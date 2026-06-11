# CIRIL Auth Module — Software Requirements Specification

## 1. Standardised Error Response Schema

Every API error response MUST use the following unified envelope:

```json
{
  "error": {
    "code": "OTP_EXPIRED",
    "message": "The verification code has expired. Request a new one.",
    "status": 410
  }
}
```

### Error Codes

| code | HTTP status | message | trigger |
|------|-------------|---------|---------|
| `PHONE_INVALID` | 400 | "Phone number does not match E.164 format (+1XXXXXXXXXX)." | Input validation |
| `OTP_INVALID` | 401 | "The code you entered is incorrect." | Twilio rejects code |
| `OTP_EXPIRED` | 410 | "The verification code has expired. Request a new one." | Twilio returns `expired` status |
| `RATE_LIMITED` | 429 | "Too many attempts. Please wait {seconds}s before trying again." | Per-phone or per-IP cooldown active |
| `TOKEN_EXPIRED` | 401 | "Session token has expired. Please sign in again." | JWT `exp` claim exceeded |
| `TOKEN_INVALID` | 401 | "Session token is malformed or revoked." | JWT signature mismatch or blacklisted |
| `REFRESH_FAILED` | 401 | "Refresh token is invalid or expired. Please sign in again." | Refresh token not found or expired |
| `RECOVERY_PHONE_MISMATCH` | 400 | "New phone does not match the recovery request token." | Recovery token signed for different phone |
| `RECOVERY_TOKEN_EXPIRED` | 410 | "Recovery link has expired. Please start over." | Recovery token older than TTL |
| `SESSION_ANOMALY` | 403 | "Unusual sign-in detected. Additional verification required." | Device fingerprint mismatch detected |
| `GOOGLE_AUTH_FAILED` | 502 | "Google authentication temporarily unavailable." | Upstream Google API error |
| `GOOGLE_ACCOUNT_MISMATCH` | 409 | "The Google account email is already linked to a different phone number." | Email already in use with different phone |
| `INTERNAL_ERROR` | 500 | "Something went wrong. Try again later." | Unhandled server exception |

### Client-side handling contract

All API clients (mobile, web) MUST handle the error envelope uniformly:

```typescript
interface ApiError {
  error: {
    code: ErrorCode;
    message: string;
    status: number;
  };
}

// Client-side map
const ERROR_TOAST: Record<ErrorCode, string> = {
  OTP_INVALID:         "Incorrect code. Try again.",
  OTP_EXPIRED:         "Code expired. Request a new one.",
  RATE_LIMITED:        "Too many attempts. Wait before trying again.",
  PHONE_INVALID:       "Enter a valid phone number.",
  TOKEN_EXPIRED:       "Session expired. Sign in again.",
  TOKEN_INVALID:       "Session invalid. Sign in again.",
  REFRESH_FAILED:      "Please sign in again.",
  RECOVERY_PHONE_MISMATCH: "This link is for a different number.",
  RECOVERY_TOKEN_EXPIRED:  "Recovery link expired.",
  SESSION_ANOMALY:     "Verify your identity to continue.",
  GOOGLE_AUTH_FAILED:  "Google sign-in unavailable. Try SMS.",
  GOOGLE_ACCOUNT_MISMATCH: "This Google account is linked to another account.",
  INTERNAL_ERROR:      "Something went wrong. Try again.",
};
```

---

## 2. Phone Number Migration / Account Recovery

### 2.1 Initiate recovery

**`POST /auth/recovery/init`**

| field | type | required | description |
|-------|------|----------|-------------|
| `oldPhone` | string | yes | Current phone on the account (E.164) |

**Logic:**
1. Look up `oldPhone` in `users` table. If not found → return `PHONE_INVALID`.
2. Generate a signed recovery token (JWT, 15 min TTL, payload `{ oldPhone, jti }`).
3. Persist `jti` to Redis with TTL 15 min under key `recovery:{jti}`.
4. Send SMS to `oldPhone`: *"IvVah: To move your account to a new number, visit {url}/auth/recovery?t={token}"*.
5. Return `{ ok: true }` (no token leak in response).

**Errors:** `PHONE_INVALID`, `RATE_LIMITED` (1 init per 5 min per phone), `INTERNAL_ERROR`.

### 2.2 Complete recovery

**`POST /auth/recovery/complete`**

| field | type | required | description |
|-------|------|----------|-------------|
| `token` | string | yes | Recovery token received via SMS |
| `newPhone` | string | yes | New phone number (E.164) |
| `newPhoneCode` | string | yes | OTP sent to newPhone for proof of ownership |

**Logic:**
1. Verify `token` JWT signature + TTL. If expired → `RECOVERY_TOKEN_EXPIRED`. If invalid signature → `TOKEN_INVALID`.
2. Check Redis `recovery:{jti}` is still present (prevents replay; delete after use). If missing → `RECOVERY_TOKEN_EXPIRED`.
3. Verify `newPhone` matches no existing account. If found → `PHONE_INVALID` (account already exists at new number; user should merge manually).
4. Verify `newPhoneCode` via Twilio. If fail → `OTP_INVALID`.
5. Within a **single database transaction**:
   - Update `users.phone` from `oldPhone` to `newPhone`.
   - Update all `activities.host_phone` matching `oldPhone` → `newPhone`.
   - Update all `activity_participants.phone` matching `oldPhone` → `newPhone`.
   - Delete Redis `recovery:{jti}`.
6. Issue new session tokens for `newPhone`.
7. Invalidate all existing sessions for `oldPhone` (Redis `sessions:{oldPhone}:*`).
8. Return `{ ok: true, user: { ... }, accessToken, refreshToken }`.

**Errors:** `RECOVERY_TOKEN_EXPIRED`, `RECOVERY_PHONE_MISMATCH`, `TOKEN_INVALID`, `PHONE_INVALID`, `OTP_INVALID`, `INTERNAL_ERROR`.

---

## 3. Redis Key Schema — Device Fingerprint Session Storage

### 3.1 Key naming convention

| key pattern | type | TTL | description |
|-------------|------|-----|-------------|
| `session:{sessionId}` | hash | refresh_token TTL (30d) | Stores session payload |
| `sessions:{phone}:{sessionId}` | set | none (TTL on member) | Index: all active sessions for a user |
| `otp-rate:{phone}` | string (integer) | 60 s | OTP request cooldown: epoch ms of last send |
| `otp-rate-ip:{ip}` | string (integer) | 60 s | Global IP-level OTP cooldown |
| `recovery:{jti}` | string (`newPhone`) | 900 s (15 min) | Recovery token replay guard |
| `token-blacklist:{jti}` | string (`"1"`) | remaining TTL of the revoked token | Revoked JWT guard |
| `anomaly-log:{phone}` | list | 604 800 s (7 d) | Circular buffer of recent session anomalies |

### 3.2 Session hash fields (`session:{sessionId}`)

| field | type | example | description |
|-------|------|---------|-------------|
| `phone` | string | `+14155551234` | Authenticated user |
| `createdAt` | ISO-8601 | `2026-06-10T12:00:00Z` | Session creation timestamp |
| `fingerprint` | serialised object | `{"ua":"...","ip":"...","geo":"...","canvas":"..."}` | Device fingerprint snapshot |
| `deviceName` | string | `Chrome 128 / macOS 15` | Human-readable device label |
| `refreshCount` | integer | `3` | Counter of token refreshes on this session |

### 3.3 Session lifecycle

| event | action |
|-------|--------|
| **Login (OTP or Google)** | Generate `sessionId` (crypto.randomUUID). `HMSET session:{sessionId}` with fingerprint. `SADD sessions:{phone}:{sessionId}`. Issue `accessToken` (15 min) and `refreshToken` (30 d) signed with `sessionId` in `jti`. |
| **Token refresh** | Verify `refreshToken` JWT. Look up `session:{sessionId}`. If missing → `REFRESH_FAILED` (session revoked). Increment `refreshCount`. Issue new `accessToken` + `refreshToken` pair. Delete old `refreshToken` key. |
| **Logout** | Delete `session:{sessionId}`. Remove from `sessions:{phone}:{sessionId}`. Add `accessToken.jti` and `refreshToken.jti` to `token-blacklist:{jti}` for their remaining TTL. |
| **Admin / Recovery revoke all** | Iterate `sessions:{phone}:*`, delete each `session:{sessionId}`, delete set keys, blacklist all active JWT `jti`s. |

### 3.4 Anomaly log structure (`anomaly-log:{phone}`)

Each element is a JSON string with these fields:

```json
{
  "ts": "2026-06-10T12:00:00Z",
  "type": "new_device" | "new_ip" | "new_city" | "cloned_token",
  "sessionId": "uuid-of-session",
  "details": {
    "observedFingerprint": { "ua": "...", "ip": "...", "geo": "..." },
    "storedFingerprint": { "ua": "...", "ip": "...", "geo": "..." },
    "similarity": 0.42
  }
}
```

**Trigger rules:**
- **`new_device`** — Canvas fingerprint hash differs from all previous sessions.
- **`new_ip`** — Client IP falls outside the /24 subnet of any prior session.
- **`new_city`** — MaxMind geo city differs from last 3 sessions.
- **`cloned_token`** — Same `sessionId` used from two different IPs within 5 min window.

On `cloned_token` the server MUST immediately revoke the session and force re-authentication. On `new_*` anomalies the server SHOULD issue a `SESSION_ANOMALY` response and prompt the user for OTP verification on the next sensitive action.

### 3.5 Redis Lua script for atomic session creation

```lua
-- create_session.lua
-- KEYS[1] = session:{sessionId}
-- KEYS[2] = sessions:{phone}:{sessionId}
-- ARGV[1] = serialised session hash fields (JSON)
-- ARGV[2] = refresh token TTL (seconds)
local parsed = cjson.decode(ARGV[1])
redis.call("HMSET", KEYS[1], "phone", parsed.phone, "createdAt", parsed.createdAt,
           "fingerprint", parsed.fingerprint, "deviceName", parsed.deviceName,
           "refreshCount", 0)
redis.call("EXPIRE", KEYS[1], ARGV[2])
redis.call("SADD", KEYS[2], KEYS[1])
redis.call("EXPIRE", KEYS[2], ARGV[2])
return 1
```

### 3.6 Environment variables

| variable | default | description |
|----------|---------|-------------|
| `REDIS_URL` | `redis://localhost:6379` | Redis connection string |
| `REFRESH_TOKEN_TTL_SEC` | `2592000` | 30 days |
| `ACCESS_TOKEN_TTL_SEC` | `900` | 15 minutes |
| `OTP_RATE_LIMIT_SEC` | `60` | Cooldown between OTP requests |
| `RECOVERY_TOKEN_TTL_SEC` | `900` | Recovery link expiry |
| `SESSION_ANOMALY_PROMPT_OTP` | `true` | Whether to challenge on anomaly |

---

## Appendix A: Supabase schema additions

```sql
-- Add recovery fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_verified_at timestamptz;
ALTER TABLE users ADD COLUMN IF NOT EXISTS recovery_requested_at timestamptz;

-- Activity participants table (assumed; create if missing)
CREATE TABLE IF NOT EXISTS activity_participants (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id uuid NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  phone      text NOT NULL,
  joined_at  timestamptz DEFAULT now(),
  UNIQUE(activity_id, phone)
);
```

## Appendix B: Token JWT claims

### Access token (short-lived, 15 min)

```json
{
  "sub": "+14155551234",
  "sessionId": "uuid-of-session",
  "jti": "unique-token-id",
  "iat": 1749600000,
  "exp": 1749600900
}
```

### Refresh token (long-lived, 30 d)

```json
{
  "sub": "+14155551234",
  "sessionId": "uuid-of-session",
  "jti": "unique-token-id",
  "type": "refresh",
  "iat": 1749600000,
  "exp": 1752192000
}
```

### Recovery token (short-lived, 15 min)

```json
{
  "oldPhone": "+14155551234",
  "jti": "uuid",
  "type": "recovery",
  "iat": 1749600000,
  "exp": 1749600900
}
```

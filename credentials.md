# IvVah — Credentials Checklist
> All services below have a **free tier with no credit card required** unless noted.
> Check each box as you collect the credential, then paste the values into your `.env.local` and Lovable environment settings.

---

## 1. Supabase — Database
**Free tier:** 2 projects, 500 MB storage, unlimited API calls. No credit card.
**Time to set up:** ~5 min

- [ ] Go to **https://supabase.com** → Sign up (GitHub or email)
- [ ] Click **New Project** → choose a name (e.g. `ivvah`) and a strong DB password → select region closest to you → Create
- [ ] Wait ~2 min for project to spin up
- [ ] Go to **Project Settings → API** (left sidebar)
- [ ] Copy **Project URL** → paste as `SUPABASE_URL`
- [ ] Under **Project API Keys**, copy `service_role` (secret) key → paste as `SUPABASE_SERVICE_ROLE_KEY`
  > ⚠️ Never expose the service_role key to the browser. It's safe because `db.server.ts` is tree-shaken from the client bundle.
- [ ] Go to **SQL Editor** → paste and run the SQL from the improvement prompt (Part 1c) to create tables

```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Twilio Verify — SMS OTP
**Free tier:** $15.50 trial credit on sign-up (~300 free OTP verifications). No credit card for trial.
**Time to set up:** ~10 min

- [ ] Go to **https://twilio.com** → Sign up (confirm your email + phone number during signup)
- [ ] From the **Console Dashboard**, copy:
  - [ ] **Account SID** → paste as `TWILIO_ACCOUNT_SID`
  - [ ] **Auth Token** (click to reveal) → paste as `TWILIO_AUTH_TOKEN`
- [ ] In the left sidebar → **Verify → Services** → click **Create new**
  - Friendly name: `IvVah`
  - Leave defaults → Create
- [ ] Copy the **Service SID** (starts with `VA...`) → paste as `TWILIO_VERIFY_SERVICE_SID`
- [ ] During trial, Twilio can only send OTPs to **verified numbers**. Go to **Phone Numbers → Verified Caller IDs** and add your own number for testing.
  > Once you upgrade (or go live), this restriction lifts. Upgrade is free — just requires a credit card.

```
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 3. Google OAuth — "Continue with Google"
**Free:** Google OAuth is always free. No credit card.
**Time to set up:** ~10 min

- [ ] Go to **https://console.cloud.google.com** → Sign in with any Google account
- [ ] Click the project dropdown (top bar) → **New Project**
  - Name: `IvVah` → Create → wait ~30 sec
- [ ] Make sure the new project is selected in the top bar
- [ ] In the search bar, search **"OAuth consent screen"** → open it
  - User type: **External** → Create
  - Fill in: App name (`IvVah`), User support email (your email), Developer contact email → Save and Continue
  - Scopes: click **Add or Remove Scopes** → add `openid`, `email`, `profile` → Save and Continue
  - Test users: add your own Google email → Save and Continue → Back to Dashboard
- [ ] In the search bar, search **"Credentials"** → open it
  - Click **+ Create Credentials → OAuth 2.0 Client ID**
  - Application type: **Web application**
  - Name: `IvVah Web`
  - Authorized redirect URIs:
    - [ ] Add `http://localhost:5173/auth/callback` (for local dev)
    - [ ] Add `https://YOUR-PROJECT.lovable.app/auth/callback` (replace with your actual Lovable URL)
  - Click **Create**
- [ ] Copy **Client ID** → paste as `GOOGLE_CLIENT_ID`
- [ ] Copy **Client Secret** → paste as `GOOGLE_CLIENT_SECRET`
- [ ] Set `GOOGLE_REDIRECT_URI` based on environment (see below)

```
GOOGLE_CLIENT_ID=xxxxxxxxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback   # local dev
# GOOGLE_REDIRECT_URI=https://YOUR-PROJECT.lovable.app/auth/callback   # production
```

---

## 4. Where to Put the Credentials

### Local development — `.env.local` (already in `.gitignore`)
Create this file in the project root:
```
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=VA...
GOOGLE_CLIENT_ID=....apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

### Lovable (production)
- Go to your Lovable project → **Settings → Environment Variables**
- Add each variable one by one
- Change `GOOGLE_REDIRECT_URI` to your production domain

---

## 5. Summary — What Each Credential Unlocks

| Credential | Unlocks |
|---|---|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Activities and users persist across restarts; feed loads real DB data |
| `TWILIO_ACCOUNT_SID` + `TWILIO_AUTH_TOKEN` + `TWILIO_VERIFY_SERVICE_SID` | Real SMS OTP on login instead of console.log |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` + `GOOGLE_REDIRECT_URI` | "Continue with Google" button actually works |

### Can I run the app without all of them?
Yes. The app degrades gracefully:
- **No Supabase** → falls back to in-memory store (data lost on restart). Works fine for demos.
- **No Twilio** → OTP step still works, code is logged to server console (`console.log`). Fine for local dev.
- **No Google** → phone OTP login still works. Google button shows an error toast.

---

## 6. Optional Future Services (still free tier)

| Service | Purpose | Sign-up |
|---|---|---|
| **Resend** (resend.com) | Email notifications (3000 emails/month free) | resend.com → free plan |
| **Upstash Redis** | Rate limiting / caching (10k commands/day free) | upstash.com → free plan |
| **Cloudflare R2** | Avatar image uploads (5 GB/month free) | cloudflare.com → free plan |
| **Sentry** | Error tracking (5k errors/month free) | sentry.io → free plan |

None of these are needed to ship v1. Add them when needed.
import { Router } from "express";
import twilio from "twilio";
import { createClient } from "@supabase/supabase-js";

export const authRouter = Router();

function getTwilio() {
  const sid = process.env.tiwoli_SID;
  const token = process.env.tiwoli_token;
  if (!sid || !token) throw new Error("Missing Twilio credentials");
  return twilio(sid, token);
}

function getVerifySid() {
  const sid = process.env.twilio_message_key;
  if (!sid) throw new Error("Missing twilio_message_key (Verify Service SID)");
  return sid;
}

function getSupabase() {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase credentials");
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

const rateLimitMap = new Map();

authRouter.post("/otp/request", async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || phone.length < 4) return res.status(400).json({ error: "Invalid phone number" });

    const last = rateLimitMap.get(phone);
    if (last && Date.now() - last < 60_000) {
      return res.status(429).json({ error: "Please wait 60 seconds before requesting another OTP." });
    }
    rateLimitMap.set(phone, Date.now());

    await getTwilio().verify.v2.services(getVerifySid()).verifications.create({
      to: phone,
      channel: "sms",
    });
    res.json({ ok: true });
  } catch (err) {
    console.error("OTP request error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/otp/verify", async (req, res) => {
  try {
    const { phone, code } = req.body;
    if (!phone || !code || code.length !== 6) return res.status(400).json({ error: "Invalid input" });

    const check = await getTwilio().verify.v2.services(getVerifySid()).verificationChecks.create({
      to: phone,
      code,
    });

    if (check.status !== "approved") return res.status(401).json({ error: "Invalid or expired OTP" });

    const supabase = getSupabase();
    const { data: existing } = await supabase.from("users").select("phone").eq("phone", phone).single();
    res.json({ ok: true, isNewUser: !existing });
  } catch (err) {
    console.error("OTP verify error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

authRouter.get("/profile/:phone", async (req, res) => {
  try {
    const { data } = await getSupabase().from("users").select("*").eq("phone", req.params.phone).single();
    if (!data) return res.json(null);
    res.json({ phone: data.phone, name: data.name, city: data.city, interests: data.interests ?? [], avatarSeed: data.avatar_seed ?? data.phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.post("/profile", async (req, res) => {
  try {
    const { phone, name, city, interests } = req.body;
    if (!phone || !name || !city) return res.status(400).json({ error: "Missing required fields" });
    await getSupabase().from("users").upsert({ phone, name, city, interests: interests ?? [], avatar_seed: phone });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.get("/google", (_req, res) => {
  res.status(410).json({ error: "Use Supabase signInWithOAuth on the client instead." });
});

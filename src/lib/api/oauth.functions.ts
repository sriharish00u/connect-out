import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabase } from "@/lib/db.server";
import process from "node:process";

export const getGoogleAuthUrl = createServerFn({ method: "POST" })
  .inputValidator(z.object({ callbackUrl: z.string() }))
  .handler(async ({ data }) => {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID ?? "");
    url.searchParams.set("redirect_uri", process.env.GOOGLE_REDIRECT_URI ?? "");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("scope", "openid email profile");
    url.searchParams.set("state", data.callbackUrl);
    return { url: url.toString() };
  });

export const handleGoogleCallback = createServerFn({ method: "POST" })
  .inputValidator(z.object({ code: z.string() }))
  .handler(async ({ data }) => {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: data.code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: process.env.GOOGLE_REDIRECT_URI ?? "",
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json() as { access_token: string };
    const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await infoRes.json() as {
      email: string;
      name: string;
      sub: string;
    };

    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("users")
      .select("*")
      .eq("phone", profile.email)
      .single();

    const isNewUser = !existing;

    if (isNewUser) {
      await supabase.from("users").insert({
        phone: profile.email,
        name: profile.name,
        city: "",
        interests: [],
        avatar_seed: profile.sub,
      });
    }

    return {
      ok: true,
      isNewUser,
      user: {
        phone: profile.email,
        name: profile.name,
        city: existing?.city ?? "",
        interests: existing?.interests ?? [],
        avatarSeed: profile.sub,
      },
    };
  });

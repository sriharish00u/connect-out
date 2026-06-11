import { useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabase";
import { auth } from "@/lib/auth";

export function OAuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data, error }) => {
      if (error || !data.session) { navigate("/login", { replace: true }); return; }
      const userId = data.session.user.id;
      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("supabase_uid", userId)
        .single();
      if (profile) {
        auth.login({
          phone: profile.phone ?? "",
          name: profile.name,
          city: profile.city,
          interests: profile.interests ?? [],
          avatarSeed: profile.avatar_seed ?? userId,
        });
        navigate("/", { replace: true });
      } else {
        navigate("/onboarding", { replace: true });
      }
    });
  }, [navigate]);
  return <div className="flex min-h-screen items-center justify-center text-on-surface-variant">Signing you in…</div>;
}

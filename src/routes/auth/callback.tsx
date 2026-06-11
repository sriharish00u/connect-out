import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { z } from "zod";
import { handleGoogleCallback } from "@/lib/api/oauth.functions";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  validateSearch: z.object({
    code: z.string(),
    state: z.string().optional(),
  }),
  component: OAuthCallback,
});

function OAuthCallback() {
  const navigate = useNavigate();
  const { code, state } = Route.useSearch();

  useEffect(() => {
    handleGoogleCallback({ data: { code } }).then((result) => {
      if (result.ok) {
        auth.login(result.user);
        if (result.isNewUser && !result.user.city) {
          navigate({ to: "/onboarding", search: { phone: result.user.phone } });
        } else {
          navigate({ to: (state as "/" | "/landing" | undefined) ?? "/" });
        }
      }
    });
  }, [code]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-container-low">
      <p className="font-headline italic text-primary">Signing you in&hellip;</p>
    </div>
  );
}

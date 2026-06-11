import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import { api } from "@/lib/api/client";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);

  const handleGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) toast.error("Failed to start Google sign in.");
    } catch {
      toast.error("Failed to start Google sign in.");
    }
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 4) return;
    try {
      await api.auth.requestOtp(phone);
      toast.success("OTP sent!");
      setStep("otp");
    } catch {
      toast.error("Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) return;
    try {
      const result = await api.auth.verifyOtp(phone, code);
      if (result.isNewUser) {
        navigate("/onboarding?phone=" + encodeURIComponent(phone));
      } else {
        const profile = await api.auth.getProfile(phone);
        if (profile) {
          auth.login(profile);
          navigate("/");
        } else {
          navigate("/onboarding?phone=" + encodeURIComponent(phone));
        }
      }
    } catch {
      toast.error("Invalid code");
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      e.preventDefault();
      setDigits(text.split(""));
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface-container-low">
      <main className="flex flex-grow items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <span className="font-headline text-headline-md font-bold text-primary">
              ivvazh
            </span>
          </div>
          <section className="organic-shadow rounded-xl border border-outline-variant bg-surface-container-lowest p-8 md:p-12">
            <header className="mb-8 text-center">
              <h1 className="font-headline text-headline-lg italic text-on-surface">
                Welcome back
              </h1>
              <p className="mt-2 text-on-surface-variant">Find your rhythm in the community.</p>
            </header>

            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-4 text-button text-on-surface transition-colors hover:bg-surface-container-low active:scale-[0.99]"
            >
              <svg height="20" width="20" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 5.84-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-surface-container-lowest px-4 font-label-mono text-on-surface-variant">
                  OR
                </span>
              </div>
            </div>

            {step === "phone" ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-1">
                  <label htmlFor="phone" className="block font-medium text-on-surface">
                    Phone number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-4 text-body-md placeholder:text-on-tertiary-fixed-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-primary px-6 py-4 text-button text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-[0.98]"
                >
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-1 text-center">
                  <p className="text-on-surface-variant">Enter the 6-digit code sent to</p>
                  <p className="font-semibold text-on-surface">{phone || "+1 (555) •••-••••"}</p>
                </div>
                <div className="flex justify-between gap-2">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      value={d}
                      aria-label={`OTP digit ${i + 1}`}
                      onPaste={i === 0 ? handlePaste : undefined}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "");
                        const next = [...digits];
                        next[i] = v;
                        setDigits(next);
                        if (v && i < 5) {
                          const el = document.getElementById(`otp-${i + 1}`);
                          el?.focus();
                        }
                      }}
                      id={`otp-${i}`}
                      className="h-14 w-12 rounded-lg border border-outline-variant text-center font-headline text-headline-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-button text-on-primary transition-all hover:bg-primary-container active:scale-[0.98]"
                >
                  Verify <Icon name="arrow_forward" size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setDigits(["", "", "", "", "", ""]);
                  }}
                  className="block w-full text-center text-button text-primary hover:underline"
                >
                  Change number
                </button>
              </form>
            )}
          </section>

          <p className="mt-6 text-center font-label-mono text-on-surface-variant">
            By continuing, you agree to ivvazh&apos;s Guidelines &amp; Safety promise.
          </p>
        </div>
      </main>
    </div>
  );
}

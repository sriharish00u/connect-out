import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/Icon";
import { getGoogleAuthUrl } from "@/lib/api/oauth.functions";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Join IvVah | Community Registration" },
      {
        name: "description",
        content: "Create your IvVah profile to start exploring local activities.",
      },
    ],
  }),
  component: Register,
});

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleGoogle = async () => {
    try {
      const { url } = await getGoogleAuthUrl({ data: { callbackUrl: "/" } });
      window.location.href = url;
    } catch {
      toast.error("Failed to start Google sign up.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    toast.success("Profile created! Check your phone for the OTP.");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-container-margin py-xxl">
      <main className="w-full max-w-lg">
        {/* Brand Identity */}
        <div className="mb-xl text-center">
            <h1 className="font-headline text-headline-md font-bold text-primary">
              IvVah
            </h1>
          <p className="font-label-mono text-label-mono text-tertiary uppercase tracking-widest">
            A Space for Intentional Connection
          </p>
        </div>

        {/* Registration Card */}
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-xl shadow-sm">
          <header className="mb-xl">
            <h2 className="font-headline text-headline-md italic font-semibold text-on-surface">
              Join the community
            </h2>
            <p className="mt-xs text-body-md text-on-surface-variant">
              Create your profile to start exploring local activities.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-md">
            <div>
              <label
                htmlFor="name"
                className="mb-xs block font-button text-[14px] text-on-surface"
              >
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Elias Thorne"
                required
                className="w-full rounded-lg border border-outline-variant bg-white px-md py-sm text-body-md text-on-surface placeholder:text-outline transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-xs block font-button text-[14px] text-on-surface"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="elias@example.com"
                required
                className="w-full rounded-lg border border-outline-variant bg-white px-md py-sm text-body-md text-on-surface placeholder:text-outline transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-xs block font-button text-[14px] text-on-surface"
              >
                Phone number
              </label>
              <div className="relative">
                <span className="font-label-mono text-label-mono absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">
                  +1
                </span>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 000-0000"
                  required
                  className="w-full rounded-lg border border-outline-variant bg-white pl-xl pr-md py-sm text-body-md text-on-surface placeholder:text-outline transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Privacy Notice */}
            <div className="flex items-start gap-sm py-sm">
              <Icon
                name="verified_user"
                className="shrink-0 text-secondary"
                size={20}
                filled
              />
              <p className="text-body-md text-[13px] leading-relaxed text-on-surface-variant">
                By joining, you agree to our{" "}
                <a
                  href="#"
                  className="text-primary underline decoration-primary/30 transition-all hover:decoration-primary"
                >
                  Community Guidelines
                </a>{" "}
                designed to keep IvVah safe and intentional.
              </p>
            </div>

            <button
              type="submit"
              className="mt-md flex w-full items-center justify-center gap-sm rounded-xl bg-primary py-md text-button text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
            >
              Join IvVah
              <Icon name="arrow_forward" size={18} />
            </button>

            {/* Divider */}
            <div className="relative flex items-center py-md">
              <div className="flex-grow border-t border-outline-variant" />
              <span className="mx-md shrink-0 font-label-mono text-[10px] uppercase text-tertiary">
                Or connect via
              </span>
              <div className="flex-grow border-t border-outline-variant" />
            </div>

            {/* Google Sign-up */}
            <button
              type="button"
              onClick={handleGoogle}
              className="flex w-full items-center justify-center gap-sm rounded-xl border border-outline-variant bg-white py-md text-button text-on-surface transition-colors hover:bg-surface-container"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </form>

          {/* Login link */}
          <div className="mt-xl text-center">
            <p className="text-body-md text-on-surface-variant">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-button text-primary transition-all hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

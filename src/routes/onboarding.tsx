import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Icon } from "@/components/Icon";
import { saveProfile } from "@/lib/api/auth.functions";
import { auth } from "@/lib/auth";

export const Route = createFileRoute("/onboarding")({
  validateSearch: z.object({ phone: z.string() }),
  head: () => ({
    meta: [{ title: "Welcome to IvVah" }],
  }),
  component: Onboarding,
});

const interests = [
  { value: "outdoors", emoji: "🌲", label: "Outdoors" },
  { value: "culinary", emoji: "🍳", label: "Culinary" },
  { value: "creative", emoji: "🎨", label: "Creative" },
  { value: "wellness", emoji: "🧘", label: "Wellness" },
  { value: "tech", emoji: "💻", label: "Tech" },
  { value: "music", emoji: "🎶", label: "Music" },
  { value: "travel", emoji: "✈️", label: "Travel" },
  { value: "books", emoji: "📚", label: "Books" },
  { value: "sport", emoji: "🏃", label: "Sport" },
];

function Onboarding() {
  const navigate = useNavigate();
  const { phone } = Route.useSearch();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const toggle = (v: string) => {
    const next = new Set(picked);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    setPicked(next);
  };

  const next = async () => {
    if (step === 3) {
      const interestsArr = [...picked];
      await saveProfile({ data: { phone, name, city, interests: interestsArr } });
      auth.login({ phone, name, city, interests: interestsArr, avatarSeed: phone });
      navigate({ to: "/" });
    } else {
      setStep(step + 1);
    }
  };

  const canAdvance =
    (step === 1 && name.trim() && city.trim()) || (step === 2 && picked.size >= 3) || step === 3;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-container-low p-4">
      <div
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-xl"
        style={{ minHeight: 520 }}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="font-headline text-headline-md italic text-primary">IvVah</div>
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <span
                key={s}
                className={
                  "h-2 w-2 rounded-full " + (s <= step ? "bg-primary" : "bg-surface-variant")
                }
              />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div className="flex flex-1 flex-col items-center px-6 py-10 text-center">
            <h1 className="mb-3 font-headline text-headline-md italic text-primary">
              What&apos;s your name?
            </h1>
            <p className="mb-8 max-w-sm text-on-surface-variant">
              We&apos;d love to know who we&apos;re talking to and where you&apos;re joining us
              from.
            </p>
            <div className="w-full max-w-xs space-y-5 text-left">
              <div>
                <label htmlFor="onb-name" className="mb-1 block font-medium text-on-surface">
                  Your First Name
                </label>
                <input
                  id="onb-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Julian"
                  className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="onb-city" className="mb-1 block font-medium text-on-surface">
                  Your City
                </label>
                <input
                  id="onb-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Amsterdam"
                  className="w-full rounded-lg border border-outline-variant px-4 py-3 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-1 flex-col items-center px-6 py-10 text-center">
            <h1 className="mb-3 font-headline text-headline-md italic text-primary">
              Pick your interests
            </h1>
            <p className="mb-6 text-on-surface-variant">
              Select at least <span className="font-bold text-primary">3 categories</span> to
              personalize your feed.
            </p>
            <div className="grid w-full max-w-sm grid-cols-3 gap-2">
              {interests.map((i) => {
                const active = picked.has(i.value);
                return (
                  <button
                    key={i.value}
                    onClick={() => toggle(i.value)}
                    className={
                      "flex flex-col items-center justify-center rounded-xl border p-4 transition-all " +
                      (active
                        ? "border-primary bg-primary-fixed text-on-primary-fixed"
                        : "border-outline-variant bg-surface-container-lowest hover:border-outline")
                    }
                  >
                    <span className="mb-1 text-2xl">{i.emoji}</span>
                    <span className="font-label-mono">{i.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-1 flex-col items-center px-6 py-10 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container">
              <Icon name="celebration" size={40} filled className="text-on-secondary-container" />
            </div>
            <h1 className="mb-3 font-headline text-headline-md italic text-primary">
              Welcome to IvVah, {name || "friend"}!
            </h1>
            <p className="mb-xl text-on-surface-variant">
              Your neighborhood in{" "}
              <span className="underline">{city || "your city"}</span> is buzzing. Here&apos;s a
              glimpse of what&apos;s waiting for you.
            </p>

            {/* Personalized Preview Card */}
            <div className="mb-4 flex w-full overflow-hidden rounded-xl border border-surface-variant bg-white text-left shadow-sm">
              <div className="w-1.5 shrink-0 bg-secondary" />
              <div className="flex items-center gap-md p-md">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface-container">
                  <Icon name="local_fire_department" className="text-primary" />
                </div>
                <div>
                  <div className="mb-xs font-label-mono text-[10px] font-bold uppercase tracking-wider text-secondary">
                    New for you
                  </div>
                  <h3 className="font-headline-md text-body-md font-semibold italic leading-tight text-on-surface">
                    Sunset Terrace Social
                  </h3>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    3 spots left &bull; 0.4 miles away
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-outline-variant bg-surface-container-low px-6 py-4">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="text-button text-on-surface-variant disabled:opacity-40"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-button text-on-primary transition-all hover:bg-primary-container active:scale-95 disabled:opacity-40"
          >
            {step === 3 ? "Enter IvVah" : "Continue"}
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

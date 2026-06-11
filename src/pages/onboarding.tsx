import { useNavigate, useSearchParams } from "react-router";
import { useState } from "react";
import { Icon } from "@/components/Icon";
import { api } from "@/lib/api/client";
import { auth } from "@/lib/auth";

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

export function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const phone = searchParams.get("phone") ?? "";
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
      await api.auth.saveProfile({ phone, name, city, interests: interestsArr });
      auth.login({ phone, name, city, interests: interestsArr, avatarSeed: phone });
      navigate("/");
    } else {
      setStep(step + 1);
    }
  };

  const canAdvance =
    (step === 1 && name.trim() && city.trim()) || (step === 2 && picked.size >= 3) || step === 3;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-surface-container-low p-4">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden opacity-30">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="mb-6 font-headline text-display-hero">Your Feed</div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-64 rounded-xl border border-outline-variant bg-surface-container-lowest" />
            <div className="h-64 rounded-xl border border-outline-variant bg-surface-container-lowest" />
            <div className="h-64 rounded-xl border border-outline-variant bg-surface-container-lowest" />
          </div>
        </div>
      </div>

      <div
        className="relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface shadow-xl"
        style={{ minHeight: 520 }}
      >
        <div className="flex items-center justify-between px-6 pt-6">
          <div className="font-headline italic text-primary">ivvazh</div>
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
              We&apos;d love to know who we&apos;re talking to and where you&apos;re joining us from.
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
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <Icon name="check" size={40} filled />
            </div>
            <h1 className="mb-3 font-headline text-headline-md italic text-primary">
              You&apos;re in, {name || "friend"}.
            </h1>
            <p className="max-w-sm text-on-surface-variant">
              We&apos;ve tuned your feed around the {picked.size || 3} interests you picked. Now
              let&apos;s find your kind.
            </p>
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
            {step === 3 ? "Enter ivvazh" : "Continue"}
            <Icon name="arrow_forward" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

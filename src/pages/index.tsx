import { Link, Navigate, useSearchParams } from "react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { formatRelative } from "date-fns";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/api/client";

export interface ActivityCard {
  stripe: "primary" | "secondary" | "tertiary";
  host: string;
  city: string;
  avatar: string;
  title: string;
  blurb: string;
  tags: string[];
  filled: number;
  total: number;
}

export const cards: ActivityCard[] = [
  {
    stripe: "primary",
    host: "Alex Rivera",
    city: "Brooklyn, NY",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    title: "Morning Roadtrip Co-driver",
    blurb: "Driving up to Beacon for the gallery openings. Looking for a co-driver to share the tunes and gas.",
    tags: ["TRAVEL", "ROADTRIP"],
    filled: 1,
    total: 3,
  },
  {
    stripe: "secondary",
    host: "Maya Chen",
    city: "Queens, NY",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maya",
    title: "Weekend Hardware Hackathon",
    blurb: "Building a low-fi e-ink notification board. Need someone with some soldering experience.",
    tags: ["MAKER", "WEEKEND"],
    filled: 2,
    total: 4,
  },
  {
    stripe: "tertiary",
    host: "Priya Shah",
    city: "Jersey City, NJ",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    title: "Chai-mate at the Hudson",
    blurb: "Cardamom chai by the water at golden hour. Conversation only — no agenda, no networking.",
    tags: ["CHAI", "GOLDEN HOUR"],
    filled: 1,
    total: 2,
  },
  {
    stripe: "secondary",
    host: "Elias Thorne",
    city: "Echo Park, LA",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elias",
    title: "Rooftop Gardening & Mint Juleps",
    blurb: "Late afternoon on my terrace. Repot summer herbs, then mix juleps with the harvest.",
    tags: ["OUTDOORS", "BEGINNER"],
    filled: 4,
    total: 6,
  },
];

const stripeColor: Record<string, string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

const categoryLabels = ["Co-driver", "Hackathon", "Chai-mate", "Creator", "Walk", "Strategy"];

const categoryEmojis: Record<string, string> = {
  "Co-driver": "🚛",
  Hackathon: "🧑‍💻",
  "Chai-mate": "☕",
  Creator: "🎨",
  Walk: "🚶",
  Strategy: "🧩",
};

export function FeedPage() {
  const { isLoggedIn } = useAuth();
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [categoryFilter, setCategoryFilter] = useState<Set<string>>(new Set());
  const { data } = useSuspenseQuery({
    queryKey: ["activities"],
    queryFn: () => api.activities.getAll({}),
  });

  const activities = data.activities;

  const sorted = useMemo(() => {
    let result = [...activities];
    if (q) {
      const lower = q.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.tags.some((t) => t.toLowerCase().includes(lower)),
      );
    }
    if (categoryFilter.size > 0) {
      result = result.filter((a) => categoryFilter.has(a.category));
    }
    result.sort((a, b) => {
      const ratioA = a.filled / a.slots;
      const ratioB = b.filled / b.slots;
      return ratioB - ratioA;
    });
    return result;
  }, [activities, q, categoryFilter]);

  const topHappening = useMemo(() => {
    return [...activities]
      .sort((a, b) => {
        const ratioA = a.filled / a.slots;
        const ratioB = b.filled / b.slots;
        return ratioB - ratioA;
      })
      .slice(0, 3);
  }, [activities]);

  if (!isLoggedIn) return <Navigate to="/landing" />;

  const toggleCategory = (cat: string) => {
    const next = new Set(categoryFilter);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setCategoryFilter(next);
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <h1 className="sr-only">ivvazh activities near you</h1>
        <section className="mb-12" aria-labelledby="happening-now-heading">
          <div className="mb-5 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="pulsing-dot absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-secondary" />
            </span>
            <h2 id="happening-now-heading" className="font-headline text-headline-md italic">
              Happening Now
            </h2>
          </div>
          <div className="hide-scrollbar flex gap-5 overflow-x-auto pb-3">
            {topHappening.map((item) => (
              <Link
                key={item.id}
                to={"/activity/" + item.id}
                className="flex min-w-[300px] cursor-pointer items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
                  <div className="flex h-full w-full items-center justify-center text-3xl">
                    {item.categoryEmoji}
                  </div>
                </div>
                <div>
                  <h3 className="font-headline text-body-md italic leading-tight">{item.title}</h3>
                  <p className="mt-1 font-label-mono text-tertiary">
                    {item.slots - item.filled} spot{item.slots - item.filled === 1 ? "" : "s"} left
                    · {formatRelative(new Date(item.datetime), new Date())}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-8 lg:flex-row">
          <aside className="w-full shrink-0 lg:w-72">
            <div className="space-y-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              <div>
                <h3 className="mb-3 font-headline text-body-md">Categories</h3>
                <div className="space-y-2">
                  {categoryLabels.map((label) => {
                    const count = activities.filter((a) => a.category === label).length;
                    const on = categoryFilter.has(label);
                    return (
                      <label key={label} className="group flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={on}
                          onChange={() => toggleCategory(label)}
                          className="h-5 w-5 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary"
                        />
                        <span
                          className={
                            "flex-1 text-body-md transition-colors " +
                            (on ? "text-on-surface" : "text-on-surface-variant")
                          }
                        >
                          {categoryEmojis[label] ?? ""} {label}
                        </span>
                        <span className="rounded-full bg-surface-container-high px-2 py-0.5 font-label-mono">
                          {count}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className="mb-3 font-headline text-body-md">Date Range</h3>
                <div className="flex flex-col gap-2">
                  {["Today", "This Week", "Weekend"].map((d, i) => (
                    <button
                      key={d}
                      className={
                        "w-full rounded-lg px-4 py-2 text-left text-body-md transition-colors " +
                        (i === 0
                          ? "bg-primary-fixed text-on-primary-fixed-variant"
                          : "text-on-surface-variant hover:bg-surface-container-high")
                      }
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="radius-slider" className="font-headline text-body-md">
                    Radius
                  </label>
                  <span className="font-label-mono text-primary" id="radius-val">
                    10km
                  </span>
                </div>
                <input
                  id="radius-slider"
                  type="range"
                  min={1}
                  max={50}
                  defaultValue={10}
                  aria-label="Search radius in kilometers"
                  className="w-full accent-primary"
                  onInput={(e) => {
                    const el = document.getElementById("radius-val");
                    if (el) el.textContent = `${(e.target as HTMLInputElement).value}km`;
                  }}
                />
              </div>
            </div>
          </aside>

          <div className="flex-1">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-headline text-headline-md italic">Activities near you</h2>
              <span className="font-label-mono uppercase text-on-surface-variant">
                {sorted.length} result{sorted.length === 1 ? "" : "s"}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {sorted.map((c) => (
                <Link
                  to={"/activity/" + c.id}
                  key={c.id}
                  className="activity-card relative flex overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary"
                >
                  <div className={`w-[6px] ${stripeColor[c.stripe]}`} />
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={c.hostAvatar}
                          alt=""
                          className="h-8 w-8 rounded-full bg-surface-container-high"
                        />
                        <div className="flex flex-col">
                          <span className="font-label-mono font-bold text-on-surface">
                            {c.hostName}
                          </span>
                          <span className="font-label-mono text-tertiary">{c.location}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        aria-label={`Save ${c.title}`}
                        onClick={(e) => e.preventDefault()}
                        className="rounded-md p-1 text-on-surface-variant hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <Icon name="bookmark" />
                      </button>
                    </div>
                    <h3 className="mb-2 font-headline text-headline-md italic">{c.title}</h3>

                    <p className="mb-5 line-clamp-2 text-body-md text-on-surface-variant">
                      {c.description}
                    </p>
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {c.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full bg-surface-container px-2 py-0.5 font-label-mono text-tertiary"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex items-center justify-between border-t border-outline-variant pt-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-label-mono uppercase text-tertiary">Spots Left</span>
                        <div className="flex items-center gap-1.5">
                          {Array.from({ length: c.slots }).map((_, i) => (
                            <span
                              key={i}
                              className={
                                "h-3 w-3 rounded-sm " +
                                (i < c.filled ? "bg-secondary" : "border border-outline-variant")
                              }
                            />
                          ))}
                          <span className="ml-2 font-label-mono text-secondary">
                            {c.slots - c.filled} spot{c.slots - c.filled === 1 ? "" : "s"} left
                          </span>
                        </div>
                      </div>
                      <span className="border-b border-primary text-button text-primary">
                        Join Activity
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

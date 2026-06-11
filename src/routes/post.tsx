import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/hooks/use-auth";
import { createActivity } from "@/lib/api/activities.functions";

export const Route = createFileRoute("/post")({
  head: () => ({
    meta: [
      { title: "Post Activity | IvVah" },
      {
        name: "description",
        content:
          "Create a small-group activity on IvVah. Title, category, time, slots, and a live preview as you type.",
      },
    ],
  }),
  component: PostActivity,
});

export interface Category {
  emoji: string;
  label: string;
  color: "primary" | "secondary" | "tertiary";
}

export const categories: Category[] = [
  { emoji: "🚛", label: "Co-driver", color: "secondary" },
  { emoji: "🧑‍💻", label: "Hackathon", color: "primary" },
  { emoji: "☕", label: "Chai-mate", color: "tertiary" },
  { emoji: "🎨", label: "Creator", color: "secondary" },
  { emoji: "🚶", label: "Walk", color: "secondary" },
  { emoji: "🧩", label: "Strategy", color: "primary" },
];

const stripeBg: Record<Category["color"], string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

function PostActivity() {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [datetime, setDatetime] = useState("");
  const [slots, setSlots] = useState(4);
  const [anon, setAnon] = useState(false);
  const [category, setCategory] = useState<Category>(categories[0]);
  const [tags, setTags] = useState<string[]>(["ivvah"]);
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async () => {
    if (!title.trim() || !location.trim() || !datetime) {
      toast.error("Please fill in title, location, and date.");
      return;
    }
    try {
      const result = await createActivity({
        data: {
          title,
          description: desc,
          location,
          datetime,
          slots,
          anon,
          category: category.label,
          categoryEmoji: category.emoji,
          tags,
          hostPhone: user!.phone,
          hostName: user!.name,
        },
      });
      toast.success("Activity posted!");
      navigate({ to: "/activity/$id", params: { id: result.id } });
    } catch {
      toast.error("Failed to post. Try again.");
    }
  };

  const previewTime = useMemo(() => {
    if (!datetime) return "Time";
    const d = new Date(datetime);
    return d.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [datetime]);

  const onTagKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = tagInput.trim();
      if (v && !tags.includes(v)) setTags([...tags, v]);
      setTagInput("");
    }
  };

  return (
    <PageShell>
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          {/* Form */}
          <section className="lg:col-span-7">
            <div className="mb-8">
              <h1 className="mb-2 font-headline text-headline-lg italic text-on-surface">
                Create an Activity
              </h1>
              <p className="text-on-surface-variant">
                Intentional connections start here. Share what you&apos;re up to.
              </p>
            </div>
            <div className="space-y-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 shadow-sm md:p-8">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  maxLength={80}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Sunday morning ceramics session"
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-headline text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="mt-1 flex justify-end">
                  <span className="font-label-mono text-[10px] text-outline">
                    {title.length}/80
                  </span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {categories.map((c) => {
                    const active = c.label === category.label;
                    return (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setCategory(c)}
                        className={
                          "flex flex-col items-center gap-1 rounded-xl border p-4 transition-all focus:outline-none focus:ring-2 focus:ring-primary " +
                          (active
                            ? "border-primary bg-primary-fixed"
                            : "border-outline-variant hover:bg-surface-container-high")
                        }
                      >
                        <span className="text-2xl">{c.emoji}</span>
                        <span className="font-label-mono">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="desc"
                  className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant"
                >
                  Description
                </label>
                <textarea
                  id="desc"
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Tell the community what's happening..."
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Location + Date */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="location"
                    className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <input
                      id="location"
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City or area"
                      className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 pr-12 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary"
                    >
                      <Icon name="my_location" size={20} />
                    </button>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="datetime"
                    className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant"
                  >
                    Date &amp; Time
                  </label>
                  <input
                    id="datetime"
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Slots + Anonymous */}
              <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="slots"
                    className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant"
                  >
                    Total Slots (2-20)
                  </label>
                  <input
                    id="slots"
                    type="number"
                    min={2}
                    max={20}
                    value={slots}
                    onChange={(e) => setSlots(Math.max(2, Math.min(20, +e.target.value || 2)))}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 font-label-mono text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <label className="flex h-[54px] items-center justify-between rounded-lg border border-outline-variant p-4">
                  <span className="font-label-mono text-on-surface-variant">Anonymous Mode</span>
                  <span className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={anon}
                      onChange={(e) => setAnon(e.target.checked)}
                    />
                    <span className="peer h-6 w-11 rounded-full bg-surface-container-high after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-primary peer-checked:after:translate-x-full peer-checked:after:border-white" />
                  </span>
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="mb-2 block font-label-mono uppercase tracking-wider text-on-surface-variant">
                  Tags
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 font-label-mono text-on-surface"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => setTags(tags.filter((x) => x !== t))}
                        className="hover:text-error"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={onTagKey}
                  placeholder="Add a tag and press enter..."
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-headline text-on-primary shadow-lg transition-all hover:bg-primary-container active:scale-95"
                >
                  <Icon name="add" />
                  Post Activity
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-headline text-on-primary shadow-lg transition-all hover:bg-primary-container active:scale-95"
                >
                  <Icon name="login" />
                  Sign in to Post Activity
                </Link>
              )}
            </div>
          </section>

          {/* Preview */}
          <aside className="lg:sticky lg:top-28 lg:col-span-5">
            <div className="mb-8">
              <h2 className="mb-2 font-headline text-headline-lg italic text-on-surface">
                Preview
              </h2>
              <p className="text-on-surface-variant">This is how your post will look to others.</p>
            </div>

            <article className="flex overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-md">
              <div className={`w-1.5 ${stripeBg[category.color]}`} />
              <div className="flex-1 p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-outline-variant bg-surface-container-high">
                      <img
                        alt=""
                        src={
                          anon
                            ? "https://api.dicebear.com/7.x/bottts-neutral/svg?seed=AnonHost"
                            : "https://api.dicebear.com/7.x/avataaars/svg?seed=IvVahUser"
                        }
                      />
                    </div>
                    <div>
                      <p className="font-headline text-sm italic leading-none">
                        {anon ? "Anonymous Host" : "Your Name"}
                      </p>
                      <p className="mt-0.5 font-label-mono text-[10px] text-outline">just now</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-surface-container-high px-4 py-1 font-label-mono text-on-surface-variant">
                    {category.emoji} {category.label}
                  </span>
                </div>
                <h3 className="mb-2 font-headline text-headline-md italic">
                  {title || "The Activity Title"}
                </h3>
                <p className="mb-4 line-clamp-3 text-on-surface-variant">
                  {desc ||
                    "A brief, thoughtful description of your activity will appear here as you type..."}
                </p>
                <div className="mb-6 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <Icon name="location_on" size={18} />
                    <span className="font-label-mono">{location || "Location"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-on-surface-variant">
                    <Icon name="schedule" size={18} />
                    <span className="font-label-mono">{previewTime}</span>
                  </div>
                </div>
                <div className="mb-6 flex flex-wrap gap-1">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-surface-container-high px-2 py-1 font-label-mono text-[10px] text-outline"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between border-t border-outline-variant pt-4">
                  <div className="flex gap-[2px]">
                    {Array.from({ length: slots }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          "h-2 w-2 " + (i === 0 ? "bg-secondary" : "border border-outline-variant")
                        }
                      />
                    ))}
                  </div>
                  <span className="flex items-center gap-1 font-label-mono text-primary">
                    View Details <Icon name="arrow_forward" size={14} />
                  </span>
                </div>
              </div>
            </article>

            <div className="mt-6 flex items-start gap-3 rounded-xl bg-secondary-container p-6 text-on-secondary-container">
              <Icon name="lightbulb" className="mt-1" />
              <div>
                <p className="mb-1 font-headline italic leading-tight">Host Tip</p>
                <p className="text-sm">
                  Activities with a specific time and location get 3x more interest than vague ones.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

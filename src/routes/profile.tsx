import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/hooks/use-auth";
import { auth as authStore } from "@/lib/auth";
import { getMyActivities } from "@/lib/api/activities.functions";
import { saveProfile } from "@/lib/api/auth.functions";
import type { Activity } from "@/lib/api/activities.functions";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile | IvVah" },
      {
        name: "description",
        content: "Your profile, hosted activities, and joined sessions on IvVah.",
      },
    ],
  }),
  component: Profile,
});

const INTERESTS = [
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

function ActivityCard({ a, type }: { a: Activity; type: "hosting" | "joined" }) {
  const stripe = a.stripe ?? "primary";
  const stripeColors: Record<string, string> = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
  };

  return (
    <Link
      to="/activity/$id"
      params={{ id: a.id }}
      className="activity-card relative flex overflow-hidden rounded-xl border border-surface-variant bg-white"
    >
      <div className={`w-[6px] shrink-0 ${stripeColors[stripe] || "bg-primary"}`} />
      <div className="flex flex-1 flex-col justify-between p-lg pl-xl">
        <div>
          <div className="mb-base flex items-start justify-between">
            <span className="font-label-mono text-label-mono uppercase tracking-widest text-on-tertiary-fixed-variant">
              {new Date(a.datetime).toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).toUpperCase()}
            </span>
            {type === "hosting" ? (
              <div className="flex gap-1">
                {Array.from({ length: a.slots }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 w-2 rounded-sm ${i < a.filled ? "bg-secondary" : "border border-outline"}`}
                  />
                ))}
              </div>
            ) : (
              <span className="rounded bg-secondary-container px-2 py-0.5 font-label-mono text-[10px] text-on-secondary-fixed-variant">
                JOINED
              </span>
            )}
          </div>
          <h3 className="font-headline-md text-headline-md mb-sm italic leading-tight">{a.title}</h3>
          <p className="line-clamp-2 text-body-md text-on-surface-variant">{a.description}</p>
        </div>
        <div className="mt-lg flex items-center justify-between">
          {type === "hosting" ? (
            <>
              <span className="font-bold text-primary">{a.filled}/{a.slots}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("View details");
                }}
                className="text-button text-on-background underline transition-colors hover:text-primary"
              >
                Details
              </button>
            </>
          ) : (
            <>
              <div className="flex -space-x-2">
                <div className="h-6 w-6 rounded-full border-2 border-white bg-surface-container-highest object-cover" />
                <div className="h-6 w-6 rounded-full border-2 border-white bg-surface-container-highest object-cover" />
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-surface-container-highest text-[10px] font-bold text-on-surface">
                  +3
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  toast.info("Open chat");
                }}
                className="text-button text-on-background underline transition-colors hover:text-primary"
              >
                Chat
              </button>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

function Profile() {
  const { user, isLoggedIn } = useAuth();
  const [tab, setTab] = useState<"hosting" | "joined">("hosting");
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["myActivities", user?.phone ?? "none"],
    queryFn: () => getMyActivities({ data: { phone: user?.phone ?? "" } }),
    enabled: !!user,
  });

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" />;
  }

  const handleEditToggle = () => {
    if (!editOpen) {
      setEditName(user.name);
      setEditBio("");
    }
    setEditOpen(!editOpen);
  };

  const handleSaveEdit = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    try {
      await saveProfile({
        data: { phone: user.phone, name: editName, city: user.city, interests: user.interests },
      });
      authStore.login({ ...user, name: editName });
      toast.success("Profile updated!");
      setEditOpen(false);
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  return (
    <PageShell>
      <div className="mx-auto flex max-w-[1200px] flex-col gap-xxl px-container-margin py-xl md:flex-row">
        {/* Sidebar */}
        <aside className="w-full shrink-0 md:w-[320px]">
          <div className="sticky top-24 space-y-lg">
            {/* Profile Header */}
            <div className="flex flex-col items-center text-center">
              <div className="mb-md h-32 w-32 overflow-hidden rounded-full border-4 border-surface-container-highest shadow-sm">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-background">{user.name}</h2>
              <p className="flex items-center justify-center gap-xs text-body-md text-on-surface-variant">
                <Icon name="location_on" size={14} /> {user.city}
              </p>
              <div className="mt-sm flex items-center gap-xs text-primary">
                <div className="flex">
                  {[1, 2, 3, 4].map((i) => (
                    <Icon key={i} name="star" filled size={18} />
                  ))}
                  <Icon name="star" size={18} />
                </div>
                <span className="font-label-mono mt-1 text-on-surface-variant">(24 reviews)</span>
              </div>
            </div>

            {/* Bio & Interests */}
            <div className="border-t border-surface-variant pt-lg">
              <p className="mb-lg italic leading-relaxed text-on-surface">
                &ldquo;Curator of quiet mornings and shared craft. I believe in the magic of small
                groups and intentional conversation. Usually found with a fountain pen or a sourdough
                starter.&rdquo;
              </p>
              <div className="flex flex-wrap gap-xs">
                {user.interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-surface-variant px-sm py-1 font-label-mono text-label-mono text-on-tertiary-fixed-variant"
                  >
                    {i.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit Button & Inline Form */}
            <div className="pt-lg">
              <button
                onClick={handleEditToggle}
                className="flex w-full items-center justify-center gap-sm rounded-xl bg-secondary-container py-md text-button text-on-secondary-fixed-variant transition-all hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <Icon name={editOpen ? "close" : "edit"} size={18} />
                {editOpen ? "Cancel" : "Edit Profile"}
              </button>
              <div
                className={`mt-lg overflow-hidden rounded-xl border border-surface-variant bg-white p-md shadow-sm transition-all duration-300 ${
                  editOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <form
                  className="space-y-md"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveEdit();
                  }}
                >
                  <div>
                    <label
                      htmlFor="edit-name"
                      className="mb-1 block text-[14px] font-medium text-on-background"
                    >
                      Display Name
                    </label>
                    <input
                      id="edit-name"
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full rounded-lg border border-surface-variant bg-white p-sm text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="edit-bio"
                      className="mb-1 block text-[14px] font-medium text-on-background"
                    >
                      Bio
                    </label>
                    <textarea
                      id="edit-bio"
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full rounded-lg border border-surface-variant bg-white p-sm text-body-md outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                      placeholder="Write a short bio..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary py-sm text-button text-white transition-all hover:opacity-90"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1">
          {/* Tabs */}
          <div className="mb-xl flex gap-xl overflow-x-auto border-b border-surface-variant">
            <button
              onClick={() => setTab("hosting")}
              className={
                "py-md font-headline-md text-headline-md whitespace-nowrap transition-colors focus:outline-none focus:text-primary " +
                (tab === "hosting"
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant")
              }
            >
              Hosting
            </button>
            <button
              onClick={() => setTab("joined")}
              className={
                "py-md font-headline-md text-headline-md whitespace-nowrap transition-colors focus:outline-none focus:text-primary " +
                (tab === "joined"
                  ? "border-b-2 border-primary text-primary"
                  : "text-on-surface-variant")
              }
            >
              Joined
            </button>
          </div>

          {/* Grid */}
          {isLoading ? (
            <p className="text-center text-on-surface-variant">Loading...</p>
          ) : tab === "hosting" ? (
            data && data.hosting.length > 0 ? (
              <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
                {data.hosting.map((a) => (
                  <ActivityCard key={a.id} a={a} type="hosting" />
                ))}
              </div>
            ) : (
              <EmptyState
                icon="add_circle"
                title="Nothing yet"
                text="Post your first activity!"
                to="/post"
                buttonText="Post Activity"
                buttonIcon="add"
              />
            )
          ) : data && data.joined.length > 0 ? (
            <div className="grid grid-cols-1 gap-lg lg:grid-cols-2">
              {data.joined.map((a) => (
                <ActivityCard key={a.id} a={a} type="joined" />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="search"
              title="Not joined any yet"
              text="Explore activities and join one!"
              to="/"
              buttonText="Browse Activities"
              buttonIcon="explore"
            />
          )}
        </section>
      </div>
    </PageShell>
  );
}

function EmptyState({
  icon,
  title,
  text,
  to,
  buttonText,
  buttonIcon,
}: {
  icon: string;
  title: string;
  text: string;
  to: string;
  buttonText: string;
  buttonIcon: string;
}) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low p-8 text-center">
      <Icon name={icon} className="mx-auto text-primary" size={32} />
      <p className="mt-3 font-headline text-headline-md italic text-on-surface">{title}</p>
      <p className="mt-1 text-body-md text-on-surface-variant">{text}</p>
      <Link
        to={to as "/" | "/post" | "/login" | "/profile" | "/landing" | "/notifications"}
        className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-button text-on-primary transition-transform active:scale-95"
      >
        <Icon name={buttonIcon} size={18} />
        {buttonText}
      </Link>
    </div>
  );
}

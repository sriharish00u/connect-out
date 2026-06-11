import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/Icon";
import { useAuth } from "@/hooks/use-auth";
import { getActivity, joinActivity } from "@/lib/api/activities.functions";
import type { Activity } from "@/lib/api/activities.functions";

export const Route = createFileRoute("/activity/$id")({
  loader: async ({ params, context: { queryClient } }) => {
    await queryClient.prefetchQuery({
      queryKey: ["activity", params.id],
      queryFn: () => getActivity({ data: { id: params.id } }),
    });
  },
  head: ({ params }) => ({
    meta: [{ title: `Activity | IvVah` }],
  }),
  component: ActivityDetail,
});

interface Msg {
  author: string;
  isHost?: boolean;
  isYou?: boolean;
  time: string;
  text: string;
  avatar: string;
}

const initialMessages: Msg[] = [
  {
    author: "Sarah Kim",
    time: "12:45 PM",
    text: "Does anyone need me to bring any specific tools? I have a great hand trowel set.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  },
  {
    author: "Elias (Host)",
    isHost: true,
    time: "12:48 PM",
    text: "I've got plenty of tools, Sarah! Just bring yourself and maybe a sun hat.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elias",
  },
  {
    author: "Marco D.",
    time: "12:52 PM",
    text: "Stoked for this. I'll bring a bottle of bourbon — small batch from a friend's distillery.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marco",
  },
];

function ActivityDetail() {
  const { user, isLoggedIn } = useAuth();
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [approved, setApproved] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(initialMessages);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: activity } = useSuspenseQuery({
    queryKey: ["activity", id],
    queryFn: () => getActivity({ data: { id } }),
  });

  useEffect(() => {
    if (approved && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [messages, approved]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages([
      ...messages,
      {
        author: "You",
        isYou: true,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.avatarSeed ?? "User"}`,
      },
    ]);
    setInput("");
  };

  const handleJoin = async () => {
    if (!isLoggedIn || !user) {
      toast.error("Sign in to join this activity.");
      return;
    }
    try {
      const result = await joinActivity({ data: { activityId: id, phone: user.phone } });
      toast.success("You're in!");
      queryClient.invalidateQueries({ queryKey: ["activity", id] });
      setApproved(true);
    } catch {
      toast.error("Could not join. It may be full.");
    }
  };

  if (!activity) {
    return (
      <PageShell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-on-surface-variant">Activity not found.</p>
        </div>
      </PageShell>
    );
  }

  const a: Activity = activity;

  return (
    <PageShell hideFooter>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-8 lg:h-[calc(100vh-88px)] lg:flex-row">
        {/* Left: details */}
        <section className="custom-scrollbar flex flex-col gap-6 overflow-y-auto pr-2 lg:w-7/12">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit rounded-full bg-surface-container-highest px-4 py-1 font-label-mono text-on-surface-variant">
              {a.categoryEmoji} {a.category.toUpperCase()}
            </span>
            <h1 className="font-headline text-headline-lg italic">{a.title}</h1>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <img
              src={a.hostAvatar}
              alt=""
              className="h-14 w-14 flex-shrink-0 rounded-full bg-surface-container-high object-cover"
            />
            <div>
              <p className="font-headline text-[18px] text-on-surface">Hosted by {a.hostName}</p>
              <div className="flex items-center gap-1 text-primary">
                <Icon name="star" filled size={18} />
                <span className="font-label-mono">4.9 (24 Hosted)</span>
              </div>
            </div>
            <button className="ml-auto text-button text-primary underline underline-offset-4 transition-transform active:scale-95">
              Profile
            </button>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-body-lg leading-relaxed text-on-surface">{a.description}</p>
            <div className="flex flex-wrap gap-2">
              {a.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-surface-container-highest px-4 py-1 font-label-mono text-on-surface-variant"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative h-48 w-full overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high">
            <div className="flex h-full w-full items-center justify-center bg-primary-fixed text-6xl">
              {a.categoryEmoji}
            </div>
            <div className="absolute bottom-4 left-4 rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-2 shadow-sm">
              <p className="font-label-mono text-on-surface">{a.location.toUpperCase()}</p>
            </div>
          </div>

          <h2 className="font-headline text-headline-md italic">Activity Details</h2>
          <div className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-[20px]">Confirmed Kindred</h3>
              <span className="font-label-mono text-on-surface-variant">
                {a.filled} / {a.slots} SPOTS FILLED
              </span>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: a.slots }).map((_, i) => (
                <span
                  key={i}
                  className={
                    "h-8 w-8 rounded-sm " +
                    (i < a.filled ? "bg-secondary" : "border border-outline slot-empty")
                  }
                />
              ))}
            </div>
            <p className="font-label-mono text-on-surface-variant">
              {new Date(a.datetime).toLocaleDateString([], {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </section>

        {/* Right: chat */}
        <aside className="relative flex h-[600px] flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm lg:h-full lg:w-5/12">
          <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
            <div>
              <h2 className="font-headline text-[18px]">Event Discussion</h2>
              <p className="font-label-mono uppercase tracking-wider text-secondary">
                {approved ? "4 Kindred Online" : "Members only"}
              </p>
            </div>
            <Icon name="more_vert" className="text-on-surface-variant" />
          </div>

          <div
            ref={scrollRef}
            className="custom-scrollbar flex flex-grow flex-col gap-5 overflow-y-auto p-6"
          >
            {messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <img
                  src={m.avatar}
                  alt=""
                  className="h-10 w-10 flex-shrink-0 rounded-full border border-outline-variant object-cover"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "font-headline text-[16px] " +
                        (m.isHost ? "text-primary" : "text-on-surface")
                      }
                    >
                      {m.author}
                    </span>
                    <span className="font-label-mono text-[10px] text-on-surface-variant">
                      {m.time}
                    </span>
                  </div>
                  <p
                    className={
                      "mt-1 rounded-b-xl rounded-tr-xl p-4 text-body-md " +
                      (m.isHost
                        ? "bg-primary-fixed text-on-primary-fixed"
                        : m.isYou
                          ? "bg-secondary-container text-on-secondary-container"
                          : "bg-surface-container-low text-on-surface")
                    }
                  >
                    {m.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {!approved && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 p-8 text-center backdrop-blur-md">
              <div className="max-w-xs rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-lg">
                <Icon name="lock" size={48} className="mb-4 text-primary" />
                <h3 className="mb-2 font-headline text-[20px]">Exclusive to Kindred</h3>
                <p className="mb-6 text-on-surface-variant">
                  You must be approved for this activity to participate in the real-time discussion.
                </p>
                <button
                  onClick={handleJoin}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-button text-on-primary transition-transform active:scale-95"
                >
                  Request to Join
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-outline-variant bg-surface-container-low p-3">
            <label htmlFor="chat-input" className="sr-only">
              Message
            </label>
            <input
              id="chat-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              disabled={!approved}
              placeholder={approved ? "Say something kind..." : "Join to chat"}
              className="flex-1 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
            />
            <button
              onClick={send}
              disabled={!approved}
              aria-label="Send message"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-on-primary transition-transform active:scale-95 disabled:opacity-40"
            >
              <Icon name="send" />
            </button>
          </div>
        </aside>
      </div>
    </PageShell>
  );
}

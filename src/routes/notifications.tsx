import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications | IvVah" },
      {
        name: "description",
        content:
          "Stay on top of join requests, approvals, and reminders for your IvVah activities.",
      },
    ],
  }),
  component: NotificationsPage,
});

interface Note {
  icon: string;
  iconBg: string;
  iconColor: string;
  edge: string;
  body: React.ReactNode;
  time: string;
  unread?: boolean;
}

const today: Note[] = [
  {
    icon: "groups",
    iconBg: "bg-primary-fixed",
    iconColor: "text-on-primary-fixed",
    edge: "text-primary",
    body: (
      <>
        <span className="font-bold">Ravi</span> wants to join your{" "}
        <span className="font-headline italic text-primary">Chai Mate</span> session
      </>
    ),
    time: "2 hours ago",
    unread: true,
  },
  {
    icon: "check_circle",
    iconBg: "bg-secondary-container",
    iconColor: "text-on-secondary-container",
    edge: "text-secondary",
    body: (
      <>
        You&apos;re in!{" "}
        <span className="font-headline italic text-secondary">Rooftop Gardening</span> confirmed
      </>
    ),
    time: "5 hours ago",
    unread: true,
  },
  {
    icon: "alarm",
    iconBg: "bg-tertiary-fixed",
    iconColor: "text-on-tertiary-fixed",
    edge: "text-tertiary",
    body: (
      <>
        Your trek starts in <span className="font-bold">2 hours</span>. Remember to bring water!
      </>
    ),
    time: "Just now",
    unread: true,
  },
];

const earlier: Note[] = [
  {
    icon: "favorite",
    iconBg: "bg-surface-container-high",
    iconColor: "text-tertiary",
    edge: "text-tertiary",
    body: (
      <>
        <span className="font-bold">Maya</span> bookmarked your{" "}
        <span className="font-headline italic">Weekend Hack</span> session
      </>
    ),
    time: "Yesterday",
  },
  {
    icon: "chat",
    iconBg: "bg-surface-container-high",
    iconColor: "text-tertiary",
    edge: "text-tertiary",
    body: (
      <>
        New message in <span className="font-headline italic">Morning Run</span> chat
      </>
    ),
    time: "2 days ago",
  },
];

function Row({ n }: { n: Note }) {
  return (
    <a href="#" className="block">
      <div
        className={
          "activity-card flex items-start gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 transition-all hover:bg-white " +
          n.edge
        }
        style={{ boxShadow: "inset 6px 0 0 0 currentColor" }}
      >
        <div
          className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${n.iconBg}`}
        >
          <Icon name={n.icon} filled className={n.iconColor} />
        </div>
        <div className="flex-1 text-on-surface">
          <p className="text-body-md">{n.body}</p>
          <p className="mt-1 font-label-mono text-on-tertiary-fixed-variant">{n.time}</p>
        </div>
        {n.unread && <span className="mt-2 h-2 w-2 rounded-full bg-primary" />}
      </div>
    </a>
  );
}

function NotificationsPage() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-2xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-headline text-headline-lg-mob italic md:text-headline-lg">
            Notifications
          </h1>
          <button className="flex items-center gap-2 text-button text-primary underline-offset-4 hover:underline">
            Mark all as read
          </button>
        </div>

        <section className="mb-8">
          <h2 className="mb-4 font-label-mono uppercase tracking-widest text-on-surface-variant">
            Today
          </h2>
          <div className="space-y-2">
            {today.map((n, i) => (
              <Row n={n} key={i} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-label-mono uppercase tracking-widest text-on-surface-variant">
            Earlier
          </h2>
          <div className="space-y-2">
            {earlier.map((n, i) => (
              <Row n={n} key={i} />
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-xl border border-outline-variant bg-surface-container-low p-6 text-center">
          <Icon name="auto_awesome" className="text-primary" />
          <p className="mt-2 font-headline italic text-on-surface">You&apos;re all caught up</p>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Check back later for new activity.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

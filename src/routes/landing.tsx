import { createFileRoute, Link } from "@tanstack/react-router";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";

export const Route = createFileRoute("/landing")({
  head: () => ({
    meta: [
      { title: "IvVah — Find your kind. Do the thing." },
      {
        name: "description",
        content:
          "IvVah connects people for real activities — hyper-specific, location-aware, and actually human.",
      },
    ],
  }),
  component: Landing,
});

const categories = [
  { emoji: "☕", label: "Chai", count: 24 },
  { emoji: "🚛", label: "Ride Along", count: 8 },
  { emoji: "🎨", label: "Creative", count: 15 },
  { emoji: "🧑‍💻", label: "Hackathon", count: 12 },
  { emoji: "🚶", label: "Walk", count: 18 },
  { emoji: "🧩", label: "Strategy", count: 6 },
  { emoji: "🏃", label: "Trekking", count: 9 },
  { emoji: "🗣️", label: "Debate", count: 4 },
];

const happeningNow = [
  {
    stripe: "bg-primary",
    tag: "Co-driver",
    slots: { filled: 2, total: 3 },
    title: "1 seat left: Coimbatore -> Bangalore, leaving Friday 6am",
    host: "Karthik",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karthik",
  },
  {
    stripe: "bg-secondary",
    tag: "Hackathon",
    slots: { filled: 1, total: 4 },
    title: "Hackathon team — need UI/UX designer, Chakravyuha Trichy",
    host: "Team Flux",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=TeamFlux",
  },
  {
    stripe: "bg-primary-container",
    tag: "Chai-mate",
    slots: { filled: 1, total: 3 },
    title: "Chai & conversations near Gandhipuram, today 5pm, 2 spots",
    host: "Anjali",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali",
  },
];

function Landing() {
  return (
    <div className="min-h-screen font-body text-body-md text-on-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Section 1: Hero */}
      <section className="relative mx-auto flex max-w-7xl flex-col items-center gap-xxl overflow-hidden px-container-margin pb-xxl pt-xxl md:flex-row">
        <div className="z-10 flex-1">
          <h1 className="font-display-hero text-display-hero mb-lg italic text-on-background">
            Find someone to <span className="text-primary">drive</span> with.{" "}
            <br />
            <span className="text-secondary">Debate</span> with. <br />
            <span className="text-tertiary">Trek</span> with. <br />
            <span className="text-primary">Chai</span> with.
          </h1>
          <p className="font-body-lg text-body-lg mb-xl max-w-lg text-on-surface-variant">
            IvVah connects people for real activities — hyper-specific, location-aware, and
            actually human.
          </p>
          <div className="flex flex-wrap gap-md">
            <Link
              to="/login"
              className="rounded-xl bg-primary px-xl py-lg text-button text-on-primary shadow-lg transition-transform hover:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Post an activity
            </Link>
            <Link
              to="/register"
              className="rounded-xl border-2 border-outline-variant px-xl py-lg text-button text-on-surface transition-colors hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              Join IvVah
            </Link>
          </div>
        </div>

        {/* Floating Cards (hidden on mobile) */}
        <div className="relative hidden h-[500px] w-full flex-1 lg:block">
          <div className="bobbing-1 activity-card absolute left-10 top-0 w-72 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest" style={{ "--rot": "-3deg" } as React.CSSProperties}>
            <div className="flex overflow-hidden">
              <div className="w-[6px] shrink-0 bg-secondary" />
              <div className="flex-1 p-md">
                <div className="mb-xs flex items-start justify-between">
                  <span className="rounded-full bg-surface-container px-sm py-1 font-label-mono text-label-mono text-tertiary">Trekking</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-sm bg-secondary" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-sm italic leading-tight">Silent valley trek morning session</h3>
                <p className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Starting 5:30 AM</p>
              </div>
            </div>
          </div>
          <div className="bobbing-2 activity-card absolute right-10 top-40 w-72 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest" style={{ "--rot": "2deg" } as React.CSSProperties}>
            <div className="flex overflow-hidden">
              <div className="w-[6px] shrink-0 bg-primary-container" />
              <div className="flex-1 p-md">
                <div className="mb-xs flex items-start justify-between">
                  <span className="rounded-full bg-surface-container px-sm py-1 font-label-mono text-label-mono text-tertiary">Debate</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-sm bg-secondary" />
                    <div className="h-2 w-2 rounded-sm bg-secondary" />
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-sm italic leading-tight">AI vs Human Creativity over Coffee</h3>
                <p className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Race Course Road</p>
              </div>
            </div>
          </div>
          <div className="bobbing-3 activity-card absolute bottom-10 left-20 w-72 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest" style={{ "--rot": "-1deg" } as React.CSSProperties}>
            <div className="flex overflow-hidden">
              <div className="w-[6px] shrink-0 bg-outline" />
              <div className="flex-1 p-md">
                <div className="mb-xs flex items-start justify-between">
                  <span className="rounded-full bg-surface-container px-sm py-1 font-label-mono text-label-mono text-tertiary">Art</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-sm bg-secondary" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-sm italic leading-tight">Watercolor painting in the park</h3>
                <p className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Sunday 10 AM</p>
              </div>
            </div>
          </div>

          {/* Mobile: single mini card */}
          <div className="mt-xl w-full justify-center md:flex lg:hidden">
            <div className="activity-card flex w-72 overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest">
              <div className="w-[6px] shrink-0 bg-primary-container" />
              <div className="flex-1 p-md">
                <div className="mb-xs flex items-start justify-between">
                  <span className="rounded-full bg-surface-container px-sm py-1 font-label-mono text-label-mono text-tertiary">Chai</span>
                  <div className="flex gap-1">
                    <div className="h-2 w-2 rounded-sm bg-secondary" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                    <div className="slot-empty h-2 w-2 rounded-sm" />
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md mb-sm italic leading-tight">Chai &amp; conversations near Gandhipuram</h3>
                <p className="font-label-mono text-label-mono uppercase tracking-wider text-on-surface-variant">Today 5 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: How it works */}
      <section className="bg-surface-container-low px-container-margin py-xxl">
        <div className="mx-auto max-w-7xl">
          <div className="mb-xxl text-center">
            <h2 className="font-headline-lg text-headline-lg mb-md">How IvVah works</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Simple, human-centric connection.</p>
          </div>
          <div className="grid grid-cols-1 gap-xl md:grid-cols-3">
            {[
              {
                icon: "edit_square",
                bg: "bg-primary-fixed",
                color: "text-primary",
                title: "Post activity",
                desc: "Share exactly what you're planning. Be hyper-specific.",
              },
              {
                icon: "diversity_3",
                bg: "bg-secondary-fixed",
                color: "text-secondary",
                title: "People find it",
                desc: "Locals with similar niche interests see your post on their map.",
              },
              {
                icon: "chat",
                bg: "bg-tertiary-fixed",
                color: "text-tertiary",
                title: "Request & Chat",
                desc: "Screen requests, confirm details, and meet in the real world.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-surface-container-high bg-surface-container-lowest p-xl text-center"
              >
                <div
                  className={`mx-auto mb-lg flex h-16 w-16 items-center justify-center rounded-full ${item.bg} ${item.color}`}
                >
                  <Icon name={item.icon} size={24} />
                </div>
                <h3 className="font-headline-md text-headline-md mb-sm italic">{item.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Explore by Interest */}
      <section className="mx-auto max-w-7xl px-container-margin py-xxl">
        <h2 className="font-headline-lg text-headline-lg mb-xl">Explore by Interest</h2>
        <div className="grid grid-cols-2 gap-md md:grid-cols-4">
          {categories.map((c) => (
            <div
              key={c.label}
              className="group relative cursor-pointer overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest p-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              <div className="absolute bottom-0 left-0 top-0 w-0 bg-primary transition-all group-hover:w-[6px]" />
              <div className="flex items-center justify-between">
                <span className="text-3xl">{c.emoji}</span>
                <span className="rounded bg-surface-container px-sm py-1 font-label-mono text-label-mono text-primary">
                  {c.count}
                </span>
              </div>
              <p className="font-headline-md text-headline-md mt-md italic">{c.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Happening right now */}
      <section className="bg-surface-container-low px-container-margin py-xxl">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-headline-lg text-headline-lg mb-xl text-center">Happening right now</h2>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            {happeningNow.map((item) => (
              <div
                key={item.title}
                className="activity-card flex overflow-hidden rounded-xl border border-surface-container-high bg-surface-container-lowest"
              >
                <div className={`w-[6px] shrink-0 ${item.stripe}`} />
                <div className="flex-1 p-lg">
                  <div className="mb-sm flex items-start justify-between">
                    <span className="rounded-full bg-surface-container px-sm py-1 font-label-mono text-label-mono text-tertiary">
                      {item.tag}
                    </span>
                    <div className="flex gap-1">
                      {Array.from({ length: item.slots.total }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-sm ${i < item.slots.filled ? "bg-secondary" : "slot-empty"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-md italic leading-tight">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex items-center gap-sm">
                    <div className="h-6 w-6 overflow-hidden rounded-full bg-outline-variant">
                      <img
                        alt=""
                        className="h-full w-full object-cover"
                        src={item.hostAvatar}
                      />
                    </div>
                    <span className="font-label-mono text-[10px] uppercase tracking-widest text-on-surface-variant">
                      Posted by {item.host}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-xl text-center">
            <Link
              to="/register"
              className="border-b-2 border-primary pb-1 font-button text-button text-primary transition-colors hover:text-primary-container focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              See all 142 activities nearby
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-container-high bg-surface-container-lowest px-container-margin py-xl">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-lg md:flex-row md:items-center">
          <div>
            <span className="font-headline-md text-headline-md italic font-semibold text-on-background">
              IvVah
            </span>
            <p className="font-body-md text-body-md mt-sm text-on-surface-variant">
              Warmly built for human connection.
            </p>
            <p className="font-label-mono text-[10px] mt-md uppercase tracking-widest text-on-surface-variant">
              Made with chai ☕ in Coimbatore
            </p>
          </div>
          <div className="flex flex-wrap gap-xl">
            <div className="flex flex-col gap-sm">
              <span className="mb-xs font-label-mono text-label-mono uppercase text-tertiary">
                Product
              </span>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                About
              </a>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Safety
              </a>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Guidelines
              </a>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="mb-xs font-label-mono text-label-mono uppercase text-tertiary">
                Social
              </span>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Twitter
              </a>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Instagram
              </a>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                GitHub
              </a>
            </div>
            <div className="flex flex-col gap-sm">
              <span className="mb-xs font-label-mono text-label-mono uppercase text-tertiary">
                Legal
              </span>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Privacy
              </a>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Terms
              </a>
              <a className="text-body-md text-body-md text-on-surface-variant transition-colors hover:text-primary" href="#">
                Contact
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-xl flex flex-col items-center justify-between gap-md border-t border-surface-container pt-lg md:flex-row">
          <p className="font-label-mono text-label-mono text-on-surface-variant">
            &copy; 2024 IvVah. All rights reserved.
          </p>
          <div className="flex gap-lg">
            <Icon name="language" className="cursor-pointer text-on-surface-variant hover:text-primary" />
            <Icon name="share" className="cursor-pointer text-on-surface-variant hover:text-primary" />
          </div>
        </div>
      </footer>
    </div>
  );
}

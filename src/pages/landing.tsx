import { Link } from "react-router";
import { Footer } from "@/components/Footer";
import { Icon } from "@/components/Icon";
import { cards, type ActivityCard } from "@/pages/index";
import { categories } from "@/pages/post";

const stripeColor: Record<ActivityCard["stripe"], string> = {
  primary: "bg-primary",
  secondary: "bg-secondary",
  tertiary: "bg-tertiary",
};

const testimonials = [
  {
    name: "Amara O.",
    city: "Brooklyn, NY",
    seed: "Amara",
    quote:
      "I moved to a new city six months ago and ivvazh helped me find my people. Now I have a weekly board game group and a running buddy.",
  },
  {
    name: "Diego R.",
    city: "Austin, TX",
    seed: "Diego",
    quote:
      "Posted a 'let's build something' and three strangers showed up with laptops. We shipped a prototype in one weekend. Never looked back.",
  },
  {
    name: "Priya S.",
    city: "Jersey City, NJ",
    seed: "PriyaTestimonial",
    quote:
      "The chai-mate session by the Hudson was exactly what I needed. Real conversation, no agenda, new friends. This is the internet doing something right.",
  },
];

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <section className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-6 py-20 lg:flex-row lg:gap-16">
        <div className="max-w-xl text-center lg:text-left">
          <p className="mb-4 font-headline text-[20px] italic text-primary">ivvazh</p>
          <h1 className="font-headline text-display-hero text-on-surface">
            Find your kind.
            <br />
            Do the thing.
          </h1>
          <p className="mt-6 max-w-md text-body-lg text-on-surface-variant lg:mx-0 lg:max-w-lg">
            ivvazh is where real people post small, intentional gatherings — no followers, no
            clout, just vibes.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-4 text-button text-on-primary transition-transform hover:bg-primary-container active:scale-95"
            >
              <Icon name="person_add" size={18} />
              Join ivvazh
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-4 text-button text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <Icon name="explore" size={18} />
              Explore Activities
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 lg:mt-0">
          {cards.slice(0, 3).map((c) => (
            <div
              key={c.title}
              className="flex w-80 items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4 shadow-sm"
            >
              <div className={`h-12 w-[4px] shrink-0 rounded-full ${stripeColor[c.stripe]}`} />
              <div className="flex-1 overflow-hidden">
                <p className="truncate font-headline text-[16px] italic">{c.title}</p>
                <p className="mt-0.5 font-label-mono text-on-surface-variant">
                  {c.host} · {c.city}
                </p>
              </div>
              <div className="flex gap-[2px]">
                {Array.from({ length: c.total }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 ${i < c.filled ? "bg-secondary" : "border border-outline-variant"}`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-low px-6 py-20">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-4 font-headline text-headline-lg italic text-on-surface">
            How It Works
          </h2>
          <p className="mb-12 text-body-md text-on-surface-variant">
            Three simple steps to real connection.
          </p>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                icon: "post_add",
                title: "Post your plan",
                desc: "A walk, a hackathon, chai — whatever you're into. Name it, set a time and place, and put it out there.",
              },
              {
                icon: "search",
                title: "Find your people",
                desc: "Browse activities near you. Filter by category, date, or vibe. Every post is a real person, not an algorithm.",
              },
              {
                icon: "handshake",
                title: "Show up & connect",
                desc: "Small groups, real conversation. No followers, no clout — just showing up and doing the thing together.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex flex-col items-center rounded-xl bg-surface-container-lowest p-8 shadow-sm"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed text-primary">
                  <Icon name={item.icon} size={32} />
                </div>
                <h3 className="mb-2 font-headline text-headline-md italic text-on-surface">
                  {item.title}
                </h3>
                <p className="text-body-md text-on-surface-variant">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-center font-headline text-headline-md italic text-on-surface">
            Find your kind of thing
          </h2>
          <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-4">
            {categories.map((c) => (
              <div
                key={c.label}
                className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-6 py-5"
              >
                <span className="text-3xl">{c.emoji}</span>
                <span className="whitespace-nowrap font-label-mono text-on-surface-variant">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center font-headline text-headline-lg italic text-on-surface">
            Real people, real stories
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col rounded-xl border border-outline-variant bg-surface-container-lowest p-8 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${t.seed}`}
                    alt=""
                    className="h-12 w-12 rounded-full bg-surface-container-high"
                  />
                  <div>
                    <p className="font-headline text-[16px] italic text-on-surface">{t.name}</p>
                    <p className="font-label-mono text-on-surface-variant">{t.city}</p>
                  </div>
                </div>
                <p className="flex-1 text-body-md italic text-on-surface-variant">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-fixed px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-6 font-headline text-headline-lg italic text-on-primary-fixed">
            Ready to find your kind?
          </h2>
          <p className="mb-8 text-body-lg text-on-primary-fixed-variant">
            Join thousands of people showing up for small, intentional gatherings.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-button text-on-primary shadow-lg transition-transform hover:bg-primary-container active:scale-95"
          >
            <Icon name="person_add" size={18} />
            Get Started
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

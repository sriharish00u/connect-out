import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-headline text-display-hero text-primary">404</h1>
        <h2 className="mt-4 font-headline text-headline-md italic text-on-surface">
          Page not found
        </h2>
        <p className="mt-2 text-body-md text-on-surface-variant">
          That page wandered off. Let&apos;s find you something to do instead.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-button text-on-primary transition-transform active:scale-95"
          >
            Back to feed
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-headline text-headline-md italic text-on-surface">
          Something didn&apos;t load
        </h1>
        <p className="mt-2 text-body-md text-on-surface-variant">
          Take a breath. Try again or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-button text-on-primary transition-transform active:scale-95"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-outline-variant bg-surface-container-lowest px-5 py-3 text-button text-on-surface transition-colors hover:bg-surface-container-high"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "IvVah — Find your kind. Do the thing." },
      {
        name: "description",
        content:
          "IvVah is the small-group activity platform for real human connection. Browse small-group activities near you — co-driver runs, chai mates, hackathons, walks, and more.",
      },
      {
        name: "author",
        content: "IvVah",
      },
      {
        property: "og:title",
        content: "IvVah — Find your kind. Do the thing.",
      },
      {
        property: "og:description",
        content: "IvVah is a React application for building and managing connections.",
      },
      {
        name: "twitter:title",
        content: "IvVah — Find your kind. Do the thing.",
      },
      {
        name: "twitter:description",
        content: "IvVah is a React application for building and managing connections.",
      },
      {
        property: "og:image",
        content: "https://example.com/og-image.png",
      },
      { name: "author", content: "IvVah" },
      { property: "og:title", content: "IvVah — Find your kind. Do the thing." },
      {
        property: "og:description",
        content: "IvVah is the small-group activity platform for real human connection.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "IvVah — Find your kind. Do the thing." },
      {
        name: "description",
        content: "IvVah is the small-group activity platform for real human connection.",
      },
      {
        name: "twitter:description",
        content: "IvVah is the small-group activity platform for real human connection.",
      },
      {
        property: "og:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64ed86bf-b9da-4a68-839e-721a594d0c45/id-preview-966be107--6233e84f-a5ee-4314-9083-144c65e483c2.lovable.app-1781017937105.png",
      },
      {
        name: "twitter:image",
        content:
          "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/64ed86bf-b9da-4a68-839e-721a594d0c45/id-preview-966be107--6233e84f-a5ee-4314-9083-144c65e483c2.lovable.app-1781017937105.png",
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..800;1,9..144,400..800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0..1,0&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

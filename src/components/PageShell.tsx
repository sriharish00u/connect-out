import type { ReactNode } from "react";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";
import { BottomNav } from "./BottomNav";

export function PageShell({ children, hideFooter }: { children: ReactNode; hideFooter?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-background pb-20 md:pb-0">
      <TopNav />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
      <BottomNav />
    </div>
  );
}

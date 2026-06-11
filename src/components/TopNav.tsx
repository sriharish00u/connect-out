import { Link, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import { Icon } from "./Icon";
import { useAuth } from "@/hooks/use-auth";
import { auth as authStore } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { label: "Explore", to: "/" },
  { label: "Notifications", to: "/notifications" },
  { label: "Profile", to: "/profile" },
];

export function TopNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-background/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-headline text-headline-md italic text-primary">
            ivvazh
          </Link>
          <div className="hidden gap-6 md:flex">
            {navItems.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={
                    active
                      ? "border-b-2 border-primary pb-1 text-body-md text-primary"
                      : "text-body-md text-on-surface-variant transition-colors hover:text-primary"
                  }
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Icon
              name="search"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
              size={18}
            />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q.trim()) {
                  navigate(`/?q=${encodeURIComponent(q.trim())}`);
                }
              }}
              placeholder="Search activities..."
              className="w-56 rounded-full border border-outline-variant bg-surface-container-low py-2 pl-9 pr-4 text-body-md placeholder:text-on-surface-variant focus:border-primary focus:outline-none"
            />
          </div>
          <Link
            to="/post"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-button text-on-primary transition-transform active:scale-95"
          >
            <Icon name="add" size={18} />
            <span className="hidden sm:inline">Post Activity</span>
          </Link>
          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 overflow-hidden rounded-full border border-outline-variant bg-surface-container-high cursor-pointer">
                  <img
                    alt="Your profile"
                    className="h-full w-full object-cover"
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  My Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  My Activities
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    authStore.logout();
                    navigate("/landing");
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-button text-on-primary transition-transform hover:scale-95"
              >
                <Icon name="person_add" size={18} />
                <span className="hidden sm:inline">Join</span>
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-button text-on-surface transition-colors hover:bg-surface-container-high"
              >
                <Icon name="login" size={18} />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

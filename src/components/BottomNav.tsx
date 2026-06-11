import { Link, useNavigate, useLocation } from "react-router";
import { Icon } from "./Icon";
import { useAuth } from "@/hooks/use-auth";

const items = [
  { label: "Home", to: "/", icon: "home" },
  { label: "Notifications", to: "/notifications", icon: "notifications" },
  { label: "Post", to: "/post", icon: "add_circle" },
  { label: "Explore", to: "/", icon: "chat_bubble" },
  { label: "Profile", to: "/profile", icon: "person" },
];

export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isLoggedIn } = useAuth();

  const isActive = (to: string) => {
    if (to === "/") return pathname === "/";
    return pathname.startsWith(to);
  };

  return (
    <nav className="fixed bottom-0 left-0 z-50 w-full border-t border-outline-variant bg-surface pb-[env(safe-area-inset-bottom)] md:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {items.map((item) => {
          const active = isActive(item.to);
          return (
            <Link
              key={item.to + item.label}
              to={item.to}
              onClick={(e) => {
                if (item.label === "Post" && !isLoggedIn) {
                  e.preventDefault();
                  navigate("/login");
                }
              }}
              className={
                "flex flex-col items-center justify-center rounded-xl px-3 py-1 transition-all " +
                (active
                  ? "bg-secondary-container text-on-secondary-container"
                  : "text-on-surface-variant hover:bg-surface-container-high")
              }
            >
              <div className="relative">
                <Icon name={item.icon} filled={active} />
              </div>
              <span className="mt-0.5 font-label-mono">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

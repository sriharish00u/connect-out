export interface AuthUser {
  phone: string;
  name: string;
  city: string;
  interests: string[];
  avatarSeed: string;
}

const STORAGE_KEY = "ivvazh_user";

type Listener = () => void;
const listeners = new Set<Listener>();

let _user: AuthUser | null = (() => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
})();

export const auth = {
  get user(): AuthUser | null {
    return _user;
  },
  login(u: AuthUser) {
    _user = u;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    }
    listeners.forEach((fn) => fn());
  },
  logout() {
    _user = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    listeners.forEach((fn) => fn());
  },
  subscribe(fn: Listener) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
  },
};

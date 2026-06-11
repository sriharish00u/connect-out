import { useEffect, useState } from "react";
import { auth, type AuthUser } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(auth.user);
  useEffect(() => auth.subscribe(() => setUser(auth.user)), []);
  return { user, isLoggedIn: user !== null };
}

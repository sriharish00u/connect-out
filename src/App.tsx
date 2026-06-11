import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/use-auth";

import { LandingPage }      from "@/pages/landing";
import { FeedPage }         from "@/pages/index";
import { LoginPage }        from "@/pages/login";
import { OnboardingPage }   from "@/pages/onboarding";
import { ActivityDetail }   from "@/pages/activity";
import { PostActivity }     from "@/pages/post";
import { ProfilePage }      from "@/pages/profile";
import { NotificationsPage } from "@/pages/notifications";
import { OAuthCallback }    from "@/pages/auth-callback";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <>{children}</> : <Navigate to="/landing" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/landing"        element={<LandingPage />} />
      <Route path="/login"          element={<LoginPage />} />
      <Route path="/onboarding"     element={<OnboardingPage />} />
      <Route path="/auth/callback"  element={<OAuthCallback />} />

      <Route path="/"               element={<RequireAuth><FeedPage /></RequireAuth>} />
      <Route path="/activity/:id"   element={<RequireAuth><ActivityDetail /></RequireAuth>} />
      <Route path="/post"           element={<RequireAuth><PostActivity /></RequireAuth>} />
      <Route path="/profile"        element={<RequireAuth><ProfilePage /></RequireAuth>} />
      <Route path="/notifications"  element={<RequireAuth><NotificationsPage /></RequireAuth>} />

      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
}

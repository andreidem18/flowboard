import { Navigate } from "react-router";
import { useAuth } from "~/features/auth/hooks";

export default function RedirectPage() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <></>;

  if (!isAuthenticated) return <Navigate to="/auth" />;

  return <Navigate to="/app/dashboard" />;
}

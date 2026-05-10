import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/features/auth/hooks";

export default function RequireSession() {
  const { isAuthenticated, loading } = useAuth();

  if (!loading && !isAuthenticated) return <Navigate to="/auth" replace />;
  return <Outlet />;
}

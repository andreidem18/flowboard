import { Link, Navigate, Outlet, useLocation } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAuth } from "~/features/auth/hooks";

export default function authLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="flex size-full min-h-dvh items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-2xl text-transparent">
            FlowBoard
          </CardTitle>
          <CardDescription>
            Manage your tasks and projects efficiently
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={location.pathname}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="/auth/login" asChild>
                <Link to="/auth/login">Login</Link>
              </TabsTrigger>
              <TabsTrigger value="/auth/signup" asChild>
                <Link to="/auth/signup">Sign Up</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  );
}

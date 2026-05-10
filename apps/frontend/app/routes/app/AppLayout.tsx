import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ChartNoAxesCombined,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { useLogoutMutation } from "~/features/auth/mutations";

export default function AppLayout() {
  const location = useLocation();
  const { mutate: handleLogout, isPending } = useLogoutMutation();

  return (
    <div className="flex size-full min-h-dvh flex-col">
      <header className="flex items-center justify-between border-b px-6 py-4 transition-all duration-300">
        <div className="flex items-center gap-6">
          <h1 className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent">
            FlowBoard
          </h1>
          <nav className="flex gap-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button variant={isActive ? "default" : "ghost"} size="sm">
                    <Icon className="mr-2 h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleLogout()}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner className="mr-2" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            Logout
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

const NAV_LINKS = [
  {
    to: "/app/dashboard",
    label: "Dashboard",
    icon: ChartNoAxesCombined,
  },
  {
    to: "/app/projects",
    label: "Projects",
    icon: FolderKanban,
  },
  {
    to: "/app/board",
    label: "Board",
    icon: LayoutDashboard,
  },
];

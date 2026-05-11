import {
  LayoutDashboard,
  FolderKanban,
  LogOut,
  ChartNoAxesCombined,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { Spinner } from "~/components/ui/spinner";
import { ThemeToggle } from "~/components/ui/theme-toggle";
import { useLogoutMutation } from "~/features/auth/mutations";

export default function AppLayout() {
  const location = useLocation();
  const { mutate: handleLogout, isPending } = useLogoutMutation();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-4 py-4">
          <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent group-data-[collapsible=icon]:hidden">
            FlowBoard
          </span>
          <span className="hidden bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent group-data-[collapsible=icon]:block">
            Fl
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="px-2">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname.startsWith(link.to);
              return (
                <SidebarMenuItem key={link.to}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={link.label}
                  >
                    <Link to={link.to}>
                      <Icon />
                      <span>{link.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="flex flex-col gap-1 px-2 pb-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => handleLogout()}
            disabled={isPending}
          >
            {isPending ? (
              <Spinner className="mr-2" />
            ) : (
              <LogOut className="mr-2 h-4 w-4" />
            )}
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-12 items-center border-b px-4">
          <SidebarTrigger />
          <span className="block bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-xl font-semibold text-transparent group-data-[collapsible=icon]:hidden md:hidden">
            FlowBoard
          </span>
        </header>
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
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

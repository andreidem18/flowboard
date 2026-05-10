import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/RedirectPage.tsx"),

  route("/auth", "./routes/auth/AuthPage.tsx"),

  layout("./guards/RequireSession.tsx", [
    layout("./routes/app/AppLayout.tsx", [
      route("/app/dashboard", "./routes/app/dashboard/DashboardPage.tsx"),
      route("/app/projects", "./routes/app/projects/ProjectsPage.tsx"),
      route("/app/board", "./routes/app/board/BoardPage.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

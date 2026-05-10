import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes"

export default [
  layout("./guards/RequireSession.tsx", [index("routes/home.tsx")]),

  route("/auth", "./routes/auth/AuthPage.tsx"),
] satisfies RouteConfig

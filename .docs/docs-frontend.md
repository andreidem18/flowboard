# Frontend — Documentación

SPA construida con **React 19** y **React Router v7** en modo CSR, con gestión de servidor centralizada en React Query y tipos compartidos con el backend vía `@repo/shared`.

## Stack

| Capa           | Tecnología                           |
| -------------- | ------------------------------------ |
| Framework      | React 19 + React Router DOM v7 (CSR) |
| Estilos        | Tailwind CSS v4 + shadcn/ui          |
| Server state   | TanStack React Query v5              |
| Client state   | Zustand v5                           |
| Formularios    | React Hook Form + Zod                |
| Gráficas       | Recharts                             |
| Notificaciones | Sonner                               |
| Drag and drop  | Dnd kit                              |
| Tests          | Vitest + React Testing Library       |

## Estructura

```
app/
├── features/          # Lógica organizada por dominio
│   ├── auth/          #   hooks, mutations, schemas, helpers
│   ├── board/         #   queries, mutations, hooks, stores, components
│   ├── dashboard/     #   queries, components, utils
│   ├── projects/      #   queries, mutations, hooks, stores, components
│   └── users/         #   queries
├── routes/            # Páginas y layouts de React Router
│   ├── app/           #   dashboard, projects, board, board/:projectId
│   └── auth/          #   Login, signup
├── guards/            # RequireSession — protección de rutas autenticadas
├── components/ui/     # Primitivos shadcn/ui y componentes genéricos
├── providers/         # ReactQueryClientProvider, ThemeProvider
├── hooks/             # Hooks globales (ej. use-mobile)
└── lib/               # env, utils (cn)
```

Cada feature sigue la separación: **queries/mutations → hooks → components**. Los componentes no hacen fetch directamente; consumen hooks que encapsulan React Query.

## Routing

React Router v7 en modo **Framework (CSR)**. Las rutas se declaran en `app/routes.ts` usando la API de configuración tipada.

```
/                    →  RedirectPage (redirige según sesión)
/auth                →  AuthPage (login / signup)
/app/dashboard       →  DashboardPage       ┐
/app/projects        →  ProjectsPage        │ protegidas por
/app/board           →  BoardPage           │ RequireSession
/app/board/:id       →  BoardDetail         ┘
```

`RequireSession` es un layout guard: consulta la sesión vía React Query y redirige a `/auth` si no hay sesión activa. Si la query está cargando, renderiza el outlet igualmente para evitar flashes innecesarios.

## Gestión de estado

El estado se divide en dos capas con responsabilidades bien delimitadas:

**Server state — React Query**
Todo lo que viene del backend vive en React Query: fetching, caché, revalidación e invalidación tras mutaciones. Los query keys están centralizados dentro de cada feature. Las mutaciones realizan `optimistic updates` en features claves como el reordenamiento para mejorar la experiencia de usuario. `staleTime` se configura por query según la frecuencia esperada de cambio (la sesión tiene 5 min; las tareas del board se revalidan en cada foco).

**Client state — Zustand**
Solo se usa para estado de UI que necesita ser compartido entre componentes sin prop-drilling: el task seleccionado en el board (`useBoardStore`), el diálogo abierto y el status pre-seleccionado al crear una tarea. No hay estado global de negocio; si un dato viene del servidor, vive en React Query.

## Autenticación

La sesión se obtiene con un fetch a `/api/v1/auth/get-session` (Better Auth) envuelto en `useAuth`. El hook expone `{ user, session, isAuthenticated, loading }` y es consumido por `RequireSession` y cualquier componente que necesite el contexto del usuario.

No hay manejo de tokens en el cliente — las sesiones son cookie-based, por lo que todas las requests incluyen `credentials: "include"`.

## Formularios y validación

Los formularios usan **React Hook Form** con resolvers de Zod. Cuando el schema ya existe en `@repo/shared` se reutiliza directamente; si tiene campos específicos de UI (confirmación de contraseña, campos de solo presentación) se extiende localmente. Esto evita duplicar contratos de validación entre frontend y backend.

## Decisiones de diseño y tradeoffs

### React Router v7 sobre TanStack Router

React Router v7 en Framework Mode ofrece una API de configuración tipada (`routes.ts`) con soporte para loaders y una convención de rutas familiar. TanStack Router tiene tipado de rutas más estricto y búsqueda de parámetros con type-safety nativa, pero su curva de adopción y el ecosistema más joven no justificaban el cambio para esta escala. Si el proyecto creciera hacia rutas con params complejos o búsqueda tipada, TanStack Router sería la alternativa natural.

### CSR sobre SSR

React Router v7 soporta SSR, pero se optó por CSR puro. Flowboard es una aplicación autenticada donde casi todo el contenido es privado — el beneficio de SSR (SEO, tiempo al primer byte de contenido público) no aplica. CSR simplifica el deployment, elimina la necesidad de un servidor Node en producción y reduce la superficie de bugs de hidratación.

### shadcn/ui sobre una librería de componentes encapsulada

shadcn/ui genera los componentes directamente en el repositorio en lugar de instalarlos como dependencia. Esto implica que los componentes son completamente modificables sin workarounds, pero también que los updates no son automáticos — hay que migrarlos manualmente. Para un proyecto donde el design system necesita adaptarse al producto, tener el código en el repo es la opción correcta.

# Flowboard

Flowboard es un gestor de proyectos y tareas tipo kanban, con autenticación, soporte móvil y API REST documentada.

### Setup rápido con Docker 🐳 (3 pasos)

1. Copia las variables de entorno de ejemplo

```bash
cp .env.docker.example .env.docker
```

2. Ejecuta docker compose

```bash
docker compose --env-file .env.docker up --build
```

3. Espera a que salga `🟢 backend running at localhost:3000`

*El primer build se puede demorar alrededor de 6 minutos*⌛

✅ Accede al frontend en

```bash
http://localhost:5173
```

(No accedas con 127.0.0.1 porque puede dar error de CORS)

✅ Accede a la documentación del backend en

```bash
http://localhost:3000/openapi             # Backend general
http://localhost:3000/api/v1/auth/openapi # autenticación con better auth
```

Credenciales de prueba:

```json
{
  "email": "alice@example.com",
  "password": "admin1234"
}
```

> La contraseña viene de la variable `SEED_USER_PASSWORD`

---

## Documentación

### Estructura del monorepo

El proyecto usa **Turborepo** con **pnpm workspaces** para gestionar múltiples paquetes de forma eficiente. Turborepo cachea los resultados de tareas como `build`, `lint` y `typecheck`, y las ejecuta en paralelo respetando dependencias entre paquetes.

```
flowboard/
├── apps/
│   ├── backend/   # API REST (Elysia + PrismaORM + PostgreSQL)
│   └── frontend/  # SPA (React + React Router DOM + tanStank query)
└── packages/
    ├── shared/          # Esquemas Zod y tipos compartidos entre apps
    ├── eslint-config/   # Configuración ESLint común
    └── typescript-config/ # tsconfig base compartida
```

El paquete `shared` es clave: define los esquemas de validación con Zod (proyectos, tareas, usuarios, autenticación) que tanto el frontend como el backend consumen, garantizando consistencia de tipos end-to-end.

Los scripts disponibles desde la raíz del monorepo son:

| Script           | Descripción                                           |
| ---------------- | ----------------------------------------------------- |
| `pnpm dev`       | Levanta frontend y backend en paralelo con hot-reload |
| `pnpm build`     | Build de todas las apps (respeta dependencias)        |
| `pnpm lint`      | Lint en todos los paquetes                            |
| `pnpm typecheck` | Verificación de tipos en todos los paquetes           |

### Desarrollo local

1. Crea una base de datos Postgres
2. Instala Node v18+ y pnpm
3. Copia y completa las variables de entorno:
   - `apps/backend/.env.example` → `apps/backend/.env`
   - `apps/frontend/.env.example` → `apps/frontend/.env`
4. Ejecuta desde la raíz:

```bash
pnpm install
pnpm dev
```

Para más información sobre la arquitectura del frontend y el backend:

- [Documentación frontend](/.docs/docs-frontend.md)
- [Documentación backend](/.docs/docs-backend.md)

#### Screenshots

![login](/.docs/screenshots/1-login.png)
![dashboard](/.docs/screenshots/2-dashboard.png)
![dashboard-2](/.docs/screenshots/3-dashboard-2.png)
![projects](/.docs/screenshots/4-projects.png)
![task-board](/.docs/screenshots/5-task-board.png)
![task-form](/.docs/screenshots/6-task-form.png)
![mobile](/.docs/screenshots/7-mobile.png)
![backend-endpoints](/.docs/screenshots/8-backend-endpoints.png)

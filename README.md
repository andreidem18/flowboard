# Flowboard

### Setup rápido con Docker 🐳 (3 pasos)

1. Copia las variables de entorno de ejemplo

```bash
cp .env.docker.example .env.docker
```

2. Ejecuta docker compose

```bash
docker compose up --build
```

3. Espera a que salga `🟢 backend running at localhost:3000`

*El primer build se puede demorar alrededor de 6 minutos*⌛

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

## Backend

### Docs

The docs are at /openapi.
the auth docs are at /api/v1/auth/openapi

### Authentication

The authentication is maintained by using better auth and login with email and password

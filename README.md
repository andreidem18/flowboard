# Flowboard

### Setup rápido con Docker 🐳

- Copia las variables de entorno de ejemplo

```bash
cp .env.docker.example .env.docker
```

- Ejecuta docker compose

```bash
docker compose up --build
```

*El primer build se demora unos minutos*⌛

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

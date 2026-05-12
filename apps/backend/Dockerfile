FROM node:22-slim AS base

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./

COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile

RUN pnpm --filter backend build

EXPOSE 3000

CMD ["pnpm", "--filter", "backend", "start"]

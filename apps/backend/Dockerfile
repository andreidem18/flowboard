FROM node:24-alpine

WORKDIR /app

RUN corepack enable

COPY . .

RUN pnpm install

RUN pnpm run prisma:generate

RUN pnpm --filter backend build

EXPOSE 3000

CMD ["pnpm", "--filter", "backend", "start"]

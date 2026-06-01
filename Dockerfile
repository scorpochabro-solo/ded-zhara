# ───────────────────────────────────────────────────────────────
#  Дед&Жара — Dockerfile для self-host на VPS.
#  По умолчанию работает на SQLite (файл в /data, смонтируй volume).
#  Для Postgres — задай DATABASE_URL и поменяй provider в схеме (см. README).
# ───────────────────────────────────────────────────────────────

# 1. Установка зависимостей (без postinstall — prisma generate сделаем в билде)
FROM node:24-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# 2. Сборка приложения
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3. Финальный образ
FROM node:24-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# SQLite-файл живёт в томе /data (персистентность между перезапусками)
ENV DATABASE_URL="file:/data/dev.db"

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/src/generated ./src/generated
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/next.config.ts ./next.config.ts
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

RUN mkdir -p /data
VOLUME /data
EXPOSE 3000

# При старте: применяем схему к БД (idempotent) и поднимаем сервер.
CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && node_modules/.bin/next start -p ${PORT}"]

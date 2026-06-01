import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

/**
 * Единый экземпляр Prisma Client (мини-CRM «Дед&Жара»).
 *
 * Prisma 7 требует driver-адаптер. По умолчанию — SQLite (better-sqlite3),
 * чтобы проект запускался локально без настройки.
 *
 * ┌─ Переключение на PostgreSQL (Vercel/Neon/Supabase) ───────────────┐
 * │ 1. prisma/schema.prisma → provider = "postgresql"                 │
 * │ 2. .env → DATABASE_URL="postgresql://user:pass@host/db?sslmode..." │
 * │ 3. npm i @prisma/adapter-pg pg  (и удали better-sqlite3, если не   │
 * │    нужен) — затем замени блок адаптера ниже на:                    │
 * │      import { PrismaPg } from "@prisma/adapter-pg";                │
 * │      const adapter = new PrismaPg({ connectionString: url });      │
 * │ 4. npx prisma generate && npx prisma db push                       │
 * └────────────────────────────────────────────────────────────────────┘
 */

const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

// В dev переиспользуем клиент между hot-reload, чтобы не плодить соединения.
const globalForPrisma = globalThis as unknown as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

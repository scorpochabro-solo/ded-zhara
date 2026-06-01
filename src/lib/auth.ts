import crypto from "node:crypto";

/**
 * Минимальная аутентификация для /admin: подписанная cookie-сессия (HMAC).
 * Логин и пароль — из переменных окружения. Никаких секретов в коде.
 */

export const ADMIN_COOKIE = "dz_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

const SECRET =
  process.env.ADMIN_SESSION_SECRET || "dev-insecure-secret-change-me-please";

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Проверка логина/пароля против env. */
export function verifyCredentials(user: string, password: string): boolean {
  const U = process.env.ADMIN_USER ?? "";
  const P = process.env.ADMIN_PASSWORD ?? "";
  if (!U || !P) return false;
  return safeEqual(user, U) && safeEqual(password, P);
}

/** Создаёт подписанный токен сессии с временем жизни. */
export function createSessionToken(): string {
  const exp = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = String(exp);
  return `${payload}.${sign(payload)}`;
}

/** Проверяет подпись и срок действия токена. */
export function verifySessionToken(token?: string | null): boolean {
  if (!token) return false;
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!safeEqual(sig, sign(payload))) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

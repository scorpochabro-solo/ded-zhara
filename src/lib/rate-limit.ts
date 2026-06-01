/**
 * Простой in-memory rate-limit по IP (скользящее окно).
 * Для одного инстанса этого достаточно как антиспам-страховка вместе с
 * honeypot-полем. На многоинстансном проде стоит вынести в Redis/Upstash.
 */

const WINDOW_MS = 10 * 60 * 1000; // 10 минут
const MAX_HITS = 5; // не больше 5 заявок с одного IP за окно

const hits = new Map<string, number[]>();

export function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSec?: number;
} {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);

  if (arr.length >= MAX_HITS) {
    const oldest = arr[0];
    const retryAfterSec = Math.ceil((WINDOW_MS - (now - oldest)) / 1000);
    hits.set(ip, arr);
    return { allowed: false, retryAfterSec };
  }

  arr.push(now);
  hits.set(ip, arr);

  // Лёгкая защита от утечки памяти: чистим устаревшие ключи изредка.
  if (hits.size > 5000) {
    for (const [key, value] of hits) {
      const fresh = value.filter((t) => now - t < WINDOW_MS);
      if (fresh.length === 0) hits.delete(key);
      else hits.set(key, fresh);
    }
  }

  return { allowed: true };
}

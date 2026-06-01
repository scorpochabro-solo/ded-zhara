import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifySessionToken } from "./auth";

/** Проверяет, авторизован ли текущий запрос как админ (по cookie-сессии). */
export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

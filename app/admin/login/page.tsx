import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { loginAction } from "../actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Вход в админку",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdmin()) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <div className="w-full max-w-sm surface-card rounded-card p-8">
        <a href="/" className="font-display text-2xl font-semibold">
          Дед<span className="text-ember-gradient italic">&amp;</span>Жара
        </a>
        <h1 className="mt-6 font-display text-3xl">Вход в CRM</h1>
        <p className="mt-2 text-sm text-muted">
          Заявки с сайта. Доступ только для мастера.
        </p>

        {error && (
          <p className="mt-5 rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-bright">
            Неверный логин или пароль.
          </p>
        )}

        <form action={loginAction} className="mt-6 flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-faint">
              Логин
            </span>
            <input
              name="user"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-cream focus:border-copper focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-faint">
              Пароль
            </span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-cream focus:border-copper focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="mt-2 rounded-full bg-linear-to-b from-copper-bright to-copper px-6 py-3.5 font-medium text-bg-deep shadow-ember transition-all hover:-translate-y-0.5 hover:brightness-105"
          >
            Войти
          </button>
        </form>
      </div>
    </main>
  );
}

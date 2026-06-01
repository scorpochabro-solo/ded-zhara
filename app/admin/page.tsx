import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-session";
import { prisma } from "@/lib/db";
import { logoutAction } from "./actions";
import { StatusSelect } from "./StatusSelect";
import { formatDateTimeMsk } from "@/lib/format";
import {
  CHANNEL_LABELS,
  SERVICE_LABELS,
  SERVICES,
  STATUSES,
  STATUS_LABELS,
  type Channel,
  type ServiceKind,
} from "@/lib/validation";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "CRM — заявки",
  robots: { index: false, follow: false },
};

type SP = Record<string, string | string[] | undefined>;
const first = (v: string | string[] | undefined) =>
  (Array.isArray(v) ? v[0] : v) ?? "";

function startOfTodayMskUtc(): Date {
  const MSK = 3 * 60 * 60 * 1000;
  const m = new Date(Date.now() + MSK);
  return new Date(Date.UTC(m.getUTCFullYear(), m.getUTCMonth(), m.getUTCDate()) - MSK);
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");

  const sp = await searchParams;
  const status = first(sp.status);
  const service = first(sp.service);
  const q = first(sp.q).trim();

  const where: {
    status?: string;
    service?: string;
    OR?: { name?: { contains: string }; phone?: { contains: string } }[];
  } = {};
  if (status && (STATUSES as readonly string[]).includes(status)) where.status = status;
  if (service && (SERVICES as readonly string[]).includes(service)) where.service = service;
  if (q) where.OR = [{ name: { contains: q } }, { phone: { contains: q } }];

  const [leads, total, newToday] = await Promise.all([
    prisma.lead.findMany({ where, orderBy: { createdAt: "desc" }, take: 500 }),
    prisma.lead.count(),
    prisma.lead.count({ where: { createdAt: { gte: startOfTodayMskUtc() } } }),
  ]);

  const exportQs = new URLSearchParams();
  if (where.status) exportQs.set("status", status);
  if (where.service) exportQs.set("service", service);
  if (q) exportQs.set("q", q);
  const exportHref = `/api/admin/export${exportQs.toString() ? `?${exportQs}` : ""}`;

  const fieldCls =
    "rounded-lg border border-line bg-surface px-3 py-2 text-sm text-cream focus:border-copper focus:outline-none";

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Шапка */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <a href="/" className="font-display text-2xl font-semibold">
            Дед<span className="text-ember-gradient italic">&amp;</span>Жара
          </a>
          <span className="ml-3 text-sm text-faint">мини-CRM · заявки</span>
        </div>
        <form action={logoutAction}>
          <button className="rounded-full border border-line px-4 py-2 text-sm text-muted transition-colors hover:border-ember/50 hover:text-ember-bright">
            Выйти
          </button>
        </form>
      </div>

      {/* Счётчики */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-sm">
        <div className="rounded-2xl border border-line bg-surface/40 p-4">
          <div className="font-display text-3xl text-cream">{total}</div>
          <div className="text-sm text-faint">всего заявок</div>
        </div>
        <div className="rounded-2xl border border-copper/30 bg-copper/5 p-4">
          <div className="font-display text-3xl text-copper-bright">{newToday}</div>
          <div className="text-sm text-faint">новых сегодня</div>
        </div>
      </div>

      {/* Фильтры */}
      <form
        method="get"
        className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-line bg-surface/30 p-4"
      >
        <label className="flex flex-col gap-1">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-faint">Статус</span>
          <select name="status" defaultValue={status} className={fieldCls}>
            <option value="">Все</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-faint">Услуга</span>
          <select name="service" defaultValue={service} className={fieldCls}>
            <option value="">Все</option>
            {SERVICES.map((s) => (
              <option key={s} value={s}>{SERVICE_LABELS[s]}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[0.68rem] uppercase tracking-[0.16em] text-faint">Поиск (имя / телефон)</span>
          <input name="q" defaultValue={q} placeholder="Иван или 920…" className={fieldCls} />
        </label>
        <button className="rounded-lg bg-copper px-4 py-2 text-sm font-medium text-bg-deep hover:brightness-105">
          Фильтровать
        </button>
        <a href="/admin" className="px-2 py-2 text-sm text-faint hover:text-cream">
          Сбросить
        </a>
        <a
          href={exportHref}
          className="ml-auto rounded-lg border border-line px-4 py-2 text-sm text-cream transition-colors hover:border-copper hover:text-copper-bright"
        >
          ↓ Экспорт CSV
        </a>
      </form>

      {/* Таблица */}
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-surface/60 text-[0.7rem] uppercase tracking-[0.12em] text-faint">
            <tr>
              <th className="px-4 py-3 font-semibold">Дата</th>
              <th className="px-4 py-3 font-semibold">Имя</th>
              <th className="px-4 py-3 font-semibold">Телефон</th>
              <th className="px-4 py-3 font-semibold">Связь</th>
              <th className="px-4 py-3 font-semibold">Услуга</th>
              <th className="px-4 py-3 font-semibold">Желаемая дата</th>
              <th className="px-4 py-3 font-semibold">Комментарий</th>
              <th className="px-4 py-3 font-semibold">Статус</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {leads.map((l) => (
              <tr key={l.id} className="align-top transition-colors hover:bg-surface/30">
                <td className="whitespace-nowrap px-4 py-3 text-faint">
                  {formatDateTimeMsk(l.createdAt)}
                </td>
                <td className="px-4 py-3 font-medium text-cream">{l.name}</td>
                <td className="whitespace-nowrap px-4 py-3">
                  <a href={`tel:${l.phone.replace(/[^\d+]/g, "")}`} className="text-cream hover:text-copper-bright">
                    {l.phone}
                  </a>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {CHANNEL_LABELS[l.channel as Channel] ?? l.channel}
                </td>
                <td className="px-4 py-3 text-muted">
                  {SERVICE_LABELS[l.service as ServiceKind] ?? l.service}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted">
                  {l.preferredDate || "—"}
                </td>
                <td className="max-w-[16rem] px-4 py-3 text-muted">
                  <span className="line-clamp-2" title={l.comment ?? ""}>
                    {l.comment || "—"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <StatusSelect id={l.id} value={l.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leads.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="font-display text-2xl text-cream">Заявок пока нет</span>
            <p className="text-sm text-faint">
              {total === 0
                ? "Как только кто-то заполнит форму на сайте — заявка появится здесь."
                : "По выбранным фильтрам ничего не найдено."}
            </p>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-faint">
        Показаны последние 500 заявок. Время — московское (МСК).
      </p>
    </main>
  );
}

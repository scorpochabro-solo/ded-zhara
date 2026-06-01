"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  CHANNELS,
  SERVICES,
  CHANNEL_LABELS,
  SERVICE_LABELS,
  leadSchema,
  type Channel,
  type ServiceKind,
} from "@/lib/validation";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "error";

const fieldBase =
  "w-full rounded-xl border border-line bg-surface/50 px-4 py-3 text-cream placeholder:text-faint transition-colors focus:border-copper focus:outline-none";

function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (!d) return "";
  if (d[0] === "8") d = "7" + d.slice(1);
  if (d[0] !== "7") d = "7" + d;
  d = d.slice(0, 11);
  const a = d.slice(1, 4);
  const b = d.slice(4, 7);
  const c = d.slice(7, 9);
  const e = d.slice(9, 11);
  let out = "+7";
  if (a) out += ` (${a}`;
  if (a.length === 3) out += ")";
  if (b) out += ` ${b}`;
  if (c) out += `-${c}`;
  if (e) out += `-${e}`;
  return out;
}

export function LeadForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    channel: "phone" as Channel,
    service: "classic" as ServiceKind,
    preferredDate: "",
    comment: "",
    consent: false,
    company: "", // honeypot
  });

  const update = (patch: Partial<typeof form>) =>
    setForm((f) => ({ ...f, ...patch }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);

    const parsed = leadSchema.safeParse(form);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});

    // Демо-режим (GitHub Pages): бэкенда нет — показываем экран успеха без отправки.
    if (process.env.NEXT_PUBLIC_DEMO === "true") {
      setStatus("success");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("success");
        return;
      }
      const data = await res.json().catch(() => null);
      if (res.status === 429) {
        setServerError("Слишком много заявок подряд. Попробуйте через пару минут.");
      } else if (data?.fieldErrors) {
        setErrors(data.fieldErrors);
        setServerError("Проверьте поля формы.");
      } else {
        setServerError("Не удалось отправить. Позвоните или напишите напрямую.");
      }
      setStatus("error");
    } catch {
      setServerError("Нет связи с сервером. Попробуйте ещё раз или свяжитесь напрямую.");
      setStatus("error");
    }
  }

  function reset() {
    setForm({
      name: "",
      phone: "",
      channel: "phone",
      service: "classic",
      preferredDate: "",
      comment: "",
      consent: false,
      company: "",
    });
    setStatus("idle");
    setErrors({});
    setServerError(null);
  }

  return (
    <div className="surface-card rounded-card p-6 sm:p-8">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center py-10 text-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-copper/40 text-copper-bright ember-pulse">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h3 className="mt-6 font-display text-3xl">Заявка принята</h3>
            <p className="mt-3 max-w-sm text-muted">
              Скоро свяжемся, подберём время и формат. Лёгкого вам пара!
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-7 text-sm text-copper-bright underline-offset-4 hover:underline"
            >
              Оставить ещё одну заявку
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-5"
          >
            {/* Honeypot — скрыто от людей */}
            <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Компания
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={form.company}
                  onChange={(e) => update({ company: e.target.value })}
                />
              </label>
            </div>

            {/* Имя */}
            <Field label="Имя" error={errors.name} htmlFor="name">
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Как к вам обращаться"
                value={form.name}
                onChange={(e) => update({ name: e.target.value })}
                className={cn(fieldBase, errors.name && "border-ember")}
              />
            </Field>

            {/* Телефон */}
            <Field label="Телефон" error={errors.phone} htmlFor="phone">
              <input
                id="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={form.phone}
                onChange={(e) => update({ phone: formatPhone(e.target.value) })}
                className={cn(fieldBase, errors.phone && "border-ember")}
              />
            </Field>

            {/* Способ связи */}
            <fieldset>
              <legend className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-faint">
                Как удобнее связаться
              </legend>
              <div className="grid grid-cols-3 gap-2">
                {CHANNELS.map((c) => (
                  <label key={c} className="cursor-pointer">
                    <input
                      type="radio"
                      name="channel"
                      value={c}
                      checked={form.channel === c}
                      onChange={() => update({ channel: c })}
                      className="peer sr-only"
                    />
                    <span className="block rounded-xl border border-line bg-surface/40 py-2.5 text-center text-sm text-muted transition-all peer-checked:border-copper peer-checked:bg-copper/10 peer-checked:text-copper-bright peer-focus-visible:outline-2 peer-focus-visible:outline-copper-bright">
                      {CHANNEL_LABELS[c]}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            {/* Услуга + дата */}
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Что интересует" error={errors.service} htmlFor="service">
                <div className="relative">
                  <select
                    id="service"
                    value={form.service}
                    onChange={(e) => update({ service: e.target.value as ServiceKind })}
                    className={cn(fieldBase, "appearance-none pr-10")}
                  >
                    {SERVICES.map((s) => (
                      <option key={s} value={s} className="bg-surface text-cream">
                        {SERVICE_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint">
                    <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Field>

              <Field label="Желаемая дата" htmlFor="date" optional>
                <input
                  id="date"
                  type="date"
                  value={form.preferredDate}
                  onChange={(e) => update({ preferredDate: e.target.value })}
                  className={cn(fieldBase, "[color-scheme:dark]")}
                />
              </Field>
            </div>

            {/* Комментарий */}
            <Field label="Комментарий" htmlFor="comment" optional error={errors.comment}>
              <textarea
                id="comment"
                rows={3}
                placeholder="Пожелания, количество человек, вопросы…"
                value={form.comment}
                onChange={(e) => update({ comment: e.target.value })}
                className={cn(fieldBase, "resize-none")}
              />
            </Field>

            {/* Согласие */}
            <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => update({ consent: e.target.checked })}
                className="peer sr-only"
              />
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-line-strong transition-colors peer-checked:border-copper peer-checked:bg-copper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-copper-bright [&>svg]:opacity-0 peer-checked:[&>svg]:opacity-100">
                <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5 text-bg-deep transition-opacity">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                Согласен на обработку{" "}
                <Link href="/privacy" target="_blank" className="text-copper-bright underline-offset-2 hover:underline">
                  персональных данных
                </Link>{" "}
                (152-ФЗ).
              </span>
            </label>
            {errors.consent && (
              <p className="-mt-2 text-sm text-ember-bright">{errors.consent}</p>
            )}

            {serverError && (
              <p className="rounded-xl border border-ember/40 bg-ember/10 px-4 py-3 text-sm text-ember-bright">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={!form.consent || status === "loading"}
              className="group mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-b from-copper-bright to-copper px-8 py-4 font-medium text-bg-deep shadow-ember transition-all duration-300 ease-warm hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {status === "loading" ? (
                <>
                  <Spinner />
                  Отправляем…
                </>
              ) : (
                <>
                  Отправить заявку
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-2 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-faint"
      >
        {label}
        {optional && <span className="font-normal normal-case tracking-normal text-faint/70">— необязательно</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-sm text-ember-bright">{error}</p>}
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

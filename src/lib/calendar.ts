import { randomUUID } from "node:crypto";
import { createDAVClient } from "tsdav";
import {
  CHANNEL_LABELS,
  SERVICE_LABELS,
  type Channel,
  type ServiceKind,
} from "./validation";

/**
 * Создаёт событие в Яндекс Календаре по заявке (CalDAV).
 *
 * Включается только если заданы YANDEX_CALDAV_USER и YANDEX_CALDAV_PASSWORD
 * (пароль приложения из Яндекс ID). Никогда не бросает наружу: если календарь
 * не настроен или недоступен — возвращает { ok:false }, заявка уже в БД.
 *
 * Работает только на «боевом» сервере (Vercel/VPS), где запущен бэкенд.
 * На статичном демо (GitHub Pages) /api/lead не выполняется.
 */

type Payload = {
  name: string;
  phone: string;
  channel: Channel;
  service: ServiceKind;
  preferredDate?: string | null; // YYYY-MM-DD
  preferredTime?: string | null; // HH:MM
  comment?: string | null;
};

const MSK_OFFSET_MIN = 180; // Europe/Moscow = UTC+3 (без переходов на летнее время)

const pad = (n: number) => String(n).padStart(2, "0");

const fmtUtc = (d: Date) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

const fmtDate = (y: number, m: number, d: number) => `${y}${pad(m)}${pad(d)}`;

function escapeIcs(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

function buildIcs(lead: Payload): string {
  const now = fmtUtc(new Date());
  const summary = `Парение: ${lead.name} — ${SERVICE_LABELS[lead.service]}`;
  const desc = [
    `Телефон: ${lead.phone}`,
    `Связь: ${CHANNEL_LABELS[lead.channel]}`,
    `Услуга: ${SERVICE_LABELS[lead.service]}`,
    ...(lead.comment ? [`Комментарий: ${lead.comment}`] : []),
    "Заявка с сайта Дед&Жара",
  ]
    .map(escapeIcs)
    .join("\\n");

  const dateMatch = lead.preferredDate?.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  const timeMatch = lead.preferredTime?.trim().match(/^(\d{1,2}):(\d{2})$/);

  let dtStart: string;
  let dtEnd: string;

  if (dateMatch && timeMatch) {
    // Конкретный слот (введён по МСК) → переводим в UTC, длительность 1 час.
    const start = new Date(
      Date.UTC(+dateMatch[1], +dateMatch[2] - 1, +dateMatch[3], +timeMatch[1], +timeMatch[2]) -
        MSK_OFFSET_MIN * 60_000,
    );
    const end = new Date(start.getTime() + 60 * 60_000);
    dtStart = `DTSTART:${fmtUtc(start)}`;
    dtEnd = `DTEND:${fmtUtc(end)}`;
  } else {
    // Только дата (или ничего) → событие на весь день. Без даты — на сегодня (МСК).
    let y: number, m: number, d: number;
    if (dateMatch) {
      y = +dateMatch[1];
      m = +dateMatch[2];
      d = +dateMatch[3];
    } else {
      const mskNow = new Date(Date.now() + MSK_OFFSET_MIN * 60_000);
      y = mskNow.getUTCFullYear();
      m = mskNow.getUTCMonth() + 1;
      d = mskNow.getUTCDate();
    }
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    dtStart = `DTSTART;VALUE=DATE:${fmtDate(y, m, d)}`;
    dtEnd = `DTEND;VALUE=DATE:${fmtDate(next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate())}`;
  }

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ded-zhara//lead//RU",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${randomUUID()}@ded-zhara`,
    `DTSTAMP:${now}`,
    dtStart,
    dtEnd,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${desc}`,
    "STATUS:TENTATIVE",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export async function addToYandexCalendar(
  lead: Payload,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const username = process.env.YANDEX_CALDAV_USER;
  const password = process.env.YANDEX_CALDAV_PASSWORD;
  if (!username || !password) return { ok: false, skipped: true };

  try {
    const client = await createDAVClient({
      serverUrl: "https://caldav.yandex.ru",
      credentials: { username, password },
      authMethod: "Basic",
      defaultAccountType: "caldav",
    });

    const calendars = await client.fetchCalendars();
    if (!calendars?.length) return { ok: false };

    // По умолчанию — первый календарь; можно указать имя в YANDEX_CALDAV_CALENDAR.
    const want = process.env.YANDEX_CALDAV_CALENDAR?.toLowerCase();
    const calendar =
      (want &&
        calendars.find(
          (c) => String(c.displayName ?? "").toLowerCase() === want,
        )) ||
      calendars[0];

    await client.createCalendarObject({
      calendar,
      filename: `${randomUUID()}.ics`,
      iCalString: buildIcs(lead),
    });
    return { ok: true };
  } catch (e) {
    console.error("[calendar] не удалось создать событие в Яндекс Календаре", e);
    return { ok: false };
  }
}

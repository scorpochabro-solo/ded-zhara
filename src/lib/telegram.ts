import {
  CHANNEL_LABELS,
  SERVICE_LABELS,
  type Channel,
  type ServiceKind,
} from "./validation";

type NotifyPayload = {
  name: string;
  phone: string;
  channel: Channel;
  service: ServiceKind;
  preferredDate?: string | null;
  preferredTime?: string | null;
  comment?: string | null;
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function nowMsk(): string {
  return (
    new Intl.DateTimeFormat("ru-RU", {
      timeZone: "Europe/Moscow",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date()) + " МСК"
  );
}

/**
 * Отправляет уведомление о заявке в Telegram.
 * Никогда не бросает исключение наружу: если бот не настроен или API
 * недоступен — просто возвращает { ok:false }, лид всё равно уже в БД.
 */
export async function sendTelegramNotification(
  lead: NotifyPayload,
): Promise<{ ok: boolean; skipped?: boolean }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return { ok: false, skipped: true };
  }

  const lines = [
    "🔥 <b>Новая заявка — Дед&amp;Жара</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
    `<b>Связь:</b> ${CHANNEL_LABELS[lead.channel]}`,
    `<b>Услуга:</b> ${SERVICE_LABELS[lead.service]}`,
    `<b>Желаемое:</b> ${lead.preferredDate ? escapeHtml(lead.preferredDate) : "—"}${lead.preferredTime ? " в " + escapeHtml(lead.preferredTime) : ""}`,
    `<b>Комментарий:</b> ${lead.comment ? escapeHtml(lead.comment) : "—"}`,
    `<b>Отправлено:</b> ${nowMsk()}`,
  ];

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
        signal: AbortSignal.timeout(8000),
      },
    );
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}

import { CHANNEL_LABELS, SERVICE_LABELS, type Channel, type ServiceKind } from "./validation";

type Payload = {
  name: string;
  phone: string;
  channel: Channel;
  service: ServiceKind;
  preferredDate?: string | null;
  comment?: string | null;
};

/**
 * Опциональное дублирование заявки на e-mail.
 * Выключено по умолчанию: работает, только если задан NOTIFY_EMAIL.
 * Для реальной отправки нужен провайдер — поддержан Resend (RESEND_API_KEY).
 * Без ключа провайдера просто логируем (хук готов, заявка уже в БД и Telegram).
 */
export async function notifyByEmail(lead: Payload): Promise<void> {
  const to = process.env.NOTIFY_EMAIL;
  if (!to) return; // выключено

  const subject = `Новая заявка — Дед&Жара: ${lead.name}`;
  const text = [
    `Имя: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Связь: ${CHANNEL_LABELS[lead.channel]}`,
    `Услуга: ${SERVICE_LABELS[lead.service]}`,
    `Дата: ${lead.preferredDate || "—"}`,
    `Комментарий: ${lead.comment || "—"}`,
  ].join("\n");

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.info(
      `[email] NOTIFY_EMAIL задан (${to}), но провайдер не настроен (RESEND_API_KEY). ` +
        `Письмо не отправлено. Заявка сохранена в БД и отправлена в Telegram.`,
    );
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Дед&Жара <onboarding@resend.dev>",
        to: [to],
        subject,
        text,
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.error("[email] не удалось отправить письмо", e);
  }
}

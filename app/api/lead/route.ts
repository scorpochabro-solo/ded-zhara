import { NextResponse, type NextRequest } from "next/server";
import { leadSchema } from "@/lib/validation";
import { prisma } from "@/lib/db";
import { sendTelegramNotification } from "@/lib/telegram";
import { notifyByEmail } from "@/lib/email";
import { addToYandexCalendar } from "@/lib/calendar";
import { checkRateLimit } from "@/lib/rate-limit";

// Нужен Node-рантайм (better-sqlite3 / node:crypto), без статической оптимизации.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: NextRequest) {
  // Антиспам: rate-limit по IP.
  const ip = getIp(req);
  const rl = checkRateLimit(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      {
        status: 429,
        headers: rl.retryAfterSec
          ? { "Retry-After": String(rl.retryAfterSec) }
          : undefined,
      },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 400 });
  }

  const data = parsed.data;

  // Honeypot: бот заполнил скрытое поле — тихо «принимаем», но игнорируем.
  if (data.company && data.company.length > 0) {
    return NextResponse.json({ ok: true });
  }

  // 1) Главное — сохранить заявку в БД (её нельзя потерять).
  try {
    await prisma.lead.create({
      data: {
        name: data.name,
        phone: data.phone,
        channel: data.channel,
        service: data.service,
        preferredDate: data.preferredDate || null,
        preferredTime: data.preferredTime || null,
        comment: data.comment || null,
        source: "site",
      },
    });
  } catch (e) {
    console.error("[lead] ошибка записи в БД", e);
    return NextResponse.json({ ok: false, error: "db" }, { status: 500 });
  }

  // 2) Уведомления — не критично: если упадут, заявка уже сохранена.
  await Promise.allSettled([
    sendTelegramNotification({
      name: data.name,
      phone: data.phone,
      channel: data.channel,
      service: data.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      comment: data.comment,
    }),
    notifyByEmail({
      name: data.name,
      phone: data.phone,
      channel: data.channel,
      service: data.service,
      preferredDate: data.preferredDate,
      comment: data.comment,
    }),
    addToYandexCalendar({
      name: data.name,
      phone: data.phone,
      channel: data.channel,
      service: data.service,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      comment: data.comment,
    }),
  ]);

  return NextResponse.json({ ok: true });
}

import { z } from "zod";

/** Каналы связи и услуги — единый источник правды для формы, API и админки. */
export const CHANNELS = ["phone", "telegram", "max"] as const;
export const SERVICES = ["group", "individual", "spa", "trip"] as const;
export const STATUSES = ["new", "in_progress", "booked", "done", "rejected"] as const;

export type Channel = (typeof CHANNELS)[number];
export type ServiceKind = (typeof SERVICES)[number];
export type LeadStatus = (typeof STATUSES)[number];

export const CHANNEL_LABELS: Record<Channel, string> = {
  phone: "Телефон",
  telegram: "Telegram",
  max: "MAX",
};

export const SERVICE_LABELS: Record<ServiceKind, string> = {
  group: "Групповое парение",
  individual: "Индивидуальное парение",
  spa: "Банное СПА",
  trip: "Выезд / банный день",
};

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  booked: "Записан",
  done: "Завершена",
  rejected: "Отказ",
};

/** Схема заявки. Используется и на клиенте, и на сервере. */
export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Как к вам обращаться?")
    .max(80, "Слишком длинное имя"),
  phone: z
    .string()
    .trim()
    .min(6, "Укажите телефон")
    .max(30, "Проверьте номер")
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Проверьте номер телефона"),
  channel: z.enum(CHANNELS),
  service: z.enum(SERVICES),
  preferredDate: z.string().trim().max(40).optional(),
  preferredTime: z.string().trim().max(10).optional(),
  comment: z.string().trim().max(1000, "Слишком длинный комментарий").optional(),
  consent: z
    .boolean()
    .refine((v) => v === true, "Нужно согласие на обработку персональных данных"),
  // honeypot — настоящие люди оставят пустым (логика отсечения — в /api/lead)
  company: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;

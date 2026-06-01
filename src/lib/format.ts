import {
  CHANNEL_LABELS,
  SERVICE_LABELS,
  STATUS_LABELS,
  type Channel,
  type LeadStatus,
  type ServiceKind,
} from "./validation";

/** Дата-время в московском поясе для отображения в админке. */
export function formatDateTimeMsk(d: Date): string {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

type CsvLead = {
  createdAt: Date;
  name: string;
  phone: string;
  channel: string;
  service: string;
  preferredDate: string | null;
  comment: string | null;
  status: string;
  source: string;
};

function cell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return `"${s.replace(/"/g, '""')}"`;
}

const label = <T extends string>(map: Record<T, string>, key: string): string =>
  (map as Record<string, string>)[key] ?? key;

/** Экспорт заявок в CSV (с BOM и ';' — корректно открывается в Excel с кириллицей). */
export function leadsToCsv(leads: CsvLead[]): string {
  const header = [
    "Дата (МСК)",
    "Имя",
    "Телефон",
    "Связь",
    "Услуга",
    "Желаемая дата",
    "Комментарий",
    "Статус",
    "Источник",
  ];

  const rows = leads.map((l) =>
    [
      formatDateTimeMsk(l.createdAt),
      l.name,
      l.phone,
      label(CHANNEL_LABELS as Record<Channel, string>, l.channel),
      label(SERVICE_LABELS as Record<ServiceKind, string>, l.service),
      l.preferredDate ?? "",
      l.comment ?? "",
      label(STATUS_LABELS as Record<LeadStatus, string>, l.status),
      l.source,
    ]
      .map(cell)
      .join(";"),
  );

  return "﻿" + [header.map(cell).join(";"), ...rows].join("\r\n");
}

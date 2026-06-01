/**
 * Конфиг бренда «Дед&Жара».
 *
 * ⚠️ Значения в формате {{ВОТ_ТАК}} — ПЛЕЙСХОЛДЕРЫ. Их подставит владелец.
 * Не выдумывай телефон, юр.реквизиты, ссылку на клуб и т.п.
 */

export const site = {
  brand: "Дед&Жара",
  master: "Сергей Аперин",
  role: "Пармастер · инструктор по туризму",
  slogan: "Ваш гид в мире пара и тепла",
  signature: "Ваш Дед&Жара",

  location: {
    city: "Балахна",
    region: "Нижегородская область",
    near: "Нижний Новгород",
    // Координаты для карты — ПЛЕЙСХОЛДЕР (см. секцию контактов / JSON-LD)
    lat: "{{ШИРОТА}}",
    lng: "{{ДОЛГОТА}}",
  },

  // ── Контакты (ПЛЕЙСХОЛДЕРЫ — заменить перед запуском) ──────────────
  contacts: {
    // display — что видит пользователь; href — для клика.
    phone: {
      display: "{{ТЕЛЕФОН}}", // напр. +7 (920) 000-00-00
      href: "tel:{{ТЕЛЕФОН_E164}}", // напр. tel:+79200000000
    },
    telegram: {
      label: "Telegram",
      handle: "{{TELEGRAM_ДЛЯ_СВЯЗИ}}", // напр. @ded_zhara
      href: "https://t.me/{{TELEGRAM_ДЛЯ_СВЯЗИ}}",
    },
    max: {
      label: "MAX",
      display: "{{MAX_КОНТАКТ}}",
      href: "{{MAX_ССЫЛКА}}",
    },
  },

  // Соцсети. Канал в Telegram известен из ТЗ; VK — плейсхолдер.
  social: {
    telegramChannel: { label: "Telegram-канал", href: "https://t.me/parrmass_aperin", handle: "@parrmass_aperin" },
    vk: { label: "VK", href: "{{ССЫЛКА_VK}}" },
  },

  // Связь со сторонним турклубом — добавлять ссылку только после подтверждения.
  clubLink: "{{ССЫЛКА_НА_КЛУБ}}",

  // Карта (Яндекс.Карты iframe) — вставить реальный src после подтверждения адреса.
  mapEmbedSrc: "{{ЯНДЕКС_КАРТА_IFRAME_SRC}}",

  // Юр. реквизиты для футера — ПЛЕЙСХОЛДЕРЫ.
  legal: {
    entity: "{{ИП / самозанятый — ФИО}}",
    inn: "{{ИНН}}",
    privacyPolicyHref: "/privacy",
  },

  // Навигация (якоря секций)
  nav: [
    { href: "#services", label: "Услуги" },
    { href: "#how", label: "Как проходит" },
    { href: "#about", label: "О мастере" },
    { href: "#trips", label: "Выезды" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#contact", label: "Контакты" },
  ],
} as const;

export type Site = typeof site;

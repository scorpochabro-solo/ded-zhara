/**
 * Единый реестр медиа «Дед&Жара».
 *
 * Здесь стоят РЕАЛЬНЫЕ фото Сергея (обработаны из source-photos/ в веб-размеры).
 * Часть слотов переиспользует одни и те же кадры — Сергей пришлёт ещё фото.
 *
 * ⚠️ Пути к картинкам префиксуются basePath: при статическом экспорте на
 * GitHub Pages сайт живёт по /<repo>/, а next/image с unoptimized НЕ добавляет
 * basePath к src сам. NEXT_PUBLIC_BASE_PATH пуст в обычном режиме (Vercel/локально)
 * и равен "/ded-zhara" в CI-сборке для Pages.
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Путь к статике в /public с учётом basePath. */
const p = (path: string) => `${BASE}${path}`;

export type Media = { src: string; alt: string; width?: number; height?: number };

export const media = {
  // Первый экран теперь без фото (атмосферный фон) — слот оставлен для галереи/OG.
  hero: {
    src: p("/images/hero.jpg"),
    alt: "ПарМастер Сергей «Дед&Жара» с пихтовыми вениками у бани",
    width: 1920,
    height: 1440,
  } as Media,

  // Карточки программ парения (по id программы из copy.ts → services.items).
  programs: {
    elements: { src: p("/images/hero.jpg"), alt: "Парение пихтовыми вениками — программа «4 стихии»", width: 1920, height: 1440 } as Media,
    taiga: { src: p("/images/profile-hvoya.jpg"), alt: "Хвоя и аромат тайги — программа «Таёжное»", width: 1000, height: 1333 } as Media,
    literary: { src: p("/images/about-master.jpg"), alt: "Спокойное парение под русскую классику — «Литературная гостиная»", width: 1100, height: 1467 } as Media,
    family: { src: p("/images/vyezd-banya.jpg"), alt: "Семейное парение с юными банщиками", width: 1100, height: 1467 } as Media,
  },

  // Портрет мастера.
  about: {
    src: p("/images/about-master.jpg"),
    alt: "Сергей Аперин — ПарМастер «Дед&Жара»",
    width: 1100,
    height: 1467,
  } as Media,

  // Выезды.
  trips: {
    splav: { src: p("/images/vyezd-splav.jpg"), alt: "Сплав по реке с турклубом «9Легенд»", width: 1280, height: 853 } as Media,
    banya: { src: p("/images/vyezd-banya.jpg"), alt: "Выездная мобильная баня с гостями на природе", width: 1100, height: 1467 } as Media,
  },

  // Галерея (масонри). Реальные кадры разных пропорций.
  gallery: [
    { src: p("/images/hero.jpg"), alt: "Сергей с пихтовыми вениками у бани", width: 1920, height: 1440 },
    { src: p("/images/profile-hvoya.jpg"), alt: "Аромат хвои перед парением", width: 1000, height: 1333 },
    { src: p("/images/vyezd-banya.jpg"), alt: "Гости в выездной бане", width: 1100, height: 1467 },
    { src: p("/images/na-beregu.jpg"), alt: "Мобильная баня на берегу реки", width: 640, height: 858 },
    { src: p("/images/vyezd-splav.jpg"), alt: "Сплав по реке", width: 1280, height: 853 },
    { src: p("/images/camp.jpg"), alt: "Лагерь в сосновом лесу на выезде", width: 1280, height: 853 },
  ] as Media[],

  // Видео парения: пока нет реального — постер-плейсхолдер, src пустой.
  video: {
    src: "",
    poster: p("/images/video-poster.jpg"),
    alt: "Видео процесса парения",
  },

  // OG-картинка для соцсетей (1200×630) — реальное фото мастера.
  og: { src: p("/images/og.jpg"), alt: "Дед&Жара — парение веником, Сергей Аперин", width: 1200, height: 630 } as Media,
};

/**
 * Единый реестр медиа «Дед&Жара».
 *
 * Здесь стоят РЕАЛЬНЫЕ фото Сергея (обработаны из source-photos/ в веб-размеры).
 * Часть слотов переиспользует одни и те же кадры — Сергей пришлёт ещё фото,
 * тогда заменим. Замена = положить файл с тем же именем в /public/images
 * ИЛИ поменять путь здесь.
 */

export type Media = { src: string; alt: string; width?: number; height?: number };

export const media = {
  // Первый экран — Сергей с пихтовыми вениками у бани.
  hero: {
    src: "/images/hero.jpg",
    alt: "ПарМастер Сергей «Дед&Жара» с пихтовыми вениками у бани",
    width: 1920,
    height: 1440,
  } as Media,

  // Карточки программ парения (по id программы из copy.ts → services.items).
  programs: {
    elements: { src: "/images/hero.jpg", alt: "Парение пихтовыми вениками — программа «4 стихии»", width: 1920, height: 1440 } as Media,
    taiga: { src: "/images/profile-hvoya.jpg", alt: "Хвоя и аромат тайги — программа «Таёжное»", width: 1000, height: 1333 } as Media,
    literary: { src: "/images/about-master.jpg", alt: "Спокойное парение под русскую классику — «Литературная гостиная»", width: 1100, height: 1467 } as Media,
    family: { src: "/images/vyezd-banya.jpg", alt: "Семейное парение с юными банщиками", width: 1100, height: 1467 } as Media,
  },

  // Портрет мастера.
  about: {
    src: "/images/about-master.jpg",
    alt: "Сергей Аперин — ПарМастер «Дед&Жара»",
    width: 1100,
    height: 1467,
  } as Media,

  // Выезды.
  trips: {
    splav: { src: "/images/vyezd-splav.jpg", alt: "Сплав по реке с турклубом «9Легенд»", width: 1280, height: 853 } as Media,
    banya: { src: "/images/vyezd-banya.jpg", alt: "Выездная мобильная баня с гостями на природе", width: 1100, height: 1467 } as Media,
  },

  // Галерея (масонри). Реальные кадры разных пропорций.
  gallery: [
    { src: "/images/hero.jpg", alt: "Сергей с пихтовыми вениками у бани", width: 1920, height: 1440 },
    { src: "/images/profile-hvoya.jpg", alt: "Аромат хвои перед парением", width: 1000, height: 1333 },
    { src: "/images/vyezd-banya.jpg", alt: "Гости в выездной бане", width: 1100, height: 1467 },
    { src: "/images/na-beregu.jpg", alt: "Мобильная баня на берегу реки", width: 640, height: 858 },
    { src: "/images/vyezd-splav.jpg", alt: "Сплав по реке", width: 1280, height: 853 },
    { src: "/images/camp.jpg", alt: "Лагерь в сосновом лесу на выезде", width: 1280, height: 853 },
  ] as Media[],

  // Видео парения: пока нет реального — постер-плейсхолдер, src пустой.
  video: {
    src: "",
    poster: "/images/video-poster.jpg",
    alt: "Видео процесса парения",
  },

  // OG-картинка для соцсетей (1200×630) — реальное фото мастера.
  og: { src: "/images/og.jpg", alt: "Дед&Жара — парение веником, Сергей Аперин", width: 1200, height: 630 } as Media,
};

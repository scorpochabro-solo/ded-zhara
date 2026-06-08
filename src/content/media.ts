/**
 * Единый реестр медиа «Дед&Жара».
 *
 * Реальные фото Сергея (обработаны из source-photos/ в веб-размеры).
 *
 * ⚠️ basePath: на GitHub Pages сайт по /<repo>/, а next/image (unoptimized) не
 * добавляет basePath к src сам — поэтому пути префиксуются NEXT_PUBLIC_BASE_PATH
 * (пуст локально/Vercel, "/ded-zhara" в CI).
 *
 * `pos` — object-position для кадрирования в обрезающих карточках (чтобы лицо
 * не срезалось). В галерее не используется (масонри показывает фото целиком).
 */

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const p = (path: string) => `${BASE}${path}`;

export type Media = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  pos?: string;
};

export const media = {
  hero: {
    src: p("/images/hero.jpg"),
    alt: "ПарМастер Сергей «Дед&Жара» с пихтовыми вениками у бани",
    width: 1920,
    height: 1440,
    pos: "center 30%",
  } as Media,

  // Карточки программ парения (по id программы из copy.ts → services.items).
  programs: {
    elements: { src: p("/images/hero.jpg"), alt: "Парение пихтовыми вениками — программа «4 стихии»", width: 1920, height: 1440, pos: "center 28%" } as Media,
    taiga: { src: p("/images/profile-hvoya.jpg"), alt: "Хвоя и аромат тайги — программа «Таёжное»", width: 1000, height: 1333, pos: "center 25%" } as Media,
    literary: { src: p("/images/about-master.jpg"), alt: "Спокойное парение под русскую классику — «Литературная гостиная»", width: 1100, height: 1467, pos: "center 18%" } as Media,
    family: { src: p("/images/vyezd-banya.jpg"), alt: "Семейное парение с юными банщиками", width: 1100, height: 1467, pos: "center 38%" } as Media,
  },

  // Портрет мастера.
  about: {
    src: p("/images/about-master.jpg"),
    alt: "Сергей Аперин — ПарМастер «Дед&Жара»",
    width: 1100,
    height: 1467,
    pos: "center 22%",
  } as Media,

  // Выезды.
  trips: {
    splav: { src: p("/images/vyezd-splav.jpg"), alt: "Сплав по реке с турклубом «9Легенд»", width: 1280, height: 853, pos: "center 32%" } as Media,
    banya: { src: p("/images/vyezd-banya.jpg"), alt: "Выездная мобильная баня с гостями на природе", width: 1100, height: 1467, pos: "center 35%" } as Media,
  },

  // Авторский тур в Мезмай (горы Кавказа).
  mezmai: { src: p("/images/mezmai-2.jpg"), alt: "Группа на вершине — авторский тур в Мезмай", width: 900, height: 1200, pos: "center 30%" } as Media,

  // Галерея (масонри — без обрезки, фото целиком).
  gallery: [
    { src: p("/images/hero.jpg"), alt: "Сергей с пихтовыми вениками у бани", width: 1920, height: 1440 },
    { src: p("/images/profile-hvoya.jpg"), alt: "Аромат хвои перед парением", width: 1000, height: 1333 },
    { src: p("/images/vyezd-banya.jpg"), alt: "Гости в выездной бане", width: 1100, height: 1467 },
    { src: p("/images/na-beregu.jpg"), alt: "Мобильная баня на берегу реки", width: 640, height: 858 },
    { src: p("/images/vyezd-splav.jpg"), alt: "Сплав по реке", width: 1280, height: 853 },
    { src: p("/images/camp.jpg"), alt: "Лагерь в сосновом лесу на выезде", width: 1280, height: 853 },
    { src: p("/images/mezmai-1.jpg"), alt: "Орлиная полка, Мезмай — горы Кавказа", width: 560, height: 757 },
    { src: p("/images/mezmai-3.jpg"), alt: "Альпийский луг на плато Лаго-Наки", width: 900, height: 1200 },
  ] as Media[],

  video: {
    src: "",
    poster: p("/images/video-poster.jpg"),
    alt: "Видео процесса парения",
  },

  og: { src: p("/images/og.jpg"), alt: "Дед&Жара — парение веником, Сергей Аперин", width: 1200, height: 630 } as Media,
};

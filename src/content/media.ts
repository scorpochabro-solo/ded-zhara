/**
 * Единый реестр медиа «Дед&Жара».
 *
 * Замена фото на реальное = заменить файл с тем же именем в /public/images
 * ИЛИ поменять путь в одной строке здесь.
 *
 * Сейчас в /public/images лежат СГЕНЕРИРОВАННЫЕ атмосферные плейсхолдеры
 * (тёплый грейдинг, пар, зерно) — без лиц и логотипов. Сгенерировать заново:
 *   npm run gen:media
 *
 * TODO (везде): заменить на реальные фото/видео клиента.
 */

export type Media = { src: string; alt: string; width?: number; height?: number };

export const media = {
  // Первый экран — крупный атмосферный кадр пара/парения.
  hero: {
    src: "/images/hero.jpg",
    alt: "Пар, дубовый веник и тёплый свет в бане — атмосфера парения",
    width: 1920,
    height: 1280,
  } as Media,

  // Карточки услуг.
  services: {
    classic: { src: "/images/service-classic.jpg", alt: "Классическое парение веником", width: 900, height: 1100 } as Media,
    ritual: { src: "/images/service-ritual.jpg", alt: "Полный банный ритуал «Дед&Жара»: дубовый и берёзовый веники", width: 900, height: 1100 } as Media,
    gift: { src: "/images/service-gift.jpg", alt: "Подарочный сертификат на парение «Пар в Дар»", width: 900, height: 1100 } as Media,
  },

  // Портрет мастера.
  about: {
    src: "/images/about-master.jpg",
    alt: "Сергей Аперин — пармастер, в войлочной шапке у банной печи",
    width: 1100,
    height: 1320,
  } as Media,

  // Выезды.
  trips: {
    splav: { src: "/images/vyezd-splav.jpg", alt: "Сплав по реке и баня на берегу", width: 1280, height: 900 } as Media,
    mountains: { src: "/images/vyezd-mountains.jpg", alt: "Горный ретрит: треккинг и баня от пармастера", width: 1280, height: 900 } as Media,
  },

  // Галерея (сетка).
  gallery: [
    { src: "/images/gallery-1.jpg", alt: "Дубовый веник и пар", width: 900, height: 900 },
    { src: "/images/gallery-2.jpg", alt: "Банная печь и живой огонь", width: 900, height: 1200 },
    { src: "/images/gallery-3.jpg", alt: "Войлочная банная шапка на полке", width: 900, height: 900 },
    { src: "/images/gallery-4.jpg", alt: "Травяной чай после парения", width: 900, height: 1200 },
    { src: "/images/gallery-5.jpg", alt: "Река и туман на рассвете", width: 900, height: 900 },
    { src: "/images/gallery-6.jpg", alt: "Горы и звёздное небо в экспедиции", width: 900, height: 1200 },
  ] as Media[],

  // Видео парения: poster — плейсхолдер, src — реальный файл/ссылку подставить.
  video: {
    // {{ВИДЕО_ПАРЕНИЕ_URL}} — напр. /videos/parenie.mp4 или внешняя ссылка
    src: "",
    poster: "/images/video-poster.jpg",
    alt: "Видео процесса парения",
  },

  // OG-картинка для соцсетей (1200×630).
  og: { src: "/images/og.jpg", alt: "Дед&Жара — парение веником", width: 1200, height: 630 } as Media,
};

/**
 * Генератор атмосферных плейсхолдеров «Дед&Жара».
 * Создаёт тёплые, тематические заглушки (пар, дерево, огонь, горы, река)
 * в /public/images. Без лиц и логотипов — чисто настроение и грейдинг.
 *
 * Запуск:  npm run gen:media
 * Замена:  положи реальное фото с тем же именем — и всё.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "images");

const C = {
  bg: "#16120e",
  surface: "#211b14",
  wood: "#8a5a2b",
  woodLight: "#a6713b",
  copper: "#c98a3a",
  copperBright: "#e3aa57",
  ember: "#c2542a",
  emberBright: "#db6230",
  leaf: "#3c4a32",
  leafLight: "#5d6e49",
  cream: "#ede6d8",
};

const defs = `
  <radialGradient id="steam" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="${C.cream}" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="${C.cream}" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="flame" x1="0" y1="1" x2="0" y2="0">
    <stop offset="0%" stop-color="${C.ember}"/>
    <stop offset="60%" stop-color="${C.copper}"/>
    <stop offset="100%" stop-color="${C.copperBright}"/>
  </linearGradient>`;

function steam(blobs) {
  return blobs
    .map(
      ([x, y, r, o = 1]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#steam)" opacity="${o}"/>`,
    )
    .join("");
}

const flame = (cx, cy, s) =>
  `<path transform="translate(${cx},${cy}) scale(${s})" d="M0,-60 C20,-20 -30,-10 -30,20 a30,30 0 0 0 60,0 C30,5 22,0 22,-12 C40,5 48,30 18,52 C-8,70 -42,42 -42,12 C-42,-26 0,-30 0,-60 Z" fill="url(#flame)" opacity="0.92"/>`;

function mountains(w, h) {
  return `
    <polygon points="0,${h} ${w * 0.28},${h * 0.45} ${w * 0.5},${h} " fill="${C.leaf}" opacity="0.85"/>
    <polygon points="${w * 0.3},${h} ${w * 0.62},${h * 0.32} ${w * 0.95},${h}" fill="${C.surface}" opacity="0.9"/>
    <polygon points="${w * 0.55},${h} ${w * 0.8},${h * 0.55} ${w},${h}" fill="${C.wood}" opacity="0.5"/>`;
}

function river(w, h) {
  let p = "";
  for (let i = 0; i < 4; i++) {
    const y = h * (0.55 + i * 0.1);
    p += `<path d="M0,${y} C${w * 0.3},${y - 18} ${w * 0.6},${y + 18} ${w},${y - 6}" stroke="${C.cream}" stroke-opacity="${0.18 - i * 0.03}" stroke-width="2" fill="none"/>`;
  }
  return p;
}

function stars(w, h, n) {
  let s = "";
  // детерминированные «звёзды» (без random — стабильная генерация)
  for (let i = 0; i < n; i++) {
    const x = ((i * 97.13) % w);
    const y = ((i * 53.7) % (h * 0.45));
    const r = (i % 3) * 0.6 + 0.6;
    s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${r}" fill="${C.cream}" opacity="0.5"/>`;
  }
  return s;
}

function venik(cx, cy, s) {
  let lines = "";
  for (let i = -4; i <= 4; i++) {
    lines += `<line x1="${cx}" y1="${cy}" x2="${cx + i * 10 * s}" y2="${cy - 120 * s}" stroke="${C.leafLight}" stroke-opacity="0.55" stroke-width="${2 * s}"/>`;
  }
  return `<g>${lines}<rect x="${cx - 4 * s}" y="${cy}" width="${8 * s}" height="${70 * s}" rx="${3 * s}" fill="${C.wood}"/></g>`;
}

function card(w, h, glowColor, motif, cx = 0.5, cy = 0.4) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      ${defs}
      <radialGradient id="glow" cx="${cx * 100}%" cy="${cy * 100}%" r="80%">
        <stop offset="0%" stop-color="${glowColor}" stop-opacity="0.55"/>
        <stop offset="55%" stop-color="${C.surface}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${C.bg}" stop-opacity="1"/>
      </radialGradient>
      <radialGradient id="vig" cx="50%" cy="50%" r="75%">
        <stop offset="55%" stop-color="#000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000" stop-opacity="0.5"/>
      </radialGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="${C.bg}"/>
    <rect width="${w}" height="${h}" fill="url(#glow)"/>
    ${motif}
    <rect width="${w}" height="${h}" fill="url(#vig)"/>
  </svg>`);
}

const jobs = [
  { file: "hero.jpg", w: 1920, h: 1280, glow: C.ember, motif: (w, h) => flame(w * 0.5, h * 0.62, 3.2) + steam([[w * 0.3, h * 0.4, 260, 0.5], [w * 0.68, h * 0.5, 320, 0.45], [w * 0.5, h * 0.7, 380, 0.35]]), cy: 0.55 },
  { file: "service-classic.jpg", w: 900, h: 1100, glow: C.copper, motif: (w, h) => venik(w * 0.5, h * 0.55, 1.6) + steam([[w * 0.5, h * 0.3, 180, 0.5]]) },
  { file: "service-ritual.jpg", w: 900, h: 1100, glow: C.emberBright, motif: (w, h) => flame(w * 0.5, h * 0.55, 2.1) + steam([[w * 0.4, h * 0.3, 160, 0.5], [w * 0.62, h * 0.4, 150, 0.4]]) },
  { file: "service-gift.jpg", w: 900, h: 1100, glow: C.woodLight, motif: (w, h) => `<rect x="${w * 0.3}" y="${h * 0.42}" width="${w * 0.4}" height="${w * 0.4}" rx="14" fill="${C.wood}" opacity="0.55"/><line x1="${w * 0.5}" y1="${h * 0.42}" x2="${w * 0.5}" y2="${h * 0.42 + w * 0.4}" stroke="${C.copperBright}" stroke-width="6" opacity="0.7"/>` + steam([[w * 0.5, h * 0.3, 150, 0.45]]) },
  { file: "about-master.jpg", w: 1100, h: 1320, glow: C.wood, motif: (w, h) => `<ellipse cx="${w * 0.5}" cy="${h * 0.42}" rx="${w * 0.2}" ry="${w * 0.24}" fill="${C.surface}" opacity="0.8"/>` + steam([[w * 0.5, h * 0.35, 220, 0.4]]), cy: 0.42 },
  { file: "vyezd-splav.jpg", w: 1280, h: 900, glow: C.leafLight, motif: (w, h) => river(w, h) + flame(w * 0.18, h * 0.62, 1.1) + `<circle cx="${w * 0.8}" cy="${h * 0.24}" r="42" fill="${C.cream}" opacity="0.5"/>`, cy: 0.45 },
  { file: "vyezd-mountains.jpg", w: 1280, h: 900, glow: C.copper, motif: (w, h) => stars(w, h, 60) + mountains(w, h) + `<circle cx="${w * 0.74}" cy="${h * 0.2}" r="38" fill="${C.copperBright}" opacity="0.55"/>`, cy: 0.3 },
  { file: "gallery-1.jpg", w: 900, h: 900, glow: C.copper, motif: (w, h) => venik(w * 0.5, h * 0.52, 1.4) },
  { file: "gallery-2.jpg", w: 900, h: 1200, glow: C.emberBright, motif: (w, h) => flame(w * 0.5, h * 0.58, 2.2) },
  { file: "gallery-3.jpg", w: 900, h: 900, glow: C.woodLight, motif: (w, h) => `<path d="M${w * 0.3},${h * 0.5} a${w * 0.2},${w * 0.16} 0 0 1 ${w * 0.4},0 z" fill="${C.surface}" opacity="0.85"/><ellipse cx="${w * 0.5}" cy="${h * 0.5}" rx="${w * 0.2}" ry="${w * 0.05}" fill="${C.wood}" opacity="0.7"/>` },
  { file: "gallery-4.jpg", w: 900, h: 1200, glow: C.copper, motif: (w, h) => `<path d="M${w * 0.34},${h * 0.45} h${w * 0.3} v${h * 0.12} a${w * 0.15},${h * 0.12} 0 0 1 -${w * 0.3},0 z" fill="${C.surface}" opacity="0.85"/>` + steam([[w * 0.5, h * 0.3, 120, 0.5]]) },
  { file: "gallery-5.jpg", w: 900, h: 900, glow: C.leafLight, motif: (w, h) => river(w, h) + `<circle cx="${w * 0.7}" cy="${h * 0.28}" r="34" fill="${C.cream}" opacity="0.45"/>`, cy: 0.5 },
  { file: "gallery-6.jpg", w: 900, h: 1200, glow: C.copper, motif: (w, h) => stars(w, h, 70) + mountains(w, h), cy: 0.3 },
  { file: "video-poster.jpg", w: 1600, h: 900, glow: C.ember, motif: (w, h) => flame(w * 0.5, h * 0.6, 2.4) + `<circle cx="${w * 0.5}" cy="${h * 0.5}" r="52" fill="none" stroke="${C.cream}" stroke-opacity="0.6" stroke-width="3"/><path d="M${w * 0.5 - 14},${h * 0.5 - 22} l40,22 l-40,22 z" fill="${C.cream}" opacity="0.85"/>`, cy: 0.55 },
  { file: "og.jpg", w: 1200, h: 630, glow: C.ember, motif: (w, h) => flame(w * 0.5, h * 0.62, 2.0) + steam([[w * 0.3, h * 0.4, 180, 0.4], [w * 0.7, h * 0.45, 200, 0.35]]) + `<rect x="${w * 0.5 - 90}" y="${h * 0.82}" width="180" height="3" fill="${C.copperBright}"/>`, cy: 0.5 },
];

await mkdir(OUT, { recursive: true });

for (const job of jobs) {
  const svg = card(job.w, job.h, job.glow, job.motif(job.w, job.h), job.cx ?? 0.5, job.cy ?? 0.4);
  await sharp(svg).jpeg({ quality: 80, mozjpeg: true }).toFile(join(OUT, job.file));
  console.log("✓", job.file, `${job.w}×${job.h}`);
}

console.log(`\nГотово: ${jobs.length} плейсхолдеров в public/images`);

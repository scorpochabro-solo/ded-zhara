import type { NextConfig } from "next";

// Статический экспорт для GitHub Pages (демо «только дизайн»): STATIC_EXPORT=true.
// PAGES_BASE_PATH=/имя-репозитория — Pages отдаёт сайт по адресу /<repo>/.
// В обычном режиме (по умолчанию) всё работает как полноценное приложение.
const isStatic = process.env.STATIC_EXPORT === "true";
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = isStatic
  ? {
      output: "export",
      distDir: ".next-export",
      trailingSlash: true,
      basePath: basePath || undefined,
      assetPrefix: basePath || undefined,
      images: { unoptimized: true },
    }
  : {
      // Нативный драйвер SQLite не должен попадать в бандл — внешний пакет.
      serverExternalPackages: ["better-sqlite3", "@prisma/adapter-better-sqlite3"],
      images: { formats: ["image/avif", "image/webp"] },
    };

export default nextConfig;

import type { Metadata, Viewport } from "next";
import { Cormorant, Golos_Text } from "next/font/google";
import "./globals.css";
import { site } from "@/content/site";

// Заголовки — высококонтрастный антиквенный шрифт (традиция/премиум), кириллица.
const cormorant = Cormorant({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

// Текст — спокойный гуманистический гротеск с родной кириллицей.
const golos = Golos_Text({
  subsets: ["cyrillic", "latin"],
  variable: "--font-golos",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.brand} — парение веником в Балахне и Нижнем Новгороде`,
    template: `%s — ${site.brand}`,
  },
  description:
    "Профессиональное парение веником как живой русский ритуал. Пармастер Сергей Аперин — Балахна и Нижний Новгород. Классическое парение, ритуал «Дед&Жара», сертификаты, выезды и сплавы с баней.",
  keywords: [
    "парение",
    "парение веником",
    "пармастер",
    "баня",
    "банные традиции",
    "парение в подарок",
    "Балахна",
    "Нижний Новгород",
    "сплавы",
    "выезды с баней",
  ],
  authors: [{ name: "Сергей Аперин" }],
  creator: "Сергей Аперин",
  applicationName: site.brand,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl,
    siteName: site.brand,
    title: `${site.brand} — парение, которое возвращает силы`,
    description:
      "Живой русский ритуал парения веником от пармастера. Балахна · Нижний Новгород. Парения, сертификаты, выезды и сплавы с баней.",
    images: [
      {
        url: "/images/og.jpg",
        width: 1200,
        height: 630,
        alt: "Дед&Жара — парение веником",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand} — парение, которое возвращает силы`,
    description:
      "Живой русский ритуал парения веником от пармастера. Балахна · Нижний Новгород.",
    images: ["/images/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "lifestyle",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16120e",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${golos.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-copper focus:px-4 focus:py-2 focus:font-medium focus:text-bg-deep"
        >
          К основному содержанию
        </a>
        {children}
        {/* Зерно плёнки поверх всего — тонкая фактура «не из конструктора» */}
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  );
}

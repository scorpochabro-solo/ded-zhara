import { site } from "@/content/site";
import { services } from "@/content/copy";

/** Возвращает значение только если это не плейсхолдер ({{...}}). */
const real = (v?: string) => (v && !v.includes("{{") ? v : undefined);

export function JsonLd() {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["LocalBusiness", "HealthAndBeautyBusiness"],
        "@id": `${url}#business`,
        name: "Дед&Жара — парение веником",
        description:
          "Профессиональное парение веником как живой русский ритуал. Пармастер Сергей Аперин. Балахна и Нижний Новгород.",
        url,
        image: `${url}/images/og.jpg`,
        priceRange: "₽₽",
        areaServed: [
          { "@type": "City", name: "Балахна" },
          { "@type": "City", name: "Нижний Новгород" },
        ],
        address: {
          "@type": "PostalAddress",
          addressLocality: "Балахна",
          addressRegion: "Нижегородская область",
          addressCountry: "RU",
        },
        telephone: real(site.contacts.phone.display),
        geo:
          real(site.location.lat) && real(site.location.lng)
            ? {
                "@type": "GeoCoordinates",
                latitude: site.location.lat,
                longitude: site.location.lng,
              }
            : undefined,
        sameAs: [site.social.telegramChannel.href, real(site.social.vk.href)].filter(
          Boolean,
        ),
        founder: { "@id": `${url}#master` },
        makesOffer: services.items.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, description: s.desc },
        })),
      },
      {
        "@type": "Person",
        "@id": `${url}#master`,
        name: "Сергей Аперин",
        jobTitle: "Пармастер, инструктор по туризму",
        description:
          "Профессиональный банный мастер (пармастер) и инструктор по спортивному и природному туризму из Балахны.",
        worksFor: { "@id": `${url}#business` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

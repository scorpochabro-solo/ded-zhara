import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { reviews } from "@/content/copy";

export function Reviews() {
  return (
    <Section id="reviews" className="bg-surface/30">
      <SectionHeading
        eyebrow="Отзывы"
        title={reviews.title}
        intro={reviews.intro}
      />

      <Reveal className="mt-12">
        {/* Карусель со scroll-snap (свайп на мобильном, скролл на десктопе) */}
        <ul
          className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-5 sm:-mx-8 sm:px-8 [scrollbar-width:thin]"
          aria-label="Отзывы гостей"
        >
          {reviews.items.map((r, i) => (
            <li
              key={i}
              className="flex w-[85%] shrink-0 snap-start flex-col rounded-card surface-card p-7 sm:w-[26rem]"
            >
              <span
                aria-hidden="true"
                className="font-display text-6xl leading-none text-copper/40"
              >
                &ldquo;
              </span>
              <p className="-mt-3 flex-1 text-lg leading-relaxed text-cream/90">
                {r.text}
              </p>
              <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-copper/40 font-display text-lg text-copper-bright">
                  {/* TODO: при наличии — фото гостя; пока инициал-плейсхолдер */}
                  {r.name.replace(/[{}]/g, "").trim().charAt(0) || "—"}
                </span>
                <span>
                  <span className="block font-medium text-cream">{r.name}</span>
                  {r.city && (
                    <span className="block text-sm text-faint">{r.city}</span>
                  )}
                </span>
              </footer>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { faq } from "@/content/copy";

export function Faq() {
  return (
    <Section size="narrow">
      <SectionHeading eyebrow="Вопросы и ответы" title={faq.title} />

      <Reveal className="mt-10 border-t border-line">
        {faq.items.map((item, i) => (
          <details
            key={i}
            className="group border-b border-line"
            name="faq"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
              <span className="font-display text-xl text-cream transition-colors group-open:text-copper-bright sm:text-2xl">
                {item.q}
              </span>
              <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong text-copper-bright transition-transform duration-300 group-open:rotate-45">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <div className="pb-6 pr-12 leading-relaxed text-muted">{item.a}</div>
          </details>
        ))}
      </Reveal>
    </Section>
  );
}

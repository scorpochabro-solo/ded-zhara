import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/Reveal";
import { benefits } from "@/content/copy";

export function Benefits() {
  return (
    <Section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="steam-glow pointer-events-none absolute inset-x-0 top-1/4 -z-10 h-96"
      />
      <SectionHeading
        eyebrow="Польза и эффект"
        title={benefits.title}
        intro={benefits.intro}
        align="center"
      />

      <RevealStagger
        className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.09}
      >
        {benefits.items.map((b) => (
          <RevealItem key={b.title}>
            <div className="flex h-full flex-col gap-3 bg-bg p-7 transition-colors duration-300 hover:bg-surface/50">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-copper/40 text-copper-bright">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <h3 className="font-display text-xl text-cream">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{b.desc}</p>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>

      <Reveal className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-line bg-surface/40 px-5 py-4 text-sm text-faint">
        <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-copper/70">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
          <path d="M12 11v5M12 8h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <p>{benefits.disclaimer}</p>
      </Reveal>
    </Section>
  );
}

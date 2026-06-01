import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { steps } from "@/content/copy";

const icons = [
  // Прогрев — пламя
  <svg key="flame" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M12 3c1 3-2 4-2 7a2 2 0 104 0c0-1-.5-1.5-.5-2.5C15 9 17 11 17 14a5 5 0 11-10 0c0-4 5-5 5-11z"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinejoin="round"
    />
  </svg>,
  // Веник — лист
  <svg key="leaf" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M5 19c0-7 6-13 14-13 0 8-6 14-14 13zM5 19l6-6"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
  // Отдых — чашка
  <svg key="cup" viewBox="0 0 24 24" fill="none" className="h-6 w-6">
    <path
      d="M4 9h13v4a5 5 0 01-5 5H9a5 5 0 01-5-5V9zM17 10h2a2 2 0 010 4h-2M8 3c-.5 1 .5 1.5 0 3M12 3c-.5 1 .5 1.5 0 3"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>,
];

export function Steps() {
  return (
    <Section id="how" className="bg-surface/30">
      <SectionHeading
        eyebrow="Как проходит"
        title={steps.title}
        intro={steps.intro}
      />

      <div className="relative mt-16">
        {/* Соединительная линия (десктоп) */}
        <div className="rule-ember absolute left-0 right-0 top-7 hidden lg:block" />

        <RevealStagger
          className="grid gap-12 lg:grid-cols-3 lg:gap-8"
          stagger={0.16}
        >
          {steps.items.map((step, i) => (
            <RevealItem key={step.n}>
              <div className="relative flex flex-col">
                <div className="relative z-10 mb-7 flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-copper/40 bg-bg text-copper-bright">
                    {icons[i]}
                  </span>
                  <span className="font-display text-5xl text-cream/15">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-[1.7rem]">
                  {step.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted">{step.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}

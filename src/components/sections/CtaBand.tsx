import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ctaBlock } from "@/content/copy";
import { site } from "@/content/site";

export function CtaBand() {
  return (
    <section className="py-10 sm:py-16">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-copper/25 bg-linear-to-br from-surface-2 to-bg px-7 py-14 text-center sm:px-12 sm:py-20">
            {/* тёплое свечение */}
            <div aria-hidden="true" className="absolute inset-0 bg-radial from-ember/15 via-transparent to-transparent" />
            <div aria-hidden="true" className="steam-layer pointer-events-none absolute -right-10 -top-16 h-72 w-72 rounded-full bg-copper/10 blur-[100px]" />

            <div className="relative">
              <p className="mb-4 text-sm uppercase tracking-[0.24em] text-copper">
                {site.slogan}
              </p>
              <h2 className="mx-auto max-w-3xl font-display text-4xl leading-[1.05] sm:text-5xl lg:text-6xl">
                {ctaBlock.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg text-muted">
                {ctaBlock.text}
              </p>
              <div className="mt-9 flex justify-center">
                <Button href="#contact" size="lg" withArrow className="ember-pulse">
                  {ctaBlock.button}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

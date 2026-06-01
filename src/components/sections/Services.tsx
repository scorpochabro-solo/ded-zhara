import Image from "next/image";
import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/content/copy";
import { media } from "@/content/media";
import { cn } from "@/lib/cn";

function Meta({ duration, price }: { duration: string; price: string }) {
  return (
    <dl className="mt-6 flex flex-wrap items-end gap-x-8 gap-y-3 border-t border-line pt-5">
      <div>
        <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">
          Длительность
        </dt>
        <dd className="mt-1 text-cream/90">{duration}</dd>
      </div>
      <div>
        <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">
          Стоимость
        </dt>
        <dd className="mt-1 font-display text-2xl text-copper-bright">{price}</dd>
      </div>
    </dl>
  );
}

export function Services() {
  const classic = services.find((s) => s.id === "classic")!;
  const ritual = services.find((s) => s.id === "ritual")!;
  const gift = services.find((s) => s.id === "gift")!;

  return (
    <Section id="services">
      <SectionHeading
        eyebrow="Услуги"
        title={
          <>
            Парение на любой вкус —{" "}
            <span className="text-muted">от знакомства до полного ритуала</span>
          </>
        }
        intro="Три формата: попробовать, погрузиться целиком или подарить тепло близкому."
      />

      <div className="mt-14 flex flex-col gap-6">
        {/* Featured — полный ритуал */}
        <Reveal>
          <article className="surface-card group relative grid overflow-hidden rounded-card lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-64 overflow-hidden lg:min-h-full">
              <Image
                // TODO: заменить на реальное фото клиента
                src={media.services.ritual.src}
                alt={media.services.ritual.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-warm group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface/80 via-transparent to-transparent lg:bg-linear-to-r" />
              <span className="absolute left-5 top-5 rounded-full border border-copper/40 bg-bg/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright backdrop-blur">
                Хит · полный ритуал
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-sm uppercase tracking-[0.2em] text-copper">
                {ritual.kicker}
              </p>
              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                {ritual.title}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{ritual.desc}</p>
              <Meta duration={ritual.meta.duration} price={ritual.meta.price} />
              <div className="mt-7">
                <Button href="#contact" withArrow>
                  Записаться на ритуал
                </Button>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Классическое + Подарок */}
        <RevealStagger className="grid gap-6 md:grid-cols-2">
          {[classic, gift].map((s) => (
            <RevealItem key={s.id}>
              <article className="surface-card group flex h-full flex-col overflow-hidden rounded-card">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    // TODO: заменить на реальное фото клиента
                    src={
                      s.id === "classic"
                        ? media.services.classic.src
                        : media.services.gift.src
                    }
                    alt={
                      s.id === "classic"
                        ? media.services.classic.alt
                        : media.services.gift.alt
                    }
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className={cn(
                      "object-cover transition-transform duration-700 ease-warm group-hover:scale-105",
                    )}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-surface/20 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm uppercase tracking-[0.2em] text-copper">
                    {s.kicker}
                  </p>
                  <h3 className="mt-3 font-display text-2xl sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">
                    {s.desc}
                  </p>
                  <Meta duration={s.meta.duration} price={s.meta.price} />
                  <div className="mt-6">
                    <Button href="#contact" variant="secondary">
                      Записаться
                    </Button>
                  </div>
                </div>
              </article>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}

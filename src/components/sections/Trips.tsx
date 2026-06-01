import Image from "next/image";
import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { RevealStagger, RevealItem, Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { trips } from "@/content/copy";
import { media } from "@/content/media";

export function Trips() {
  return (
    <Section id="trips" className="bg-surface/30">
      <SectionHeading
        eyebrow="Выезды"
        title={trips.title}
        intro={trips.intro}
      />

      <RevealStagger className="mt-14 grid gap-6 lg:grid-cols-2" stagger={0.16}>
        {trips.items.map((trip) => {
          const img =
            trip.id === "splav" ? media.trips.splav : media.trips.banya;
          return (
            <RevealItem key={trip.id}>
              <article className="group relative flex min-h-[30rem] flex-col justify-end overflow-hidden rounded-card surface-card">
                <Image
                  // TODO: заменить на реальное фото клиента
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[1.1s] ease-warm group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/55 to-bg/5" />

                <div className="relative p-7 sm:p-9">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-bright">
                    {trip.kind}
                  </p>
                  <h3 className="mt-2 font-display text-3xl sm:text-4xl">
                    {trip.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-cream/80">
                    {trip.desc}
                  </p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {trip.places.map((place) => (
                      <li
                        key={place}
                        className="rounded-full border border-line-strong bg-bg/40 px-3 py-1 text-xs text-cream/80 backdrop-blur"
                      >
                        {place}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-line/70 pt-5">
                    <div className="flex gap-8">
                      <div>
                        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-faint">
                          Даты
                        </p>
                        <p className="mt-1 text-cream/90">{trip.meta.dates}</p>
                      </div>
                      <div>
                        <p className="text-[0.7rem] uppercase tracking-[0.18em] text-faint">
                          Стоимость
                        </p>
                        <p className="mt-1 font-display text-xl text-copper-bright">
                          {trip.meta.price}
                        </p>
                      </div>
                    </div>
                    <Button href="#contact" variant="secondary" size="md">
                      Узнать о выезде
                    </Button>
                  </div>
                </div>
              </article>
            </RevealItem>
          );
        })}
      </RevealStagger>

      <Reveal className="mt-7">
        <p className="flex items-start gap-2.5 text-sm text-faint">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-copper" />
          {trips.note}
        </p>
      </Reveal>
    </Section>
  );
}

import Image from "next/image";
import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { Reveal, RevealStagger, RevealItem } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { services } from "@/content/copy";
import { media } from "@/content/media";

function Meta({
  duration,
  price,
  note,
}: {
  duration: string;
  price: string;
  note?: string;
}) {
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
        {note && <dd className="mt-1 text-xs text-faint">{note}</dd>}
      </div>
    </dl>
  );
}

const programImg = (id: string) =>
  media.programs[id as keyof typeof media.programs];

export function Services() {
  const featured = services.items.find((s) => s.featured) ?? services.items[0];
  const rest = services.items.filter((s) => s !== featured);

  return (
    <Section id="services">
      <SectionHeading
        eyebrow={services.eyebrow}
        title={services.title}
        intro={services.intro}
      />

      <div className="mt-14 flex flex-col gap-6">
        {/* Featured — «4 стихии» */}
        <Reveal>
          <article className="surface-card group relative grid overflow-hidden rounded-card lg:grid-cols-[1.1fr_1fr]">
            <div className="relative min-h-64 overflow-hidden lg:min-h-full">
              <Image
                src={programImg(featured.id).src}
                alt={programImg(featured.id).alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-warm group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface/80 via-transparent to-transparent lg:bg-linear-to-r" />
              <span className="absolute left-5 top-5 rounded-full border border-copper/40 bg-bg/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright backdrop-blur">
                Хит
              </span>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-sm uppercase tracking-[0.2em] text-copper">
                {featured.kind}
              </p>
              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                {featured.title}
              </h3>
              <p className="mt-4 leading-relaxed text-muted">{featured.desc}</p>
              <Meta
                duration={featured.meta.duration}
                price={featured.meta.price}
                note={featured.meta.note}
              />
              <div className="mt-7">
                <Button href="#contact" withArrow>
                  Записаться
                </Button>
              </div>
            </div>
          </article>
        </Reveal>

        {/* Остальные программы */}
        <RevealStagger className="grid gap-6 md:grid-cols-3">
          {rest.map((s) => (
            <RevealItem key={s.id}>
              <article className="surface-card group flex h-full flex-col overflow-hidden rounded-card">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={programImg(s.id).src}
                    alt={programImg(s.id).alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-warm group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-surface/90 via-surface/20 to-transparent" />
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <p className="text-sm uppercase tracking-[0.2em] text-copper">
                    {s.kind}
                  </p>
                  <h3 className="mt-3 font-display text-2xl">{s.title}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">
                    {s.desc}
                  </p>
                  <Meta
                    duration={s.meta.duration}
                    price={s.meta.price}
                    note={s.meta.note}
                  />
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

        {/* Банное СПА */}
        <Reveal>
          <div className="surface-card relative overflow-hidden rounded-card p-7 sm:p-10">
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-radial from-ember/10 via-transparent to-transparent"
            />
            <span className="inline-flex items-center gap-2 rounded-full border border-copper/40 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright">
              🔥 {services.spa.eyebrow}
            </span>
            <h3 className="mt-4 font-display text-3xl sm:text-4xl">
              {services.spa.title}
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">
              {services.spa.intro}
            </p>

            <ul className="mt-7 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {services.spa.items.map((item) => (
                <li
                  key={item.title}
                  className="flex items-start justify-between gap-4 bg-bg p-5"
                >
                  <div>
                    <p className="font-medium text-cream">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {item.desc}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-lg text-copper-bright">
                    {item.price}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-5 text-sm text-faint">{services.spa.note}</p>
            <div className="mt-7">
              <Button href="#contact" withArrow>
                Записаться на СПА
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Форматы */}
        <RevealStagger className="grid gap-4 sm:grid-cols-3">
          {services.formats.items.map((f) => (
            <RevealItem key={f.title}>
              <div className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-surface/40 p-6">
                <h4 className="font-display text-xl text-copper-bright">
                  {f.title}
                </h4>
                <p className="text-sm leading-relaxed text-muted">{f.desc}</p>
              </div>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </Section>
  );
}

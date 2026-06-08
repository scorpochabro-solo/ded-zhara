import Image from "next/image";
import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { trips } from "@/content/copy";
import { media } from "@/content/media";
import { cn } from "@/lib/cn";

const zaezd = (n: number) => (n === 1 ? "заезд" : "заезда");

function Check() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-copper-bright">
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Trips() {
  const { splavy, mezmai, banya } = trips;

  return (
    <Section id="trips" className="bg-surface/30">
      <SectionHeading eyebrow={trips.eyebrow} title={trips.title} intro={trips.intro} />

      <div className="mt-14 flex flex-col gap-6">
        {/* ─── Авторский тур в Мезмай ─── */}
        <Reveal>
          <article className="surface-card group grid overflow-hidden rounded-card lg:grid-cols-2">
            <div className="relative min-h-[22rem] overflow-hidden lg:min-h-full">
              <Image
                src={media.mezmai.src}
                alt={media.mezmai.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                style={{ objectPosition: media.mezmai.pos }}
                className="object-cover transition-transform duration-700 ease-warm group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-linear-to-t from-surface/70 via-transparent to-transparent lg:bg-linear-to-r" />
              <span className="absolute left-5 top-5 rounded-full border border-copper/40 bg-bg/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-copper-bright backdrop-blur">
                {mezmai.badge}
              </span>
            </div>

            <div className="flex flex-col p-7 sm:p-10">
              <h3 className="font-display text-3xl sm:text-4xl">{mezmai.title}</h3>
              <p className="mt-1 font-display text-xl italic text-copper-bright">{mezmai.subtitle}</p>
              <p className="mt-4 leading-relaxed text-muted">{mezmai.intro}</p>

              <dl className="mt-6 flex flex-wrap items-end gap-x-10 gap-y-3 border-y border-line py-5">
                <div>
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">Даты</dt>
                  <dd className="mt-1 text-cream/90">{mezmai.dates}</dd>
                </div>
                <div>
                  <dt className="text-[0.7rem] uppercase tracking-[0.2em] text-faint">Стоимость</dt>
                  <dd className="mt-1 font-display text-2xl text-copper-bright">{mezmai.price}</dd>
                  <dd className="text-xs text-faint">{mezmai.priceNote}</dd>
                </div>
              </dl>

              <ul className="mt-5 flex flex-wrap gap-2">
                {mezmai.highlights.map((h) => (
                  <li key={h} className="rounded-full border border-line bg-bg/40 px-3 py-1 text-xs text-cream/80">
                    {h}
                  </li>
                ))}
              </ul>

              <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                {mezmai.includes.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted">
                    <Check />
                    {i}
                  </li>
                ))}
              </ul>

              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                <Button href={`tel:${mezmai.booking.tel}`} withArrow>
                  Записаться · {mezmai.booking.display}
                </Button>
                <a href={`mailto:${mezmai.booking.email}`} className="text-sm text-cream/80 underline-offset-4 transition-colors hover:text-copper-bright hover:underline">
                  {mezmai.booking.email}
                </a>
              </div>
              <p className="mt-3 text-sm text-faint">{mezmai.note}</p>
            </div>
          </article>
        </Reveal>

        {/* ─── Сплавы 2026 (интерактивный график) ─── */}
        <Reveal>
          <div className="surface-card rounded-card p-7 sm:p-10">
            <h3 className="font-display text-3xl sm:text-4xl">{splavy.title}</h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-muted">{splavy.intro}</p>

            {/* Аккордеон рек: клик по реке → её даты */}
            <div className="mt-7 overflow-hidden rounded-2xl border border-line">
              {splavy.rivers.map((r, i) => (
                <details
                  key={r.name}
                  name="splav-river"
                  className={cn("group bg-bg/30", i > 0 && "border-t border-line")}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 [&::-webkit-details-marker]:hidden">
                    <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span className="font-display text-2xl text-cream transition-colors group-open:text-copper-bright">
                        {r.name}
                      </span>
                      <span className="text-sm text-faint">
                        {r.days} · {r.dates.length} {zaezd(r.dates.length)}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-3">
                      <span className="text-sm text-copper-bright">от {r.child}</span>
                      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-faint transition-transform duration-300 group-open:rotate-180">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </summary>
                  <div className="border-t border-line px-5 pb-5 pt-4">
                    <ul className="flex flex-wrap gap-2">
                      {r.dates.map((d) => (
                        <li key={d} className="rounded-full border border-copper/30 bg-bg px-3 py-1.5 text-sm text-cream">
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                      <span>
                        <span className="text-faint">Взрослый:</span>{" "}
                        <b className="font-medium text-cream">{r.adult}</b>
                      </span>
                      <span>
                        <span className="text-faint">Детский:</span>{" "}
                        <b className="font-medium text-cream">{r.child}</b>
                      </span>
                      <span>
                        <span className="text-faint">Трансфер:</span>{" "}
                        <span className="text-cream/90">{r.transfer}</span>
                      </span>
                    </div>
                  </div>
                </details>
              ))}
            </div>

            <p className="mt-5 text-sm text-muted">{splavy.extras}</p>

            {/* Скидки */}
            <div className="mt-6 rounded-2xl border border-line bg-bg/40 p-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-copper">
                {splavy.discountsTitle}
              </h4>
              <ul className="mt-3 space-y-2 text-sm text-muted">
                {splavy.discounts.map((d) => (
                  <li key={d} className="flex items-start gap-2.5">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-copper" />
                    {d}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-faint">{splavy.discountsNote}</p>
            </div>

            {/* Запись на сплавы */}
            <div className="mt-6">
              <p className="text-sm text-faint">{splavy.bookingNote}</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {splavy.booking.map((b) => (
                  <a
                    key={b.tel}
                    href={`tel:${b.tel}`}
                    className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2.5 text-sm text-cream transition-colors hover:border-copper hover:text-copper-bright"
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                    {b.display}
                    <span className="text-faint">· {b.name}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* ─── Выездная баня ─── */}
        <Reveal>
          <article className="surface-card group relative flex min-h-[18rem] flex-col justify-end overflow-hidden rounded-card">
            <Image
              src={media.trips.banya.src}
              alt={media.trips.banya.alt}
              fill
              sizes="100vw"
              style={{ objectPosition: media.trips.banya.pos }}
              className="object-cover transition-transform duration-[1.1s] ease-warm group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-bg/10" />
            <div className="relative p-7 sm:p-9">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-copper-bright">
                {banya.kicker}
              </p>
              <h3 className="mt-2 font-display text-3xl">{banya.title}</h3>
              <p className="mt-3 max-w-xl leading-relaxed text-cream/80">{banya.desc}</p>
              <div className="mt-6">
                <Button href="#contact" variant="secondary">
                  Узнать о выезде
                </Button>
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </Section>
  );
}

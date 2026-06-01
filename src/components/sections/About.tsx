import Image from "next/image";
import { Section } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Eyebrow } from "@/components/ui/Heading";
import { about } from "@/content/copy";
import { media } from "@/content/media";

export function About() {
  return (
    <Section id="about">
      <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        {/* Портрет с офсетной медной рамкой */}
        <Reveal className="relative">
          <div
            aria-hidden="true"
            className="absolute -left-4 -top-4 h-full w-full rounded-card border border-copper/30"
          />
          <div className="relative aspect-[4/5] overflow-hidden rounded-card surface-card">
            <Image
              // TODO: заменить на реальное фото клиента (портрет Сергея)
              src={media.about.src}
              alt={media.about.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-bg/50 to-transparent" />
          </div>
        </Reveal>

        {/* Текст */}
        <div>
          <Reveal>
            <Eyebrow>{about.title}</Eyebrow>
            <h2 className="mt-5 font-display text-4xl sm:text-5xl">
              {about.name}
            </h2>
            <p className="mt-3 text-sm uppercase tracking-[0.18em] text-copper/90">
              {about.role}
            </p>
          </Reveal>

          <Reveal delay={0.08} className="mt-7 space-y-4 text-lg leading-relaxed text-muted">
            {about.paragraphs.map((p, i) => (
              <p key={i} className={i === 1 ? "text-cream/90" : undefined}>
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.12}>
            <dl className="mt-10 grid grid-cols-3 gap-4 border-y border-line py-7">
              {about.stats.map((s) => (
                <div key={s.label} className="min-w-0">
                  <dt className="font-display text-2xl leading-none text-copper-bright [overflow-wrap:anywhere] sm:text-3xl">
                    {s.value}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-faint">
                    {s.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-8 font-display text-3xl italic text-cream sm:text-4xl">
              {about.signature}
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { Reveal } from "@/components/ui/Reveal";
import { LeadForm } from "./LeadForm";
import { site } from "@/content/site";
import { contactCopy } from "@/content/copy";

const PhoneIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 005 5L14 13l5 2v3a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const TgIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M21 5L3 12l5 2 2 5 3-4 4 3 4-13z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);
const MaxIcon = (
  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
    <path d="M4 5h16v11H8l-4 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface/40 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-copper/50 hover:bg-surface/70"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-copper/40 text-copper-bright">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[0.72rem] uppercase tracking-[0.18em] text-faint">
          {label}
        </span>
        <span className="block truncate text-lg text-cream transition-colors group-hover:text-copper-bright">
          {value}
        </span>
      </span>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-auto shrink-0 text-faint transition-transform duration-300 group-hover:translate-x-1 group-hover:text-copper-bright">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

export function Contact() {
  const hasMap = site.mapEmbedSrc.startsWith("http");

  return (
    <Section id="contact">
      <SectionHeading
        eyebrow="Контакты"
        title={contactCopy.title}
        intro={contactCopy.intro}
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        {/* Прямая связь */}
        <Reveal className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-faint">
            {contactCopy.directTitle}
          </h3>
          <ContactRow icon={PhoneIcon} label="Телефон" value={site.contacts.phone.display} href={site.contacts.phone.href} />
          <ContactRow icon={TgIcon} label={site.social.telegramChannel.label} value={site.social.telegramChannel.handle} href={site.social.telegramChannel.href} />
          <ContactRow icon={MaxIcon} label={site.social.vk.label} value={site.social.vk.handle} href={site.social.vk.href} />

          {/* Карта / гео */}
          <div className="mt-2 overflow-hidden rounded-2xl border border-line">
            {hasMap ? (
              <iframe
                src={site.mapEmbedSrc}
                title="Карта — Балахна"
                loading="lazy"
                className="h-56 w-full"
              />
            ) : (
              <div className="flex h-56 flex-col items-center justify-center gap-2 bg-surface/40 text-center">
                <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8 text-copper/70">
                  <path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.4" />
                </svg>
                <p className="font-display text-xl text-cream">
                  {site.location.city} · {site.location.region}
                </p>
                <p className="text-sm text-faint">
                  Точную точку и карту добавим после подтверждения адреса.
                </p>
              </div>
            )}
          </div>
        </Reveal>

        {/* Форма */}
        <Reveal delay={0.08}>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-faint">
            {contactCopy.formTitle}
          </h3>
          <LeadForm />
        </Reveal>
      </div>
    </Section>
  );
}

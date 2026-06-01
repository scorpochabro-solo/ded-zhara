import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { site } from "@/content/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-bg-deep pt-16">
      <Container>
        <div className="grid gap-10 pb-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Бренд */}
          <div>
            <span className="font-display text-3xl font-semibold">
              Дед<span className="text-ember-gradient italic">&amp;</span>Жара
            </span>
            <p className="mt-4 max-w-xs leading-relaxed text-muted">
              {site.slogan}. {site.location.city} · {site.location.near}.
            </p>
            <p className="mt-5 font-display text-2xl italic text-cream/80">
              {site.signature}
            </p>
          </div>

          {/* Навигация */}
          <nav aria-label="Подвал — разделы">
            <h3 className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-faint">
              Разделы
            </h3>
            <ul className="flex flex-col gap-2.5 text-muted">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-copper-bright">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Связь */}
          <div>
            <h3 className="mb-4 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-faint">
              Связь
            </h3>
            <ul className="flex flex-col gap-2.5 text-muted">
              <li>
                <a href={site.contacts.phone.href} className="transition-colors hover:text-copper-bright">
                  {site.contacts.phone.display}
                </a>
              </li>
              <li>
                <a href={site.social.telegramChannel.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-copper-bright">
                  {site.social.telegramChannel.label} {site.social.telegramChannel.handle}
                </a>
              </li>
              <li>
                <a href={site.social.vk.href} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-copper-bright">
                  {site.social.vk.label}
                </a>
              </li>
              <li>
                <a href={site.contacts.telegram.href} className="transition-colors hover:text-copper-bright">
                  {site.contacts.telegram.label} для записи
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-ember" />

        <div className="flex flex-col gap-3 py-7 text-sm text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} «Дед&amp;Жара». {site.legal.entity} · ИНН {site.legal.inn}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href={site.legal.privacyPolicyHref} className="transition-colors hover:text-cream">
              Политика обработки персональных данных
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";
import { Button } from "@/components/ui/Button";

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-2xl font-semibold tracking-tight", className)}>
      Дед<span className="text-ember-gradient italic">&amp;</span>Жара
    </span>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокируем прокрутку под открытым мобильным меню.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-warm",
        scrolled
          ? "border-b border-line bg-bg/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:h-20 sm:px-8">
        <a href="#top" className="relative z-10" aria-label={site.brand}>
          <Wordmark />
        </a>

        {/* Десктоп-навигация */}
        <div className="hidden items-center gap-8 lg:flex">
          <ul className="flex items-center gap-7 text-sm text-cream/80">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="relative py-1 transition-colors duration-300 hover:text-copper-bright after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-copper after:transition-all after:duration-300 hover:after:w-full"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            <a
              href={site.contacts.phone.href}
              className="text-sm font-medium text-cream transition-colors hover:text-copper-bright"
            >
              {site.contacts.phone.display}
            </a>
            <Button href="#contact" size="md">
              Записаться
            </Button>
          </div>
        </div>

        {/* Бургер */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line text-cream lg:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
        >
          <span className="relative block h-3.5 w-5">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-all duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 bg-current transition-all duration-300",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </nav>

      {/* Мобильное меню */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 -z-0 flex flex-col bg-bg/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-6 pb-10 pt-24">
              {site.nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i + 0.1 }}
                  className="border-b border-line py-4 font-display text-3xl text-cream"
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="mt-8 flex flex-col gap-3">
                <Button href="#contact" size="lg" withArrow onClick={() => setOpen(false)}>
                  Записаться
                </Button>
                <a
                  href={site.contacts.phone.href}
                  className="text-center text-lg text-cream/80"
                >
                  {site.contacts.phone.display}
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

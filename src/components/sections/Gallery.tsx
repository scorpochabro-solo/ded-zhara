"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Heading";
import { gallery } from "@/content/copy";
import { media } from "@/content/media";

export function Gallery() {
  const items = media.gallery;
  const [index, setIndex] = useState<number | null>(null);

  const close = useCallback(() => setIndex(null), []);
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, close, prev, next]);

  const active = index === null ? null : items[index];

  return (
    <Section id="gallery">
      <SectionHeading
        eyebrow="Галерея"
        title={gallery.title}
        intro={gallery.intro}
      />

      {/* Видео */}
      <div className="mt-14">
        <div className="relative aspect-video overflow-hidden rounded-card surface-card">
          <video
            className="h-full w-full object-cover"
            poster={media.video.poster}
            controls
            preload="none"
            aria-label={media.video.alt}
          >
            {/* TODO: подставить реальный файл/ссылку видео {{ВИДЕО_ПАРЕНИЕ_URL}} */}
            {media.video.src ? <source src={media.video.src} /> : null}
          </video>
          {!media.video.src && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-bg/30">
              <span className="flex items-center gap-3 rounded-full border border-line-strong bg-bg/70 px-5 py-2.5 text-sm text-cream/80 backdrop-blur">
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-copper-bright">
                  <path d="M8 5v14l11-7z" fill="currentColor" />
                </svg>
                Видео скоро появится
              </span>
            </div>
          )}
        </div>
        <p className="mt-3 text-sm text-faint">{gallery.videoCaption}</p>
      </div>

      {/* Масонри-сетка */}
      <div className="mt-8 gap-4 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setIndex(i)}
            className="group mb-4 block w-full overflow-hidden rounded-2xl border border-line focus-visible:outline-2 focus-visible:outline-copper-bright"
            aria-label={`Открыть фото: ${item.alt}`}
          >
            <Image
              // TODO: заменить на реальное фото клиента
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="h-auto w-full transition-transform duration-700 ease-warm group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Лайтбокс */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-bg-deep/95 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={active.alt}
          >
            <button
              type="button"
              onClick={close}
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-cream hover:text-copper-bright"
              aria-label="Закрыть"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-3 flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-cream hover:text-copper-bright sm:left-6"
              aria-label="Предыдущее фото"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.img
              key={active.src}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              src={active.src}
              alt={active.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[85vh] max-w-[92vw] rounded-xl object-contain shadow-warm"
            />

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-3 flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-cream hover:text-copper-bright sm:right-6"
              aria-label="Следующее фото"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}

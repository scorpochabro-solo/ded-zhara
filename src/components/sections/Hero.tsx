"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/copy";
import { media } from "@/content/media";
import { staggerContainer, fadeUp, easeWarm } from "@/lib/motion";

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Лёгкий параллакс фонового фото (выключен при prefers-reduced-motion).
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "16%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Фоновое фото с параллаксом */}
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-10">
        <Image
          // TODO: заменить на реальное фото клиента
          src={media.hero.src}
          alt={media.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      {/* Тёплые слои затемнения + пар */}
      <motion.div
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-t from-bg via-bg/70 to-bg/30"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-radial from-ember/10 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="steam-layer pointer-events-none absolute -top-1/4 left-1/4 -z-10 h-[60vh] w-[60vh] rounded-full bg-cream/5 blur-[120px]"
      />

      <div className="relative w-full px-5 pb-16 pt-32 sm:px-8 sm:pb-24 lg:pb-28">
        <motion.div
          variants={staggerContainer(0.14, 0.1)}
          initial="hidden"
          animate="show"
          className="mx-auto flex w-full max-w-6xl flex-col items-start"
        >
          <motion.span
            variants={fadeUp}
            className="mb-7 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.3em] text-copper"
          >
            <span className="h-px w-8 bg-copper/60" />
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            variants={fadeUp}
            className="font-display text-[clamp(3.2rem,11vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.02em]"
          >
            <span className="block">
              Дед
              <span className="text-ember-gradient italic">&amp;</span>
              Жара
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-2xl font-display text-2xl italic leading-tight text-cream/90 sm:text-3xl lg:text-4xl"
          >
            Парение, которое возвращает силы.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:items-center"
          >
            <Button href="#contact" size="lg" withArrow className="ember-pulse">
              {hero.primaryCta}
            </Button>
            <Button href="#trips" variant="secondary" size="lg">
              {hero.secondaryCta}
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex items-center gap-3 text-sm text-faint"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-copper" />
            {hero.slogan}
          </motion.div>
        </motion.div>
      </div>

      {/* Индикатор скролла */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:block"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: easeWarm }}
            className="flex h-10 w-6 items-start justify-center rounded-full border border-line-strong p-1.5"
          >
            <span className="h-2 w-1 rounded-full bg-copper" />
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

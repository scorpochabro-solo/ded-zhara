"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { hero } from "@/content/copy";
import { staggerContainer, fadeUp, easeWarm } from "@/lib/motion";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden">
      {/* Атмосферный фон «пар и угли» — без фото */}
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-bg" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(125%_85%_at_50%_118%,rgba(194,84,42,0.22),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_82%_6%,rgba(201,138,58,0.12),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="steam-layer pointer-events-none absolute left-1/4 top-[18%] -z-10 h-[55vh] w-[55vh] rounded-full bg-cream/[0.05] blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-linear-to-t from-bg to-transparent"
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

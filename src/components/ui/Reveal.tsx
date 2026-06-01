"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, inViewOnce, staggerContainer } from "@/lib/motion";

/** Одиночное появление блока при скролле (fade-up по умолчанию). */
export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

/** Контейнер со ступенчатым появлением детей (используй вместе с RevealItem). */
export function RevealStagger({
  children,
  className,
  stagger = 0.12,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger, delay)}
      initial="hidden"
      whileInView="show"
      viewport={inViewOnce}
    >
      {children}
    </motion.div>
  );
}

/** Ребёнок RevealStagger — наследует состояние анимации от контейнера. */
export function RevealItem({
  children,
  className,
  variants = fadeUp,
}: {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}

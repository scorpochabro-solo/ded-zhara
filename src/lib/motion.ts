import type { Variants } from "framer-motion";

/** Тёплая, чуть «дышащая» плавность под всю анимацию сайта. */
export const easeWarm = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeWarm },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.9, ease: easeWarm } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 18 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeWarm },
  },
};

/** Контейнер со «ступенчатым» появлением детей. */
export const staggerContainer = (stagger = 0.12, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Общие настройки появления при скролле. */
export const inViewOnce = { once: true, margin: "-80px" } as const;

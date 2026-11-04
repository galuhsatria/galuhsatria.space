import type { Variants } from 'motion/react';

const revealItem = {
  hidden: { opacity: 0, transform: "translateY(14px)" },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
} satisfies Variants;

const revealFromLeft = {
  hidden: { opacity: 0, transform: "translateX(-12px)" },
  visible: {
    opacity: 1,
    transform: "translateX(0px)",
    transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] },
  },
} satisfies Variants;

const revealFade = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
  },
} satisfies Variants;

const revealHeading = {
  hidden: {
    opacity: 0,
    transform: "translateY(12px)",
  },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] },
  },
} satisfies Variants;

const staggerContent = {
  hidden: {},
  visible: {
    transition: { delayChildren: 0.04, staggerChildren: 0.06 },
  },
} satisfies Variants;

export { revealItem, revealFromLeft, revealFade, revealHeading, staggerContent };

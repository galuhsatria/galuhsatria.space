import { m } from 'motion/react';
import { revealFade } from '../lib/motion';

/*
 * Horizontal separator that fades in once it enters the viewport —
 * matches the reveal animations of the content around it.
 */
export default function FadeBorder({ className = '' }: { className?: string }) {
  return (
    <m.div
      className={`border-t border-line ${className}`}
      variants={revealFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    />
  );
}

import { m } from 'motion/react';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { revealHeading, revealItem } from '../lib/motion';
import FadeBorder from './FadeBorder';
import Heading from './Heading';

interface SectionProps {
  title: string;
  id?: string;
  href?: string;
  link?: string;
  children: ReactNode;
}

/*
 * Section titles fade up; content fades up from below. `once: true` means
 * each section animates a single time. The root route wraps everything in
 * <MotionConfig reducedMotion="user"> so OS motion preferences are honoured
 * while SSR and client render the same initial styles.
 */
export default function Section({ title, id, href, link, children }: SectionProps) {
  return (
    <section id={id} className="mt-16 scroll-mt-20">
      <FadeBorder />
      <m.div
        className="mt-16 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2"
        variants={revealHeading}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        <Heading>{title}</Heading>
        {href ? (
          <Link to={href as never} className="font-mono text-xs text-accent hover:underline">
            {link} →
          </Link>
        ) : null}
      </m.div>
      <m.div
        className="mt-8"
        variants={revealItem}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
      >
        {children}
      </m.div>
    </section>
  );
}

import { m } from 'motion/react';
import { revealItem } from '../lib/motion';

export interface BracketLinkItem {
  id: string;
  name: string;
  href: string;
}

export default function BracketLinks({
  items,
  className = '',
}: {
  items: BracketLinkItem[];
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.8rem] text-accent ${className}`}>
      {items.map((s) => (
        <m.li
          key={s.id}
          variants={revealItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            title={s.name}
            className="transition-opacity duration-200 hover:opacity-70"
          >
            <span className="text-muted">[</span>{s.id}<span className="text-muted">]</span>
          </a>
        </m.li>
      ))}
    </ul>
  );
}

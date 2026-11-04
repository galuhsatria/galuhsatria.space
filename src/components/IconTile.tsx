import { m } from 'motion/react';
import { revealItem } from '../lib/motion';
import Icon, { type IconId } from './Icon';

interface IconTileProps {
  id: IconId;
  name: string;
  href: string;
}

export default function IconTile({ id, name, href }: IconTileProps) {
  return (
    <m.li
      className="shrink-0"
      variants={revealItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={name}
        title={name}
        className="block text-muted transition-colors duration-200 hover:text-ink"
      >
        <Icon id={id} />
      </a>
    </m.li>
  );
}

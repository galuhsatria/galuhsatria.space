import { m } from 'motion/react';
import { Link } from '@tanstack/react-router';
import { revealFade, staggerContent } from '../lib/motion';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/*
 * Small mono breadcrumb that matches the existing header/back-link styling.
 * The last item is the current page and is not a link.
 */
export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <m.nav
      aria-label="Breadcrumb"
      className="font-mono text-xs text-muted"
      variants={staggerContent}
      initial="hidden"
      animate="visible"
    >
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <m.li
              key={`${item.label}-${index}`}
              className="flex items-center gap-2"
              variants={revealFade}
            >
              {item.href && !isLast ? (
                <Link
                  to={item.href as never}
                  activeOptions={{ exact: true }}
                  className="text-accent hover:underline underline-offset-4"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className={isLast ? 'text-soft' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast ? <span aria-hidden="true" className="text-dim">/</span> : null}
            </m.li>
          );
        })}
      </ol>
    </m.nav>
  );
}

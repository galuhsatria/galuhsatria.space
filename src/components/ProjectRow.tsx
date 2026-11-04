import { m } from 'motion/react';
import { t, type Lang } from '../i18n';
import { revealItem } from '../lib/motion';
import FadeImage from './FadeImage';
import type { Project } from '../data/projects';

const ExternalIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-3 w-3 -translate-x-1 opacity-0 transition motion-reduce:transition-none group-hover/link:translate-x-0 group-hover/link:opacity-100 group-focus-visible/link:translate-x-0 group-focus-visible/link:opacity-100 [@media(hover:none)]:translate-x-0 [@media(hover:none)]:opacity-100"
  >
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export default function ProjectRow({ project, lang }: { project: Project; lang: Lang }) {
  const tr = t(lang);

  const links = [
    project.url && { label: tr.ui.visitSite, href: project.url },
    project.source && { label: tr.ui.sourceCode, href: project.source },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <m.li
      className="grid gap-4 sm:grid-cols-[168px_minmax(0,1fr)] sm:gap-6"
      variants={revealItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="min-w-0">
        <h3 className="font-medium">{project.name[lang]}</h3>
        <p className="mt-1 line-clamp-4 text-[0.83rem] leading-relaxed text-muted sm:line-clamp-none">
          {project.description[lang]}
        </p>
        {links.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${l.label}: ${project.name[lang]}`}
                className="group/link inline-flex items-center gap-1 font-mono text-xs text-accent underline-offset-4 hover:underline"
              >
                {l.label}
                <ExternalIcon />
              </a>
            ))}
          </div>
        )}
      </div>
      <div
        className="aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-line sm:order-first"
        style={{ background: 'var(--shot)' }}
      >
        {project.image && (
          <FadeImage src={project.image} alt={project.imageAlt?.[lang] ?? (lang === 'id' ? `Tangkapan layar ${project.name[lang]}` : `${project.name[lang]} screenshot`)} width={640} height={480} loading="lazy" className="h-full w-full object-cover" />
        )}
      </div>
    </m.li>
  );
}

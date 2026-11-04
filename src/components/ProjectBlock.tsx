import { m } from 'motion/react';
import { revealItem } from '../lib/motion';
import Heading from './Heading';
import FadeImage from './FadeImage';
import type { Lang } from '../i18n';
import type { Project } from '../data/projects';

export default function ProjectBlock({ project, lang }: { project: Project; lang: Lang }) {
  return (
    <m.article
      className="grid gap-5 border-b border-line py-9 sm:grid-cols-[minmax(0,1fr)_190px] sm:gap-8"
      variants={revealItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="min-w-0">
        <Heading level={2}>{project.name[lang]}</Heading>
        <p className="mt-3 text-muted">{project.description[lang]}</p>
        <div className="flex items-center gap-3">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${lang === 'id' ? 'Kunjungi situs' : 'Visit site'}: ${project.name[lang]}`}
              className="mt-3 inline-block font-mono text-xs text-accent hover:underline"
            >
              {lang === 'id' ? 'Kunjungi situs' : 'Visit site'} <span aria-hidden="true">↗</span>
            </a>
          )}
          {project.source && (
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${lang === 'id' ? 'Kode sumber' : 'Source code'}: ${project.name[lang]}`}
              className="mt-3 inline-block font-mono text-xs text-accent hover:underline"
            >
              {lang === 'id' ? 'Kode sumber' : 'Source code'} <span aria-hidden="true">↗</span>
            </a>
          )}
       </div>
      </div>
      {project.image && (
        <div
          className="aspect-[4/3] w-full overflow-hidden rounded-[8px] border border-line"
          style={{ background: 'var(--shot)' }}
        >
          <FadeImage src={project.image} alt={project.imageAlt?.[lang] ?? (lang === 'id' ? `Tangkapan layar ${project.name[lang]}` : `${project.name[lang]} screenshot`)} width={640} height={480} loading="lazy" className="h-full w-full object-cover" />
        </div>
      )}
    </m.article>
  );
}

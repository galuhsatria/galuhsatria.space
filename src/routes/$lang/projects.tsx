import { createFileRoute } from '@tanstack/react-router';
import { m } from 'motion/react';
import ProjectBlock from '../../components/ProjectBlock';
import FadeBorder from '../../components/FadeBorder';
import Breadcrumbs from '../../components/Breadcrumbs';
import { t, type Lang } from '../../i18n';
import { projects } from '../../data/projects';
import { revealHeading, revealItem } from '../../lib/motion';
import {
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  breadcrumbSchema,
  buildSeo,
  graphSchema,
  itemListSchema,
} from '../../lib/seo';

export const Route = createFileRoute('/$lang/projects')({
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const tr = t(lang);
    const path = `/${lang}/projects/`;
    const title = `${SITE_NAME} | Projects`;
    const featuredNames = projects
      .slice(0, 4)
      .map((project) => project.name[lang])
      .join(', ');
    const description =
      lang === 'id'
        ? `${tr.ui.selectedProjectsSubtitle} Termasuk ${featuredNames}.`
        : `${tr.ui.selectedProjectsSubtitle} Includes ${featuredNames}.`;

    return buildSeo({
      title,
      description,
      path,
      lang,
      imageAlt: lang === 'id' ? `${tr.projects.title} oleh ${SITE_NAME}` : `${tr.projects.title} by ${SITE_NAME}`,
      jsonLd: graphSchema(
        {
          '@type': 'CollectionPage',
          '@id': `${absoluteUrl(path)}#collection`,
          url: absoluteUrl(path),
          name: title,
          description,
          inLanguage: lang,
          isPartOf: { '@id': WEBSITE_ID },
        },
        itemListSchema(
          projects.map((project) => ({
            name: project.name[lang],
            url: project.url ?? `${absoluteUrl(path)}#${project.id}`,
          })),
        ),
        breadcrumbSchema([
          { name: tr.navigation.home, path: `/${lang}/` },
          { name: tr.projects.title, path },
        ]),
      ),
    });
  },
  component: Projects,
});

function Projects() {
  const lang = Route.useParams().lang as Lang;
  const tr = t(lang);

  return (
    <div className="pt-14">
      <Breadcrumbs
        items={[
          { label: tr.navigation.home, href: `/${lang}/` },
          { label: tr.projects.title },
        ]}
      />
      <m.h1
        className="mt-5 font-mono text-[clamp(2rem,8vw,2.75rem)] font-normal leading-none"
        variants={revealHeading}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <span className="font-mono font-normal text-dim" aria-hidden="true"># </span>
        {tr.projects.title}
      </m.h1>
      <FadeBorder className="mt-8" />
      <div>
        {projects.map((p) => (
          <ProjectBlock key={p.id} project={p} lang={lang} />
        ))}
      </div>
    </div>
  );
}

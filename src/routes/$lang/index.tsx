import { createFileRoute } from '@tanstack/react-router';
import { m } from 'motion/react';
import Section from '../../components/Section';
import ProjectRow from '../../components/ProjectRow';
import PostRow from '../../components/PostRow';
import IconTile from '../../components/IconTile';
import BracketLinks from '../../components/BracketLinks';
import FadeImage from '../../components/FadeImage';
import SayHi from '../../components/SayHi';
import { t, type Lang } from '../../i18n';
import { projects } from '../../data/projects';
import { tech, resume, socials } from '../../data/site';
import { getPosts } from '../../lib/blog';
import { revealItem, revealFade, revealFromLeft, revealHeading } from '../../lib/motion';
import { IconId } from '../../components/Icon';
import {
  AVATAR_IMAGE,
  PERSON_ID,
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
  buildSeo,
  graphSchema,
} from '../../lib/seo';

export const Route = createFileRoute('/$lang/')({
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const tr = t(lang);
    const path = `/${lang}/`;
    const title = `${SITE_NAME} | Fullstack Developer`;
    const description = tr.home.subtitle;

    return buildSeo({
      title,
      description,
      path,
      lang,
      type: 'profile',
      imageAlt:
        lang === 'id'
          ? `${SITE_NAME}, pengembang web fullstack`
          : `${SITE_NAME}, fullstack web developer`,
      preloadImage: AVATAR_IMAGE,
      jsonLd: graphSchema({
        '@type': 'ProfilePage',
        '@id': `${absoluteUrl(path)}#profile`,
        url: absoluteUrl(path),
        name: title,
        description,
        inLanguage: lang,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': PERSON_ID },
        mainEntity: { '@id': PERSON_ID },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: absoluteUrl(AVATAR_IMAGE),
          width: 512,
          height: 708,
        },
      }),
    });
  },
  component: Home,
});

function Home() {
  const lang = Route.useParams().lang as Lang;
  const tr = t(lang);
  const experience = Object.values(tr.home.experience.items);
  const featured = projects.filter((p) => p.featured);
  const posts = getPosts(lang);
  const heroLinks = [resume, ...socials.filter((s) => s.id === 'github' || s.id === 'linkedin')];

  return (
    <>
      <section className="pt-14 flex w-full flex-col-reverse gap-5 sm:flex-row sm:gap-10">
        <div className="min-w-0 w-full sm:w-auto sm:flex-1">
          <m.h1
            className="font-mono mt-8 text-[clamp(2rem,8vw,2rem)] font-normal leading-none"
            variants={revealHeading}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >

            <span className="font-mono font-normal text-dim" aria-hidden="true">{'#'}</span> Galuh Satria
          </m.h1>
          <m.p
            className="mt-1.5 text-muted"
            variants={revealFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Fullstack Developer
          </m.p>
          <m.p
            className="mt-3 text-sm text-muted"
            variants={revealItem}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tr.home.subtitle}
          </m.p>

          <BracketLinks items={heroLinks} className="mt-5" />

          <m.p
            className="mt-2 font-mono text-xs"
            variants={revealFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 bg-bg py-2 pr-3 text-soft">
              {/* Briefcase */}
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent" aria-hidden="true">
                <path d="M12 12h.01" />
                <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                <path d="M22 13a18.15 18.15 0 0 1-20 0" />
                <rect width="20" height="14" x="2" y="6" rx="2" />
              </svg>
              {tr.navigation.status}
            </span>
          </m.p>
        </div>
        <m.figure
          className="ml-auto w-48 shrink-0 overflow-hidden rounded-[16px] max-sm:m-auto"
          variants={revealItem}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          style={{
            WebkitMaskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
            maskImage: 'linear-gradient(to bottom, #000 55%, transparent 100%)',
          }}
        >
          <FadeImage src={AVATAR_IMAGE} width={512} height={708} alt="Galuh Satria, fullstack web developer" fetchPriority="high" loading="eager" reveal={false} className="block h-auto w-full" />
        </m.figure>
      </section>

      <Section title={tr.ui.selectedProjects} href={`/${lang}/projects/`} link={tr.ui.allProjects}>
        {featured.length > 0 ? (
          <ul className="grid gap-8">
            {featured.map((p) => (
              <ProjectRow key={p.id} project={p} lang={lang} />
            ))}
          </ul>
        ) : (
          <p className="text-muted">{tr.ui.emptyProjects}</p>
        )}
      </Section>

      <Section title={tr.home.experience.title}>
        <ol className="grid gap-8">
          {experience.map((it) => (
            <m.li
              key={it.company}
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-4"
              variants={revealItem}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <div className="grid h-10 w-10 place-items-center overflow-hidden rounded-[10px] border border-line bg-card">
                <FadeImage src={it.logo} alt="" width={40} height={40} loading="lazy" className="h-full w-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex justify-between gap-3">
                  <p className="min-w-0 font-semibold leading-snug">{it.company}</p>
                  <p className="mt-0.5 shrink-0 font-mono text-xs tabular-nums text-muted">{it.date}</p>
                </div>
                <p className="text-[0.9rem] text-soft">{it.role}</p>
                <p className="mt-1.5 text-muted">{it.subtitle}</p>
              </div>
            </m.li>
          ))}
        </ol>
      </Section>

      <Section title={tr.navigation.blog} href={`/${lang}/blog/`} link={tr.ui.allPosts}>
        {posts.length > 0 ? (
          <div className="grid gap-7">
            {posts.map((post) => (
              <PostRow key={post.slug} post={post} lang={lang} />
            ))}
          </div>
        ) : (
          <p className="text-muted">{tr.ui.emptyPosts}</p>
        )}
      </Section>

      <Section title={tr.about.favoriteTechStack}>
        <div className="relative w-full overflow-hidden py-3">
          <ul className="flex items-center gap-8 overflow-x-auto px-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {tech.map((s) => (
              <IconTile key={s.id} id={s.id as IconId} name={s.name} href={s.href} />
            ))}
          </ul>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-bg to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg to-transparent" />
        </div>
      </Section>

      <SayHi lang={lang} />
    </>
  );
}

import { HeadContent, Outlet, Scripts, createRootRoute, useRouterState } from '@tanstack/react-router';
import { MotionConfig, LazyMotion, domAnimation } from 'motion/react';
import '@fontsource-variable/inter';
import '@fontsource-variable/geist-pixel';
import '../styles/global.css';
import TopLoader from '../components/TopLoader';
import NotFound from '../components/NotFound';

const googleVerification = import.meta.env.VITE_GOOGLE_SITE_VERIFICATION as string | undefined;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#242628' },
      { title: 'Galuh Satria | Fullstack Developer' },
      {
        name: 'description',
        content:
          'Portfolio and blog of Galuh Satria, a fullstack web developer based in Lombok, Indonesia.',
      },
      { name: 'author', content: 'Galuh Satria' },
      ...(googleVerification
        ? [{ name: 'google-site-verification', content: googleVerification }]
        : []),
    ],
    links: [
      { rel: 'icon', type: 'image/png', href: '/favicon-avatar.png', sizes: '256x256' },
      { rel: 'apple-touch-icon', href: '/favicon-avatar.png', sizes: '180x180' },
    ],
  }),
  notFoundComponent: () => (
    <main id="main" className="shell pb-24">
      <NotFound />
    </main>
  ),
  component: RootComponent,
});

function RootComponent() {
  const lang = useRouterState({
    select: (state) =>
      state.location.pathname === '/id' || state.location.pathname.startsWith('/id/') ? 'id' : 'en',
  });

  return (
    <html lang={lang}>
      <head>
        <HeadContent />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[4px] focus:border focus:border-line focus:bg-card focus:px-3 focus:py-2 focus:font-mono focus:text-xs focus:text-ink"
        >
          {lang === 'id' ? 'Lompat ke konten' : 'Skip to content'}
        </a>
        <MotionConfig reducedMotion="user">
          <LazyMotion features={domAnimation} strict>
            <TopLoader />
            <Outlet />
          </LazyMotion>
        </MotionConfig>
        <Scripts />
      </body>
    </html>
  );
}

import { Link, useRouterState } from '@tanstack/react-router';
import { t, type Lang } from '../i18n';

const copy = {
  en: {
    title: 'Page not found',
    body: 'The page you are looking for does not exist, or it may have moved.',
    home: 'Back home',
  },
  id: {
    title: 'Halaman tidak ditemukan',
    body: 'Halaman yang kamu cari tidak ada, atau mungkin sudah dipindahkan.',
    home: 'Kembali ke beranda',
  },
} satisfies Record<Lang, { title: string; body: string; home: string }>;

export default function NotFound() {
  const lang = useRouterState({
    select: (state) =>
      state.location.pathname === '/id' || state.location.pathname.startsWith('/id/')
        ? ('id' as const)
        : ('en' as const),
  });
  const tr = t(lang);
  const c = copy[lang];

  return (
    <div className="pt-14">
      <p className="font-mono text-xs tracking-[0.2em] text-accent">404</p>
      <h1 className="mt-4 font-mono text-[clamp(2rem,8vw,2.75rem)] font-normal leading-none text-balance">
        {c.title}
      </h1>
      <p className="mt-4 max-w-prose text-muted">{c.body}</p>
      <nav className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-sm">
        <Link to="/$lang/" params={{ lang }} className="text-accent hover:underline underline-offset-4">
          ← {c.home}
        </Link>
        <Link
          to="/$lang/blog/"
          params={{ lang }}
          className="text-muted transition-colors hover:text-ink"
        >
          {tr.navigation.blog}
        </Link>
        <Link
          to="/$lang/projects/"
          params={{ lang }}
          className="text-muted transition-colors hover:text-ink"
        >
          {tr.navigation.projects}
        </Link>
      </nav>
    </div>
  );
}

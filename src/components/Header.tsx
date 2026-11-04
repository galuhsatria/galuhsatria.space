import { useEffect, useRef, useState } from 'react';
import { Link, useRouterState } from '@tanstack/react-router';
import { m } from 'motion/react';
import { t, switchLangPath, languages, type Lang } from '../i18n';
import { revealFade } from '../lib/motion';

export default function Header({ lang }: { lang: Lang }) {
  const tr = t(lang);
  const [menuOpen, setMenuOpen] = useState(false);
  const path = useRouterState({ select: (state) => state.location.pathname });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const base = `/${lang}/`;

  const links: { id: string; href: string; label: string; hash?: string }[] = [
    { id: 'home', href: base, label: tr.navigation.home },
    { id: 'projects', href: `${base}projects/`, label: tr.navigation.projects },
    { id: 'blog', href: `${base}blog/`, label: tr.navigation.blog },
    { id: 'contact', href: base, hash: 'say-hi', label: tr.navigation.letsTalk },
  ];

  useEffect(() => {
    if (!menuOpen) return;

    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const isActive = (id: string) => {
    if (id === 'home') return path === base;
    if (id === 'contact') return false;
    return path.startsWith(`${base}${id}`);
  };

  return (
    <header className="site-head">
      <m.div
        className="shell flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-3 font-mono text-[0.75rem] border-b border-line"
        variants={revealFade}
        initial="hidden"
        animate="visible"
      >
        <Link to={base as never} translate="no" activeOptions={{ exact: true }} className="text-muted hover:text-ink">~/galuh-satria/README.md</Link>
        <div className="flex w-full items-center justify-between gap-5 sm:w-auto sm:justify-end">
          <nav aria-label="Main" className="flex gap-4">
            {links.map((l) => {
              const className = `lowercase ${
                isActive(l.id)
                  ? 'text-ink underline decoration-accent underline-offset-[6px]'
                  : 'text-muted hover:text-ink'
              }`;

              if (l.hash) {
                return (
                  <Link
                    key={l.id}
                    to={base as never}
                    hash={l.hash}
                    activeOptions={{ exact: true }}
                    className={className}
                  >
                    {l.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={l.id}
                  to={l.href as never}
                  activeOptions={{ exact: l.id === 'home' }}
                  aria-current={isActive(l.id) ? 'page' : undefined}
                  className={className}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative" ref={dropdownRef}>
            <button
              ref={triggerRef}
              type="button"
              aria-label={`${lang === 'id' ? 'Bahasa' : 'Language'}: ${lang.toUpperCase()}`}
              aria-expanded={menuOpen}
              aria-controls="language-menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 rounded-[4px] border border-line px-2 py-1 font-mono text-[0.65rem] uppercase text-ink transition-colors hover:border-muted"
            >
              {/* Globe */}
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                <path d="M2 12h20" />
              </svg>

              <span>{lang.toUpperCase()}</span>

              {/* Chevron */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              id="language-menu"
              hidden={!menuOpen}
              className="absolute right-0 top-full z-50 mt-2 min-w-full overflow-hidden rounded-[4px] border border-line bg-bg p-1 shadow-lg"
            >
              <ul aria-label={lang === 'id' ? 'Pilih bahasa' : 'Choose language'}>
                {languages.map((l) => (
                  <li key={l}>
                    <Link
                      aria-current={lang === l ? 'true' : undefined}
                      to={switchLangPath(path, l) as never}
                      onClick={() => setMenuOpen(false)}
                      className={`block my-1 rounded-[3px] px-3 py-1.5 font-mono text-[0.65rem] uppercase transition-colors ${
                        lang === l
                          ? 'bg-raised text-ink'
                          : 'text-muted hover:bg-raised hover:text-ink'
                      }`}
                    >
                      {l.toUpperCase()}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </m.div>
    </header>
  );
}

import { useEffect, useRef } from 'react';
import type { Lang } from '../i18n';

const GISCUS_SRC = 'https://giscus.app/client.js';

const ATTRS = {
  'data-repo': 'galuhsatria/galuhsatria.space',
  'data-repo-id': 'R_kgDOVidP2Q',
  'data-category': 'Comments',
  'data-category-id': 'DIC_kwDOVidP2c4DKYLu',
  /* One discussion per localized post URL: /en/blog/x and /id/blog/x are separate. */
  'data-mapping': 'pathname',
  'data-strict': '0',
  'data-reactions-enabled': '1',
  'data-emit-metadata': '0',
  'data-input-position': 'bottom',
  /* Site is dark-only (color-scheme: dark on :root), so this resolves to dark. */
  'data-theme': 'preferred_color_scheme',
  'data-loading': 'lazy',
} as const;

/* Giscus (GitHub Discussions) comments. The script is injected client-side
   and remounted per post+lang so the pathname mapping stays correct. */
export default function Giscus({ lang }: { lang: Lang }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.replaceChildren();

    const script = document.createElement('script');
    script.src = GISCUS_SRC;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-lang', lang);
    for (const [name, value] of Object.entries(ATTRS)) {
      script.setAttribute(name, value);
    }
    container.appendChild(script);

    return () => {
      container.replaceChildren();
    };
  }, [lang]);

  return <div ref={containerRef} className="mt-16 border-t border-line pt-6" />;
}

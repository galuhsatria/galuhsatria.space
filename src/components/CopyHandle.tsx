import { useEffect, useRef, useState } from 'react';
import { extra, type Lang } from '../i18n';
import { handle } from '../data/site';

export default function CopyHandle({ lang }: { lang: Lang }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(handle);
      setCopied(true);
      if (timer.current !== null) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: do nothing */
    }
  };

  return (
    <div className="inline-flex h-11 items-center gap-3 rounded-[10px] border border-line bg-card px-3.5 font-mono text-sm">
      <span translate="no">{handle}</span>
      <button
        type="button"
        onClick={onClick}
        className="rounded-[4px] border border-line px-2 py-0.5 text-xs text-muted hover:text-ink"
      >
        {copied ? extra[lang].copied : extra[lang].copy}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? extra[lang].copied : ''}
      </span>
    </div>
  );
}

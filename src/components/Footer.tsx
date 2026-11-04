import { useEffect, useState } from 'react';
import { m } from 'motion/react';
import { type Lang } from '../i18n';
import { revealFade } from '../lib/motion';

export default function Footer({ lang }: { lang: Lang }) {
  const [clock, setClock] = useState('--:--:-- GMT+8');

  useEffect(() => {
    // Live clock in WITA (GMT+8)
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Makassar',
    });
    const tick = () => setClock(`${fmt.format(new Date())} GMT+8`);
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <m.footer
      className="border-t border-line"
      variants={revealFade}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="shell flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 py-8 text-[0.8rem] text-muted">
        <p suppressHydrationWarning>© {new Date().getFullYear()} Galuh Satria</p>
        <p className="font-mono"><span className="tabular-nums">{clock}</span></p>
      </div>
    </m.footer>
  );
}

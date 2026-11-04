import { useEffect, useRef, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { AnimatePresence, m, useReducedMotion } from 'motion/react';

/* Keep the bar visible long enough to register without slowing navigation much. */
const MIN_VISIBLE = 420;
const TICK = 120;

export default function TopLoader() {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const active = useRef(false);
  const startedAt = useRef(0);
  const ticker = useRef<number | null>(null);
  const finish = useRef<number | null>(null);

  useEffect(() => {
    const clearTicker = () => {
      if (ticker.current !== null) {
        window.clearInterval(ticker.current);
        ticker.current = null;
      }
    };
    const clearFinish = () => {
      if (finish.current !== null) {
        window.clearTimeout(finish.current);
        finish.current = null;
      }
    };

    const start = () => {
      clearTicker();
      clearFinish();
      active.current = true;
      startedAt.current = performance.now();
      setProgress(reduced ? 100 : 8);
      setVisible(true);

      if (!reduced) {
        ticker.current = window.setInterval(() => {
          /* Ease toward 90% while waiting; the last 10% lands on render. */
          setProgress((p) => (p >= 90 ? p : p + (90 - p) * 0.14));
        }, TICK);
      }
    };

    const done = () => {
      if (!active.current) return;
      active.current = false;
      clearTicker();

      const remaining = Math.max(0, MIN_VISIBLE - (performance.now() - startedAt.current));
      finish.current = window.setTimeout(() => {
        setProgress(100);
        finish.current = window.setTimeout(() => setVisible(false), 200);
      }, remaining);
    };

    const unsubscribeStart = router.subscribe('onBeforeNavigate', (event) => {
      if (event.pathChanged) start();
    });
    const unsubscribeDone = router.subscribe('onRendered', done);

    return () => {
      unsubscribeStart();
      unsubscribeDone();
      clearTicker();
      clearFinish();
    };
  }, [router, reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <m.div
          key="top-loader"
          className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.18 }}
          role="status"
          aria-live="polite"
        >
          <div
            className="h-full origin-left bg-accent"
            style={{
              transform: `scaleX(${progress / 100})`,
              transition: reduced ? undefined : 'transform 160ms ease-out',
              boxShadow: '0 0 8px var(--accent)',
            }}
          />
          <span className="sr-only">Memuat halaman</span>
        </m.div>
      )}
    </AnimatePresence>
  );
}

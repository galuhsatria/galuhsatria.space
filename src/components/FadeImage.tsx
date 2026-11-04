import { useEffect, useRef, useState } from 'react';
import { m, useInView } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

/*
 * Images fade in from a blur once they are in view (and actually loaded).
 * CSS in global.css forces them visible under prefers-reduced-motion.
 */
export default function FadeImage({
  className = '',
  onLoad,
  onError,
  loading = 'lazy',
  decoding = 'async',
  reveal = true,
  ...props
}: HTMLMotionProps<'img'> & { reveal?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [loaded, setLoaded] = useState(false);
  const visible = inView && loaded;
  const shown = !reveal || visible;

  /* Cached/SSR images can finish loading before onLoad is attached. */
  useEffect(() => {
    if (ref.current?.complete) setLoaded(true);
  }, []);

  return (
    <m.img
      ref={ref}
      {...props}
      loading={loading}
      decoding={decoding}
      className={`fade-image ${className}`}
      initial={reveal ? { opacity: 0, filter: 'blur(12px)' } : false}
      animate={shown ? { opacity: 1, filter: 'blur(0px)' } : { opacity: 0, filter: 'blur(12px)' }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      onLoad={(event) => {
        onLoad?.(event);
        setLoaded(true);
      }}
      onError={(event) => {
        onError?.(event);
        setLoaded(true);
      }}
    />
  );
}

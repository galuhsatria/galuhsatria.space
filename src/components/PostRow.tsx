import { m } from 'motion/react';
import { Link } from '@tanstack/react-router';
import { extra, formatDate, type Lang } from '../i18n';
import { revealItem } from '../lib/motion';
import type { Post } from '../lib/blog';

export default function PostRow({
  post,
  lang,
  level = 3,
}: {
  post: Post;
  lang: Lang;
  level?: 2 | 3;
}) {
  const Tag = level === 2 ? 'h2' : 'h3';

  return (
    <m.div
      variants={revealItem}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <Link to={`/${lang}/blog/${post.slug}/` as never} className="row block">
        <Tag className="rt font-semibold leading-snug">{post.title}</Tag>
        <p className="mt-1 text-muted">{post.summary}</p>
        <p className="mt-1.5 font-mono text-xs tabular-nums text-dim">
          <time dateTime={post.createdAt.toISOString()}>{formatDate(post.createdAt, lang)}</time>
          {' · '}
          {post.minutes} {extra[lang].minRead}
        </p>
      </Link>
    </m.div>
  );
}

import type { ReactElement } from 'react';

declare module '*.mdx' {
  export const frontmatter: {
    title: string;
    slug: string;
    summary: string;
    createdAt: string;
  };
  export const wc: number;
  const MDXContent: () => ReactElement;
  export default MDXContent;
}

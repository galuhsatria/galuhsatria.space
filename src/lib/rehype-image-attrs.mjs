import { visit } from 'unist-util-visit';

/*
 * Add performance attributes to images written in MDX/Markdown.
 * Blog images are always below the fold, so lazy loading is safe here.
 */
export default function rehypeImageAttrs() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'img') return;
      node.properties = {
        ...node.properties,
        loading: 'lazy',
        decoding: 'async',
      };
    });
  };
}

import { visit } from 'unist-util-visit';

/**
 * remark plugin: counts the words of the document (excluding frontmatter)
 * and exposes it as `export const wc = <number>`, used for read-time metadata.
 * @type {import('unified').Plugin}
 */
export default function remarkWords() {
  return (tree) => {
    let words = 0;
    const seen = new Set();

    visit(tree, (node) => {
      const type = node && node.type;
      if (type === 'yaml' || type === 'mdxjsEsm') return;
      if (typeof node.value !== 'string') return;
      if (seen.has(node)) return;
      seen.add(node);
      words += node.value.split(/\s+/).filter(Boolean).length;
    });

    tree.children.push({
      type: 'mdxjsEsm',
      value: `export const wc = ${words}`,
      data: {
        estree: {
          type: 'Program',
          sourceType: 'module',
          body: [
            {
              type: 'ExportNamedDeclaration',
              specifiers: [],
              source: null,
              declaration: {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                  {
                    id: { type: 'Identifier', name: 'wc' },
                    init: { type: 'Literal', value: words, raw: String(words) },
                  },
                ],
              },
            },
          ],
        },
      },
    });
  };
}

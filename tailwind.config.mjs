/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        ink: 'var(--ink)',
        soft: 'var(--soft)',
        muted: 'var(--muted)',
        dim: 'var(--dim)',
        line: 'var(--line)',
        card: 'var(--card)',
        raised: 'var(--raised)',
        accent: 'var(--accent)',
        ok: 'var(--ok)',
      },
      fontFamily: {
        sans: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
    },
  },
  plugins: [],
};

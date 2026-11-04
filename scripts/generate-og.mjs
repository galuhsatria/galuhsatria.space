import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';

const cacheDir = 'scripts/.cache';
fs.mkdirSync(cacheDir, { recursive: true });

async function prepareFont(source, target) {
  const ttf = await wawoff2.decompress(fs.readFileSync(source));
  fs.writeFileSync(target, ttf);
  return fontkit.openSync(target).familyName;
}

const displayFont = await prepareFont(
  'node_modules/@fontsource-variable/geist-pixel/files/geist-pixel-latin-elsh-normal.woff2',
  `${cacheDir}/og-display.ttf`,
);
const bodyFont = await prepareFont(
  'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  `${cacheDir}/og-body.ttf`,
);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <radialGradient id="glow" cx="0.82" cy="0.18" r="0.55">
      <stop offset="0" stop-color="#89A4FF" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#89A4FF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="#242628"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <rect x="38" y="38" width="1124" height="554" rx="18" fill="none" stroke="#38393d" stroke-width="2"/>
  <circle cx="1088" cy="118" r="6" fill="#4ade80"/>
  <text x="80" y="118" font-family="${displayFont}" font-size="22" fill="#9b9ea4">~/galuh-satria/README.md</text>
  <text x="1068" y="124" font-family="${bodyFont}" font-size="20" fill="#d2d4d8" text-anchor="end">Open to work</text>
  <text x="80" y="292" font-family="${displayFont}" font-size="94" fill="#f4f4f5"># Galuh Satria</text>
  <text x="80" y="362" font-family="${bodyFont}" font-size="38" fill="#d2d4d8">Fullstack Web Developer</text>
  <text x="80" y="418" font-family="${bodyFont}" font-size="26" fill="#9b9ea4">Lombok, Indonesia · galuhsatria.space</text>
  <line x1="80" y1="486" x2="1120" y2="486" stroke="#38393d" stroke-width="2"/>
  <text x="80" y="544" font-family="${displayFont}" font-size="20" fill="#89A4FF">[portfolio] [projects] [blog]</text>
  <text x="1120" y="544" font-family="${bodyFont}" font-size="20" fill="#6a6d73" text-anchor="end">TanStack Start · React · Tailwind CSS</text>
</svg>`;

const png = new Resvg(svg, {
  fitTo: { mode: 'original' },
  font: {
    fontFiles: [`${cacheDir}/og-display.ttf`, `${cacheDir}/og-body.ttf`],
    loadSystemFonts: false,
    defaultFontFamily: bodyFont,
  },
}).render().asPng();

fs.writeFileSync('public/og-image.png', png);
console.log(`Wrote public/og-image.png (${png.length} bytes)`);

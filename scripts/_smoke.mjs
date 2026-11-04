import fs from 'node:fs';
import { Resvg } from '@resvg/resvg-js';
import * as fontkit from 'fontkit';
import wawoff2 from 'wawoff2';

const ttf = await wawoff2.decompress(
  fs.readFileSync('node_modules/@fontsource-variable/geist-pixel/files/geist-pixel-latin-elsh-normal.woff2'),
);
fs.mkdirSync('scripts/.cache', { recursive: true });
fs.writeFileSync('scripts/.cache/geist-pixel.ttf', ttf);
const font = fontkit.openSync('scripts/.cache/geist-pixel.ttf');
console.log('family:', font.familyName);
const glyph = font.layout('M').glyphs[0];
console.log('M advance (unitsPerEm ratio):', glyph.advanceWidth / font.unitsPerEm);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="60">
  <rect width="240" height="60" fill="#242628"/>
  <text x="12" y="42" font-family="${font.familyName}" font-size="36" fill="#f4f4f5">Og Pixel</text>
</svg>`;
const png = new Resvg(svg, {
  fitTo: { mode: 'original' },
  font: { fontFiles: ['scripts/.cache/geist-pixel.ttf'], loadSystemFonts: false, defaultFontFamily: font.familyName },
}).render().asPng();
fs.writeFileSync('scripts/.cache/smoke.png', png);
console.log('render ok, bytes:', png.length);

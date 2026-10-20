#!/usr/bin/env node
/**
 * Raster icons from public/favicon.svg (the "AD" monogram, glyphs as paths):
 *
 *   node scripts/media/make_icons.mjs
 *
 * Writes
 *   public/apple-touch-icon.png  180×180, square corners (iOS applies its own mask)
 *   public/favicon.ico           16 + 32 px PNG frames, for clients that ask for /favicon.ico
 *
 * Uses sharp (installed with Astro). BaseLayout links both files. Re-run after
 * changing favicon.svg.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = fileURLToPath(new URL('../../', import.meta.url));
const svg = await readFile(`${root}public/favicon.svg`, 'utf8');

// Same drawing on a full square (no rounded corners) for the touch icon.
const square = Buffer.from(svg.replace(/\srx="[^"]*"/, ''));
const png = (source, size) => sharp(source, { density: 72 * (size / 64) * 2 }).resize(size, size).png().toBuffer();

await writeFile(`${root}public/apple-touch-icon.png`, await png(square, 180));

// ICO container holding PNG frames (supported by every current browser).
const frames = await Promise.all([16, 32].map(async (size) => ({ size, data: await png(Buffer.from(svg), size) })));
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach(({ size, data }, i) => {
  const e = 6 + 16 * i;
  header.writeUInt8(size, e); // width
  header.writeUInt8(size, e + 1); // height
  header.writeUInt8(0, e + 2); // palette colours
  header.writeUInt8(0, e + 3); // reserved
  header.writeUInt16LE(1, e + 4); // colour planes
  header.writeUInt16LE(32, e + 6); // bits per pixel
  header.writeUInt32LE(data.length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += data.length;
});
await writeFile(`${root}public/favicon.ico`, Buffer.concat([header, ...frames.map((f) => f.data)]));

console.log('public/apple-touch-icon.png, public/favicon.ico');

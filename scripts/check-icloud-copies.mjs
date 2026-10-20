#!/usr/bin/env node
/**
 * Prebuild guard (`npm run build` runs it first, see package.json "prebuild").
 *
 * iCloud Drive writes conflict copies named "name 2.ext" next to the original
 * when a synced folder changes on two sides. In src/ such a copy would be
 * built (e.g. "polymander 2.md" = an extra project page and tile), and in
 * public/ it would be published. Fail the build and list them instead.
 * The real fix is to keep the repo out of iCloud-synced folders (README).
 */
import { readdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const COPY = /^.+ \d+(\.[^.]+)?$/; // "index 2.html", "poster 3.png", "folder 2"

function walk(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (COPY.test(entry.name)) found.push(relative(root, path));
    if (entry.isDirectory()) walk(path, found);
  }
  return found;
}

const copies = ['src', 'public'].flatMap((dir) => walk(join(root, dir)));
if (copies.length > 0) {
  console.error(`\nFound ${copies.length} file(s) that look like iCloud conflict copies:\n`);
  copies.forEach((path) => console.error(`  ${path}`));
  console.error('\nCompare each with its original, delete the copy, then build again.\n');
  process.exit(1);
}

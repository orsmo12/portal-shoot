// Builds the single-file "artifact" version of the game from web/index.html:
//   • drops the <head> meta block (doctype, viewport, noindex, manifest, icons) — the artifact host adds its own
//   • blanks GA_ID so the preview never sends analytics
// Usage: node tools/build-artifact.mjs  →  dist/portal-shoot.html
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
const src = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8');
let out = src.slice(src.indexOf('<title>'));
out = out.replace(/const GA_ID='[^']*';/, "const GA_ID='';").replace(/\n<\/html>\s*$/, '\n');
mkdirSync(new URL('../dist/', import.meta.url), { recursive: true });
writeFileSync(new URL('../dist/portal-shoot.html', import.meta.url), out);
console.log('dist/portal-shoot.html', (out.length / 1024).toFixed(0) + ' KB');

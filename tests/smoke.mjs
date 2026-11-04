// Smoke tests for Portal Shoot. Run: npm test   (needs `npx playwright install chromium` once)
// Loads web/index.html in a phone-sized Chromium with a tiny test hook, then checks the core rules.
import { chromium, devices } from 'playwright';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const src = readFileSync(new URL('../web/index.html', import.meta.url), 'utf8')
  .replace(/const GA_ID='[^']*';/, "const GA_ID='';")
  .replace(/^requestAnimationFrame\(frame\);$/m, 'requestAnimationFrame(frame);window.__PS={Engine,Store,generateLevel,params,simulate,Ads};');
if (!src.includes('window.__PS=')) throw new Error('test hook not inserted (requestAnimationFrame(frame); line moved?)');
const file = join(mkdtempSync(join(tmpdir(), 'ps-')), 'index.html');
writeFileSync(file, src);

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await (await browser.newContext({ ...devices['Pixel 7'] })).newPage();
const errors = []; page.on('pageerror', e => errors.push(e.message));
let failed = 0;
const check = (name, ok, info = '') => { console.log(`${ok ? '✓' : '✗'} ${name}${info ? '  ' + info : ''}`); if (!ok) failed++; };

await page.goto('file://' + file + '?ads=test&iap=test');
await page.waitForTimeout(600);

// 1. World layout 5 / 5 / 6 / 8 and the first Dark World is World 4
const layout = await page.evaluate(() => {
  const { params } = window.__PS, worlds = {};
  for (let lv = 1; lv <= 40; lv++) { const P = params(lv); (worlds[P.w] = worlds[P.w] || []).push(P.dark ? 'D' : '.'); }
  return Object.values(worlds).map(a => a.join(''));
});
check('world sizes 5/5/6/8/8', layout.slice(0, 5).map(s => s.length).join() === '5,5,6,8,8', layout.slice(0, 5).map(s => s.length).join('/'));
check('World 4 is the first Dark World', layout[3] === 'DDDDDDDD' && !layout.slice(0, 3).join('').includes('D'));

// 2. Every level 1-40 generates a solvable board without the fallback generator
const gen = await page.evaluate(() => {
  const { generateLevel } = window.__PS, bad = [];
  for (let lv = 1; lv <= 40; lv++) for (const salt of [7, 99]) {
    const L = generateLevel(lv, { W: 640, H: 1138 }, salt, 2500);
    if (L.fallback || !L.routes.length) bad.push(lv);
  }
  return bad;
});
check('levels 1-40 generate with real routes', gen.length === 0, gen.length ? 'fallback on ' + gen.join(',') : '');

// 3. Old 8-per-world saves migrate to the new layout (seeded before the game script runs)
const ctx = page.context(); await page.close();
const page2 = await ctx.newPage(); page2.on('pageerror', e => errors.push(e.message));
await page2.addInitScript(() => {
  const best = {}; for (let l = 1; l <= 19; l++) best[l] = { stars: 3, score: 1 };
  localStorage.setItem('ps_prog', JSON.stringify({ unlocked: 20, best, wallet: 5, daily: 'seeded' }));
});
await page2.goto('file://' + file + '?ads=test&iap=test'); await page2.waitForTimeout(400);
const m = await page2.evaluate(() => { const s = window.__PS.Store.prog; return { unlocked: s.unlocked, layoutV: s.layoutV, wallet: s.wallet, best: Object.keys(s.best).length }; });
check('save migration keeps world + wallet', m.unlocked === 11 && m.layoutV === 2 && m.best === 13, JSON.stringify(m));

// 4. Rewarded-ad caps
const ads = await page2.evaluate(() => { const { Ads } = window.__PS; return { ready: Ads.ready(), freebie: Ads.left('freebie'), daily: Ads.left('daily') }; });
check('ads=test enables rewarded ads with daily caps', ads.ready && ads.freebie === 3 && ads.daily === 1, JSON.stringify(ads));

check('no page errors', errors.length === 0, errors.join(' | '));
await browser.close();
process.exit(failed ? 1 : 0);

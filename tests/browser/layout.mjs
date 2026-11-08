// Measures how much of the map is visible (not covered by interface) at common screen sizes.
// Build first, then run with the static server on :8080. Milestone 3 target: at least 75% on a phone held sideways.
import { chromium } from 'playwright';

const url = process.env.TW_URL ?? 'http://localhost:8080/index.html';
const out = process.env.TW_OUT ?? 'tests/browser';
const SIZES = [
  ['phone-landscape', { width: 844, height: 390, isMobile: true, hasTouch: true }],
  ['small-landscape', { width: 667, height: 375, isMobile: true, hasTouch: true }],
  ['phone-portrait', { width: 390, height: 844, isMobile: true, hasTouch: true }],
  ['tablet', { width: 1024, height: 768, isMobile: true, hasTouch: true }],
  ['desktop', { width: 1280, height: 800 }],
];
const browser = await chromium.launch();
const results = {};
let failed = false;
for (const [name, v] of SIZES) {
  const { width, height, ...rest } = v;
  const page = await (await browser.newContext({ viewport: { width, height }, ...rest })).newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript(() => {
    globalThis.__twDebug = true;
  });
  await page.goto(url);
  await page.waitForTimeout(1500);
  await page.getByText('Free build').first().click();
  await page.waitForTimeout(1500);
  // Measure the busiest everyday screen: a campaign with its quest card and a raid on the way.
  await page.evaluate(() => {
    const w = globalThis.__tw.w;
    Object.assign(w.story, { mode: 'campaign', settled: true });
    const day = Math.floor(w.time + 1e-8) + 1;
    Object.assign(w.frontier, {
      initialized: true,
      lastDay: day,
      nextEventDay: day + 50,
      pending: { id: 2, kind: 'raid', dueDay: day + 3, strength: 20, title: 'Red Sail raiders' },
    });
    w.message = '';
  });
  await page.waitForTimeout(7000); // let the notices fade
  const visible = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    let hit = 0, n = 0;
    for (let y = 0.5; y < 30; y++)
      for (let x = 0.5; x < 40; x++) {
        const el = document.elementFromPoint((x / 40) * innerWidth, (y / 30) * innerHeight);
        n++;
        if (el === canvas || (el && canvas && el.contains(canvas))) hit++;
      }
    return hit / n;
  });
  await page.screenshot({ path: `${out}/layout-${name}.png` });
  results[name] = Math.round(visible * 100) + '%' + (errors.length ? ' errors: ' + errors.join('; ') : '');
  if (name === 'phone-landscape' && visible < 0.75) failed = true;
  if (errors.length) failed = true;
  await page.close();
}
await browser.close();
console.log(failed ? 'layout: FAILED' : 'layout: ok', JSON.stringify(results));
process.exit(failed ? 1 : 0);

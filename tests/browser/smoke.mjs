// Browser smoke test: build first (npm run build), then run with the static server on :8080.
// Starts a free-build island, checks for page errors, saves, reloads the save and checks the round trip.
import { chromium } from 'playwright';

const url = process.env.TW_URL ?? 'http://localhost:8080/index.html';
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true })).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => { globalThis.__twDebug = true; });
await page.goto(url);
await page.waitForTimeout(2000);
await page.getByText('Free build').first().click();
await page.waitForTimeout(3000);
const result = await page.evaluate(async () => {
  const X = globalThis.__twx, w = globalThis.__tw.w;
  const text = await X.serAsync(w);
  const packed = await X.packOffThread(text);
  const back = X.ser(await X.read(packed));
  return { cells: w.cells.length, roundTrip: back === X.ser(await X.read(await X.pack(back))) };
});
await page.screenshot({ path: 'tests/browser/smoke.png' });
await browser.close();
const ok = errors.length === 0 && result.cells === 384 * 320 && result.roundTrip;
console.log(ok ? 'browser smoke: ok' : 'browser smoke: FAILED', JSON.stringify({ ...result, errors }));
process.exit(ok ? 0 : 1);

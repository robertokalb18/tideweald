// Browser check for Milestone 2: stages a raid on a free-build island and screenshots the fight.
// Build first (npm run build), then run with the static server on :8080.
import { chromium } from 'playwright';

const url = process.env.TW_URL ?? 'http://localhost:8080/index.html';
const out = process.env.TW_OUT ?? 'tests/browser';
const browser = await chromium.launch();
const page = await (
  await browser.newContext(
    process.env.TW_DESKTOP
      ? { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 }
      : { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
  )
).newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.addInitScript(() => {
  globalThis.__twDebug = true;
});
await page.goto(url);
await page.waitForTimeout(2000);
await page.getByText('Free build').first().click();
await page.waitForTimeout(2500);
const setup = await page.evaluate(() => {
  const w = globalThis.__tw.w;
  // Nearest dry land to the haven for the stores.
  let best, bd = 1e9;
  for (const c of w.cells) {
    if (!c.land || c.pond || c.rock) continue;
    const d = (c.x - 192) ** 2 + (c.y - 163) ** 2;
    if (d < bd) (bd = d), (best = c);
  }
  const sx = best.x + 0.5, sy = best.y + 0.5;
  let id = 70000;
  const put = (kind, dx, dy) =>
    w.buildings.push({ id: id++, kind, x: sx + dx, y: sy + dy, progress: 0, buildProgress: 1, stored: 0, orientation: 0 });
  put('storehouse', 0, 0);
  put('guardhall', -4, -3);
  put('watchtower', 3, 2);
  put('palisade', -1, 3);
  w.placements++;
  Object.assign(w.story, { mode: 'campaign', settled: true, started: true });
  const day = Math.floor(w.time + 1e-8) + 1;
  Object.assign(w.frontier, {
    initialized: true,
    lastDay: day,
    nextEventDay: day + 50,
    garrison: 6,
    formation: 'line',
    pending: { id: 2, kind: 'raid', dueDay: day + 1, strength: 24, title: 'Red Sail raiders' },
  });
  w.wallet = { gold: 800, food: 400, timber: 200, stone: 100 };
  globalThis.__twx.ps(w, 0.025); // the plan is made on the next step
  return { sx, sy, plan: w.frontier.pending.landing, len: w.frontier.pending.route?.length };
});
const centre = async (x, y, z = 1.4) =>
  page.evaluate(
    ([x, y, z]) => {
      const { cam } = globalThis.__tw;
      const W = innerWidth, H = innerHeight;
      const px = ((x - 192 - (y - 160)) * 58) / 2, py = ((x - 192 + (y - 160)) * 29) / 2;
      cam.zoom = z;
      cam.x = W / 2 - px * z;
      cam.y = H * 0.42 - py * z;
    },
    [x, y, z],
  );
const mid = [(setup.sx + setup.plan[0]) / 2, (setup.sy + setup.plan[1]) / 2];
await centre(...mid, 0.9);
await page.waitForTimeout(700);
await page.screenshot({ path: `${out}/raid-1-warning.png` });
// Land and fight, a step at a time.
const shots = [];
for (let i = 0; i < 80; i++) {
  const s = await page.evaluate(() => {
    const w = globalThis.__tw.w;
    globalThis.__twx.ps(w, 0.025);
    const b = w.frontier.battle;
    return b
      ? { t: b.t, fighting: b.guards.some((g) => g.s === 'fight'), cx: b.raiders.reduce((a, u) => a + u.x, 0) / b.raiders.length, cy: b.raiders.reduce((a, u) => a + u.y, 0) / b.raiders.length }
      : { done: !w.frontier.pending, report: w.frontier.lastReport };
  });
  if (s.t !== undefined && !shots.includes('landing') && s.t > 0.05) {
    await centre(s.cx, s.cy, 1.5);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/raid-2-landing.png` });
    shots.push('landing');
  }
  if (s.fighting && !shots.includes('fight')) {
    await centre(s.cx, s.cy, 1.8);
    await page.waitForTimeout(400);
    await page.screenshot({ path: `${out}/raid-3-fight.png` });
    shots.push('fight');
    // The Army panel during the fight: live tally, forecast and formation buttons.
    await page.getByLabel('View approaching threat').click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${out}/raid-3b-army.png` });
    await page.getByRole('button', { name: 'Marching column' }).click();
    shots.push(await page.evaluate(() => globalThis.__tw.w.frontier.formation));
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }
  if (s.done) {
    console.log('report', JSON.stringify(s.report));
    break;
  }
}
await page.waitForTimeout(300);
await page.screenshot({ path: `${out}/raid-4-after.png` });
await browser.close();
const ok = errors.length === 0 && shots.join() === 'landing,fight,column';
console.log(ok ? 'browser raid: ok' : 'browser raid: FAILED', JSON.stringify({ setup, shots, errors }));
process.exit(ok ? 0 : 1);

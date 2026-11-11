// v17: the river's year (src/world/river.js). The level is a function of island time, so these tests are about
// what the player can predict (the calendar), what it costs and gives (floodplain, fishing), how it moves the
// raids, and that nothing but a flood threat's surge is saved.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceWorld } from '../src/core/simulation.js';
import { production } from '../src/economy/production.js';
import { raidPlan } from '../src/military/frontier.js';
import { readIslandText, serializeWorld } from '../src/persistence/save.js';
import {
  RIVER,
  fishesRiver,
  isFlooded,
  levelOnDay,
  onFloodplain,
  raidPossible,
  raidWater,
  riverActive,
  riverCalendar,
  riverEffect,
  riverForecast,
  riverHeadline,
  riverLine,
  riverMask,
} from '../src/world/river.js';
import { GRID_W } from '../src/world/grid.js';
import { loadFixtureWorld } from './helpers.js';
import { raidWorld } from './raid-helpers.js';

let base;
/** The fixture island as a campaign, with the given buildings at absolute [kind, x, y]. */
async function island(list = [], time = 0.5) {
  base ??= await loadFixtureWorld();
  const w = structuredClone(base);
  Object.assign(w.story, { mode: 'campaign', started: true });
  w.time = time;
  w.wallet = { gold: 2000, food: 500, timber: 500, stone: 500 };
  w.buildings = list.map(([kind, x, y], i) => ({
    id: 71000 + i, kind, x, y, progress: 0, buildProgress: 1, stored: 0, orientation: 0,
  }));
  w.placements++;
  return w;
}
/** A floodplain cell and a dry cell well away from the river, both near the haven. */
function sites(w) {
  const m = riverMask(w);
  let plain, dry;
  for (let r = 0; r < 30 && !(plain && dry); r++)
    for (let y = 160 - r; y <= 160 + r; y++)
      for (let x = 192 - r; x <= 192 + r; x++) {
        const c = w.cells[y * GRID_W + x];
        if (!c.land || c.pond || c.rock) continue;
        if (!plain && m[y * GRID_W + x] & 2) plain = [x + 0.5, y + 0.5];
        if (!dry && !(m[y * GRID_W + x] & 4) && c.elevation <= 3) dry = [x + 0.5, y + 0.5];
      }
  return { plain, dry };
}

test('the river keeps one calendar every year: flood days 5–7, low water 22–25, ice 39–48', async () => {
  const w = await island();
  const year = (from) => Array.from({ length: 48 }, (_, d) => levelOnDay(w, from + d));
  const y1 = year(0);
  assert.deepEqual(y1.slice(3, 8), ['normal', 'high', 'high', 'high', 'normal']);
  assert.deepEqual(y1.slice(20, 26), ['normal', 'low', 'low', 'low', 'low', 'normal']);
  assert.equal(y1[37], 'normal');
  assert.ok(y1.slice(38).every((l) => l === 'ice'));
  assert.deepEqual(year(48), y1, 'the second year is the same as the first');
  assert.deepEqual(year(48 * 7), y1);
});

test('the forecast, the clock words and the calendar agree with the schedule', async () => {
  const w = await island([], 1.3); // Day 2
  let f = riverForecast(w);
  assert.equal(f.level, 'normal');
  assert.deepEqual(f.event, { level: 'high', day: 5, inDays: 3 });
  assert.equal(riverHeadline(w), 'Flood in 3d');
  assert.equal(riverLine(w), 'River steady \xB7 flood on Day 5');
  assert.deepEqual(
    riverCalendar(w).map((c) => [c.level, c.day]),
    [['high', 5], ['normal', 8], ['low', 22], ['normal', 26]],
  );
  w.time = 0.2; // Day 1: four days off, the clock stays quiet
  assert.equal(riverHeadline(w), '');
  w.time = 5.5; // Day 6, in the flood
  f = riverForecast(w);
  assert.equal(f.level, 'high');
  assert.equal(f.until, 8, 'the water falls on Day 8');
  assert.equal(riverHeadline(w), 'Flood \xB7 2d');
  assert.equal(riverLine(w), 'River in flood until Day 8');
  w.time = 40;
  assert.equal(riverHeadline(w), 'Ice \xB7 8d');
});

test('the floodplain is the dry bank beside the river, and only that', async () => {
  const w = await island();
  const m = riverMask(w);
  let water = 0, plain = 0;
  for (let i = 0; i < m.length; i++) {
    const c = w.cells[i];
    if (m[i] & 1) water++;
    if (m[i] & 2) {
      plain++;
      assert.ok(c.land && !c.pond && !c.rock, 'floodplain is buildable ground');
      assert.ok(m[i] & 4, 'the floodplain lies inside the fishing reach');
    }
  }
  assert.ok(water > 500 && plain > 500, `river ${water} cells, floodplain ${plain}`);
  assert.equal(riverMask(w), m, 'worked out once per terrain');
  const { plain: p, dry } = sites(w);
  assert.ok(onFloodplain(w, ...p) && !onFloodplain(w, ...dry) && !fishesRiver(w, ...dry));
});

test('a farm on the floodplain bears 30% more, and the flood stops it and sweeps what it holds', async () => {
  const s = sites(await island());
  const w = await island([['farm', ...s.plain]], 1.5);
  const farm = w.buildings[0];
  const rate = production(w, farm).rate;
  assert.ok(rate > 0);
  const w0 = structuredClone(w);
  Object.assign(w0.story, { mode: 'sandbox' }); // the river's year does not apply here
  assert.ok(Math.abs(rate / production(w0, w0.buildings[0]).rate - RIVER.silt) < 1e-9);
  assert.match(production(w, farm).reason, /River silt \+30%.*next: Day 5/);

  advanceWorld(w, 2.4); // to Day 4, late: the farm has been filling
  assert.ok(farm.stored > 20, `stored ${farm.stored}`);
  assert.equal(isFlooded(w, farm), false);
  advanceWorld(w, 0.2); // dawn of Day 5
  assert.equal(isFlooded(w, farm), true);
  assert.equal(farm.stored, 0, 'the flood takes what the farm held');
  const p = production(w, farm);
  assert.equal(p.rate, 0);
  assert.match(p.reason, /Flooded .* falls on Day 8/);
  assert.match(w.story.events.at(-1).title, /over its banks/);
  advanceWorld(w, 2.85); // still Day 7
  assert.equal(farm.stored, 0);
  advanceWorld(w, 0.5); // Day 8
  assert.equal(isFlooded(w, farm), false);
  assert.ok(farm.stored > 0, 'the farm works again when the water falls');
});

test('the warning comes two days ahead, once, and the same river is told after a skip or a reload', async () => {
  const w = await island([], 0.5);
  advanceWorld(w, 2); // Day 3
  const told = w.story.events.filter((e) => e.title === 'The river is rising');
  assert.equal(told.length, 1);
  assert.equal(told[0].day, 3);
  assert.match(told[0].text, /On Day 5/);
  // Long skips and many short steps tell the same story.
  const a = await island([], 0.5), b = await island([], 0.5);
  for (let i = 0; i < 15; i++) advanceWorld(a, 3); // advanceWorld takes at most three days a call
  advanceWorld(a, 2);
  for (let i = 0; i < 470; i++) advanceWorld(b, 0.1);
  const titles = (x) => x.story.events.map((e) => `${e.day} ${e.title}`).filter((t) => /river|water|ice|frozen/i.test(t));
  assert.deepEqual(titles(a), titles(b));
  assert.ok(titles(a).some((t) => t === '39 The river has frozen'));
  const again = await readIslandText(serializeWorld(a));
  assert.equal(levelOnDay(again, 46), 'ice');
  assert.equal(again.frontier.surge, undefined, 'nothing about the yearly river is saved');
});

test('buildings made for the water do not flood; a house or a sawpit on the low bank does', async () => {
  const { plain } = sites(await island());
  for (const kind of ['fishery', 'pier', 'harbor', 'shipyard', 'watermill']) {
    const w = await island([[kind, ...plain]], 5.5);
    assert.equal(isFlooded(w, w.buildings[0]), false, kind);
  }
  for (const kind of ['house', 'sawpit', 'storehouse']) {
    const w = await island([[kind, ...plain]], 5.5);
    assert.equal(isFlooded(w, w.buildings[0]), true, kind);
    assert.match(riverEffect({ ...w, time: 1.5 }, kind, ...plain).note, /On the floodplain/);
  }
});

test('river fishing follows the water: +25% in flood, −25% at low water, half through the ice', async () => {
  const { plain, dry } = sites(await island());
  const at = async (time, where = plain) => riverEffect(await island([], time), 'fishery', ...where).factor;
  assert.equal(await at(1.5), 1);
  assert.equal(await at(5.5), 1.25);
  assert.equal(await at(22.5), 0.75);
  assert.equal(await at(40.5), 0.5);
  assert.equal(await at(40.5, dry), 1, 'a dock away from the river (on the pond or the sea) is not touched');
  assert.equal(riverEffect(await island([], 40.5), 'fishery', ...plain, true).factor, 1, 'previews show the steady rate');
});

test('longships land close on high water, far at low water, and not at all on ice', async () => {
  const far = (w, tide) => {
    const p = raidPlan(w, { ...w.frontier.pending, tide, route: undefined }, false);
    const [sx, sy] = [192.5, 160.5];
    return Math.hypot(p.landing[0] + 0.5 - sx, p.landing[1] + 0.5 - sy);
  };
  const w = await raidWorld({ guards: 4 });
  const high = far(w, 'high'), normal = far(w, 'normal'), low = far(w, 'low');
  assert.ok(high < normal && normal < low, `landing ${high.toFixed(1)} < ${normal.toFixed(1)} < ${low.toFixed(1)}`);
  assert.ok(high >= RIVER.landing.high.min - 1 && low >= RIVER.landing.low.min - 1);
  const c = await island();
  assert.equal(raidWater(c, 6), 'high');
  assert.equal(raidWater(c, 23), 'low');
  assert.equal(raidWater(c, 12), 'normal');
  assert.equal(raidPossible(c, 12), true);
  for (let day = 39; day <= 48; day++) assert.equal(raidPossible(c, day), false, `no raid on Day ${day}`);
  assert.equal(raidPossible(c, 49), true);
});

test('no raid is ever scheduled onto the ice across four years of threats', async () => {
  const w = await raidWorld({ guards: 8, towers: [[4, 0], [-4, 0]], strength: 6 });
  w.frontier.pending = null;
  w.frontier.nextEventDay = Math.floor(w.time) + 4;
  const raids = [];
  let seen = 0;
  for (let i = 0; i < 48 * 4 * 4; i++) {
    advanceWorld(w, 0.25);
    const p = w.frontier.pending;
    if (p && p.id !== seen) {
      seen = p.id;
      if (p.kind === 'raid') raids.push(p.dueDay);
    }
  }
  assert.ok(raids.length >= 6, `${raids.length} raids sighted`);
  for (const due of raids) assert.notEqual(levelOnDay(w, due - 1), 'ice', `raid due Day ${due}`);
});

test('a River flood threat brings two days of high water out of season, and the surge survives a save', async () => {
  const { plain } = sites(await island());
  const w = await raidWorld({ guards: 2 });
  w.time = 12.2; // Day 13: steady water
  const day = 13;
  w.buildings.push({ id: 72000, kind: 'farm', x: plain[0], y: plain[1], progress: 0, buildProgress: 1, stored: 40, orientation: 0 });
  w.placements++;
  Object.assign(w.frontier, {
    lastDay: day,
    nextEventDay: day + 30,
    pending: { id: 9, kind: 'flood', dueDay: day, strength: 10, title: 'River flood' },
  });
  advanceWorld(w, 0.05);
  assert.deepEqual(w.frontier.surge, { from: day, until: day + RIVER.surgeDays });
  const farm = w.buildings.at(-1);
  assert.equal(isFlooded(w, farm), true);
  assert.equal(farm.stored, 0);
  const again = await readIslandText(serializeWorld(w));
  assert.deepEqual(again.frontier.surge, w.frontier.surge);
  assert.equal(levelOnDay(again, day), 'high');
  assert.equal(levelOnDay(again, day + 1), 'normal');
  advanceWorld(w, 2);
  assert.equal(isFlooded(w, farm), false, 'the surge ends after two days');
});

test('free build without threats has no river year; with threats it does', async () => {
  const { plain } = sites(await island());
  const w = await island([['farm', ...plain]], 5.5);
  Object.assign(w.story, { mode: 'sandbox', rules: { threats: false } });
  assert.equal(riverActive(w), false);
  assert.equal(levelOnDay(w, 5), 'normal');
  assert.equal(isFlooded(w, w.buildings[0]), false);
  assert.equal(riverHeadline(w), '');
  assert.equal(production(w, w.buildings[0]).plain, false);
  w.story.rules.threats = true;
  assert.equal(riverActive(w), true);
  assert.equal(isFlooded(w, w.buildings[0]), true);
});

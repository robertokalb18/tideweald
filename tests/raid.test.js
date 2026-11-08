// Milestone 2, "Raids you can fight": raids are played out on the map, and the result depends on
// where the defenses stand and how the guards fight.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceWorld } from '../src/core/simulation.js';
import { planRaid } from '../src/military/battle.js';
import { raidForecast } from '../src/military/frontier.js';
import { readIslandText, serializeWorld } from '../src/persistence/save.js';
import { fight, raidWorld } from './raid-helpers.js';

const holds = (r) => r.title === 'The harbor holds';
// The world as sorted JSON, without the redraw counter (a reload may order keys differently).
const state = (w) => {
  const { revision, ...rest } = JSON.parse(serializeWorld(w)).world;
  return JSON.stringify(rest, (k, v) =>
    v && typeof v === 'object' && !Array.isArray(v) ? Object.fromEntries(Object.keys(v).sort().map((q) => [q, v[q]])) : v,
  );
};

/** Steps until the first guard is in melee; returns its distance from the raiders' target. */
function firstContact(w) {
  for (let i = 0; i < 200; i++) {
    advanceWorld(w, 0.025);
    const b = w.frontier.battle;
    const g = b?.guards.find((u) => u.s === 'fight');
    if (g) return Math.hypot(g.x - b.tx, g.y - b.ty);
  }
  return -1;
}

test('the landing is on a shore, the route leads to the stores, and both are fixed by the island', async () => {
  const w = await raidWorld();
  const a = planRaid(w, 3),
    b = planRaid(w, 3);
  assert.deepEqual(a, b);
  const [x, y] = a.landing;
  const cell = (cx, cy) => w.cells[cy * 384 + cx];
  assert.ok(cell(x, y).land && !cell(x, y).pond, 'they land on dry ground');
  assert.ok(
    [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
      const c = cell(x + dx, y + dy);
      return !c.land || c.waterType === 'river';
    }),
    'beside sea or river water',
  );
  assert.deepEqual(a.route.slice(0, 2), a.landing);
  assert.deepEqual(a.route.slice(-2), [Math.floor(a.tx), Math.floor(a.ty)]);
  assert.notDeepEqual(planRaid(w, 4).landing, a.landing, 'the next raid comes from another side');
});

test('an undefended island loses its stores and the storehouse burns', async () => {
  const w = await raidWorld({ strength: 20 });
  const gold = w.wallet.gold;
  const { report } = fight(w);
  assert.equal(report.title, 'Raiders take supplies');
  assert.match(report.text, /set fire to the storehouse/);
  assert.ok(w.wallet.gold < gold);
  assert.equal(w.frontier.raidsRepelled, 0);
  assert.equal(w.frontier.pending, undefined, 'the threat is settled');
  assert.ok(w.frontier.route === undefined && w.frontier.battle === undefined);
});

test('enough guards drive the raiders off, and the raid counts as repelled', async () => {
  const w = await raidWorld({ strength: 20, guards: 8 });
  const { report, days } = fight(w);
  assert.ok(holds(report), report.text);
  assert.equal(w.frontier.raidsRepelled, 1);
  assert.ok(report.battle.fell >= 4);
  assert.ok(days < 1.6, `the fight lasts part of a day (${days.toFixed(2)})`);
});

test('formations change where the fight happens', async () => {
  const at = {};
  for (const formation of ['patrol', 'line', 'column'])
    at[formation] = firstContact(await raidWorld({ strength: 20, guards: 8, formation }));
  assert.ok(at.column > at.line, `the column meets them nearer the beach (${at.column} vs ${at.line})`);
  assert.ok(at.line > at.patrol, `the line stands forward of the patrol (${at.line} vs ${at.patrol})`);
});

test('the shield wall loses fewer guards than the charging column', async () => {
  const hurt = {};
  for (const formation of ['line', 'column']) {
    const w = await raidWorld({ strength: 32, guards: 12, formation });
    let worst = 0;
    while (w.frontier.pending) {
      advanceWorld(w, 0.05);
      const b = w.frontier.battle;
      if (b) worst = Math.max(worst, b.guards.reduce((s, g) => s + (g.max - g.hp), 0));
    }
    hurt[formation] = worst;
  }
  assert.ok(hurt.line < hurt.column, JSON.stringify(hurt));
});

test('a tower helps only where the raiders go', async () => {
  const near = fight(await raidWorld({ strength: 20, towers: [[2, 2]] })).report;
  const far = fight(await raidWorld({ strength: 20, towers: [[15, 0]] })).report;
  assert.ok(near.battle.fell > far.battle.fell, `${near.battle.fell} vs ${far.battle.fell}`);
  assert.equal(far.battle.fell, 0);
});

test('a palisade gate beside the stores keeps them from the fire', async () => {
  const w = await raidWorld({ strength: 20, palisades: [[1, -2]] });
  const { report } = fight(w);
  assert.doesNotMatch(report.text, /set fire/);
  assert.equal(w.buildings.find((b) => b.kind === 'storehouse').buildProgress, 1);
});

test('the Army forecast matches what happens when nothing changes', async () => {
  const w = await raidWorld({ strength: 32, guards: 10, formation: 'line', towers: [[2, 2]] });
  const f = raidForecast(w, w.frontier.pending);
  const { report } = fight(w);
  assert.equal(f.fell, report.battle.fell);
  assert.equal(f.repelled, holds(report));
  assert.equal(f.guardsDown, report.battle.guardsDown);
});

test('a battle gives the same result at 1x, 10x and skip ahead', async () => {
  const run = async (chunk) => {
    const w = await raidWorld({ strength: 20, guards: 6, towers: [[3, 1]] });
    for (let fed = 0; fed < 1.5 - 1e-9; fed += chunk) advanceWorld(w, Math.min(chunk, 1.5 - fed));
    return state(w);
  };
  const oneX = await run(1 / 360);
  assert.equal(await run(10 / 360), oneX);
  assert.equal(await run(0.05), oneX);
});

test('a game saved mid-battle continues exactly as if it had not been saved', async () => {
  const a = await raidWorld({ strength: 20, guards: 6, palisades: [[1, -2]] });
  for (let i = 0; i < 14; i++) advanceWorld(a, 0.025);
  assert.ok(a.frontier.battle, 'the fight is under way');
  const b = await readIslandText(serializeWorld(a));
  assert.deepEqual(b.frontier.battle.raiders, a.frontier.battle.raiders, 'every raider is saved');
  for (const w of [a, b]) fight(w);
  assert.equal(state(b), state(a));
});

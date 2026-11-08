// Milestone 4: production chains and needs tiers. Nothing new is saved; everything is worked out from buildings.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { production, worldStats } from '../src/economy/production.js';
import { houseNeeds } from '../src/economy/needs.js';
import { serializeWorld } from '../src/persistence/save.js';
import { loadFixtureWorld } from './helpers.js';

let base;
/** The fixture island with its buildings replaced by `list` ([kind, dx, dy] around the haven). */
async function island(list) {
  base ??= await loadFixtureWorld();
  const w = structuredClone(base);
  w.wallet = { gold: 900, food: 500, timber: 500, stone: 500 };
  w.buildings = list.map(([kind, dx, dy], i) => ({
    id: 60000 + i,
    kind,
    x: 192.5 + dx,
    y: 160.5 + dy,
    progress: 0,
    buildProgress: 1,
    stored: 0,
    orientation: 0,
  }));
  w.placements++;
  return w;
}
const rateOf = (w, kind) => production(w, w.buildings.find((b) => b.kind === kind)).rate;

test('a bakery bakes at half rate without barley nearby, fully with a farm, and more with a mill', async () => {
  const alone = rateOf(await island([['bakery', 0, 0]]), 'bakery');
  const farm = rateOf(await island([['bakery', 0, 0], ['farm', 5, 0]]), 'bakery');
  const far = rateOf(await island([['bakery', 0, 0], ['farm', 12, 0]]), 'bakery');
  const mill = rateOf(await island([['bakery', 0, 0], ['farm', 5, 0], ['windmill', 0, 9]]), 'bakery');
  assert.ok(alone > 0);
  assert.ok(Math.abs(farm / alone - 2) < 1e-9, `${farm} vs ${alone}`);
  assert.equal(far, alone, 'a farm 12 tiles away does not supply it');
  assert.ok(Math.abs(mill / farm - 1.3) < 1e-9);
  const w = await island([['bakery', 0, 0]]);
  assert.match(production(w, w.buildings[0]).reason, /Half rate · no barley supplier/);
});

test('a supplied smithy makes tools, which raise farm output by 15%', async () => {
  const plain = rateOf(await island([['farm', 0, 0]]), 'farm');
  const unsupplied = rateOf(await island([['farm', 0, 0], ['smithy', 6, 6]]), 'farm');
  const tools = rateOf(await island([['farm', 0, 0], ['smithy', 6, 6], ['quarry', 10, 6]]), 'farm');
  assert.ok(plain > 0);
  assert.equal(unsupplied, plain, 'a smithy with no quarry nearby makes no tools');
  assert.ok(Math.abs(tools / plain - 1.15) < 1e-9);
});

test('a supplied boatbuilders’ yard gives boats, which raise fishing by 20%', async () => {
  const w0 = await island([['fishery', 0, 0]]);
  const w1 = await island([['fishery', 0, 0], ['shipyard', 6, 0], ['sawmill', 10, 0]]);
  const a = production(w0, w0.buildings[0]).rate,
    b = production(w1, w1.buildings[0]).rate;
  if (a > 0) assert.ok(Math.abs(b / a - 1.2) < 1e-9, `${b} vs ${a}`);
  else assert.equal(b, 0);
});

test('longhouses rise through three needs tiers, with more residents and rent', async () => {
  const one = await island([['cottage', 0, 0], ['farm', 5, 0]]);
  const two = await island([['cottage', 0, 0], ['farm', 5, 0], ['garden', -4, 2]]);
  const three = await island([['cottage', 0, 0], ['farm', 5, 0], ['garden', -4, 2], ['chapel', 0, 6], ['market', -6, -3]]);
  const tierOf = (w) => houseNeeds(w, w.buildings[0]).tier;
  assert.deepEqual([tierOf(one), tierOf(two), tierOf(three)], [1, 2, 3]);
  assert.deepEqual([one, two, three].map((w) => worldStats(w).capacity), [4, 5, 6]);
  assert.deepEqual(
    [one, two, three].map((w) => production(w, w.buildings[0]).rate.toFixed(1)),
    ['0.8', '1.6', '2.6'],
  );
});

test('chains and tiers add nothing to the save', async () => {
  const w = await island([['cottage', 0, 0], ['farm', 5, 0], ['garden', -4, 2], ['bakery', 3, 3]]);
  const before = serializeWorld(w);
  for (const b of w.buildings) production(w, b);
  worldStats(w);
  assert.equal(serializeWorld(w), before);
});

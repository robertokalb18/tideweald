// Milestone 6: fog and discoveries.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceWorld } from '../src/core/simulation.js';
import { placementPreview } from '../src/progression/campaign.js';
import { readIslandText, serializeWorld } from '../src/persistence/save.js';
import { createWorld } from '../src/world/world.js';
import { isExplored, planSites } from '../src/world/fog.js';
import { loadFixtureWorld } from './helpers.js';

let base;
const charted = async () => {
  base ??= await loadFixtureWorld();
  const w = structuredClone(base);
  w.buildings = [];
  w.placements++;
  w.sight = [[192.5, 163.5, 34]];
  return w;
};

test('only a new campaign starts under fog', async () => {
  assert.ok(Array.isArray(createWorld('campaign').sight));
  assert.equal(createWorld('sandbox').sight, undefined);
  const old = await loadFixtureWorld();
  assert.equal(old.sight, undefined, 'v16.11 saves have no fog');
  assert.ok(isExplored(old, 5, 5));
});

test('sites are spread over uncharted dry land and fixed by the island', async () => {
  const w = await charted();
  const a = planSites(w);
  assert.equal(a.length, 12);
  assert.deepEqual(planSites(w), a);
  for (const s of a) {
    const c = w.cells[Math.floor(s.y) * 384 + Math.floor(s.x)];
    assert.ok(c.land && !c.pond && !c.rock);
    assert.ok(!isExplored(w, s.x, s.y), 'beyond the first charted ring');
  }
});

test('a watchtower charts the land around it and pays out discoveries once', async () => {
  const w = await charted();
  advanceWorld(w, 0.05);
  const site = w.sites[0];
  assert.equal(site.found, false);
  assert.equal(placementPreview(w, 'farm', site.x, site.y).ok, false, 'no building on uncharted land');
  assert.match(placementPreview(w, 'farm', site.x, site.y).reason, /Uncharted/);
  const before = { ...w.wallet };
  w.buildings.push({ id: 70001, kind: 'watchtower', x: site.x + 4, y: site.y, progress: 0, buildProgress: 1, stored: 0, orientation: 0 });
  w.placements++;
  advanceWorld(w, 0.05);
  assert.ok(isExplored(w, site.x, site.y));
  assert.equal(site.found, true);
  assert.match(w.story.events.at(-1).title, /^Discovered: /);
  const gained = ['gold', 'food', 'timber', 'stone'].reduce((s, k) => s + Math.max(0, Math.round(w.wallet[k] - before[k])), 0);
  assert.ok(gained > 0 || site.kind === 'runestone');
  const finds = () => w.story.events.filter((e) => e.title.startsWith('Discovered')).length;
  const once = finds();
  w.placements++;
  advanceWorld(w, 0.05);
  assert.equal(finds(), once, 'a discovery pays out only once');
  const back = await readIslandText(serializeWorld(w));
  assert.deepEqual(back.sight, w.sight);
  assert.deepEqual(back.sites, w.sites);
});

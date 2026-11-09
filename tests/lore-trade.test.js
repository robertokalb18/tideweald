// Milestone 6 (lore) and Milestone 7 (voyages, the Red Sail jarl).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceWorld } from '../src/core/simulation.js';
import { production } from '../src/economy/production.js';
import { sendVoyage, voyageStatus } from '../src/economy/voyages.js';
import { payTribute, rivalFactor, sendLongships, stepRival } from '../src/military/rival.js';
import { LORE, learnLore, loreStatus } from '../src/progression/lore.js';
import { readIslandText, serializeWorld } from '../src/persistence/save.js';
import { loadFixtureWorld } from './helpers.js';

let base;
async function island(list = [], wallet = { gold: 5000, food: 2000, timber: 2000, stone: 2000 }) {
  base ??= await loadFixtureWorld();
  const w = structuredClone(base);
  w.wallet = { ...wallet };
  w.buildings = list.map(([kind, dx, dy], i) => ({
    id: 61000 + i, kind, x: 192.5 + dx, y: 160.5 + dy, progress: 0, buildProgress: 1, stored: 0, orientation: 0,
  }));
  w.placements++;
  return w;
}

test('twelve crafts in three tiers; prerequisites, buildings and costs are enforced', async () => {
  assert.equal(LORE.length, 12);
  const w = await island([['farm', 0, 0]]);
  assert.equal(loreStatus(w, 'smoke').ok, false, 'tier II needs two tier I crafts');
  assert.match(loreStatus(w, 'clinker').reason, /fishery/);
  const gold = w.wallet.gold;
  assert.ok(learnLore(w, 'ard').ok);
  assert.equal(w.wallet.gold, gold - 150);
  assert.equal(learnLore(w, 'ard').ok, false, 'learned once');
  assert.equal(w.story.events.at(-1).title, 'Learned: Iron-shod ard');
});

test('the iron-shod ard raises farms by 15%, and lore survives a save', async () => {
  const w = await island([['farm', 0, 0]]);
  const before = production(w, w.buildings[0]).rate;
  learnLore(w, 'ard');
  assert.ok(Math.abs(production(w, w.buildings[0]).rate / before - 1.15) < 1e-9);
  const back = await readIslandText(serializeWorld(w));
  assert.deepEqual(back.story.lore, ['ard']);
});

test('a knarr sails with its cargo and comes home with silver, inside the simulation', async () => {
  const w = await island([['harbor', 0, 0], ['shipyard', 6, 0]]);
  assert.match(voyageStatus(w, 'iceland').reason, /Knarr/);
  w.story.lore = ['knarr'];
  const t0 = w.wallet.timber,
    g0 = w.wallet.gold;
  assert.ok(sendVoyage(w, 'iceland').ok);
  assert.equal(w.wallet.timber, t0 - 100);
  assert.equal(voyageStatus(w, 'norway').ok, false, 'one knarr per harbor');
  for (let d = 0; d < 11; d++) advanceWorld(w, 1);
  assert.equal(w.story.voyages.length, 1, 'still at sea');
  advanceWorld(w, 1.5);
  assert.equal(w.story.voyages.length, 0);
  assert.ok(w.wallet.gold >= g0 + 260 - 1, `${w.wallet.gold} vs ${g0}`);
  assert.match(w.story.events.map((e) => e.title).join('|'), /knarr is home from Eyrar/);
});

test('the jarl grows on schedule, tribute buys peace, and longships can break him', async () => {
  const w = await island([['shipyard', 0, 0]]);
  Object.assign(w.story, { mode: 'campaign', started: true, settled: true });
  w.frontier.resolved = 2;
  stepRival(w);
  const r = w.frontier.rival;
  assert.equal(r.strength, 20);
  w.time += 10;
  stepRival(w);
  assert.ok(r.strength > 20, 'he gathers ships every ten days');
  assert.ok(rivalFactor(w) > 0.85);
  assert.ok(payTribute(w).ok);
  assert.equal(payTribute(w).ok, false, 'already at peace');
  w.frontier.garrison = 12;
  w.story.lore = ['knarr'];
  assert.ok(sendLongships(w, true, true, false).ok);
  assert.equal(w.frontier.garrison, 6, 'half the guards sail');
  const s0 = r.strength;
  w.time += 6;
  stepRival(w);
  assert.equal(r.expedition, undefined);
  assert.ok(r.strength < s0, 'a strong strike breaks his strength');
  assert.ok(w.frontier.garrison >= 10);
  const back = await readIslandText(serializeWorld(w));
  assert.deepEqual(back.frontier.rival, w.frontier.rival);
});

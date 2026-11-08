// Milestone 5: pacing, the covenant finale and free-build rules.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceWorld } from '../src/core/simulation.js';
import { CHAPTERS, covenantFinale, openFreeBuild } from '../src/progression/campaign.js';
import { readIslandText, serializeWorld } from '../src/persistence/save.js';
import { loadFixtureWorld, seededRandom } from './helpers.js';

let base;
const fresh = async () => {
  Math.random = seededRandom(5);
  base ??= await loadFixtureWorld();
  return structuredClone(base);
};

test('the covenant finale records the saga, and the island can carry on in free build', async () => {
  const w = await fresh();
  Object.assign(w.story, { mode: 'campaign', started: true, settled: true, chapter: CHAPTERS.length, population: 300 });
  w.frontier.raidsRepelled = 9;
  assert.equal(openFreeBuild(w), false, 'not before the finale');
  covenantFinale(w);
  assert.equal(w.story.finale.raids, 9);
  assert.equal(w.story.finale.population, 300);
  assert.equal(w.story.events.at(-1).title, 'The covenant holds');
  assert.equal(openFreeBuild(w), true);
  assert.equal(w.story.mode, 'sandbox');
  assert.deepEqual(w.story.rules, { threats: true, upkeep: true });
  const back = await readIslandText(serializeWorld(w));
  assert.deepEqual(back.story.finale, w.story.finale, 'the record survives a save');
  assert.deepEqual(back.story.rules, w.story.rules);
});

test('free build is peaceful by default, and its rules switch on threats and upkeep', async () => {
  const run = async (rules) => {
    const w = await fresh();
    w.story.rules = rules;
    for (let d = 0; d < 14; d++) advanceWorld(w, 1);
    return w.frontier;
  };
  const calm = await run(undefined);
  assert.equal(calm.eventNumber, 0);
  assert.equal(calm.upkeep.gold, 0);
  const threats = await run({ threats: true, upkeep: false });
  assert.ok(threats.eventNumber >= 1, 'a threat was sighted');
  assert.equal(threats.upkeep.gold, 0);
  const upkeep = await run({ threats: false, upkeep: true });
  assert.equal(upkeep.eventNumber, 0);
  assert.ok(upkeep.upkeep.gold > 0, 'buildings cost upkeep');
});

test('saves from before Milestone 5 load with free build rules off', async () => {
  const w = await fresh();
  assert.equal(w.story.rules, undefined);
  assert.equal(w.story.finale, undefined);
});

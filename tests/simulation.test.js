import { test } from 'node:test';
import assert from 'node:assert/strict';
import { advanceWorld, STEP_DAYS } from '../src/core/simulation.js';
import { serializeWorld } from '../src/persistence/save.js';
import { loadFixtureWorld, seededRandom } from './helpers.js';

// Advance a copy of the fixture island by `days`, fed in chunks of `chunk` days.
async function run(days, chunk) {
  Math.random = seededRandom(7);
  const w = await loadFixtureWorld();
  w.story.started = true;
  for (let fed = 0; fed < days - 1e-9; fed += chunk) advanceWorld(w, Math.min(chunk, days - fed));
  // \`revision\` counts calls for redraw invalidation only, so it is left out of the comparison.
  const { revision, ...state } = JSON.parse(serializeWorld(w)).world;
  return JSON.stringify(state);
}

test('game speed does not change the result (1x, 10x, skip ahead)', async () => {
  const days = 2;
  const oneX = await run(days, 1 / 360); // one 250 ms tick at 1x
  const tenX = await run(days, 10 / 360); // one tick at 10x
  const skip = await run(days, 0.05); // the skip-ahead step
  assert.equal(tenX, oneX);
  assert.equal(skip, oneX);
});

test('time advances in whole fixed steps', async () => {
  Math.random = seededRandom(3);
  const w = await loadFixtureWorld();
  w.story.started = true;
  const t0 = w.time;
  advanceWorld(w, STEP_DAYS * 0.6);
  assert.equal(w.time, t0, 'a partial step waits');
  advanceWorld(w, STEP_DAYS * 0.6);
  assert.ok(Math.abs(w.time - t0 - STEP_DAYS) < 1e-9, 'the carried remainder completes one step');
});

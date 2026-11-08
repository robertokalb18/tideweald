// Builds small campaign islands for raid tests and balance runs.
import { loadFixtureWorld, seededRandom } from './helpers.js';
import { advanceWorld } from '../src/core/simulation.js';

let base; // the fixture island, loaded once and copied for each scenario

/**
 * A campaign island (the fixture's terrain, its buildings cleared) with a storehouse at `stores`,
 * plus the given defenses, garrison and formation, and a raid of `strength` due at once.
 * Positions are [dx, dy] offsets from the stores.
 */
export async function raidWorld({
  stores = [192.5, 160.5],
  halls = [[-3, -3]],
  towers = [],
  palisades = [],
  guards = 0,
  formation = 'patrol',
  strength = 20,
  id = 1,
  wallet = { gold: 600, food: 400, timber: 200, stone: 100 },
} = {}) {
  Math.random = seededRandom(11);
  base ??= await loadFixtureWorld();
  const w = structuredClone(base);
  Object.assign(w.story, { mode: 'campaign', started: true, settled: true });
  w.wallet = { ...wallet };
  let nextId = 50000;
  const put = (kind, [dx, dy]) =>
    w.buildings.push({
      id: nextId++,
      kind,
      x: stores[0] + dx,
      y: stores[1] + dy,
      progress: 0,
      buildProgress: 1,
      stored: 0,
      orientation: 0,
    });
  w.buildings = [];
  put('storehouse', [0, 0]);
  for (const h of guards ? halls : []) put('guardhall', h);
  for (const t of towers) put('watchtower', t);
  for (const p of palisades) put('palisade', p);
  w.placements++;
  const day = Math.floor(w.time + 1e-8) + 1;
  Object.assign(w.frontier, {
    initialized: true,
    lastDay: day,
    nextEventDay: day + 50,
    garrison: guards,
    formation,
    pending: { id, kind: 'raid', dueDay: day, strength, title: 'Red Sail raiders' },
  });
  return w;
}

/** Advances until the raid is settled (or `maxDays`). Returns the report and the days it took. */
export function fight(w, maxDays = 3, chunk = 0.05) {
  const t0 = w.time;
  while (w.frontier.pending && w.time - t0 < maxDays) advanceWorld(w, chunk);
  return { report: w.frontier.lastReport, days: w.time - t0 };
}

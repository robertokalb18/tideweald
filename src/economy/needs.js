// Milestone 4: needs tiers. A longhouse rises a tier when its household's needs are met nearby, and shows it:
//   1 Shelter       — any finished longhouse: 4 residents, 0.8 gold/day.
//   2 Varied food   — at least two kinds of food producer within 8 tiles: 5 residents, 1.6 gold/day,
//                     a woodpile by the door.
//   3 Hof and market — tier 2, plus a hof and a trading place within 8 tiles: 6 residents, 2.6 gold/day,
//                     a carved gable pole with a pennant.
// A well within 6 tiles adds 0.2 gold/day at any tier. Worked out from the buildings, not saved.
import { nearby } from './chains.js';

const built = (b) => b.buildProgress >= 1 - 1e-8;
export const NEED_RANGE = 8;
export const FOOD_KINDS = ['farm', 'fishery', 'pier', 'bakery', 'smokehouse', 'garden', 'apiary', 'hunterlodge', 'herbalist'];
export const TIERS = [
  null,
  { name: 'Shelter', residents: 4, rent: 0.8 },
  { name: 'Varied food', residents: 5, rent: 1.6 },
  { name: 'Hof and market', residents: 6, rent: 2.6 },
];

const cache = new WeakMap();
/** { tier, foods, hof, market, well } for a longhouse. */
export function houseNeeds(world, b) {
  if (b.kind !== 'cottage' || !built(b)) return { tier: 0, foods: 0, hof: false, market: false, well: false };
  let n = 0;
  for (const o of world.buildings) built(o) && n++;
  const key = `${world.placements}|${world.buildings.length}|${n}`;
  let c = cache.get(world);
  if (c?.key !== key) cache.set(world, (c = { key, map: new Map() }));
  let r = c.map.get(b.id);
  if (r) return r;
  const foods = new Set(nearby(world, b, FOOD_KINDS, NEED_RANGE).map((o) => o.kind)).size,
    hof = nearby(world, b, ['chapel'], NEED_RANGE).length > 0,
    market = nearby(world, b, ['market'], NEED_RANGE).length > 0,
    well = nearby(world, b, ['well'], 6).length > 0,
    tier = foods >= 2 ? (hof && market ? 3 : 2) : 1;
  r = { tier, foods, hof, market, well };
  c.map.set(b.id, r);
  return r;
}

export const houseRent = (world, b) => {
  const n = houseNeeds(world, b);
  return n.tier ? TIERS[n.tier].rent + (n.well ? 0.2 : 0) : 0;
};
export const houseResidents = (world, b) => TIERS[houseNeeds(world, b).tier]?.residents ?? 0;

/** What the household still needs, for the building panel. */
export function nextNeed(world, b) {
  const n = houseNeeds(world, b);
  if (n.tier === 1) return `two kinds of food within ${NEED_RANGE} tiles (${n.foods} now)`;
  if (n.tier === 2)
    return [!n.hof && 'a hof', !n.market && 'a trading place'].filter(Boolean).join(' and ') + ` within ${NEED_RANGE} tiles`;
  return '';
}

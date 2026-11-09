// The v14 test suites (TypeScript, written against lib/*.ts) import names from one flat library.
// This shim maps those names onto the rebuilt modules so the suites can run against the current game.
export * from '../../src/world/world.js';
export * from '../../src/world/catalog.js';
export * from '../../src/settlement/tools.js';
export * from '../../src/settlement/bridges.js';
export * from '../../src/economy/production.js';
export * from '../../src/progression/campaign.js';
export * from '../../src/military/frontier.js';
export * from '../../src/world/seasons.js';
export * from '../../src/persistence/save.js';
export * from '../../src/persistence/compression.js';
export { advanceWorld } from '../../src/core/simulation.js';
export { animalPose, militaryActors, raidLocation, rotateBuilding } from '../../src/world/actors.js';
export { contourRings } from '../../src/render/textures.js';
export { villageWalkers } from '../../src/render/roads-villagers.js';
export { settlementLedger } from '../../src/ui/frontier-panel.js';
export { Kn as SpatialIndex } from '../../src/world/spatial-index.js';
import { CATALOG, CATALOG_ITEMS, GRID_H, GRID_W, HAVEN, hf } from '../../src/world/catalog.js';
export const ITEMS = CATALOG_ITEMS;
export const ITEM_BY_ID = CATALOG;
export const COLS = GRID_W;
export const ROWS = GRID_H;
export const START = HAVEN;
export const LANDMARKS = hf;
import { BUILDING_SIZES } from '../../src/world/catalog.js';
import { WORKSHOPS } from '../../src/economy/workshops.js';
import { militaryActors } from '../../src/world/actors.js';
export const BUILDING_SCALE = BUILDING_SIZES;
import { Ia } from '../../src/world/catalog.js';
export const BUILD_DAYS = Ia;
// v14 had a demo gold pack; it was removed before v16.11 (no purchases, real or pretend). The test using it is skipped.
export const claimDemoPack = () => {
  throw new Error('removed before v16.11');
};
// v14's army.ts listed idle soldiers; v16 draws them through militaryActors.
export const armyUnits = (w) => militaryActors(w, 0, true).filter((a) => !a.enemy);

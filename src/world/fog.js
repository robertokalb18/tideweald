// Milestone 6: fog and discoveries. A new campaign island starts charted only around the haven. Buildings and
// road tiles chart the land around them (watchtowers and beacons much further), and twelve discoveries wait in
// the uncharted land. Charted land is saved as circles (`world.sight`); an island without `sight` (every save
// from before v16.17, and free build) has no fog at all.
// Runs inside step() via revealStep; deterministic; imports only the grid leaf module.
import { GRID_H, GRID_W, HAVEN } from './grid.js';

export const START_SIGHT = 34;
export const SIGHT = { watchtower: 18, beacon: 22, lighthouse: 16, guardhall: 12, harbor: 12, road: 5 };
const SIGHT_DEFAULT = 9;
const MAX_CIRCLES = 4000;
const built = (b) => b.buildProgress >= 1 - 1e-8;

export const SITE_KINDS = {
  hoard: { name: 'Silver hoard', reward: { gold: 150 }, text: 'Under a mossy cairn lies a buried hoard of hack-silver and arm rings.' },
  shieling: { name: 'Old shieling', reward: { stone: 40, timber: 20 }, text: 'Turf walls of a summer shieling: someone grazed cattle here long before us. Its stones are ours now.' },
  cove: { name: 'Seal cove', reward: { food: 80 }, text: 'A sheltered cove full of seals and spawning fish.' },
  bogiron: { name: 'Bog-iron seam', reward: { stone: 60 }, text: 'Rust-red water in the mire: bog iron, and good stone around it.' },
  runestone: { name: 'Rune stone', reward: { morale: 10 }, text: 'A rune stone raised by travellers before us. The settlers take heart.' },
  driftwood: { name: 'Driftwood beach', reward: { timber: 70 }, text: 'A beach piled with driftwood from far shores, dry enough to build with.' },
};
const ORDER = ['hoard', 'shieling', 'cove', 'bogiron', 'runestone', 'driftwood'];

const caches = new WeakMap();
function cacheOf(w) {
  let c = caches.get(w);
  if (!c || c.sight !== w.sight) caches.set(w, (c = { sight: w.sight, n: -1, map: null, keys: null }));
  return c;
}

/** One byte per cell: 1 when charted. Rebuilt when circles are added. */
export function exploredMap(w) {
  if (!w.sight) return null;
  const c = cacheOf(w);
  if (c.n === w.sight.length) return c.map;
  const map = c.map && c.n >= 0 && c.n < w.sight.length ? c.map : new Uint8Array(GRID_W * GRID_H);
  for (let i = map === c.map ? c.n : 0; i < w.sight.length; i++) {
    const [x, y, r] = w.sight[i];
    for (let cy = Math.max(0, Math.floor(y - r)); cy <= Math.min(GRID_H - 1, Math.ceil(y + r)); cy++)
      for (let cx = Math.max(0, Math.floor(x - r)); cx <= Math.min(GRID_W - 1, Math.ceil(x + r)); cx++)
        (cx + 0.5 - x) ** 2 + (cy + 0.5 - y) ** 2 <= r * r && (map[cy * GRID_W + cx] = 1);
  }
  c.map = map;
  c.n = w.sight.length;
  return map;
}
export const isExplored = (w, x, y) => {
  const m = exploredMap(w);
  if (!m) return true;
  const cx = Math.floor(x),
    cy = Math.floor(y);
  return cx >= 0 && cy >= 0 && cx < GRID_W && cy < GRID_H && m[cy * GRID_W + cx] === 1;
};

function hash(a, b, s) {
  let h = Math.imul((a | 0) * 374761393 + (b | 0) * 668265263 + (s | 0) * 2246822519, 1274126177);
  h ^= h >>> 13;
  h = Math.imul(h, 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function seedOf(w) {
  let s = 2166136261;
  for (const ch of String(w.islandId ?? 'tw')) s = Math.imul(s ^ ch.charCodeAt(0), 16777619);
  return s >>> 0;
}

/** Twelve discovery sites on dry land beyond the first charted ring, spread out. Decided once and saved. */
export function planSites(w) {
  const seed = seedOf(w),
    cand = [];
  for (let by = 0; by < GRID_H; by += 16)
    for (let bx = 0; bx < GRID_W; bx += 16) {
      const x = bx + Math.floor(hash(bx, by, seed) * 16),
        y = by + Math.floor(hash(by, bx, seed + 1) * 16),
        c = w.cells[y * GRID_W + x];
      if (!c || !c.land || c.pond || c.rock || c.elevation > 12) continue;
      const d = Math.hypot(x + 0.5 - HAVEN.x, y + 0.5 - HAVEN.y);
      if (d < START_SIGHT + 6) continue;
      cand.push({ x: x + 0.5, y: y + 0.5, h: hash(x, y, seed + 2) });
    }
  cand.sort((a, b) => b.h - a.h);
  const sites = [];
  for (const p of cand) {
    if (sites.length >= 12) break;
    if (sites.some((s) => Math.hypot(s.x - p.x, s.y - p.y) < 24)) continue;
    sites.push({ id: sites.length + 1, kind: ORDER[sites.length % ORDER.length], x: p.x, y: p.y, found: false });
  }
  return sites;
}

/**
 * Called from step(): charts the land around buildings and road tiles, and pays out discoveries that have just
 * been charted. `found(site)` is told about each new discovery (for the journal). Returns true if anything changed.
 */
export function revealStep(w, found) {
  if (!w.sight) return false;
  const c = cacheOf(w);
  let built_ = 0;
  for (const b of w.buildings) built(b) && built_++;
  const key = `${w.placements}|${w.buildings.length}|${built_}`;
  if (c.revealKey === key && w.sites) return false;
  c.revealKey = key;
  if (!c.keys) c.keys = new Set(w.sight.map(([x, y, r]) => `${x},${y},${r}`));
  const add = (x, y, r) => {
    const k = `${x},${y},${r}`;
    if (c.keys.has(k) || w.sight.length >= MAX_CIRCLES) return;
    c.keys.add(k);
    w.sight.push([x, y, r]);
  };
  for (const b of w.buildings) if (built(b)) add(b.x, b.y, SIGHT[b.kind] ?? SIGHT_DEFAULT);
  for (const cell of w.cells) cell.road && add(cell.x + 0.5, cell.y + 0.5, SIGHT.road);
  w.sites ??= planSites(w);
  const map = exploredMap(w);
  let changed = false;
  for (const s of w.sites) {
    if (s.found || map[Math.floor(s.y) * GRID_W + Math.floor(s.x)] !== 1) continue;
    s.found = true;
    changed = true;
    const r = SITE_KINDS[s.kind].reward;
    for (const k of ['gold', 'food', 'timber', 'stone']) r[k] && (w.wallet[k] += r[k]);
    r.morale && w.frontier && (w.frontier.morale = Math.min(100, w.frontier.morale + r.morale));
    found?.(s);
  }
  return changed;
}

export const siteReward = (kind) =>
  Object.entries(SITE_KINDS[kind].reward)
    .map(([k, v]) => (k === 'morale' ? `+${v} morale` : `+${v} ${k}`))
    .join(', ');

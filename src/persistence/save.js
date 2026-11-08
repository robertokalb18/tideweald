// Recovered from the Tideweald v16.11 build. Module: persistence/save
import { decodeStoredSave } from './compression.js';
import { diagnostics } from '../core/diagnostics.js';
import { z } from '../vendor/zod.js';
import {
  CATALOG_ITEMS,
  GRID_H,
  GRID_W,
  MAP_LIMIT,
  MAX_POPULATION,
  isBuildingItem,
  wn,
} from '../world/catalog.js';
import { Rp } from '../world/spatial-index.js';
import { createWorld } from '../world/world.js';

var gt = z.number().finite().min(0).max(1e12),
  Qi = z.number().finite().min(0).max(1),
  xe = gt.int(),
  $7 = z.number().finite().min(0).max(GRID_W),
  V7 = z.number().finite().min(0).max(GRID_H),
  Ds = { x: $7, y: V7 },
  Ji = z.object({ gold: gt, food: gt, timber: gt, stone: gt }),
  known = (e) =>
    z
      .string()
      .refine((t) =>
        CATALOG_ITEMS.some((a) => a.id === t && (e === 'buildings' ? isBuildingItem(a) : a.category === e)),
      ),
  I7 = z.enum(['raid', 'flood', 'wildfire', 'gale', 'blizzard']),
  _C = z
    .object({
      formation: z.enum(['patrol', 'line', 'column']).optional(),
      initialized: z.boolean().default(!1),
      lastDay: xe.default(0),
      nextEventDay: xe.default(0),
      eventNumber: xe.default(0),
      garrison: xe.max(18).default(0),
      training: xe.max(36).default(0),
      trainingReady: gt.default(0),
      trainingQueue: z.array(gt).max(18).optional(),
      lastReliefDay: xe.default(0),
      morale: gt.min(50).max(100).default(100),
      raidsRepelled: xe.default(0),
      resolved: xe.default(0),
      winters: xe.default(0),
      spoiledFood: gt.default(0),
      losses: Ji.default({ gold: 0, food: 0, timber: 0, stone: 0 }),
      upkeep: Ji.default({ gold: 0, food: 0, timber: 0, stone: 0 }),
      pending: z
        .object({ id: xe, kind: I7, dueDay: xe, strength: xe.min(1).max(1e4), title: z.string().max(200) })
        .optional(),
      lastReport: z
        .object({ day: xe, kind: I7, title: z.string().max(200), text: z.string().max(1e3), losses: Ji })
        .optional(),
      lastShortageDay: xe.optional(),
      scripted: z
        .object({ title: z.string().max(120), factor: z.number().finite().min(0.5).max(2) })
        .optional(),
    })
    .default({}),
  OC = z.object({
    id: xe,
    kind: z.enum(['deliver', 'build', 'wildlife', 'plant']),
    target: z.string().max(40),
    amount: xe,
    base: xe,
    issued: xe,
    due: xe,
    reward: xe,
    patron: z.string().max(120),
    title: z.string().max(160),
  }),
  LC = new Set(['pond', 'river', 'ocean']),
  BC = new Set(['path', 'road', 'paved']),
  eo = (e) => typeof e == 'number' && e >= 0 && e <= 1;
function validCells(e) {
  if (!Array.isArray(e) || e.length !== GRID_W * GRID_H) return !1;
  for (let t = 0; t < e.length; t++) {
    let a = e[t];
    if (
      !a ||
      a.x !== t % GRID_W ||
      a.y !== Math.floor(t / GRID_W) ||
      typeof a.land != 'boolean' ||
      typeof a.pond != 'boolean' ||
      typeof a.rock != 'boolean' ||
      !eo(a.soil) ||
      !eo(a.moisture) ||
      !eo(a.toxicity) ||
      !eo(a.radiation) ||
      !eo(a.oil) ||
      !eo(a.fuel) ||
      !eo(a.snow) ||
      !eo(a.fire) ||
      !eo(a.texture) ||
      typeof a.elevation != 'number' ||
      !(a.elevation >= 0 && a.elevation <= 100) ||
      (a.waterType !== null && !LC.has(a.waterType)) ||
      (a.road !== !1 && !BC.has(a.road))
    )
      return !1;
  }
  return !0;
}
var SaveSchema = z.object({
  islandId: z.string().max(64).optional(),
  saveTag: z.string().max(64).optional(),
  market: z.object({ food: gt, timber: gt, stone: gt }).optional(),
  orders: z
    .object({ list: z.array(OC).max(6), streak: xe, done: xe, nextId: xe, lastDay: xe, expired: xe })
    .optional(),
  folio: z.array(z.string().max(40)).max(400).optional(),
  bridges: z
    .array(
      z
        .object({
          id: xe,
          kind: z.enum(['timber_bridge', 'stone_bridge']),
          x: xe.max(GRID_W - 1),
          y: xe.max(GRID_H - 1),
          length: xe.min(3).max(14),
          orientation: z.union([z.literal(0), z.literal(1)]),
          buildProgress: Qi,
        })
        .refine((e) => (e.orientation ? e.y + e.length <= GRID_H : e.x + e.length <= GRID_W)),
    )
    .max(128)
    .optional(),
  terrainRevision: xe.optional(),
  frontier: _C,
  revision: xe,
  autoCollect: z.boolean(),
  wallet: Ji,
  orchardFood: gt,
  earned: gt,
  spent: gt,
  demoGold: gt,
  time: gt,
  weather: z.enum(['sun', 'rain', 'storm', 'snow', 'drought']),
  autoWeather: z.boolean(),
  nextWeather: gt,
  seed: xe,
  nextId: xe,
  message: z.string().max(1e3),
  noticeId: xe,
  placements: xe,
  cells: z.custom(validCells, { message: 'Invalid island map' }),
  buildings: z
    .array(
      z.object({
        id: xe,
        kind: known('buildings'),
        ...Ds,
        progress: Qi,
        buildProgress: Qi,
        stored: gt,
        orientation: z.union([z.literal(0), z.literal(1)]).optional(),
      }),
    )
    .max(MAX_POPULATION),
  plants: z
    .array(
      z.object({
        id: xe,
        kind: z
          .string()
          .transform((e) => Rp[e] ?? e)
          .pipe(known('plants')),
        ...Ds,
        growth: Qi,
        health: Qi,
        age: gt,
        variant: Qi,
      }),
    )
    .max(MAP_LIMIT),
  animals: z
    .array(
      z.object({
        id: xe,
        kind: known('animals'),
        ...Ds,
        tx: $7,
        ty: V7,
        age: gt,
        health: Qi,
        direction: z.union([z.literal(-1), z.literal(1)]),
        cooldown: z.number().finite().min(-10).max(10),
      }),
    )
    .max(wn),
  objects: z.array(z.object({ id: xe, kind: z.enum(['nuclear', 'trash']), ...Ds })).max(150),
  features: z
    .array(z.object({ id: xe, kind: z.enum(['mountain', 'snowpeak', 'hill']), ...Ds }))
    .max(GRID_W * GRID_H),
  story: z.object({
    mode: z.enum(['campaign', 'sandbox']),
    started: z.boolean(),
    chapter: xe.max(1e4),
    completed: z.array(xe).max(1e4),
    collected: Ji,
    reserves: Ji,
    convoyDay: xe,
    missed: xe,
    settled: z.boolean(),
    events: z.array(z.object({ day: xe, title: z.string().max(200), text: z.string().max(1e3) })).max(60),
    lastSeason: z.string().max(40),
    levelStarted: gt,
    population: xe.max(480),
    tradeGold: gt,
    chapterTrade: gt.optional(),
    chapterCollected: Ji.optional(),
    chapterEvents: xe.optional(),
    chapterRaids: xe.optional(),
    incident: z.object(Ds).optional(),
    decisions: z
      .array(z.object({ id: z.string().max(40), choice: z.enum(['a', 'b']), day: xe }))
      .max(40)
      .optional(),
    dawn: z
      .array(z.object({ food: gt, timber: gt, stone: gt }))
      .max(8)
      .optional(),
    ledgerDay: xe.optional(),
  }),
});
function parseWithRepair(e) {
  let t = SaveSchema.safeParse(e);
  if (t.success) return t.data;
  let a = { ...e };
  delete a.orders;
  let n = (o) => (l) =>
    CATALOG_ITEMS.some(
      (s) => s.id === (Rp[l.kind] ?? l.kind) && (o === 'buildings' ? isBuildingItem(s) : s.category === o),
    );
  (Array.isArray(a.plants) && (a.plants = a.plants.filter(n('plants'))),
    Array.isArray(a.animals) && (a.animals = a.animals.filter(n('animals'))),
    Array.isArray(a.buildings) && (a.buildings = a.buildings.filter(n('buildings'))));
  let r = SaveSchema.safeParse(a);
  if (r.success) return r.data;
  throw t.error;
}
function parseSavedWorld(e) {
  let t = e;
  if (Array.isArray(t?.cells) && (t.cells.length === 3808 || t.cells.length === 15232)) {
    let n = t.cells.length === 3808 ? 68 : 136,
      r = n === 68 ? 56 : 112,
      o = n === 68 ? 158 : 124,
      l = n === 68 ? 132 : 104;
    if (!t.cells.every((g, v) => g.x === v % n && g.y === Math.floor(v / n)))
      throw Error('Invalid legacy grid');
    let s = createWorld(t.story?.mode ?? 'campaign'),
      c = (g) => ({ ...g, x: g.x + o, y: g.y + l });
    for (let g of t.cells) {
      let v = c(g);
      s.cells[v.y * GRID_W + v.x] = v;
    }
    let u = (g) => g.x < o || g.x >= o + n || g.y < l || g.y >= l + r,
      d = Math.max(
        t.nextId,
        ...[...t.plants, ...t.buildings, ...t.features, ...t.objects, ...t.animals].map((g) => g.id + 1),
      ),
      m = [
        ...t.plants.map(c),
        ...s.plants
          .filter(u)
          .slice(0, Math.max(0, MAP_LIMIT - t.plants.length))
          .map((g) => ({ ...g, id: d++ })),
      ],
      h = [...t.features.map(c), ...s.features.filter(u).map((g) => ({ ...g, id: d++ }))],
      p = [
        ...t.animals.map((g) => ({ ...c(g), tx: g.tx + o, ty: g.ty + l })),
        ...s.animals
          .filter(u)
          .slice(0, Math.max(0, 80 - t.animals.length))
          .map((g) => ({ ...g, id: d++ })),
      ];
    e = {
      ...t,
      nextId: d,
      terrainRevision: (t.terrainRevision ?? 0) + 1,
      cells: s.cells,
      plants: m,
      buildings: t.buildings.map(c),
      features: h,
      objects: t.objects.map(c),
      animals: p,
      story: { ...t.story, incident: t.story.incident ? c(t.story.incident) : void 0 },
      placements: t.placements + 1,
    };
  }
  let a = parseWithRepair(e);
  return (
    e.story.chapterCollected ||
      ((a.story.chapterCollected = { ...a.story.collected }),
      (a.story.chapterTrade = a.story.tradeGold),
      (a.story.chapterEvents = a.frontier.resolved),
      (a.story.chapterRaids = a.frontier.raidsRepelled),
      a.story.chapter >= 24 &&
        ((a.story.chapter = 24),
        (a.story.completed = a.story.completed.filter((n) => n < 24)),
        (a.story.levelStarted = a.time))),
    a
  );
}
// One cell as a compact number array (trailing zeros dropped).
const encodeCell = (t) => {
        let a =
            (t.land ? 1 : 0) |
            (t.pond ? 2 : 0) |
            (t.rock ? 4 : 0) |
            (['', 'pond', 'river', 'ocean'].indexOf(t.waterType ?? '') << 3) |
            (['', 'path', 'road', 'paved'].indexOf(t.road || '') << 5),
          n = [
            t.soil,
            t.moisture,
            t.texture,
            a,
            t.elevation,
            t.snow,
            t.toxicity,
            t.radiation,
            t.oil,
            t.fuel,
            t.fire,
          ];
        for (; n.length > 4 && n.at(-1) === 0; ) n.pop();
        return n;
      };

function serializeWorld(e) {
  return JSON.stringify({
    format: 3,
    cols: GRID_W,
    rows: GRID_H,
    world: {
      ...e,
      arrival: void 0,
      cells: e.cells.map(encodeCell),
    },
  });
}
// Same output as serializeWorld, built in slices of about 6 ms so a save never blocks a frame.
async function serializeWorldAsync(e, sliceMs = 6) {
  const t0 = performance.now();
  const cells = e.cells, parts = [];
  let i = 0, mainMs = 0;
  while (i < cells.length) {
    const s0 = performance.now(), chunk = [];
    for (; i < cells.length && performance.now() - s0 < sliceMs; ) {
      const end = Math.min(cells.length, i + 1024);
      for (; i < end; i++) chunk.push(encodeCell(cells[i]));
    }
    parts.push(JSON.stringify(chunk).slice(1, -1));
    mainMs += performance.now() - s0;
    if (i < cells.length) await new Promise((r) => setTimeout(r, 0));
  }
  const s1 = performance.now();
  const shell = JSON.stringify({ format: 3, cols: GRID_W, rows: GRID_H, world: { ...e, arrival: void 0, cells: '__TW_CELLS__' } });
  const out = shell.replace('"__TW_CELLS__"', '[' + parts.filter(Boolean).join(',') + ']');
  mainMs += performance.now() - s1;
  diagnostics.save(mainMs);
  return out;
}

function readSave(e) {
  let t = JSON.parse(e);
  if (t.format !== 1 && t.format !== 2 && t.format !== 3) throw Error('Unsupported island save version');
  if (t.format === 2 || t.format === 3) {
    let a = t.format === 2 ? 136 : t.cols,
      n = t.format === 2 ? 112 : t.rows;
    if (
      (a !== 136 && a !== GRID_W) ||
      (n !== 112 && n !== GRID_H) ||
      (a === 136 && n !== 112) ||
      (a === GRID_W && n !== GRID_H) ||
      !Array.isArray(t.world?.cells) ||
      t.world.cells.length !== a * n
    )
      throw Error('Invalid compact grid');
    t.world.cells = t.world.cells.map((r, o) => {
      if (
        !Array.isArray(r) ||
        r.length < 4 ||
        r.length > 11 ||
        !r.every((w) => typeof w == 'number' && Number.isFinite(w)) ||
        !Number.isInteger(r[3]) ||
        r[3] < 0 ||
        r[3] > 127
      )
        throw Error('Invalid compact tile');
      let [l, s, c, u, d = 0, m = 0, h = 0, p = 0, g = 0, v = 0, M = 0] = r;
      return {
        x: o % a,
        y: Math.floor(o / a),
        soil: l,
        moisture: s,
        texture: c,
        elevation: d,
        snow: m,
        toxicity: h,
        radiation: p,
        oil: g,
        fuel: v,
        fire: M,
        land: !!(u & 1),
        pond: !!(u & 2),
        rock: !!(u & 4),
        waterType: [null, 'pond', 'river', 'ocean'][(u >> 3) & 3],
        road: [!1, 'path', 'road', 'paved'][(u >> 5) & 3],
      };
    });
  }
  return parseSavedWorld(t.world);
}
async function readIslandText(e) {
  let t = e.trim();
  return readSave(t.startsWith('gzip:') ? await decodeStoredSave(t) : t);
}
var BACKUPS_KEY = 'tideweald-local-backups-v2',
  LEGACY_BACKUP_KEY = 'tideweald-local-backup-v1',
  MAX_BACKUPS = 3,
  store = () => {
    try {
      return typeof localStorage > 'u' ? null : localStorage;
    } catch {
      return null;
    }
  },
  valid = (e) => !!e && typeof e.packed == 'string' && typeof e.savedAt == 'number';
function readLocalBackups(e = store()) {
  if (!e) return [];
  let t = [];
  try {
    let a = e.getItem(BACKUPS_KEY);
    if (a) {
      let n = JSON.parse(a);
      Array.isArray(n) && (t = n.filter(valid));
    }
  } catch {}
  try {
    let a = e.getItem(LEGACY_BACKUP_KEY);
    if (a) {
      let n = JSON.parse(a);
      valid(n) &&
        !t.some((r) => r.savedAt === n.savedAt) &&
        t.push({ ...n, islandId: n.islandId ?? 'legacy' });
    }
  } catch {}
  return t.sort((a, n) => n.savedAt - a.savedAt).slice(0, MAX_BACKUPS);
}
function backupFor(e, t = store()) {
  return readLocalBackups(t).find((a) => a.islandId === (e ?? 'legacy')) ?? null;
}
function writeLocalBackup(e, t, a = store(), n = Date.now()) {
  if (!a) return null;
  let r = {
      savedAt: n,
      day: Math.floor(e.time) + 1,
      chapter: e.story.chapter + 1,
      mode: e.story.mode,
      packed: t,
      islandId: e.islandId ?? 'legacy',
    },
    o = [r, ...readLocalBackups(a).filter((l) => l.islandId !== r.islandId)].slice(0, MAX_BACKUPS);
  for (; o.length; )
    try {
      a.setItem(BACKUPS_KEY, JSON.stringify(o));
      try {
        a.removeItem(LEGACY_BACKUP_KEY);
      } catch {}
      return r;
    } catch {
      if (o.length === 1) return null;
      o = o.slice(0, -1);
    }
  return null;
}
async function restoreLocalBackup(e) {
  return readSave(await decodeStoredSave(e.packed));
}
var describeBackup = (e) =>
  `${e.mode === 'sandbox' ? 'Free build' : `Chapter ${e.chapter}`} \xB7 Day ${e.day} \xB7 ${new Date(e.savedAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`;
function mergeBackups(...e) {
  let t = new Map();
  for (let a of e)
    for (let n of a) {
      if (!valid(n)) continue;
      let r = n.islandId ?? 'legacy',
        o = t.get(r);
      (!o || n.savedAt > o.savedAt) && t.set(r, n);
    }
  return [...t.values()].sort((a, n) => n.savedAt - a.savedAt).slice(0, MAX_BACKUPS);
}
var CURRENT_ISLAND_KEY = 'tideweald-current-island';
function currentIsland(e = store()) {
  try {
    return e?.getItem(CURRENT_ISLAND_KEY) ?? null;
  } catch {
    return null;
  }
}
function setCurrentIsland(e, t = store()) {
  try {
    e && t?.setItem(CURRENT_ISLAND_KEY, e);
  } catch {}
}
var cap = () => {
    try {
      return globalThis.Capacitor;
    } catch {
      return;
    }
  },
  isNativeApp = () => {
    try {
      return !!cap()?.isNativePlatform?.();
    } catch {
      return !1;
    }
  },
  nativePlatform = () => (isNativeApp() ? (cap()?.getPlatform?.() ?? 'native') : 'web'),
  nativePlugin = (e) => (isNativeApp() ? cap()?.Plugins?.[e] : void 0);
function deviceSavesOnly() {
  try {
    return isNativeApp() || document.documentElement.dataset.saves === 'device';
  } catch {
    return !1;
  }
}
var Y2 = 'DATA',
  Yf = 'tideweald',
  fileFor = (e) => `${Yf}/island-${e.replace(/[^\w-]/g, '_').slice(0, 80)}.json`;
async function writeIslandFile(e, t) {
  let a = nativePlugin('Filesystem');
  if (!a) return !1;
  try {
    return (
      await a.writeFile({ path: fileFor(e), data: t, directory: Y2, encoding: 'utf8', recursive: !0 }),
      !0
    );
  } catch {
    return !1;
  }
}
async function readIslandFiles() {
  let e = nativePlugin('Filesystem');
  if (!e) return [];
  try {
    let a = (await e.readdir({ path: Yf, directory: Y2 })).files
        .map((r) => (typeof r == 'string' ? r : r.name))
        .filter((r) => /^island-.*\.json$/.test(r)),
      n = [];
    for (let r of a)
      try {
        let o = await e.readFile({ path: `${Yf}/${r}`, directory: Y2, encoding: 'utf8' });
        n.push(o.data);
      } catch {}
    return n;
  } catch {
    return [];
  }
}
function nativeHaptic(e) {
  let t = nativePlugin('Haptics');
  return t
    ? ((e === 'tap'
        ? t.impact({ style: 'LIGHT' })
        : t.notification({ type: e === 'success' ? 'SUCCESS' : 'WARNING' })
      ).catch(() => {}),
      !0)
    : !1;
}
async function shareFile(e, t, a) {
  let n = nativePlugin('Filesystem'),
    r = nativePlugin('Share');
  if (n && r)
    try {
      let o = await n.writeFile({
        path: `${Yf}/exports/${e}`,
        data: t,
        directory: 'CACHE',
        encoding: 'utf8',
        recursive: !0,
      });
      return (await r.share({ title: a, url: o.uri }), !0);
    } catch {
      return !1;
    }
  try {
    let o = new File([t], e, { type: 'application/json' }),
      l = navigator;
    if (l.canShare?.({ files: [o] })) return (await l.share({ files: [o], title: a }), !0);
  } catch {}
  return !1;
}
var reply = async (e) =>
    await e.json().catch(() => ({ error: 'The save service did not respond. Please retry.' })),
  tag = () => {
    try {
      return crypto.randomUUID();
    } catch {
      return Date.now().toString(36) + Math.random().toString(36).slice(2);
    }
  },
  clock = (e) => new Date(e).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
function changeKey(e) {
  let t = e.wallet;
  return `${e.islandId}|${e.revision}|${e.placements}|${e.noticeId}|${e.nextId}|${e.story.chapter}|${e.story.started}|${e.autoCollect}|${Math.floor(t.gold)}|${Math.floor(t.food)}|${Math.floor(t.timber)}|${Math.floor(t.stone)}|${e.frontier.garrison}|${e.frontier.formation ?? ''}|${(e.story.decisions ?? []).length}`;
}

export { backupFor, changeKey, clock, currentIsland, describeBackup, deviceSavesOnly, encodeCell, isNativeApp, mergeBackups, nativeHaptic, nativePlatform, parseSavedWorld, readIslandFiles, readIslandText, readLocalBackups, readSave, reply, restoreLocalBackup, serializeWorld, serializeWorldAsync, setCurrentIsland, shareFile, tag, writeIslandFile, writeLocalBackup };

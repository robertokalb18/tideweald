// Recovered from the Tideweald v16.11 build. Module: world/ecosystem
import { collectGoods, production } from '../economy/production.js';
import { WORKSHOPS } from '../economy/workshops.js';
import { stepFrontier } from '../military/frontier.js';
import { SITE_KINDS, revealStep, siteReward } from './fog.js';
import { stepVoyages } from '../economy/voyages.js';
import { isFlooded, stepRiver } from './river.js';
import { charterRate, constructionRate, hasLandmark, updateCampaign } from '../progression/campaign.js';
import { councilEffects } from '../progression/council.js';
import { bridgeDays, bridgeTiles } from '../settlement/bridges.js';
import { landCells, plantSpatial } from './actors.js';
import {
  Br,
  CATALOG,
  GRID_H,
  GRID_W,
  Ia,
  MAP_LIMIT,
  Ur,
  ZS,
  buildRemaining,
  clamp,
  isBuilt,
  uf,
  wn,
} from './catalog.js';
import { seasonAt, seasonalWeather } from './seasons.js';
import { Kn, Qd, is } from './spatial-index.js';
import { wildArrivals } from './wildlife.js';
import { announce, cellAt, nearby, random } from './world.js';

var N6 = new WeakMap(),
  Bp = new WeakMap(),
  z6 = new WeakMap();
function productionContext(e) {
  let t = Bp.get(e);
  if (t) return t;
  let a = z6.get(e),
    n = 0;
  for (let r of e.buildings) isBuilt(r) && n++;
  return (
    (!a ||
      a.revision !== e.revision ||
      a.placements !== e.placements ||
      a.plantsRef !== e.plants ||
      a.plantCount !== e.plants.length ||
      a.buildingsRef !== e.buildings ||
      a.buildingCount !== e.buildings.length ||
      a.built !== n) &&
      ((a = {
        plants: new Kn(e.plants),
        landmarks: new Set(e.buildings.filter(isBuilt).map((r) => r.kind)),
        revision: e.revision,
        placements: e.placements,
        plantCount: e.plants.length,
        buildingCount: e.buildings.length,
        built: n,
        plantsRef: e.plants,
        buildingsRef: e.buildings,
      }),
      z6.set(e, a)),
    a
  );
}
function cottageIndex(e, t) {
  return (
    t.cottages || (t.cottages = new Kn(e.buildings.filter((a) => a.kind === 'cottage' && isBuilt(a)))),
    t.cottages
  );
}
function step(e, t) {
  let a = plantSpatial(e),
    n = new Set(e.buildings.filter(isBuilt).map((b) => b.kind)),
    r = { plants: a, landmarks: n };
  if ((Bp.set(e, r), (e.time += t), updateCampaign(e), wildArrivals(e, a), e.market)) {
    let b = Math.exp(-t * 0.7);
    ((e.market.food *= b), (e.market.timber *= b), (e.market.stone *= b));
  }
  let o = t * charterRate(e);
  ((e.wallet.gold += o), (e.earned += o));
  let l = N6.get(e);
  if (!l || l.placements !== e.placements || l.cells !== e.cells) {
    let b = landCells(e).filter((E) => E.pond),
      A = new Uint8Array(GRID_W * GRID_H);
    for (let E of b)
      for (let V = -2; V <= 2; V++)
        for (let Z = -2; Z <= 2; Z++)
          if (Z * Z + V * V < 6.25) {
            let L = cellAt(e, E.x + Z, E.y + V);
            L && (A[L.y * GRID_W + L.x] = 1);
          }
    ((l = { placements: e.placements, cells: e.cells, tiles: A }), N6.set(e, l));
  }
  let s = l.tiles;
  for (let b of e.bridges ?? [])
    if (
      b.buildProgress < 1 &&
      ((b.buildProgress = Math.min(1, b.buildProgress + (t * constructionRate(e)) / bridgeDays(b))),
      b.buildProgress >= 1)
    ) {
      for (let A of bridgeTiles(b)) {
        let E = cellAt(e, A.x, A.y);
        E && !E.road && (E.road = b.kind === 'stone_bridge' ? 'paved' : 'path');
      }
      (e.placements++, announce(e, 'Bridge completed. Your villagers and guards can cross.'));
    }
  for (let b of e.buildings) {
    let A = t;
    // v17: a building standing in the flood does nothing, and the water takes what it held.
    if (isFlooded(e, b)) {
      b.stored = 0;
      continue;
    }
    if (!isBuilt(b)) {
      let E = buildRemaining(b) / constructionRate(e);
      ((b.buildProgress = clamp(b.buildProgress + (t * constructionRate(e)) / Ia[b.kind])),
        (A = Math.max(0, t - E)),
        isBuilt(b) &&
          ((b.buildProgress = 1),
          n.add(b.kind),
          (r.cottages = void 0),
          announce(e, `${CATALOG[b.kind]?.name} completed. Ready to work.`)));
    }
    if (isBuilt(b)) {
      let E = production(e, b),
        V = WORKSHOPS[b.kind],
        Z = A;
      if (V?.inputs && E.rate > 0) {
        for (let [L, N] of Object.entries(V.inputs)) Z = Math.min(Z, e.wallet[L] / (N ?? 1));
        Z = Math.min(Z, (E.capacity - b.stored) / E.rate);
        for (let [L, N] of Object.entries(V.inputs)) e.wallet[L] -= Z * (N ?? 0);
      }
      ((b.stored = Math.min(E.capacity, b.stored + Z * E.rate)), (b.progress = (b.progress + A) % 1));
    }
  }
  ((e.orchardFood = Math.min(
    300,
    e.orchardFood +
      t *
        (seasonAt(e.time).index === 3
          ? hasLandmark(e, 'glasshouse')
            ? 0.75
            : 0.25
          : seasonAt(e.time).index === 2
            ? 1.3
            : 1) *
        e.plants.filter((b) => is.has(b.kind) && b.growth > 0.8 && b.health > 0.5).length *
        3 *
        (hasLandmark(e, 'glasshouse') ? 1.5 : 1),
  )),
    e.autoCollect && collectGoods(e, !0),
    e.autoWeather &&
      e.time >= e.nextWeather &&
      ((e.weather = seasonalWeather(e.time)),
      (e.nextWeather = Math.floor(e.time + 1e-8) + 1),
      announce(e, `The weather has changed to ${Ur.find((b) => b.id === e.weather)?.name.toLowerCase()}.`)));
  let c = e.weather === 'rain' || e.weather === 'storm',
    u = seasonAt(e.time).index === 3 ? 0.035 : 0.55,
    d = t * (c ? 0.95 : e.weather === 'drought' ? -0.6 : e.weather === 'snow' ? -0.025 : -0.1),
    m = e.weather === 'snow',
    h = e.weather === 'storm',
    p = t * u,
    g = t * 0.015,
    v = t * 0.06,
    M = t * 0.09,
    w = t * 0.75;
  for (let b of landCells(e)) {
    let A = b.moisture + d;
    if (
      ((A = A < 0 ? 0 : A > 1 ? 1 : A), b.pond ? (A = 1) : s[b.y * GRID_W + b.x] && A < 0.58 && (A = 0.58), m)
    ) {
      let E = b.snow + w;
      b.snow = E > 1 ? 1 : E < 0 ? 0 : E;
    } else
      b.snow > 0 &&
        ((A = A + Math.min(b.snow, p)), (A = A < 0 ? 0 : A > 1 ? 1 : A), (b.snow = Math.max(0, b.snow - p)));
    if (
      ((b.moisture = A),
      b.toxicity > 0 && (b.toxicity = Math.max(0, b.toxicity - g)),
      b.fuel > 0 && (b.fuel = Math.max(0, b.fuel - v)),
      b.radiation > 0 && (b.radiation = Math.max(0, b.radiation - M)),
      b.oil > 0.07 && ((b.toxicity = clamp(b.toxicity + t * b.oil * 0.15)), c && random(e) < t * 0.16))
    ) {
      let E = cellAt(e, b.x + (random(e) > 0.5 ? 1 : -1), b.y + (random(e) > 0.5 ? 1 : -1));
      E?.land && ((E.oil = clamp(E.oil + 0.13)), (E.toxicity = clamp(E.toxicity + 0.1)));
    }
    (h && b.fuel > 0.22 && random(e) < t * 0.55 && (b.fire = 0.9),
      b.fire > 0 &&
        ((b.fuel = Math.max(0, b.fuel - t * 2)),
        (b.soil = Math.max(0.05, b.soil - t * 0.15)),
        (b.fire = Math.max(0, b.fire - t * (c ? 3.5 : 0.48)))));
  }
  for (let b of e.objects)
    if (b.kind === 'nuclear')
      for (let A of nearby(e, b.x, b.y, 3.1))
        A.radiation = clamp(A.radiation + t * 0.45 * (1 - Math.hypot(A.x + 0.5 - b.x, A.y + 0.5 - b.y) / 4));
  let y = new Kn(e.animals.filter((b) => (b.kind === 'bee' || b.kind === 'butterfly') && b.health > 0.25)),
    k = [];
  for (let b of e.plants) {
    let A = cellAt(e, b.x, b.y);
    if (!A) continue;
    b.age += t;
    let E =
        e.weather === 'snow'
          ? ['pine', 'spruce', 'beech', 'birch', 'juniper'].includes(b.kind)
            ? 0.65
            : 0.13
          : 1,
      V = ['fern', 'mushroom', 'willow', 'alder', 'bracken', 'bluebells', 'reeds', 'sedge'].includes(b.kind)
        ? 0.35
        : ['yew', 'juniper', 'heather'].includes(b.kind)
          ? 0.09
          : 0.17,
      Z =
        A.toxicity * 0.65 +
        A.radiation * 0.9 +
        A.fire * 2.5 +
        ((isWater(A) && !(A.land && A.pond && uf.has(b.kind))) || A.rock ? 1 : 0) +
        (A.moisture < V ? (CATALOG[b.kind]?.tree && b.growth > 0.5 ? 0.06 : 0.18) : 0);
    if (((b.health = clamp(b.health + t * (Z > 0.08 ? -Z : 0.09))), b.health <= 0)) continue;
    let L = clamp((A.moisture - 0.07) * 3),
      N = clamp(A.soil * 1.6),
      O = clamp(1 - Z),
      z = y.some(b.x, b.y, 4, () => !0) ? 1.35 : 1,
      U =
        b.kind === 'beech'
          ? 0.32
          : CATALOG[b.kind]?.tree
            ? 0.58
            : b.kind === 'berry'
              ? 0.85
              : b.kind === 'mushroom'
                ? 1.8
                : 2.3,
      Y = t * U * L * N * O * E * z * (CATALOG[b.kind]?.tree ? councilEffects(e).treeGrowth : 1);
    if (
      ((b.growth = clamp(b.growth + Y)),
      (A.moisture = clamp(A.moisture - Y * 0.009)),
      (A.soil = clamp(A.soil - Y * 0.003)),
      (b.kind === 'clover' || b.kind === 'mushroom') &&
        b.growth > 0.5 &&
        (A.soil = clamp(A.soil + t * 0.035)),
      b.growth > 0.8 &&
        b.health > 0.75 &&
        ['grass', 'clover', 'flowers'].includes(b.kind) &&
        e.plants.length + k.length < Math.min(MAP_LIMIT, 1440) &&
        random(e) < t * 0.11)
    ) {
      let W = b.x + (random(e) - 0.5) * 3.5,
        j = b.y + (random(e) - 0.5) * 3.5,
        Ae = cellAt(e, W, j);
      Ae?.land &&
        !Ae.pond &&
        !Ae.rock &&
        Ae.moisture > 0.2 &&
        Ae.toxicity < 0.2 &&
        !a.some(W, j, 0.45, () => !0) &&
        k.push({
          id: e.nextId++,
          kind: b.kind,
          x: W,
          y: j,
          growth: 0.01,
          health: 1,
          age: 0,
          variant: random(e),
        });
    }
  }
  for (let b of e.buildings)
    if (b.kind === 'well' && isBuilt(b))
      for (let A of nearby(e, b.x, b.y, 4)) A.moisture = Math.max(A.moisture, 0.58);
  for (let b of e.buildings)
    if (b.kind === 'sanctuary' && isBuilt(b)) {
      for (let A of nearby(e, b.x, b.y, 7))
        ((A.toxicity = Math.max(0, A.toxicity - t * 0.3)),
          (A.radiation = Math.max(0, A.radiation - t * 0.3)),
          (A.oil = Math.max(0, A.oil - t * 0.2)));
      for (let A of e.plants) Math.hypot(A.x - b.x, A.y - b.y) < 7 && (A.health = clamp(A.health + t * 0.2));
    }
  (e.plants.push(...k),
    e.plants.some((b) => b.health <= 0 && b.age >= 8) &&
      (e.plants = e.plants.filter((b) => b.health > 0 || b.age < 8)));
  let x = plantSpatial(e),
    T = new Map(),
    C = [];
  for (let b of e.animals) T.set(b.kind, (T.get(b.kind) ?? 0) + 1);
  for (let b of e.animals) {
    ((b.age += t), (b.cooldown -= t));
    let A = cellAt(e, b.x, b.y);
    if (!A) continue;
    if (Math.hypot(b.tx - b.x, b.ty - b.y) < 0.12 || b.cooldown <= 0) {
      let Y =
          b.kind !== 'fox' && random(e) < 0.5
            ? e.animals.find(
                (Xe) =>
                  Xe !== b && Xe.kind === b.kind && Math.abs(Xe.x - b.x) < 10 && Math.abs(Xe.y - b.y) < 10,
              )
            : void 0,
        W = Y ? (b.x + Y.x) / 2 : b.x,
        j = Y ? (b.y + Y.y) / 2 : b.y,
        Ae = Y ? 4 : 7;
      for (let Xe = 0; Xe < 8; Xe++) {
        let Fe = W + (random(e) - 0.5) * Ae,
          ct = j + (random(e) - 0.5) * Ae,
          at = cellAt(e, Fe, ct);
        if (canStand(b.kind, at) && (b.kind === 'fox' || habitatOk(e, b.kind, Fe, ct, x))) {
          ((b.tx = Fe), (b.ty = ct));
          break;
        }
      }
      b.cooldown = 0.2 + random(e) * 0.6;
    }
    let E = b.tx - b.x,
      V = b.ty - b.y,
      Z = Math.hypot(E, V),
      L = Math.min(Z, t * (b.kind === 'butterfly' || b.kind === 'bee' ? 6 : 3.2)),
      N = b.x + (Z ? (E / Z) * L : 0),
      O = b.y + (Z ? (V / Z) * L : 0),
      z = cellAt(e, N, O);
    canStand(b.kind, z)
      ? ((b.x = N), (b.y = O), Math.abs(E - V) > Z * 0.4 && (b.direction = E - V < 0 ? -1 : 1))
      : (b.cooldown = 0);
    let U = b.kind === 'fox' ? !0 : habitatOk(e, b.kind, b.x, b.y, x);
    if (eM.has(b.kind)) {
      let Y = x.first(
        b.x,
        b.y,
        3.8,
        (W) => W.health > 0.2 && W.growth > 0.25 && !CATALOG[W.kind]?.tree && !is.has(W.kind),
      );
      Y && (Y.growth = Math.max(0.12, Y.growth - t * 0.055));
    }
    if (b.kind === 'fox') {
      let Y = e.animals.find(
        (W) => W.kind === 'rabbit' && W.health > 0 && Math.hypot(b.x - W.x, b.y - W.y) < 6,
      );
      ((U = !!Y),
        Y &&
          ((b.tx = Y.x),
          (b.ty = Y.y),
          Math.hypot(b.x - Y.x, b.y - Y.y) < 0.8 &&
            ((Y.health -= t * 0.5), (b.health = clamp(b.health + t * 0.3)))));
    }
    if (
      ((b.health = clamp(
        b.health + t * ((U ? 0.06 : -0.17) - A.toxicity * 0.55 - A.radiation * 0.8 - A.fire * 1.8),
      )),
      U &&
        b.health > 0.8 &&
        b.age > 3 &&
        (T.get(b.kind) ?? 0) < Br &&
        e.animals.length + C.length < wn &&
        random(e) < t * (ZS[b.kind] ?? 0))
    ) {
      let Y = e.animals.some(
          (Fe) =>
            Fe !== b &&
            Fe.kind === b.kind &&
            Fe.age > 3 &&
            Fe.health > 0.5 &&
            Math.abs(Fe.x - b.x) < 6 &&
            Math.abs(Fe.y - b.y) < 6,
        ),
        W = e.animals.filter(
          (Fe) => Fe.kind === b.kind && Math.abs(Fe.x - b.x) < 8 && Math.abs(Fe.y - b.y) < 8,
        ).length,
        j = clamp(b.x + (random(e) - 0.5) * 1.2, 0.1, GRID_W - 0.1),
        Ae = clamp(b.y + (random(e) - 0.5) * 1.2, 0.1, GRID_H - 0.1),
        Xe = cellAt(e, j, Ae);
      Y &&
        W < 8 &&
        canStand(b.kind, Xe) &&
        (C.push({
          id: e.nextId++,
          kind: b.kind,
          x: j,
          y: Ae,
          tx: j,
          ty: Ae,
          age: 0,
          health: 0.8,
          direction: b.direction,
          cooldown: 0.5,
        }),
        T.set(b.kind, (T.get(b.kind) ?? 0) + 1));
    }
  }
  C.length && e.animals.push(...C);
  let R = e.animals.filter((b) => b.health > 0);
  if (R.length < e.animals.length) {
    let b = e.animals.filter((E) => E.health <= 0),
      A = [...new Set(b.map((E) => CATALOG[E.kind]?.name.toLowerCase() ?? E.kind))];
    announce(
      e,
      `${b.length === 1 ? `A ${A[0]}` : `${b.length} animals (${A.slice(0, 3).join(', ')})`} could not survive near Day ${Math.floor(e.time) + 1}. Check its habitat for food, water and tainted ground.`,
    );
  }
  ((e.animals = R),
    stepFrontier(e, t),
    stepRiver(e, t, (s, k) => {
      (e.story.events.push({ day: Math.floor(e.time + 1e-8) + 1, title: s, text: k }),
        e.story.events.length > 60 && e.story.events.shift(),
        announce(e, `${s}. ${k}`));
    }),
    stepVoyages(e, (s, k) => {
      (e.story.events.push({ day: Math.floor(e.time + 1e-8) + 1, title: s, text: k }),
        e.story.events.length > 60 && e.story.events.shift(),
        announce(e, `${s}. ${k}`));
    }),
    revealStep(e, (s) => {
      let k = SITE_KINDS[s.kind];
      (e.story.events.push({ day: Math.floor(e.time + 1e-8) + 1, title: `Discovered: ${k.name}`, text: `${k.text} ${siteReward(s.kind)}.` }),
        e.story.events.length > 60 && e.story.events.shift(),
        announce(e, `Discovered: ${k.name}. ${siteReward(s.kind)}.`));
    }),
    Bp.delete(e));
}
function isWater(e) {
  return !!e && (!e.land || e.pond);
}
function waterWithin(e, t, a, n) {
  let r = n * n;
  for (let o = Math.max(0, Math.ceil(a - n - 0.5)); o <= Math.min(GRID_H - 1, Math.floor(a + n - 0.5)); o++)
    for (
      let l = Math.max(0, Math.ceil(t - n - 0.5));
      l <= Math.min(GRID_W - 1, Math.floor(t + n - 0.5));
      l++
    ) {
      let s = e.cells[o * GRID_W + l];
      if ((!s.land || s.pond) && (l + 0.5 - t) ** 2 + (o + 0.5 - a) ** 2 <= r) return !0;
    }
  return !1;
}
var eM = new Set(['rabbit', 'deer', 'sheep', 'cow', 'goose']),
  $6 = new Set(['duck', 'goose', 'heron', 'stork', 'otter']),
  tM = new Set(['bee', 'butterfly']),
  aM = new Set(['hazel', 'juniper', 'fern', 'bracken', 'mushroom', 'berry', 'oak', 'pine']),
  nM = new Set(['rabbit', 'deer', 'sheep', 'cow', 'hedgehog', 'boar', 'squirrel', 'bee', 'butterfly']);
function canStand(e, t) {
  return t
    ? e === 'fish'
      ? isWater(t)
      : e === 'otter'
        ? !0
        : t.land && ($6.has(e) || tM.has(e) || !t.pond)
    : !1;
}
function foodFor(e) {
  return e === 'bee' || e === 'butterfly'
    ? (t) => t.health > 0.2 && t.growth > 0.25 && Qd.has(t.kind)
    : e === 'squirrel'
      ? (t) => t.health > 0.2 && t.growth > 0.45 && !!CATALOG[t.kind]?.tree
      : e === 'boar'
        ? (t) => t.health > 0.2 && t.growth > 0.3 && (!!CATALOG[t.kind]?.tree || aM.has(t.kind))
        : (t) => t.health > 0.3 && t.growth > 0.25;
}
function habitatOk(e, t, a, n, r) {
  if (t === 'fish') return isWater(cellAt(e, a, n));
  if ($6.has(t)) return waterWithin(e, a, n, t === 'otter' ? 2.2 : 3.5);
  if (t === 'fox')
    return e.animals.some((o) => o.kind === 'rabbit' && o.health > 0 && Math.hypot(a - o.x, n - o.y) < 6);
  if (nM.has(t)) {
    let o = foodFor(t),
      l = 3.8;
    return r
      ? r.some(a, n, l, o)
      : e.plants.some(
          (s) => Math.abs(s.x - a) < l && Math.abs(s.y - n) < l && Math.hypot(s.x - a, s.y - n) < l && o(s),
        );
  }
  return !0;
}

export { canStand, cottageIndex, foodFor, habitatOk, isWater, productionContext, step, waterWithin };

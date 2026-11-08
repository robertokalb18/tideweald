// Recovered from the Tideweald v16.11 build. Module: world/wildlife
import { councilEffects } from '../progression/council.js';
import { Br, CATALOG, GRID_H, GRID_W, clamp, fs, wn } from './catalog.js';
import { canStand, foodFor, habitatOk, isWater, waterWithin } from './ecosystem.js';
import { announce, cellAt, nearby } from './world.js';

var rM = 4,
  oM = 0.45,
  LOW_PLANTS = (e) => e.health > 0.3 && e.growth > 0.3 && !CATALOG[e.kind]?.tree,
  cf = {
    rabbit: { need: 8, r: 4, food: LOW_PLANTS },
    hedgehog: { need: 8, r: 4, food: LOW_PLANTS },
    deer: { need: 12, r: 5, food: (e) => e.health > 0.3 && e.growth > 0.4 },
    boar: { need: 8, r: 4.5, food: foodFor('boar') },
    squirrel: { need: 5, r: 4, food: foodFor('squirrel') },
    bee: { need: 6, r: 4, food: foodFor('bee') },
    butterfly: { need: 5, r: 4, food: foodFor('butterfly') },
    duck: { need: 3, r: 4, food: LOW_PLANTS, water: 3 },
    goose: { need: 5, r: 4, food: LOW_PLANTS, water: 3.5 },
    heron: { need: 2, r: 4, water: 2.5 },
    stork: { need: 4, r: 4.5, food: LOW_PLANTS, water: 3.5 },
    otter: { need: 3, r: 4, water: 2 },
    fish: { need: 0, r: 0, fishWater: 14 },
    fox: { need: 0, r: 0 },
  },
  D6 = new WeakMap();
function wildRandom(e) {
  let t = e >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let a = Math.imul(t ^ (t >>> 15), 1 | t);
    return ((a = (a + Math.imul(a ^ (a >>> 7), 61 | a)) ^ a), ((a ^ (a >>> 14)) >>> 0) / 4294967296);
  };
}
function countNear(e, t, a, n, r, o) {
  let l = 0;
  return (e.some(t, a, n, (s) => (r(s) && l++, l >= o)), l);
}
function wildSpot(e, t, a, n, r) {
  let o = cf[t],
    l = cellAt(e, a, n);
  if (
    !o ||
    !l ||
    !canStand(t, l) ||
    l.toxicity > 0.2 ||
    l.radiation > 0.1 ||
    l.fire > 0 ||
    e.buildings.some((s) => Math.abs(s.x - a) < 3 && Math.abs(s.y - n) < 3) ||
    !habitatOk(e, t, a, n, r)
  )
    return !1;
  if (o.fishWater) {
    let s = 0;
    for (let c = -3; c <= 3; c++) for (let u = -3; u <= 3; u++) isWater(cellAt(e, a + u, n + c)) && s++;
    return s >= o.fishWater;
  }
  return t === 'fox'
    ? e.animals.filter((s) => s.kind === 'rabbit' && s.health > 0.4 && Math.hypot(s.x - a, s.y - n) < 6)
        .length >= 4
    : o.water && !waterWithin(e, a, n, o.water)
      ? !1
      : !o.food || countNear(r, a, n, o.r, o.food, o.need) >= o.need;
}
function wildArrivals(e, t) {
  let a = Math.floor(e.time + 1e-8);
  if (D6.get(e) === a || (D6.set(e, a), !e.story.started || a < 3 || e.animals.length >= wn - 24))
    return null;
  let n = wildRandom(e.nextId * 31 + a * 7919 + e.plants.length * 13 + e.animals.length);
  if (n() > oM * councilEffects(e).wildlife) return null;
  let r = {};
  for (let l of e.animals) r[l.kind] = (r[l.kind] ?? 0) + 1;
  let o = Object.keys(cf).filter((l) => (r[l] ?? 0) < rM);
  for (let l = o.length - 1; l > 0; l--) {
    let s = Math.floor(n() * (l + 1));
    [o[l], o[s]] = [o[s], o[l]];
  }
  for (let l of o)
    for (let s = 0; s < 40; s++) {
      let c, u;
      if (l === 'fish') ((c = n() * GRID_W), (u = n() * GRID_H));
      else if (l === 'fox') {
        let g = e.animals.filter((M) => M.kind === 'rabbit');
        if (!g.length) break;
        let v = g[Math.floor(n() * g.length)];
        ((c = v.x + (n() - 0.5) * 4), (u = v.y + (n() - 0.5) * 4));
      } else {
        if (!e.plants.length) break;
        let g = e.plants[Math.floor(n() * e.plants.length)];
        ((c = g.x + (n() - 0.5) * 3), (u = g.y + (n() - 0.5) * 3));
      }
      if (((c = clamp(c, 0.5, GRID_W - 0.5)), (u = clamp(u, 0.5, GRID_H - 0.5)), !wildSpot(e, l, c, u, t)))
        continue;
      let d = Math.min(fs[l] ?? 1, Br - (r[l] ?? 0), wn - e.animals.length),
        m = 0;
      for (let g = 0; g < d; g++) {
        let v = g ? clamp(c + (n() - 0.5) * 1.6, 0.1, GRID_W - 0.1) : c,
          M = g ? clamp(u + (n() - 0.5) * 1.6, 0.1, GRID_H - 0.1) : u;
        (g && !canStand(l, cellAt(e, v, M))) ||
          (e.animals.push({
            id: e.nextId++,
            kind: l,
            x: v,
            y: M,
            tx: v,
            ty: M,
            age: 1,
            health: 1,
            direction: n() < 0.5 ? -1 : 1,
            cooldown: 0.2 + g * 0.15,
          }),
          m++);
      }
      let h = CATALOG[l]?.name ?? l,
        p =
          l === 'fish'
            ? 'the open water'
            : cf[l].water
              ? 'the waterside'
              : l === 'squirrel' || l === 'boar' || l === 'deer'
                ? 'your woodland'
                : cf[l].food === LOW_PLANTS
                  ? 'your meadows'
                  : l === 'fox'
                    ? 'the rabbit warren'
                    : 'your flowers';
      return (
        (e.arrival = { x: c, y: u, kind: l, at: Date.now() }),
        announce(
          e,
          `Wildlife: ${h} found ${p} and settled on their own (${m} arrived). Keep the habitat healthy and they will raise young.`,
        ),
        l
      );
    }
  return null;
}
var df = {
    rabbit: 'Rabbits need grass or other low plants within a few steps. Plant a meadow here first.',
    deer: 'Deer need plants to browse within a few steps. Place them at a meadow or wood edge.',
    sheep: 'Sheep need grazing within a few steps. Plant grass or clover here first.',
    cow: 'Cattle need open grazing within a few steps. Plant grass or clover here first.',
    hedgehog: 'Hedgehogs need low plants or hedges within a few steps.',
    boar: 'Wild boar need woodland: trees, hazel, berries or fungi within a few steps.',
    squirrel: 'Red squirrels need grown trees within a few steps. Place them in a wood.',
    bee: 'Bees need flowering plants within a few steps. Plant wildflowers, clover or heather first.',
    butterfly: 'Butterflies need flowering plants within a few steps. Plant wildflowers first.',
    duck: 'Ducks need water within a few steps. Place them by a pond or river.',
    goose: 'Geese need water within a few steps. Place them by a pond or river.',
    stork: 'Storks need water within a few steps. Place them on a wet meadow by a pond or river.',
    heron: 'Herons need water beside them. Place them at a pond or river bank.',
    otter: 'Otters need water right beside them. Place them on a river or pond bank.',
    fox: 'Foxes hunt rabbits. Place them within reach of a rabbit warren.',
    fish: 'Fish need water. Add a pond, river, or ocean first.',
  },
  _6 = new WeakMap();
function productionArea(e, t, a, n = !0) {
  if (t.id === 0) return nearby(e, t.x, t.y, a, n);
  let r = _6.get(t);
  return (
    (!r || r.world !== e || r.placements !== e.placements || r.cells !== e.cells) &&
      ((r = { world: e, placements: e.placements, cells: e.cells, roads: nearby(e, t.x, t.y, 2.5) }),
      _6.set(t, r)),
    a === 2.5
      ? r.roads
      : n
        ? (r.rocks ?? (r.rocks = nearby(e, t.x, t.y, a)))
        : (r.water ?? (r.water = nearby(e, t.x, t.y, a, !1)))
  );
}

export { df, productionArea, wildArrivals };

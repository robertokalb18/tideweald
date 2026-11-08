// Recovered from the Tideweald v16.11 build. Module: world/world
import { createFrontier } from '../military/frontier.js';
import { GRID_H, GRID_W, HAVEN, uf } from './catalog.js';

function random(e) {
  return ((e.seed = (e.seed * 1664525 + 1013904223) >>> 0), e.seed / 4294967296);
}
function cellAt(e, t, a) {
  let n = Math.floor(t),
    r = Math.floor(a);
  return n >= 0 && n < GRID_W && r >= 0 && r < GRID_H ? e.cells[r * GRID_W + n] : void 0;
}
function islandTime(e) {
  if (e < 1) {
    let t = Math.max(1, Math.round(e * 24));
    return `${t} island hour${t === 1 ? '' : 's'}`;
  }
  return `${e} island day${e === 1 ? '' : 's'}`;
}
function newIslandId() {
  try {
    return crypto.randomUUID();
  } catch {
    return 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
  }
}
var lc = (e) => Math.round(e * 1e3) / 1e3;
function emptyWorld(e = 'campaign') {
  return worldShell(e);
}
function worldShell(e) {
  return {
    islandId: newIslandId(),
    terrainRevision: 0,
    frontier: createFrontier(),
    revision: 0,
    autoCollect: !1,
    story: {
      mode: e,
      started: e === 'sandbox',
      chapter: 0,
      completed: [],
      collected: { gold: 0, food: 0, timber: 0, stone: 0 },
      reserves: { gold: 0, food: 0, timber: 0, stone: 0 },
      convoyDay: 30,
      missed: 0,
      settled: !1,
      events: [],
      lastSeason: '',
      levelStarted: 0,
      population: 0,
      tradeGold: 0,
      chapterTrade: 0,
      chapterCollected: { gold: 0, food: 0, timber: 0, stone: 0 },
      chapterEvents: 0,
      chapterRaids: 0,
    },
    wallet: { gold: 900, food: 0, timber: 0, stone: 0 },
    buildings: [],
    features: [],
    orchardFood: 0,
    earned: 0,
    spent: 0,
    demoGold: 0,
    cells: [],
    plants: [],
    animals: [],
    objects: [],
    time: 0,
    weather: 'sun',
    autoWeather: !1,
    nextWeather: 1.5,
    seed: 284711,
    nextId: 1,
    message: '900 gold to begin. Build a barley farm, collect food, and trade it for gold.',
    noticeId: 0,
    placements: 0,
  };
}
function createWorld(e = 'sandbox') {
  let t = worldShell(e);
  for (let c = 0; c < GRID_H; c++)
    for (let u = 0; u < GRID_W; u++) {
      let d = (u - 191.1) / 160,
        m = (c - 159) / 126,
        h = Math.atan2(m, d),
        p = 1 + 0.08 * Math.sin(h * 5) + 0.06 * Math.cos(h * 3) + 0.022 * Math.sin(u * 0.7 + c * 0.6);
      t.cells.push({
        x: u,
        y: c,
        land: d * d + m * m < p,
        soil: lc(0.09 + random(t) * 0.06),
        moisture: lc(0.07 + random(t) * 0.04),
        toxicity: 0,
        radiation: 0,
        oil: 0,
        fuel: 0,
        snow: 0,
        pond: !1,
        rock: !1,
        fire: 0,
        texture: lc(random(t)),
        elevation: 0,
        waterType: null,
        road: !1,
      });
    }
  for (let c of t.cells) {
    if (!c.land) continue;
    let u = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([d, m]) => !cellAt(t, c.x + d, c.y + m)?.land);
    ((c.soil = u ? 0.16 : 0.32 + c.texture * 0.16),
      (c.moisture = u ? 0.17 : 0.28 + c.texture * 0.13),
      Math.hypot(c.x - HAVEN.x, c.y - HAVEN.y) < 5 && ((c.soil = 0.55), (c.moisture = 0.48)));
  }
  for (let [c, u, d] of [
    [42.5, 13.5, 'snowpeak'],
    [46.5, 16.5, 'mountain'],
    [40.5, 17.5, 'mountain'],
    [26.5, 22.5, 'hill'],
    [22.5, 38.5, 'hill'],
  ]) {
    let m = c + 158,
      h = u + 132;
    t.features.push({ id: t.nextId++, kind: d, x: m, y: h });
    for (let p of nearby(t, m, h, d === 'hill' ? 3.5 : 1.8))
      ((p.rock = d !== 'hill'),
        (p.elevation =
          d === 'hill'
            ? Math.max(3, Math.round((1 - Math.hypot(p.x + 0.5 - m, p.y + 0.5 - h) / 4) * 24))
            : 12),
        d === 'snowpeak' && (p.snow = 1));
  }
  for (let c = 142.5; c < 162; c += 0.6) {
    let u = 196.5 + Math.sin((c - 132) * 0.24) * 2;
    for (let d of nearby(t, u, c, 1.15))
      d.rock || ((d.pond = !0), (d.waterType = 'river'), (d.moisture = 1), (d.elevation = 0));
  }
  for (let c of nearby(t, 196, 163.5, 1.7)) ((c.pond = !0), (c.waterType = 'pond'), (c.moisture = 1));
  let a = [
    [29.5, 25.5, 'oak'],
    [32, 25, 'cherry_tree'],
    [34, 24, 'birch'],
    [28, 27, 'maple'],
    [30.5, 23, 'pine'],
    [25, 26, 'oak'],
    [23, 28, 'pine'],
    [22, 25, 'birch'],
    [24, 23, 'maple'],
    [29, 20, 'oak'],
    [33, 20, 'pine'],
    [34, 18, 'pine'],
    [43, 26, 'cherry_tree'],
    [45, 28, 'oak'],
    [47, 26, 'birch'],
    [44, 31, 'hawthorn'],
    [46, 33, 'maple'],
    [48, 30, 'oak'],
    [22, 35, 'willow'],
    [20, 33, 'oak'],
    [19, 37, 'pine'],
    [25, 40, 'cherry_tree'],
    [27, 42, 'maple'],
    [49, 20, 'pine'],
  ];
  for (let [c, u, d] of a) {
    let m = c + 158,
      h = u + 132,
      p = cellAt(t, m, h);
    !p?.land ||
      p.rock ||
      p.pond ||
      ((p.soil = 0.65),
      (p.moisture = 0.7),
      t.plants.push({
        id: t.nextId++,
        kind: d,
        x: m,
        y: h,
        growth: 0.65 + random(t) * 0.3,
        health: 1,
        age: 5 + random(t) * 3,
        variant: random(t),
      }));
  }
  for (let [c, u] of [
    [31, 27],
    [33, 26],
    [24, 29],
    [45, 25],
    [46, 29],
    [28, 39],
  ])
    for (let d = 0; d < 3; d++) {
      let m = c + 158 + random(t) * 1.4,
        h = u + 132 + random(t) * 1.4,
        p = cellAt(t, m, h);
      !p?.land ||
        p.pond ||
        ((p.soil = 0.65),
        (p.moisture = 0.65),
        t.plants.push({
          id: t.nextId++,
          kind: d === 0 ? 'berry' : 'flowers',
          x: m,
          y: h,
          growth: 0.7 + random(t) * 0.3,
          health: 1,
          age: 3,
          variant: random(t),
        }));
    }
  for (let [c, u, d] of [
    [29, 24, 'hazel'],
    [28, 25, 'bracken'],
    [24, 27, 'bluebells'],
    [23, 25, 'juniper'],
    [32, 22, 'heather'],
    [43, 28, 'lupine'],
    [46, 27, 'hazel'],
    [48, 28, 'heather'],
    [21, 34, 'bracken'],
    [24, 39, 'bluebells'],
    [28, 40, 'lupine'],
    [36, 26, 'reeds'],
    [36, 27, 'sedge'],
    [39, 29, 'reeds'],
    [38, 32, 'sedge'],
    [39, 32, 'reeds'],
  ])
    for (let m = 0; m < 2; m++) {
      let h = c + 158 + 0.2 + m * 0.65,
        p = u + 132 + 0.25 + m * 0.4,
        g = cellAt(t, h, p);
      !g?.land ||
        g.rock ||
        (g.pond && !uf.has(d)) ||
        ((g.soil = Math.max(g.soil, 0.6)),
        (g.moisture = Math.max(g.moisture, 0.65)),
        t.plants.push({
          id: t.nextId++,
          kind: d,
          x: h,
          y: p,
          growth: 0.6 + random(t) * 0.35,
          health: 1,
          age: 4,
          variant: random(t),
        }));
    }
  for (let [c, u, d] of [
    [16, 25, ['pine', 'birch', 'juniper', 'oak', 'fern', 'heather']],
    [27, 14, ['pine', 'spruce', 'birch', 'pine', 'bracken', 'mushroom']],
    [51, 26, ['oak', 'birch', 'hazel', 'pine', 'flowers', 'juniper']],
    [44, 42, ['birch', 'willow', 'oak', 'hazel', 'bluebells', 'bracken']],
    [22, 43, ['oak', 'pine', 'birch', 'juniper', 'heather', 'flowers']],
    [51, 18, ['pine', 'spruce', 'birch', 'pine', 'sedge', 'bracken']],
  ])
    for (let m = 0; m < d.length; m++) {
      let h = c + 158 + Math.sin(m * 2.4) * 2.6,
        p = u + 132 + Math.cos(m * 2.4) * 2.2,
        g = cellAt(t, h, p);
      !g?.land ||
        g.rock ||
        g.pond ||
        g.elevation > 12 ||
        ((g.soil = 0.64),
        (g.moisture = 0.7),
        t.plants.push({
          id: t.nextId++,
          kind: d[m],
          x: h,
          y: p,
          growth: 0.55 + random(t) * 0.4,
          health: 1,
          age: 5,
          variant: random(t),
        }));
    }
  for (let [c, u, d] of [
    [32, 44, 'mountain'],
    [98, 65, 'mountain'],
    [77, 87, 'hill'],
    [91, 29, 'snowpeak'],
    [40, 76, 'hill'],
  ]) {
    t.features.push({ id: t.nextId++, kind: d, x: c + 124.5, y: u + 104.5 });
    for (let m of nearby(t, c + 124.5, u + 104.5, 1.8))
      ((m.rock = d !== 'hill'), (m.elevation = d === 'hill' ? 6 : 12));
  }
  let n = ['oak', 'beech', 'birch', 'pine', 'hornbeam', 'spruce', 'rowan', 'hazel'];
  for (let c = 0; c < 110; c++) {
    let u = 142 + random(t) * 100,
      d = 120 + random(t) * 80,
      m = cellAt(t, u, d);
    !m?.land ||
      m.rock ||
      m.pond ||
      Math.hypot(u - HAVEN.x, d - HAVEN.y) < 27 ||
      ((m.soil = 0.62),
      (m.moisture = 0.65),
      t.plants.push({
        id: t.nextId++,
        kind: n[c % n.length],
        x: u,
        y: d,
        growth: 0.65 + random(t) * 0.3,
        health: 1,
        age: 5,
        variant: random(t),
      }));
  }
  let r = [
    { x: 83, y: 143 },
    { x: 268, y: 95 },
    { x: 299, y: 213 },
    { x: 159, y: 252 },
    { x: 136, y: 78 },
    { x: 239, y: 250 },
  ];
  for (let [c, u] of r.entries()) {
    for (let d = 0; d < 5; d++) {
      let m = u.x - 12 + d * 5,
        h = u.y - 14 + Math.sin(d * 1.9 + c) * 4;
      if (cellAt(t, m, h)?.land) {
        t.features.push({ id: t.nextId++, kind: d % 3 ? 'hill' : 'mountain', x: m, y: h });
        for (let p of nearby(t, m, h, 2)) ((p.rock = d % 3 === 0), (p.elevation = d % 3 ? 6 : 12));
      }
    }
    for (let d = -24; d < 25; d += 0.7) {
      let m = u.x + 8 + Math.sin(d * 0.11 + c) * 6,
        h = u.y + d;
      for (let p of nearby(t, m, h, 1.5))
        p.rock || ((p.pond = !0), (p.waterType = 'river'), (p.moisture = 1));
    }
    for (let d = 0; d < 140; d++) {
      let m = u.x + (random(t) - 0.5) * 55,
        h = u.y + (random(t) - 0.5) * 46,
        p = cellAt(t, m, h);
      !p?.land ||
        p.pond ||
        p.rock ||
        Math.hypot(m - u.x, h - u.y) < 5 ||
        ((p.soil = 0.63),
        (p.moisture = 0.68),
        t.plants.push({
          id: t.nextId++,
          kind: n[(d + c) % n.length],
          x: m,
          y: h,
          growth: 0.65 + random(t) * 0.3,
          health: 1,
          age: 5,
          variant: random(t),
        }));
    }
  }
  let o = t.cells.filter((c) => c.land && c.pond && c.waterType === 'river'),
    l = o.filter((c) => Math.hypot(c.x - HAVEN.x, c.y - HAVEN.y) < 25),
    s = [
      ...l.filter((c, u) => u % Math.max(1, Math.floor(l.length / 6)) === 0).slice(0, 6),
      ...Array.from({ length: 12 }, (c, u) => o[Math.floor((u * o.length) / 12)]),
    ];
  for (let c = 0; c < 18 && s.length; c++) {
    let u = s[c];
    t.animals.push({
      id: t.nextId++,
      kind: 'fish',
      x: u.x + 0.5,
      y: u.y + 0.5,
      tx: u.x + 0.5,
      ty: u.y + 0.5,
      health: 1,
      age: 1,
      direction: 1,
      cooldown: 0,
    });
  }
  for (let c of t.cells) ((c.soil = lc(c.soil)), (c.moisture = lc(c.moisture)));
  return t;
}
function nearby(e, t, a, n, r = !0) {
  let o = [],
    l = n * n;
  for (let s = Math.max(0, Math.ceil(a - n - 0.5)); s <= Math.min(GRID_H - 1, Math.floor(a + n - 0.5)); s++)
    for (
      let c = Math.max(0, Math.ceil(t - n - 0.5));
      c <= Math.min(GRID_W - 1, Math.floor(t + n - 0.5));
      c++
    ) {
      let u = e.cells[s * GRID_W + c];
      (!r || u.land) && (c + 0.5 - t) ** 2 + (s + 0.5 - a) ** 2 <= l && o.push(u);
    }
  return o;
}
function announce(e, t) {
  ((e.message = t), e.noticeId++);
}
var Pi = { id: '', tiles: 0, gold: 0, at: 0 };
function strokeTotal(e, t) {
  let a = Date.now();
  return (
    (Pi.id !== e || a - Pi.at > 1500) && (Pi = { id: e, tiles: 0, gold: 0, at: a }),
    Pi.tiles++,
    (Pi.gold += t),
    (Pi.at = a),
    Pi
  );
}

export { announce, cellAt, createWorld, emptyWorld, islandTime, nearby, random, strokeTotal };

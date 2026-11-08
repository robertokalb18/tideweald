// Recovered from the Tideweald v16.11 build. Module: render/folio
import { mix, project, ready, sprite, tier } from './world-draw.js';
import { bridgeTiles } from '../settlement/bridges.js';
import { BUILDING_SIZES, GRID_H, GRID_W, HAVEN, isBuilt } from '../world/catalog.js';
import { cellAt } from '../world/world.js';

var tw11F = {
  BOAT: 0,
  HAY: 1,
  HJELL: 2,
  ANGLER: 3,
  POTS: 4,
  RUNE: 5,
  CLOUD: 6,
  COTTON: 7,
  THRIFT: 8,
  HAREBELL: 9,
  FIREWEED: 10,
  LINGON: 11,
  WRACK: 12,
  KALE: 13,
  LICHEN: 14,
  OAK: 15,
  YEW: 16,
  PONY: 17,
  HIGHLAND: 18,
  MOORIT: 19,
  BLACKFACE: 20,
  EIDER: 21,
  GULL_UP: 22,
  GULL_DOWN: 23,
  CRANE: 24,
  EAGLE: 25,
  SEAL: 26,
  HARE: 27,
  STAG: 28,
  FISH: 29,
  HOUSE: 33,
};
var tw11Flower = new Set([6, 7, 8, 9, 10]);
var tw11Terrain = new WeakMap();
function tw11h(x, y, s) {
  let a = Math.imul((x | 0) * 374761393 + (y | 0) * 668265263 + (s | 0) * 2246822519, 1274126177);
  a ^= a >>> 13;
  a = Math.imul(a, 1274126177);
  return ((a ^ (a >>> 16)) >>> 0) / 4294967296;
}
function tw11Seed(e) {
  let s = 2166136261;
  for (const ch of String(e.islandId ?? 'tw')) s = Math.imul(s ^ ch.charCodeAt(0), 16777619);
  return s >>> 0;
}
// Milestone 3: every longhouse is drawn in a northern form (v16.11 drew 4 in 10). Folio sprites 33–36 are the
// turf-roof log house, the longhouse, the stabbur and the fisher's house; the stabbur is a storehouse on posts,
// and the fisher's house reads as a later cottage, so dwellings use the longhouse (55%) and the turf-roof log house (45%).
function tw11North(id) {
  const h = (Math.imul(id | 0, 2654435761) >>> 8) % 20;
  return h < 11 ? 1 : 0;
}
function tw11Classify(e) {
  const rev = e.terrainRevision ?? 0;
  let c = tw11Terrain.get(e);
  if (c && c.rev === rev && c.cells === e.cells) return c;
  const seed = tw11Seed(e),
    cand = [],
    coast = [],
    marsh = [],
    meadow = [],
    sea = [];
  const land = (x, y) => {
    const q = cellAt(e, x, y);
    return !!q && q.land;
  };
  const water = (x, y) => {
    const q = cellAt(e, x, y);
    return !!q && q.land && q.pond;
  };
  for (const q of e.cells) {
    const { x, y } = q;
    if (!q.land) {
      if (x % 3 === 0 && y % 3 === 0) {
        let near = 0;
        for (let d = 2; d <= 5 && !near; d++)
          if (land(x + d, y) || land(x - d, y) || land(x, y + d) || land(x, y - d)) near = d;
        near && sea.push({ x, y, h: tw11h(x, y, seed + 9) });
      }
      continue;
    }
    if (q.pond || q.rock || q.elevation > 12) continue;
    const h = tw11h(x, y, seed);
    const isCoast = !land(x + 1, y) || !land(x - 1, y) || !land(x, y + 1) || !land(x, y - 1);
    const nearWater =
      !isCoast &&
      (water(x + 1, y) ||
        water(x - 1, y) ||
        water(x, y + 1) ||
        water(x, y - 1) ||
        water(x + 2, y) ||
        water(x, y + 2));
    if (isCoast) {
      coast.push({ x, y, h });
      if (h < 0.075) {
        const k = tw11h(x, y, seed + 1);
        cand.push({
          x,
          y,
          h,
          spr: k < 0.34 ? 12 : k < 0.58 ? 8 : k < 0.74 ? 13 : k < 0.9 ? 14 : k < 0.95 ? 0 : 4,
          coast: !0,
        });
      }
    } else if (nearWater) {
      marsh.push({ x, y, h });
      if (h < 0.06) {
        const k = tw11h(x, y, seed + 2);
        cand.push({ x, y, h, spr: k < 0.48 ? 7 : k < 0.88 ? 6 : 3 });
      }
    } else {
      if ((x & 3) === 0 && (y & 3) === 0) meadow.push({ x, y, h });
      if (h < 0.016) {
        const k = tw11h(x, y, seed + 3);
        cand.push({
          x,
          y,
          h,
          spr: k < 0.33 ? 9 : k < 0.53 ? 10 : k < 0.73 ? 11 : k < 0.83 ? 6 : k < 0.96 ? 14 : 5,
        });
      }
    }
  }
  const great = [];
  const ranked = meadow
    .filter((m) => Math.hypot(m.x - HAVEN.x, m.y - HAVEN.y) > 14)
    .sort((a, b) => b.h - a.h);
  for (const m of ranked) {
    if (great.length >= 2) break;
    const far = !coast.some((s) => Math.abs(s.x - m.x) < 7 && Math.abs(s.y - m.y) < 7);
    if (far && great.every((g) => Math.hypot(g.x - m.x, g.y - m.y) > 70))
      great.push({
        x: m.x + 0.5,
        y: m.y + 0.5,
        spr: great.length ? 16 : 15,
        label: great.length ? 'The Old Yew' : 'The Old Oak',
      });
  }
  c = { rev, cells: e.cells, seed, cand, coast, marsh, meadow, sea, great };
  tw11Terrain.set(e, c);
  return c;
}
var tw11Occ = new WeakMap();
function tw11Occupied(e) {
  let built = 0;
  for (const b of e.buildings) isBuilt(b) && built++;
  const stamp = `${e.terrainRevision ?? 0}|${e.placements}|${e.buildings.length}|${built}|${e.plants.length}|${e.objects.length}|${(e.bridges ?? []).length}|${e.features.length}`;
  const hit = tw11Occ.get(e);
  if (hit && hit.stamp === stamp) return hit.occ;
  const occ = new Uint8Array(GRID_W * GRID_H);
  tw11Occ.set(e, { stamp, occ });
  const mark = (x, y, r) => {
    for (let yy = Math.floor(y - r); yy <= Math.ceil(y + r); yy++)
      for (let xx = Math.floor(x - r); xx <= Math.ceil(x + r); xx++)
        xx >= 0 &&
          xx < GRID_W &&
          yy >= 0 &&
          yy < GRID_H &&
          (xx + 0.5 - x) ** 2 + (yy + 0.5 - y) ** 2 <= r * r &&
          (occ[yy * GRID_W + xx] = 1);
  };
  for (const b of e.buildings) mark(b.x, b.y, (BUILDING_SIZES[b.kind]?.radius ?? 1) + 1.3);
  for (const p of e.plants) mark(p.x, p.y, 1.1);
  for (const o of e.objects) mark(o.x, o.y, 1);
  for (const f of e.features) mark(f.x, f.y, f.kind === 'hill' ? 0.5 : 2.4);
  for (const b of e.bridges ?? []) for (const t of bridgeTiles(b)) mark(t.x + 0.5, t.y + 0.5, 1.2);
  for (const q of e.cells) q.road && (occ[q.y * GRID_W + q.x] = 1);
  return occ;
}
function tw11Static(a, n, v) {
  const p = project(v.x, v.y),
    s = v.size;
  p.y -= v.elev;
  a.push({
    kind: 'decor',
    value: v,
    depth: v.x + v.y,
    order: n,
    x0: p.x - s * 0.62,
    x1: p.x + s * 0.62,
    y0: p.y - s - (v.label ? 4 : 2),
    y1: p.y + (v.label ? 24 : 6),
    vk: mix(
      mix(mix(2166136261, v.spr + 977), Math.round(p.x * 2)),
      Math.round(p.y * 2) * 4 + (v.flip > 0 ? 1 : 2),
    ),
    q: 0,
  });
}
var tw11Size = [64, 50, 64, 44, 58, 50, 34, 40, 36, 38, 52, 38, 46, 40, 42, 214, 192];
function tw11Decor(e, season, a, n) {
  const T = tw11Classify(e),
    occ = tw11Occupied(e),
    free = (x, y) => !occ[Math.floor(y) * GRID_W + Math.floor(x)];
  const elev = (x, y) => cellAt(e, x, y)?.elevation ?? 0;
  const add = (x, y, spr, scale = 1, label) => {
    if (season === 3 && tw11Flower.has(spr)) return;
    const j = tw11h(x * 3, y * 5, T.seed + 4);
    tw11Static(a, n++, {
      x,
      y,
      spr,
      size: tw11Size[spr] * scale * (0.86 + j * 0.28),
      flip: j > 0.5 ? -1 : 1,
      elev: elev(x, y),
      label,
    });
  };
  for (const c of T.cand)
    free(c.x, c.y) && add(c.x + 0.3 + c.h * 5, c.y + 0.4 + ((c.h * 37) % 1) * 0.3, c.spr);
  for (const g of T.great)
    free(g.x, g.y) &&
      free(g.x + 1, g.y) &&
      free(g.x, g.y + 1) &&
      free(g.x - 1, g.y) &&
      free(g.x, g.y - 1) &&
      add(g.x, g.y, g.spr, 1, g.label);
  for (const b of e.buildings) {
    if (!isBuilt(b)) continue;
    const r = (BUILDING_SIZES[b.kind]?.radius ?? 1) + 1.6;
    if (b.kind === 'farm' && (season === 1 || season === 2))
      for (let k = 0; k < 2; k++) {
        const ang = tw11h(b.id, k, 11) * 6.28,
          x = b.x + Math.cos(ang) * r,
          y = b.y + Math.sin(ang) * r,
          q = cellAt(e, x, y);
        q?.land && !q.pond && !q.road && add(x, y, 1);
      }
    if (b.kind === 'fishery' || b.kind === 'harbor')
      for (let k = 0; k < 3; k++) {
        const ang = tw11h(b.id, k, 12) * 6.28,
          x = b.x + Math.cos(ang) * r,
          y = b.y + Math.sin(ang) * r,
          q = cellAt(e, x, y);
        q?.land && !q.pond && !q.road && add(x, y, [2, 4, 0][k]);
      }
  }
  return n;
}
function tw11DrawDecor(e, t, v, z) {
  const img = t.images.folio;
  if (!ready(img)) return;
  const p = project(v.x, v.y);
  p.y -= v.elev;
  if (v.spr === 0 || v.spr === 12) {
    e.fillStyle = t.style === 'carta' ? 'rgba(120,104,70,.18)' : 'rgba(110,90,60,.16)';
    e.beginPath();
    e.ellipse(p.x, p.y + 1, v.size * 0.5, v.size * 0.12, 0, 0, Math.PI * 2);
    e.fill();
  }
  sprite(
    e,
    img,
    v.spr,
    p.x,
    p.y,
    v.size,
    1,
    v.flip,
    'folio',
    v.size > 120 ? tier(v.size * z) : 0,
    t.season === 2 && v.spr === 15
      ? 'sepia(.5) saturate(1.6) hue-rotate(-18deg)'
      : t.season === 3 && v.spr === 15
        ? 'saturate(.35) brightness(1.2)'
        : 'none',
  );
  if (v.label && t.style === 'carta') {
    e.save();
    e.font = 'italic 13px Georgia, serif';
    e.textAlign = 'center';
    e.fillStyle = 'rgba(239,228,200,.75)';
    const w = e.measureText(v.label).width;
    e.fillRect(p.x - w / 2 - 4, p.y + 7, w + 8, 16);
    e.fillStyle = 'rgba(43,33,24,.85)';
    e.fillText(v.label, p.x, p.y + 19);
    e.restore();
  }
}
var tw11Life = new WeakMap();
function tw11Anchors(e) {
  const T = tw11Classify(e);
  const stamp = `${T.rev}|${e.placements}|${e.buildings.length}|${e.plants.length}`;
  let L = tw11Life.get(e);
  if (L && L.stamp === stamp) return L;
  const occ = tw11Occupied(e),
    seed = T.seed,
    list = [];
  const pick = (arr, n, salt, ok = () => !0, gap = 18) => {
    const out = [];
    const sorted = arr.map((c) => ({ c, k: tw11h(c.x, c.y, seed + salt) })).sort((a, b) => a.k - b.k);
    for (const { c } of sorted) {
      if (out.length >= n) break;
      ok(c) && out.every((o) => Math.hypot(o.x - c.x, o.y - c.y) > gap) && out.push(c);
    }
    return out;
  };
  const free = (c) => !occ[c.y * GRID_W + c.x];
  let id = 1;
  for (const s of pick(T.sea, 12, 21, () => !0, 26))
    for (let k = 0; k < 5; k++)
      list.push({
        id: id++,
        kind: 'eider',
        x: s.x + 0.5 + (k % 3) * 0.7,
        y: s.y + 0.5 + Math.floor(k / 3) * 0.8,
        spr: 21,
        s: 22,
        r: 0.6,
      });
  for (const s of pick(T.coast, 16, 22, () => !0, 20))
    list.push({
      id: id++,
      kind: 'gull',
      x: s.x + 0.5,
      y: s.y + 0.5,
      spr: 22,
      s: 24,
      r: 3.2,
      lift: 46 + tw11h(s.x, s.y, 5) * 40,
    });
  for (const s of pick(T.marsh, 3, 23, free, 30))
    for (let k = 0; k < 2; k++)
      list.push({
        id: id++,
        kind: 'crane',
        x: s.x + 0.5 + k * 0.9,
        y: s.y + 0.5 + k * 0.3,
        spr: 24,
        s: 36,
        r: 0.5,
      });
  for (const s of pick(T.coast, 2, 24, () => !0, 90))
    list.push({ id: id++, kind: 'eagle', x: s.x + 0.5, y: s.y + 0.5, spr: 25, s: 44, r: 6, lift: 130 });
  for (const s of pick(T.coast, 8, 25, free, 24))
    for (let k = 0; k < 3; k++)
      list.push({
        id: id++,
        kind: 'seal',
        x: s.x + 0.5 + k * 0.6,
        y: s.y + 0.5 + (k % 2) * 0.5,
        spr: 26,
        s: 30,
        r: 0.05,
      });
  for (const s of pick(T.meadow, 12, 26, free, 20))
    list.push({ id: id++, kind: 'hare', x: s.x + 0.5, y: s.y + 0.5, spr: 27, s: 20, r: 1.4 });
  for (const s of pick(
    T.meadow,
    3,
    27,
    (c) => free(c) && e.plants.some((p) => Math.abs(p.x - c.x) < 4 && Math.abs(p.y - c.y) < 4),
    40,
  ))
    list.push({ id: id++, kind: 'stag', x: s.x + 0.5, y: s.y + 0.5, spr: 28, s: 44, r: 1.2 });
  for (const f of e.features) {
    if (f.kind !== 'hill' || tw11h(f.id, 1, seed) > 0.45) continue;
    for (let k = 0; k < 3; k++)
      list.push({
        id: id++,
        kind: 'sheep',
        x: f.x + 1.2 + k * 0.8,
        y: f.y + 2 + (k % 2) * 0.7,
        spr: 20,
        s: 25,
        r: 0.8,
      });
  }
  for (const b of e.buildings) {
    if (!isBuilt(b)) continue;
    const r = (BUILDING_SIZES[b.kind]?.radius ?? 1) + 2.2,
      h = tw11h(b.id, 3, seed);
    if (b.kind === 'farm')
      for (let k = 0; k < 2; k++)
        list.push({
          id: id++,
          kind: 'stock',
          x: b.x + Math.cos(h * 6.28 + k) * r,
          y: b.y + Math.sin(h * 6.28 + k) * r,
          spr: h < 0.5 ? 18 : 19,
          s: h < 0.5 ? 40 : 26,
          r: 0.7,
        });
    if (b.kind === 'cottage' && h < 0.22)
      list.push({
        id: id++,
        kind: 'pony',
        x: b.x + Math.cos(h * 40) * r,
        y: b.y + Math.sin(h * 40) * r,
        spr: 17,
        s: 31,
        r: 0.6,
      });
  }
  const ok = list.filter(
    (m) =>
      m.kind === 'eider' ||
      m.kind === 'gull' ||
      m.kind === 'eagle' ||
      (cellAt(e, m.x, m.y)?.land && !cellAt(e, m.x, m.y)?.pond && !cellAt(e, m.x, m.y)?.road),
  );
  L = { stamp, list: ok.slice(0, 160) };
  tw11Life.set(e, L);
  return L;
}
function tw11Ambient(e, season, now, still) {
  const out = [],
    t = still ? 0 : now;
  for (const m of tw11Anchors(e).list) {
    if (season === 3 && (m.kind === 'crane' || m.kind === 'eider')) continue;
    const ph = m.id * 1.7;
    let x = m.x,
      y = m.y,
      dir = 1,
      spr = m.spr,
      lift = m.lift ?? 0,
      bob = 0;
    if (m.kind === 'gull' || m.kind === 'eagle') {
      const w = (m.kind === 'gull' ? 4.2e-4 : 1.6e-4) * (m.id % 2 ? 1 : -1),
        a = t * w + ph;
      x += Math.cos(a) * m.r;
      y += Math.sin(a) * m.r * 0.8;
      dir = -Math.sin(a) * w - Math.cos(a) * w * 0.8 < 0 ? -1 : 1;
      m.kind === 'gull' && (spr = Math.floor(t / 210 + m.id) % 3 === 0 ? 23 : 22);
      lift += Math.sin(t * 9e-4 + ph) * 6;
    } else if (m.r > 0.1) {
      const cyc = (t * 6e-5 + ph * 0.13) % 1,
        a = Math.floor(t * 6e-5 + ph * 0.13) * 2.4 + ph;
      const k = cyc < 0.7 ? 0 : (cyc - 0.7) / 0.3,
        s = k * k * (3 - 2 * k);
      const a0 = a - 2.4;
      x += Math.cos(a0) * m.r * (1 - s) + Math.cos(a) * m.r * s;
      y += Math.sin(a0) * m.r * (1 - s) * 0.7 + Math.sin(a) * m.r * s * 0.7;
      dir = Math.cos(a) - Math.cos(a0) < 0 ? -1 : 1;
      m.kind === 'eider' && (bob = Math.sin(t * 2e-3 + ph) * 0.8);
      m.kind === 'hare' && k > 0 && k < 1 && (bob = Math.abs(Math.sin(t * 0.012)) * 3);
    } else dir = m.id % 2 ? 1 : -1;
    out.push({ x, y, s: m.s, lift, spr, dir, bob, kind: m.kind });
  }
  // Milestone 3, seasons beyond palette: in autumn and winter, longhouse hearths smoke (about every other house).
  if (season >= 2) {
    let n = 0;
    for (const b of e.buildings) {
      if (b.kind !== 'cottage' || b.buildProgress < 1 - 1e-8 || (Math.imul(b.id, 2654435761) >>> 29) % 2) continue;
      if (++n > 160) break;
      out.push({ x: b.x, y: b.y, s: 26, lift: 30, spr: 0, dir: 1, bob: 0, kind: 'smoke', ph: (b.id % 97) / 97, t, winter: season === 3 });
    }
  }
  return out;
}
function tw11DrawAmbient(e, t, a) {
  const m = a.ambient,
    img = t.images.folio;
  const d = project(a.x, a.y);
  d.y -= cellAt(t.world, a.x, a.y)?.elevation ?? 0;
  if (m.kind === 'smoke') {
    // Three puffs rising from the roof ridge and drifting downwind, fading as they go.
    const carta = t.style === 'carta';
    e.save();
    for (let k = 0; k < 3; k++) {
      const c = (m.t * 1.6e-4 + m.ph + k / 3) % 1,
        r = 3 + c * 7;
      e.globalAlpha = (1 - c) * (m.winter ? 0.5 : 0.38);
      e.fillStyle = carta ? '#8a8378' : '#d9dde0';
      e.beginPath();
      e.arc(d.x + 4 + c * 14 + Math.sin(c * 6 + m.ph * 9) * 2, d.y - 34 - c * 34, r, 0, Math.PI * 2);
      e.fill();
    }
    e.restore();
    return;
  }
  if (!ready(img)) return;
  const carta = t.style === 'carta',
    fly = m.kind === 'gull' || m.kind === 'eagle';
  if (fly) {
    e.fillStyle = 'rgba(30,40,40,.08)';
    e.beginPath();
    e.ellipse(d.x, d.y + 2, m.s * 0.3, m.s * 0.08, 0, 0, Math.PI * 2);
    e.fill();
  } else if (m.kind === 'eider') {
    e.strokeStyle = carta ? 'rgba(43,60,58,.4)' : 'rgba(215,252,245,.4)';
    e.lineWidth = 0.7;
    e.beginPath();
    e.ellipse(d.x, d.y + 2, m.s * 0.42, 2.4, 0, 0.2, 2.9);
    e.stroke();
  } else {
    e.fillStyle = 'rgba(42,50,40,.16)';
    e.beginPath();
    e.ellipse(d.x, d.y + 2, m.s * 0.34, m.s * 0.09, 0, 0, Math.PI * 2);
    e.fill();
  }
  sprite(e, img, m.spr, d.x, d.y - m.lift - m.bob, m.s, 1, m.dir, 'folio', 0, 'none');
}
function tw11Maelstrom(e, x, y, n, u) {
  e.save();
  e.translate(x, y);
  e.scale(u, u * 0.55);
  e.lineCap = 'round';
  const rot = n * 1.6e-4;
  for (let k = 0; k < 3; k++) {
    e.strokeStyle = k ? 'rgba(43,60,58,.55)' : '#2b2118';
    e.lineWidth = k ? 1.4 : 2.2;
    e.beginPath();
    for (let s = 0; s < 120; s++) {
      const a = rot + k * 2.09 + s * 0.12,
        r = 6 + s * 0.85;
      s ? e.lineTo(Math.cos(a) * r, Math.sin(a) * r) : e.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    e.stroke();
  }
  e.fillStyle = 'rgba(43,60,58,.5)';
  e.beginPath();
  e.arc(0, 0, 6, 0, Math.PI * 2);
  e.fill();
  e.restore();
}
function tw11Kraken(e, x, y, n, u) {
  const o = (n * 7e-5 + 0.25) % 1,
    l = Math.sin(o * Math.PI);
  if (l < 0.08) return;
  e.save();
  e.translate(x, y);
  e.scale(u, u);
  e.globalAlpha *= Math.min(1, l * 1.6);
  e.lineCap = 'round';
  e.lineJoin = 'round';
  for (let k = 0; k < 5; k++) {
    const bx = -80 + k * 40,
      h = (46 + (k % 2) * 20) * l,
      sw = Math.sin(n * 1.2e-3 + k) * 10;
    const path = new Path2D(
      `M${bx - 9} 0 C${bx - 12} ${-h * 0.5} ${bx + sw - 14} ${-h * 0.9} ${bx + sw + 6} ${-h} C${bx + sw + 16} ${-h * 1.02} ${bx + sw + 14} ${-h * 0.8} ${bx + sw + 4} ${-h * 0.82} C${bx + 4} ${-h * 0.7} ${bx + 9} ${-h * 0.4} ${bx + 9} 0 Z`,
    );
    e.fillStyle = k % 2 ? '#a3584a' : '#b8695a';
    e.fill(path);
    e.strokeStyle = '#2b2118';
    e.lineWidth = 2.2;
    e.stroke(path);
    e.fillStyle = '#efe4c8';
    for (let s = 1; s < 4; s++) {
      e.beginPath();
      e.arc(bx + 3 + sw * s * 0.2, -h * s * 0.2, 2, 0, Math.PI * 2);
      e.fill();
    }
  }
  e.strokeStyle = 'rgba(43,33,24,.55)';
  e.lineWidth = 1.2;
  e.beginPath();
  for (let c = -110; c <= 110; c += 22) {
    e.moveTo(c, 4);
    e.quadraticCurveTo(c + 6, 1, c + 12, 4);
  }
  e.stroke();
  e.restore();
}
var tw11Scratch = null;
function tw11Rings(e, m, x) {
  const cv = e.canvas,
    s = tw11Scratch || (tw11Scratch = document.createElement('canvas'));
  (s.width !== cv.width || s.height !== cv.height) && ((s.width = cv.width), (s.height = cv.height));
  const g = s.getContext('2d');
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'source-over';
  g.clearRect(0, 0, s.width, s.height);
  g.setTransform(e.getTransform());
  g.lineJoin = 'round';
  g.lineCap = 'round';
  [30, 23, 17, 12, 7.5]
    .map((C) => C * x)
    .forEach((C, R) => {
      g.globalCompositeOperation = 'source-over';
      g.strokeStyle = `rgba(43,50,48,${0.18 + R * 0.07})`;
      g.lineWidth = C * 2 + 1.1 * x;
      g.stroke(m);
      g.globalCompositeOperation = 'destination-out';
      g.lineWidth = C * 2 - 1.1 * x;
      g.strokeStyle = '#000';
      g.stroke(m);
    });
  g.globalCompositeOperation = 'source-over';
  e.save();
  e.setTransform(1, 0, 0, 1, 0, 0);
  e.globalCompositeOperation = 'source-over';
  e.drawImage(s, 0, 0);
  e.restore();
}

export {
  tw11Ambient,
  tw11Decor,
  tw11DrawAmbient,
  tw11DrawDecor,
  tw11Kraken,
  tw11Maelstrom,
  tw11North,
  tw11Rings,
};

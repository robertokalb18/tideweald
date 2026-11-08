// Recovered from the Tideweald v16.11 build. Module: render/world-draw
import { __publicField } from '../lib/runtime.js';
import { PALETTES, pattern } from './chart.js';
import { tw11Decor, tw11North, tw11Rings } from './folio.js';
import { drawRoads } from './roads-villagers.js';
import { drawStatic } from './scene.js';
import { plantLook, preparedPlant, preparedSprite, spriteRect } from './sprites.js';
import { contourRings, meadowPattern, texturePattern } from './textures.js';
import { kc } from './tile-cache.js';
import { bridgeAt, bridgeTiles } from '../settlement/bridges.js';
import { BUILDING_SIZES, CATALOG, GRID_H, GRID_W, clamp, isBuilt } from '../world/catalog.js';
import { cellAt } from '../world/world.js';

var TILE_W = 58,
  TILE_H = 29,
  isWaterCell = (e, t, a) => {
    let n = cellAt(e, t, a);
    return !!n && (!n.land || n.pond);
  },
  project = (e, t) => ({
    x: ((e - GRID_W / 2 - (t - GRID_H / 2)) * TILE_W) / 2,
    y: ((e - GRID_W / 2 + (t - GRID_H / 2)) * TILE_H) / 2,
  });
function unproject(e, t, a) {
  let n = (e - a.x) / a.zoom,
    r = (t - a.y) / a.zoom;
  return { x: n / TILE_W + r / TILE_H + GRID_W / 2, y: r / TILE_H - n / TILE_W + GRID_H / 2 };
}
var worldToTile = (e, t) => ({
    x: e / TILE_W + t / TILE_H + GRID_W / 2,
    y: t / TILE_H - e / TILE_W + GRID_H / 2,
  }),
  HM = 24,
  ready = (e) => !!e?.complete && !!e.naturalWidth;
function diamond(e, t, a, n = TILE_W, r = TILE_H) {
  (e.beginPath(),
    e.moveTo(t, a),
    e.lineTo(t + n / 2, a + r / 2),
    e.lineTo(t, a + r),
    e.lineTo(t - n / 2, a + r / 2),
    e.closePath());
}
function sprite(e, t, a, n, r, o, l = 1, s = 1, c = 'flora', u = 0, d = 'none') {
  if (!ready(t)) return;
  let m = spriteRect(c, a),
    h = o / Math.max(m.w, m.h),
    p = m.w * h,
    g = m.h * h,
    v = preparedSprite(t, c, a, d, u);
  if (s === 1) {
    let M = e.globalAlpha;
    ((e.globalAlpha = M * l), e.drawImage(v, n - p / 2, r - g * 0.94, p, g), (e.globalAlpha = M));
    return;
  }
  (e.save(),
    e.translate(n, r),
    e.scale(s, 1),
    (e.globalAlpha *= l),
    e.drawImage(v, -p / 2, -g * 0.94, p, g),
    e.restore());
}
var tier = (e) => (e > 420 ? 520 : e > 300 ? 400 : e > 220 ? 300 : e > 150 ? 240 : 0);
function plantFilter(e, t, a) {
  let n = t.deciduous && a === 2 && e.growth > 0.45,
    r = n ? 'sepia(.65) saturate(2.2) hue-rotate(-24deg)' : 'none';
  return (
    a === 3 &&
      e.growth > 0.45 &&
      (r = t.tree ? 'saturate(.38) brightness(1.25)' : 'saturate(.2) brightness(1.35)'),
    e.health < 0.5 && (r = 'sepia(.65) saturate(.5)'),
    { filter: r, fall: n }
  );
}
var GROWTH_STEPS = 12;
function shown(e) {
  let t = e.growth >= 0.97 ? 1 : Math.floor(e.growth * GROWTH_STEPS) / GROWTH_STEPS,
    a = Math.round(e.health * 5) / 5;
  return t === e.growth && a === e.health ? e : { ...e, growth: t, health: a };
}
function drawPlant(e, t, a, n, r, o, l, s, c = !1) {
  let u = shown(t),
    d = project(u.x, u.y),
    m = plantLook(u),
    h = cellAt(n, u.x, u.y);
  d.y -= h?.elevation ?? 0;
  let p = a[m.atlas];
  if (!ready(p)) return;
  let g = r > 2.4 ? 256 : r > 1.6 ? 192 : r > 1.1 ? 144 : r > 0.75 ? 120 : 96,
    v = s?.cv;
  if (!v || !v.width || (!c && s.res !== g)) {
    let { filter: x, fall: T } = plantFilter(u, m, o),
      C = m.tree && l && u.growth > 0.45;
    ((v = preparedPlant(p, m.atlas, m.index, x, m.flip, m.tree, T, C, -1, a.botanical, a.norse, g)),
      s && ((s.cv = v), (s.res = g)));
  }
  let M = m.size / 168,
    w = M * m.wide,
    y = m.tree && u.growth > 0.65 && u.variant > 0.65 ? 12 + (u.id % 4) : -1;
  y >= 0 &&
    sprite(e, a.botanical, y, d.x + m.size * 0.2, d.y + m.size * 0.065, m.size * 0.34, 1, 1, 'botanical');
  let k = e.globalAlpha;
  ((e.globalAlpha = k * Math.max(0.28, u.health)),
    e.drawImage(v, d.x - 96 * w, d.y - 178 * M, 192 * w, 208 * M),
    (e.globalAlpha = k));
}
function buildingSprite(e) {
  let f = e.kind === 'cottage' ? tw11North(e.id) : -1;
  return f >= 0
    ? { atlas: 'folio', index: 33 + f }
    : {
        atlas: e.kind === 'cottage' ? 'cottages' : (CATALOG[e.kind]?.atlas ?? 'settlement'),
        index: e.kind === 'cottage' ? e.id % 6 : (CATALOG[e.kind]?.sprite ?? 0),
      };
}
function drawBuildingStatic(e, t, a, n, r, o) {
  let l = project(t.x, t.y);
  l.y -= cellAt(n, t.x, t.y)?.elevation ?? 0;
  let s = BUILDING_SIZES[t.kind]?.size ?? 132;
  if (isBuilt(t)) {
    let c = buildingSprite(t);
    sprite(e, a[c.atlas], c.index, l.x, l.y + s * 0.15, s, 1, t.orientation ? -1 : 1, c.atlas, tier(s * r));
  } else {
    let c = buildingSprite(t),
      u = a[c.atlas],
      d = t.orientation ? -1 : 1,
      m = l.y + s * 0.15,
      h = tier(s * r),
      p = Math.min(11, Math.floor(t.buildProgress * 12)) / 12;
    if (ready(u) && ready(a.construction) && p < 8 / 12) {
      let g =
        o === PALETTES.carta
          ? 'grayscale(1) sepia(.5) brightness(1.35) contrast(.9)'
          : 'grayscale(.85) brightness(1.3)';
      (sprite(e, u, c.index, l.x, m, s, 0.2, d, c.atlas, h, g),
        sprite(
          e,
          a.construction,
          p < 4 / 12 ? 0 : 1,
          l.x,
          m,
          Math.min(s, 170) * 0.95,
          1,
          d,
          'construction',
          h,
        ));
    } else if (ready(u)) {
      let g = spriteRect(c.atlas, c.index),
        v = s / Math.max(g.w, g.h),
        M = g.w * v,
        w = g.h * v,
        y = m - w * 0.94,
        k = y + w;
      ((e.fillStyle = 'rgba(120,92,52,.28)'),
        e.beginPath(),
        e.ellipse(l.x, l.y + 2, s * 0.36, s * 0.13, 0, 0, Math.PI * 2),
        e.fill(),
        sprite(
          e,
          u,
          c.index,
          l.x,
          m,
          s,
          0.34,
          d,
          c.atlas,
          h,
          o === PALETTES.carta
            ? 'grayscale(1) sepia(.5) brightness(1.35) contrast(.9)'
            : 'grayscale(.85) brightness(1.3)',
        ));
      let x = ready(a.construction)
          ? Math.max(0.08, ((p - 8 / 12) / (4 / 12)) * 0.92 + 0.08)
          : Math.max(0.06, p),
        T = k - w * x;
      (e.save(),
        e.beginPath(),
        e.rect(l.x - M, T, M * 2, k - T + 2),
        e.clip(),
        sprite(e, u, c.index, l.x, m, s, 1, d, c.atlas, h, 'saturate(.75)'),
        e.restore(),
        (e.strokeStyle = o === PALETTES.carta ? '#5a4028' : '#6b4a2a'),
        (e.lineWidth = Math.max(1, s * 0.018)),
        (e.lineCap = 'round'),
        e.beginPath());
      for (let C of [-0.34, -0.12, 0.12, 0.34]) {
        let R = l.x + C * M;
        (e.moveTo(R, k - w * 0.08), e.lineTo(R, Math.max(y + w * 0.1, T - w * 0.12)));
      }
      (e.moveTo(l.x - M * 0.38, T),
        e.lineTo(l.x + M * 0.38, T),
        e.moveTo(l.x - M * 0.38, T + w * 0.1),
        e.lineTo(l.x + M * 0.38, T + w * 0.1),
        e.stroke(),
        (e.fillStyle = o === PALETTES.carta ? '#c9a66b' : '#c49a5a'),
        e.fillRect(l.x - M * 0.4, T - 2, M * 0.8, 3));
    } else
      sprite(
        e,
        a.construction,
        Math.min(2, Math.floor(t.buildProgress * 3)),
        l.x,
        m,
        s * 0.95,
        1,
        1,
        'construction',
        h,
      );
    sprite(e, a.characters, 3, l.x + s * 0.37, l.y + s * 0.18, 25, 1, 1, 'characters');
  }
}
function drawFeature(e, t, a, n) {
  let r = project(t.x, t.y);
  sprite(
    e,
    a.settlement,
    t.kind === 'snowpeak' ? 7 : 6,
    r.x,
    r.y + 30,
    230,
    1,
    1,
    'settlement',
    tier(230 * n),
  );
}
function drawObject(e, t) {
  let a = project(t.x, t.y),
    n = t.kind === 'nuclear';
  ((e.fillStyle = n ? '#d0b552' : '#a2a0a5'),
    e.beginPath(),
    e.roundRect(a.x - 10, a.y - 24, 20, 24, 4),
    e.fill(),
    (e.strokeStyle = n ? '#746a38' : '#666e76'),
    (e.lineWidth = 2),
    e.stroke(),
    (e.fillStyle = '#434b39'),
    (e.textAlign = 'center'),
    (e.font = '17px sans-serif'),
    e.fillText(n ? '\u2248' : '\xD7', a.x, a.y - 6));
}
var STATIC_CELL = 160,
  StaticIndex = class s2 {
    constructor(t) {
      __publicField(this, 'list', []);
      __publicField(this, 'grid', new Map());
      __publicField(this, 'query', 0);
      (t.sort((a, n) => a.depth - n.depth || a.order - n.order),
        t.forEach((a, n) => {
          a.order = n;
        }),
        (this.list = t));
      for (let a of t)
        for (let n = Math.floor(a.x0 / STATIC_CELL); n <= Math.floor(a.x1 / STATIC_CELL); n++)
          for (let r = Math.floor(a.y0 / STATIC_CELL); r <= Math.floor(a.y1 / STATIC_CELL); r++) {
            let o = (n + 1e3) * 4096 + (r + 1e3),
              l = this.grid.get(o);
            (l || this.grid.set(o, (l = [])), l.push(a));
          }
    }
    inRect(t, a, n, r, o = []) {
      let l = ++this.query;
      for (let s = Math.floor(t / STATIC_CELL); s <= Math.floor(n / STATIC_CELL); s++)
        for (let c = Math.floor(a / STATIC_CELL); c <= Math.floor(r / STATIC_CELL); c++) {
          let u = this.grid.get((s + 1e3) * 4096 + (c + 1e3));
          if (u)
            for (let d of u)
              d.q !== l && ((d.q = l), !(d.x1 < t || d.x0 > n || d.y1 < a || d.y0 > r) && o.push(d));
        }
      return o;
    }
  };
var i2 = StaticIndex,
  mix = (e, t) => Math.imul(e ^ (t | 0), 16777619) >>> 0;
function staticsFor(e, t) {
  let a = [],
    n = 0;
  for (let r of e.plants) {
    let o = shown(r),
      l = project(o.x, o.y),
      s = cellAt(e, o.x, o.y)?.elevation ?? 0;
    l.y -= s;
    let c = plantLook(o),
      u = c.size / 168,
      d = u * c.wide,
      { filter: m } = plantFilter(o, c, t),
      h = mix(mix(mix(2166136261, o.id), c.index * 31 + (c.atlas.length << 8)), Math.round(c.size));
    ((h = mix(h, Math.round(Math.max(0.28, o.health) * 10) * 7 + m.length)),
      (h = mix(
        h,
        (c.flip > 0 ? 1 : 2) + (o.growth > 0.65 && o.variant > 0.65 ? 4 : 0) + (o.growth > 0.45 ? 8 : 0),
      )),
      (h = mix(h, Math.round(l.x * 2))),
      (h = mix(h, Math.round(l.y * 2))),
      a.push({
        kind: 'plant',
        value: r,
        depth: o.x + o.y,
        order: n++,
        x0: l.x - Math.max(96 * d, c.size * 0.4),
        x1: l.x + Math.max(96 * d, c.size * 0.4),
        y0: l.y - 178 * u - 2,
        y1: l.y + 32 * u + c.size * 0.1 + 2,
        vk: h,
        q: 0,
      }));
  }
  for (let r of e.objects) {
    let o = project(r.x, r.y);
    a.push({
      kind: 'object',
      value: r,
      depth: r.x + r.y,
      order: n++,
      x0: o.x - 13,
      x1: o.x + 13,
      y0: o.y - 27,
      y1: o.y + 2,
      vk: mix(r.id, r.kind.length),
      q: 0,
    });
  }
  for (let r of e.buildings) {
    let o = project(r.x, r.y);
    o.y -= cellAt(e, r.x, r.y)?.elevation ?? 0;
    let l = BUILDING_SIZES[r.kind]?.size ?? 132,
      s = isBuilt(r) ? 99 : Math.min(11, Math.floor(r.buildProgress * 12)),
      c = mix(
        mix(mix(2166136261, r.id), r.kind.length * 131 + r.kind.charCodeAt(0)),
        s * 4 + (r.orientation ?? 0),
      );
    ((c = mix(mix(c, Math.round(o.x * 2)), Math.round(o.y * 2))),
      a.push({
        kind: 'building',
        value: r,
        depth: r.x + r.y,
        order: n++,
        x0: o.x - l * 0.56,
        x1: o.x + l * 0.56,
        y0: o.y + l * 0.15 - l * 0.96,
        y1: o.y + Math.max(l * 0.22, l * 0.15 + l * 0.08) + 4,
        vk: c,
        q: 0,
      }));
  }
  for (let r of e.features) {
    if (r.kind === 'hill') continue;
    let o = project(r.x, r.y);
    a.push({
      kind: 'feature',
      value: r,
      depth: r.x + r.y,
      order: n++,
      x0: o.x - 118,
      x1: o.x + 118,
      y0: o.y + 30 - 220,
      y1: o.y + 44,
      vk: mix(mix(r.id, r.kind.length), Math.round(o.x + o.y)),
      q: 0,
    });
  }
  n = tw11Decor(e, t, a, n);
  return a;
}
function ringsFor(e) {
  let t = contourRings(GRID_W, GRID_H, e),
    a = [];
  for (let n of t) {
    let r = n;
    for (
      let d = 0;
      d < (n.length > 240 ? 9 : n.length > 60 ? 5 : n.length > 16 ? 3 : n.length > 8 ? 1 : 0);
      d++
    )
      r = r.map((m, h) => {
        let p = r[(h + r.length - 1) % r.length],
          g = r[(h + 1) % r.length];
        return { x: m.x * 0.5 + (p.x + g.x) * 0.25, y: m.y * 0.5 + (p.y + g.y) * 0.25 };
      });
    let o = new Float32Array(r.length * 2),
      l = 1 / 0,
      s = 1 / 0,
      c = -1 / 0,
      u = -1 / 0;
    (r.forEach((d, m) => {
      let h = project(d.x, d.y);
      ((o[m * 2] = h.x),
        (o[m * 2 + 1] = h.y),
        (l = Math.min(l, h.x)),
        (s = Math.min(s, h.y)),
        (c = Math.max(c, h.x)),
        (u = Math.max(u, h.y)));
    }),
      a.push({ pts: o, x0: l, y0: s, x1: c, y1: u }));
  }
  return a;
}
function closedPath(e, t, a) {
  let n = new Path2D(),
    r = !1;
  for (let o of e) {
    if (o.x1 < t.x - a || o.x0 > t.x + t.w + a || o.y1 < t.y - a || o.y0 > t.y + t.h + a) continue;
    r = !0;
    let l = o.pts,
      s = l.length / 2;
    n.moveTo((l[s * 2 - 2] + l[0]) / 2, (l[s * 2 - 1] + l[1]) / 2);
    for (let c = 0; c < s; c++) {
      let u = (c + 1) % s;
      n.quadraticCurveTo(
        l[c * 2],
        l[c * 2 + 1],
        (l[c * 2] + l[u * 2]) / 2,
        (l[c * 2 + 1] + l[u * 2 + 1]) / 2,
      );
    }
    n.closePath();
  }
  return r ? n : null;
}
function strokePath(e, t, a) {
  let n = new Path2D(),
    r = !1,
    o = t.x - a,
    l = t.y - a,
    s = t.x + t.w + a,
    c = t.y + t.h + a;
  for (let u of e) {
    if (u.x1 < o || u.x0 > s || u.y1 < l || u.y0 > c) continue;
    let d = u.pts,
      m = d.length / 2,
      h = !1;
    for (let p = 0; p <= m; p++) {
      let g = (p + m - 1) % m,
        v = p % m,
        M = (p + 1) % m,
        w = (d[g * 2] + d[v * 2]) / 2,
        y = (d[g * 2 + 1] + d[v * 2 + 1]) / 2,
        k = d[v * 2],
        x = d[v * 2 + 1],
        T = (d[v * 2] + d[M * 2]) / 2,
        C = (d[v * 2 + 1] + d[M * 2 + 1]) / 2;
      Math.max(w, k, T) >= o && Math.min(w, k, T) <= s && Math.max(y, x, C) >= l && Math.min(y, x, C) <= c
        ? (h || (n.moveTo(w, y), (h = !0), (r = !0)), n.quadraticCurveTo(k, x, T, C))
        : (h = !1);
    }
  }
  return r ? n : null;
}
var I8 = new WeakMap(),
  isWet = (e) => e.weather === 'rain' || e.weather === 'storm';
function scene(e, t, a, n) {
  let r = I8.get(e);
  if (!r || r.world !== t) {
    r = {
      world: t,
      style: n,
      pal: PALETTES[n],
      images: a,
      terrain: null,
      entities: null,
      statics: null,
      staticsStamp: '',
      staticsAt: 0,
      staticsRevision: -1,
      shore: null,
      field: document.createElement('canvas'),
      fieldKey: new Int32Array(GRID_W * GRID_H).fill(-1),
      fieldAt: 0,
      fieldRevision: -1,
      fieldStamp: '',
      terrainStamp: '',
      entityStamp: '',
      water: { rev: -1, grid: new Map() },
      fire: { at: 0, rev: -1, cells: [] },
      scratch: document.createElement('canvas'),
      season: 0,
      wet: !1,
      status: { map: new Map(), cursor: 0, rev: -1, todo: 0 },
      zoom: 0,
      zoomAt: -1e9,
      fieldRow: 0,
    };
    let o = r,
      l = ((GRID_W + GRID_H) * TILE_W) / 4 + 400,
      s = ((GRID_W + GRID_H) * TILE_H) / 4 + 400,
      c = { x: -l, y: -s, w: l * 2, h: s * 2 };
    ((r.terrain = new kc(
      { draw: (u, d, m) => drawTerrainTile(u, o, d, m), fingerprint: (u) => terrainFingerprint(o, u) },
      20 * 1024 * 1024,
      c,
      HM,
      1 / 0,
    )),
      (r.entities = new kc(
        { draw: (u, d, m) => drawEntityTile(u, o, d, m), fingerprint: (u) => entityFingerprint(o, u) },
        20 * 1024 * 1024,
        c,
        1,
        4,
      )),
      I8.set(e, r));
  }
  return ((r.images = a), r.style !== n && ((r.style = n), (r.pal = PALETTES[n]), (r.fieldStamp = '')), r);
}
function shoreOf(e) {
  let t = e.world,
    a = t.terrainRevision ?? 0;
  return (
    (!e.shore || e.shore.rev !== a || e.shore.cells !== t.cells) &&
      ((e.shore = {
        rev: a,
        cells: t.cells,
        coast: ringsFor((n, r) => t.cells[r * GRID_W + n].land),
        water: ringsFor((n, r) => {
          let o = t.cells[r * GRID_W + n];
          return o.land && o.pond;
        }),
      }),
      (e.water.rev = -1)),
    e.shore
  );
}
function refreshField(e, t) {
  let a = e.world,
    n = `${e.style}|${e.season}|${e.wet}`,
    r = e.field,
    o = e.fieldStamp !== n;
  if (!o && e.fieldRow >= GRID_H) {
    if (e.fieldRevision === a.revision || t - e.fieldAt < 500) return !1;
    ((e.fieldRow = 0), (e.fieldRevision = a.revision), (e.fieldAt = t));
  }
  (o && ((e.fieldStamp = n), (e.fieldRow = 0), (e.fieldAt = t), (e.fieldRevision = a.revision)),
    r.width !== GRID_W && ((r.width = GRID_W), (r.height = GRID_H)));
  let l = o ? GRID_H : 16,
    s = e.fieldRow,
    c = Math.min(GRID_H, s + l);
  e.fieldRow = c;
  let u = r.getContext('2d', { willReadFrequently: !0 }),
    d = u.getImageData(0, s, GRID_W, c - s),
    m = d.data,
    h = e.pal,
    p = e.season,
    g = e.wet,
    v = 0;
  for (let M = s * GRID_W; M < c * GRID_W; M++) {
    let w = a.cells[M],
      y =
        (w.land ? 1 : 0) |
        (w.pond ? 2 : 0) |
        (w.rock ? 4 : 0) |
        (((w.soil * 8) | 0) << 3) |
        (((w.moisture * 8) | 0) << 8) |
        (((w.snow * 16) | 0) << 13) |
        (((w.toxicity * 8) | 0) << 18) |
        (((w.radiation * 8) | 0) << 21) |
        ((Math.min(31, w.elevation / 3) | 0) << 24) |
        (w.road ? 1 << 29 : 0);
    if (
      ((y = mix(
        y,
        (w.oil * 8) |
          0 |
          (((w.fuel * 8) | 0) << 3) |
          (((w.texture * 8) | 0) << 6) |
          ((((w.x > 0 ? a.cells[M - 1].elevation : 0) - (w.x < GRID_W - 1 ? a.cells[M + 1].elevation : 0)) |
            0) <<
            9),
      )),
      !o && e.fieldKey[M] === y)
    )
      continue;
    ((e.fieldKey[M] = y), v++);
    let k = (((w.soil * 8) | 0) + 0.5) / 8,
      x = (((w.moisture * 8) | 0) + 0.5) / 8,
      T = Math.min(1, k * 1.9),
      C = h.dry[0] + (h.meadow[0] - h.dry[0]) * T,
      R = h.dry[1] + (h.meadow[1] - h.dry[1]) * T,
      b = h.dry[2] + (h.meadow[2] - h.dry[2]) * T,
      A = (L, N) => {
        ((N = clamp(N)), (C += (L[0] - C) * N), (R += (L[1] - R) * N), (b += (L[2] - b) * N));
      };
    if (
      (p === 1 && A(h.summer, 0.2),
      p === 2 && A(h.autumn, 0.4),
      A(h.lush, x * 0.38),
      A(h.toxic, w.toxicity * 0.4),
      A(h.rad, w.radiation * 0.43),
      h === PALETTES.carta && w.land && !w.pond)
    ) {
      let L = mottle(w.x, w.y);
      A(L > 0 ? h.lush : h.dry, Math.abs(L) * 0.55);
    }
    let E = (w.x > 0 ? a.cells[M - 1].elevation : 0) - (w.x < GRID_W - 1 ? a.cells[M + 1].elevation : 0),
      V = (w.texture - 0.5) * 10 - E * 0.9;
    ((C += V),
      (R += V),
      (b += V),
      w.pond && ((C = h.lush[0]), (R = h.lush[1]), (b = h.lush[2])),
      g && !w.pond && A(h.wetTint, x * 0.2),
      A(h.snow, w.snow * 0.96));
    let Z = (M - s * GRID_W) * 4;
    ((m[Z] = C), (m[Z + 1] = R), (m[Z + 2] = b), (m[Z + 3] = 255));
  }
  return (v && u.putImageData(d, 0, s), v > 0);
}
function hash2(e, t) {
  let a = Math.imul(e * 374761393 + t * 668265263, 1274126177);
  return ((a ^= a >>> 13), (a = Math.imul(a, 1274126177)), ((a ^ (a >>> 16)) >>> 0) / 4294967296);
}
function vnoise(e, t) {
  let a = Math.floor(e),
    n = Math.floor(t),
    r = e - a,
    o = t - n,
    l = r * r * (3 - 2 * r),
    s = o * o * (3 - 2 * o),
    c = hash2(a, n),
    u = hash2(a + 1, n),
    d = hash2(a, n + 1),
    m = hash2(a + 1, n + 1);
  return (c * (1 - l) + u * l) * (1 - s) + (d * (1 - l) + m * l) * s;
}
var $8 = new Float32Array(GRID_W * GRID_H).fill(NaN);
function mottle(e, t) {
  let a = t * GRID_W + e,
    n = $8[a];
  return (
    n !== n &&
      ((n = (vnoise(e / 11, t / 11) - 0.5) * 1.1 + (vnoise(e / 4.3 + 50, t / 4.3) - 0.5) * 0.5), ($8[a] = n)),
    n
  );
}
function cellRange(e, t) {
  let a = [
    worldToTile(e.x - t, e.y - t),
    worldToTile(e.x + e.w + t, e.y - t),
    worldToTile(e.x - t, e.y + e.h + t),
    worldToTile(e.x + e.w + t, e.y + e.h + t),
  ];
  return {
    x0: Math.max(0, Math.floor(Math.min(...a.map((n) => n.x)))),
    x1: Math.min(GRID_W - 1, Math.ceil(Math.max(...a.map((n) => n.x)))),
    y0: Math.max(0, Math.floor(Math.min(...a.map((n) => n.y)))),
    y1: Math.min(GRID_H - 1, Math.ceil(Math.max(...a.map((n) => n.y)))),
  };
}
function forCells(e, t, a, n) {
  let r = cellRange(t, a),
    o = t.x - a - TILE_W / 2,
    l = t.x + t.w + a + TILE_W / 2,
    s = t.y - a - TILE_H - 100,
    c = t.y + t.h + a + TILE_H;
  for (let u = r.y0; u <= r.y1; u++)
    for (let d = r.x0; d <= r.x1; d++) {
      let m = ((d - GRID_W / 2 - (u - GRID_H / 2)) * TILE_W) / 2,
        h = ((d - GRID_W / 2 + (u - GRID_H / 2)) * TILE_H) / 2;
      m < o || m > l || h < s || h > c || n(e.cells[u * GRID_W + d]);
    }
}
function terrainFingerprint(e, t) {
  let a = e.world,
    n = 2166136261;
  forCells(a, t, 70, (r) => {
    n = mix(n, e.fieldKey[r.y * GRID_W + r.x]);
  });
  for (let r of a.bridges ?? []) {
    let o = project(r.x, r.y);
    Math.abs(o.x - t.x - t.w / 2) < t.w / 2 + TILE_W * 14 &&
      Math.abs(o.y - t.y - t.h / 2) < t.h / 2 + TILE_H * 14 &&
      (n = mix(mix(n, r.id), Math.round(r.buildProgress * 20) * 4 + r.orientation));
  }
  if (e.statics)
    for (let r of e.statics.inRect(t.x - 120, t.y - 120, t.x + t.w + 120, t.y + t.h + 240))
      (r.kind === 'building' || r.kind === 'feature') && (n = mix(n, r.vk));
  return n;
}
function entityFingerprint(e, t) {
  let a = 2166136261;
  if (!e.statics) return a;
  for (let n of e.statics.inRect(t.x, t.y, t.x + t.w, t.y + t.h)) a = mix(mix(a, n.vk), n.order);
  return a;
}
function drawTerrainTile(e, t, a, n) {
  let r = t.world,
    o = t.pal,
    l = t.style === 'carta',
    s = t.season,
    c = shoreOf(t),
    u = t.images,
    d = closedPath(c.coast, a, 90),
    m = strokePath(c.coast, a, 90);
  ((e.lineJoin = 'round'), (e.lineCap = 'round'));
  let h = 2 ** Math.max(0, Math.round(Math.log2(0.55 / n)));
  ((e.fillStyle = o.sea), e.fillRect(a.x, a.y, a.w, a.h));
  {
    let x = l ? pattern(e, 'sea') : texturePattern(e, 'water');
    (x.setTransform(new DOMMatrix().scale(h)),
      (e.fillStyle = x),
      (e.globalAlpha = l ? 0.85 : 1),
      e.fillRect(a.x, a.y, a.w, a.h),
      (e.globalAlpha = 1),
      x.setTransform(new DOMMatrix()));
  }
  if (!l) {
    let x = 160 * h,
      T = x * 0.5;
    ((e.strokeStyle = 'rgba(210,241,216,.14)'), (e.lineWidth = 1.2), e.beginPath());
    for (let C = Math.floor(a.y / T) - 1; C <= (a.y + a.h) / T + 1; C++)
      for (let R = Math.floor(a.x / x) - 1; R <= (a.x + a.w) / x + 1; R++) {
        let b = Math.sin(R * 31.7 + C * 18.9),
          A = R * x + b * 28,
          E = C * T + Math.cos(R * 9.7 + C * 7.3) * 12;
        (e.moveTo(A - 12, E), e.quadraticCurveTo(A, E + 3, A + 17 + b * 7, E));
      }
    e.stroke();
  }
  if (m)
    if (l) {
      let x = Math.max(1, 1.15 / n);
      (tw11Rings(e, m, x),
        (e.globalCompositeOperation = 'source-over'),
        (e.strokeStyle = 'rgba(214,226,204,.6)'),
        (e.lineWidth = 7 * x),
        e.stroke(m));
    } else
      (e.save(),
        e.translate(0, 7),
        d && ((e.fillStyle = '#a28252'), e.fill(d, 'evenodd')),
        e.restore(),
        (e.strokeStyle = '#64ced033'),
        (e.lineWidth = 38),
        e.stroke(m),
        (e.strokeStyle = '#8fe0cf55'),
        (e.lineWidth = 19),
        e.stroke(m));
  if (!d) return;
  ((e.fillStyle = `rgb(${o.meadow.join(',')})`), e.fill(d, 'evenodd'), e.save(), e.clip(d, 'evenodd'));
  let p = project(0, 0);
  (e.save(),
    e.transform(TILE_W / 2, TILE_H / 2, -TILE_W / 2, TILE_H / 2, p.x, p.y),
    (e.imageSmoothingEnabled = !0),
    e.drawImage(t.field, 0, 0),
    e.restore(),
    e.save(),
    l
      ? ((e.globalAlpha = 1), (e.fillStyle = pattern(e, 'paper')), e.fillRect(a.x, a.y, a.w, a.h))
      : ((e.globalAlpha = s === 3 ? 0.23 : 1),
        (e.fillStyle = texturePattern(e, 'grass')),
        e.fillRect(a.x, a.y, a.w, a.h)),
    e.restore(),
    e.save(),
    (e.globalAlpha = (l ? 0.75 : 1) * (s === 3 ? 0.45 : 1)),
    (e.fillStyle = meadowPattern(e, n)),
    e.fillRect(a.x, a.y, a.w, a.h),
    e.restore());
  let g = n > 0.34,
    v = t.wet,
    M = (x) =>
      r.features.some(
        (T) => Math.abs(T.x - x.x) < 3 && Math.abs(T.y - x.y) < 3 && Math.hypot(T.x - x.x, T.y - x.y) < 3,
      );
  if (
    ((e.lineWidth = 0.9),
    forCells(r, a, 40, (x) => {
      if (!x.land) return;
      let T = project(x.x, x.y);
      if (((T.y -= x.elevation), l && g && !x.pond)) {
        let C = cellAt(r, x.x - 1, x.y),
          R = cellAt(r, x.x, x.y - 1),
          b = Math.max(x.elevation - (C?.elevation ?? 0), x.elevation - (R?.elevation ?? 0));
        if (b > 1.5) {
          ((e.strokeStyle = `rgba(64,48,32,${Math.min(0.5, 0.12 + b * 0.03)})`), e.beginPath());
          for (let A = 0; A < 4; A++) {
            let E = T.x - 16 + A * 8 + x.texture * 3,
              V = T.y + TILE_H * 0.55 + (A % 2) * 3;
            (e.moveTo(E, V), e.lineTo(E - 3, V + 6 + Math.min(6, b * 0.4)));
          }
          e.stroke();
        } else if (x.texture > 0.62 && x.snow < 0.3 && !x.road) {
          ((e.strokeStyle = x.soil > 0.35 ? 'rgba(58,72,36,.32)' : 'rgba(120,96,56,.3)'), e.beginPath());
          let A = T.x + (x.texture - 0.8) * 40,
            E = T.y + TILE_H * 0.5 + (((x.texture * 7) % 1) - 0.5) * 10;
          (x.soil > 0.35
            ? (e.moveTo(A - 3, E),
              e.lineTo(A - 1, E - 4),
              e.moveTo(A, E),
              e.lineTo(A + 1, E - 5),
              e.moveTo(A + 3, E),
              e.lineTo(A + 4, E - 3.5))
            : (e.rect(A, E, 1.2, 1.2), e.rect(A + 5, E + 2, 1.2, 1.2), e.rect(A - 4, E + 3, 1.2, 1.2)),
            e.stroke());
        }
      }
      if (g && v && !x.rock && !x.pond && x.snow < 0.2 && x.texture > 0.93 && x.moisture > 0.65) {
        let C = T.x,
          R = T.y + TILE_H * 0.55;
        ((e.fillStyle = l ? 'rgba(120,160,160,.25)' : 'rgba(153,216,232,.22)'),
          e.beginPath(),
          e.ellipse(C, R, 12 + x.texture * 7, 3 + x.texture * 2, (x.texture - 0.96) * 6, 0, Math.PI * 2),
          e.fill());
      }
      if (
        (!l &&
          g &&
          !x.pond &&
          x.texture > 0.8 &&
          ((e.fillStyle = 'rgba(116,97,67,.14)'),
          e.fillRect(T.x + 7, T.y + 14, 1.7, 1),
          e.fillRect(T.x - 5, T.y + 16, 1.5, 1)),
        x.oil > 0.05 &&
          ((e.fillStyle = `rgba(46,53,51,${x.oil * 0.78})`),
          e.beginPath(),
          e.ellipse(T.x, T.y + TILE_H / 2, 23, 11, 0, 0, Math.PI * 2),
          e.fill()),
        x.fuel > 0.08 &&
          (diamond(e, T.x, T.y), (e.fillStyle = `rgba(205,149,40,${x.fuel * 0.27})`), e.fill()),
        x.rock &&
          !M(x) &&
          ((e.fillStyle = l ? '#b4ad98' : '#8f9992'),
          e.beginPath(),
          e.moveTo(T.x - 17, T.y + 20),
          e.lineTo(T.x - 13, T.y + 1),
          e.lineTo(T.x + 3, T.y - 4),
          e.lineTo(T.x + 19, T.y + 11),
          e.lineTo(T.x + 15, T.y + 22),
          e.closePath(),
          e.fill(),
          l && ((e.strokeStyle = o.ink), (e.lineWidth = 1.2), e.stroke(), (e.lineWidth = 0.9)),
          (e.fillStyle = l ? '#ddd6c2' : '#aeb7ac'),
          e.beginPath(),
          e.moveTo(T.x - 13, T.y + 1),
          e.lineTo(T.x + 3, T.y - 4),
          e.lineTo(T.x + 19, T.y + 11),
          e.lineTo(T.x, T.y + 10),
          e.closePath(),
          e.fill(),
          l))
      ) {
        ((e.strokeStyle = 'rgba(43,33,24,.5)'), e.beginPath());
        for (let C = 0; C < 3; C++)
          (e.moveTo(T.x - 10 + C * 5, T.y + 10), e.lineTo(T.x - 13 + C * 5, T.y + 18));
        e.stroke();
      }
    }),
    m && l)
  ) {
    let x = Math.max(1, 1 / n);
    ((e.strokeStyle = 'rgba(104,132,72,.16)'),
      (e.lineWidth = Math.min(260, 60 * x)),
      e.stroke(m),
      (e.strokeStyle = 'rgba(92,120,62,.16)'),
      (e.lineWidth = Math.min(120, 26 * x)),
      e.stroke(m));
  }
  (m &&
    ((e.strokeStyle = l ? o.sand : '#e1d09a'),
    (e.lineWidth = 17),
    e.stroke(m),
    l &&
      ((e.strokeStyle = 'rgba(150,120,70,.35)'),
      (e.lineWidth = 9),
      e.setLineDash([1, 5]),
      e.stroke(m),
      e.setLineDash([]))),
    e.restore(),
    m &&
      ((e.strokeStyle = l ? o.coastInk : '#f5e5aa'),
      (e.lineWidth = l ? Math.max(2.4, 1.6 / n) : 4),
      e.stroke(m)));
  let w = closedPath(c.water, a, 60),
    y = strokePath(c.water, a, 60);
  w &&
    (e.save(),
    e.clip(d, 'evenodd'),
    y &&
      ((e.strokeStyle = o.riverBank),
      (e.lineWidth = 15),
      e.stroke(y),
      (e.strokeStyle = o.riverEdge),
      (e.lineWidth = 7),
      e.stroke(y)),
    (e.fillStyle = s === 3 ? o.riverWinter : o.river),
    e.fill(w, 'evenodd'),
    e.save(),
    e.clip(w, 'evenodd'),
    l
      ? ((e.globalAlpha = 0.7),
        (e.fillStyle = pattern(e, 'sea')),
        e.fillRect(a.x, a.y, a.w, a.h),
        (e.globalAlpha = 1))
      : ((e.fillStyle = texturePattern(e, 'water')), e.fillRect(a.x, a.y, a.w, a.h)),
    y &&
      ((e.strokeStyle = s === 3 ? (l ? '#dde9e6' : '#d3edf0') : l ? 'rgba(214,230,214,.8)' : '#80c2ae'),
      (e.lineWidth = 19),
      e.stroke(y),
      l
        ? ((e.strokeStyle = 'rgba(43,60,58,.45)'), (e.lineWidth = 1.1), e.stroke(y))
        : ((e.strokeStyle = '#b6eee2'), (e.lineWidth = 3), e.stroke(y))),
    forCells(r, a, 30, (x) => {
      if (x.pond && (x.toxicity > 0.1 || x.radiation > 0.1 || x.oil > 0.05 || x.snow > 0.15)) {
        let T = project(x.x + 0.5, x.y + 0.5);
        ((e.fillStyle =
          x.snow > 0.15
            ? `rgba(235,250,252,${x.snow * 0.9})`
            : `rgba(66,95,71,${Math.min(0.8, x.oil + x.toxicity * 0.6 + x.radiation * 0.4)})`),
          e.beginPath(),
          e.ellipse(T.x, T.y, 35, 19, 0, 0, Math.PI * 2),
          e.fill());
      }
    }),
    e.restore(),
    e.restore(),
    y &&
      l &&
      (e.save(),
      e.clip(d, 'evenodd'),
      (e.strokeStyle = 'rgba(43,33,24,.7)'),
      (e.lineWidth = 1.4),
      e.stroke(y),
      e.restore()));
  let k = u.shore;
  g &&
    ready(k) &&
    forCells(r, a, 50, (x) => {
      if (!x.land || x.pond || x.rock || x.road || x.texture < 0.68) return;
      let T = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([b, A]) => {
        let E = cellAt(r, x.x + b, x.y + A);
        return !!E && (!E.land || E.pond);
      });
      if ((!T && x.texture < 0.984) || bridgeAt(r, x.x, x.y)) return;
      if (t.statics) {
        let b = project(x.x + 0.5, x.y + 0.5);
        if (
          t.statics
            .inRect(b.x - 60, b.y - 30, b.x + 60, b.y + 30)
            .some(
              (A) => A.kind === 'building' && Math.hypot(A.value.x - x.x - 0.5, A.value.y - x.y - 0.5) < 2,
            )
        )
          return;
      }
      let C = project(x.x + 0.5, x.y + 0.5),
        R = T ? (s === 2 ? 5 : x.texture > 0.91 ? 2 : x.texture > 0.83 ? 1 : 0) : x.texture > 0.992 ? 4 : 3;
      (s === 3 && (e.save(), (e.filter = 'saturate(.25) brightness(1.35)')),
        sprite(e, k, R, C.x, C.y, T ? 24 + x.texture * 17 : 27, 0.88, x.texture > 0.85 ? -1 : 1, 'shore'),
        s === 3 && e.restore());
    });
  {
    let x = [];
    (forCells(r, a, 40, (T) => {
      T.road && x.push(T);
    }),
      drawRoads(e, r, x, n > 0.2, l, project));
  }
  for (let x of r.bridges ?? []) {
    let T = project(x.x, x.y);
    Math.abs(T.x - a.x - a.w / 2) < a.w / 2 + TILE_W * 14 &&
      Math.abs(T.y - a.y - a.h / 2) < a.h / 2 + TILE_H * 14 &&
      drawBridge(e, x, u.bridges, n, !1);
  }
}
function drawBridge(e, t, a, n, r = !0) {
  if (!ready(a)) return;
  let o = (t.kind === 'stone_bridge' ? 2 : 0) + (t.orientation ? 0 : 1),
    l = spriteRect('bridges', o),
    s = TILE_W * 1.045,
    c = (s * l.h) / l.w,
    u = preparedSprite(a, 'bridges', o, 'none'),
    d = bridgeTiles(t);
  for (let m = 0; m < d.length; m++) {
    let h = d[m],
      p = project(h.x + 0.5, h.y + 0.5),
      g = e.globalAlpha;
    ((e.globalAlpha =
      g *
      (t.buildProgress >= 1
        ? 1
        : 0.25 + 0.75 * Math.max(0, Math.min(1, t.buildProgress * d.length - m + 1)))),
      e.drawImage(u, p.x - s / 2, p.y - c * 0.49 - 5, s, c),
      (e.globalAlpha = g));
  }
  r && t.buildProgress < 1 && n > 0.35 && progressBar(e, d[Math.floor(d.length / 2)], t.buildProgress);
}
function progressBar(e, t, a) {
  let n = project(t.x + 0.5, t.y + 0.5);
  ((e.fillStyle = '#203c39'),
    e.fillRect(n.x - 30, n.y - 34, 60, 7),
    (e.fillStyle = '#eab558'),
    e.fillRect(n.x - 29, n.y - 33, 58 * a, 5));
}
function drawEntityTile(e, t, a, n) {
  if (!t.statics) return !1;
  let r = t.statics.inRect(a.x, a.y, a.x + a.w, a.y + a.h).sort((o, l) => o.order - l.order);
  for (let o of r) drawStatic(e, t, o, n);
  return r.length > 0;
}

export {
  TILE_H,
  TILE_W,
  buildingSprite,
  cellRange,
  diamond,
  drawBridge,
  drawBuildingStatic,
  drawFeature,
  drawObject,
  drawPlant,
  i2,
  isWaterCell,
  isWet,
  mix,
  progressBar,
  project,
  ready,
  refreshField,
  scene,
  shoreOf,
  shown,
  sprite,
  staticsFor,
  tier,
  unproject,
};

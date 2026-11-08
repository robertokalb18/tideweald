// Recovered from the Tideweald v16.11 build. Module: render/scene
import { production } from '../economy/production.js';
import { buildingResource, placementPreview } from '../progression/campaign.js';
import { PALETTES, cartouche, compassRose, drawSerpent, drawShip, drawWhale } from './chart.js';
import { tw11Ambient, tw11DrawAmbient, tw11DrawDecor, tw11Kraken, tw11Maelstrom } from './folio.js';
import { villageWalkers } from './roads-villagers.js';
import { SPRITE_BANDS } from './sprite-bands.js';
import { plantLook, spriteCacheInfo, spriteRect } from './sprites.js';
import { artStyle } from './tile-cache.js';
import {
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
  progressBar,
  project,
  ready,
  refreshField,
  scene,
  shoreOf,
  shown,
  sprite,
  staticsFor,
} from './world-draw.js';
import { isBridge } from '../settlement/bridge-catalog.js';
import { bridgeAt, bridgePlan, bridgeTiles } from '../settlement/bridges.js';
import { animalPose, militaryActors, raidLocation } from '../world/actors.js';
import { stepProgress } from '../core/step-clock.js';
import { BUILDING_SIZES, CATALOG, GRID_H, Ia, clamp, isBuildingItem, isBuilt } from '../world/catalog.js';
import { seasonAt } from '../world/seasons.js';
import { cellAt } from '../world/world.js';

function drawStatic(e, t, a, n) {
  a.kind === 'decor'
    ? tw11DrawDecor(e, t, a.value, n)
    : a.kind === 'plant'
      ? drawPlant(e, a.value, t.images, t.world, n, t.season, t.wet, a)
      : a.kind === 'building'
        ? drawBuildingStatic(e, a.value, t.images, t.world, n, t.pal, a.yard, t.season)
        : a.kind === 'feature'
          ? drawFeature(e, a.value, t.images, n)
          : drawObject(e, a.value);
}
var spriteBands = SPRITE_BANDS;
spriteBands.folio = [
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [],
  [
    [0.036, 0.275, 0.344],
    [0.071, 0.248, 0.427],
    [0.107, 0.229, 0.459],
    [0.143, 0.211, 0.472],
    [0.179, 0.193, 0.528],
    [0.214, 0.17, 0.606],
    [0.25, 0.151, 0.615],
    [0.286, 0.133, 0.661],
    [0.321, 0.115, 0.706],
    [0.357, 0.115, 0.752],
    [0.393, 0.147, 0.798],
    [0.429, 0.147, 0.853],
    [0.464, 0.11, 0.885],
    [0.5, 0.064, 0.885],
    [0.536, 0.018, 0.844],
    [0.571, 0.028, 0.858],
    [0.607, 0.083, 0.913],
    [0.643, 0.128, 0.959],
    [0.679, 0.174, 0.982],
    [0.714, 0.22, 0.936],
    [0.75, 0.266, 0.94],
    [0.786, 0.312, 0.94],
    [0.821, 0.367, 0.945],
    [0.857, 0.413, 0.743],
    [0.893, 0.459, 0.697],
    [0.929, 0.505, 0.651],
    [0.964, 0.55, 0.606],
  ],
  [
    [0.036, 0.234, 0.276],
    [0.071, 0.215, 0.322],
    [0.107, 0.201, 0.369],
    [0.143, 0.187, 0.416],
    [0.179, 0.173, 0.463],
    [0.214, 0.159, 0.509],
    [0.25, 0.14, 0.556],
    [0.286, 0.126, 0.603],
    [0.321, 0.112, 0.65],
    [0.357, 0.098, 0.696],
    [0.393, 0.136, 0.743],
    [0.429, 0.117, 0.785],
    [0.464, 0.07, 0.832],
    [0.5, 0.023, 0.874],
    [0.536, 0.023, 0.897],
    [0.571, 0.07, 0.893],
    [0.607, 0.117, 0.888],
    [0.643, 0.164, 0.935],
    [0.679, 0.21, 0.981],
    [0.714, 0.257, 0.963],
    [0.75, 0.304, 0.916],
    [0.786, 0.35, 0.869],
    [0.821, 0.397, 0.822],
    [0.857, 0.444, 0.776],
    [0.893, 0.491, 0.762],
    [0.929, 0.537, 0.799],
    [0.964, 0.584, 0.636],
  ],
  [
    [0.036, 0.222, 0.242],
    [0.071, 0.247, 0.268],
    [0.107, 0.273, 0.325],
    [0.143, 0.263, 0.433],
    [0.179, 0.242, 0.51],
    [0.214, 0.216, 0.572],
    [0.25, 0.191, 0.634],
    [0.286, 0.17, 0.778],
    [0.321, 0.144, 0.758],
    [0.357, 0.124, 0.809],
    [0.393, 0.139, 0.871],
    [0.429, 0.17, 0.881],
    [0.464, 0.17, 0.825],
    [0.5, 0.17, 0.825],
    [0.536, 0.17, 0.825],
    [0.571, 0.18, 0.825],
    [0.607, 0.129, 0.814],
    [0.643, 0.067, 0.876],
    [0.679, 0.015, 0.928],
    [0.714, 0.052, 0.985],
    [0.75, 0.113, 0.938],
    [0.786, 0.175, 0.876],
    [0.821, 0.201, 0.814],
    [0.857, 0.299, 0.753],
    [0.893, 0.361, 0.691],
    [0.929, 0.423, 0.629],
    [0.964, 0.485, 0.567],
  ],
  [
    [0.036, 0.294, 0.353],
    [0.071, 0.275, 0.372],
    [0.107, 0.261, 0.372],
    [0.143, 0.243, 0.394],
    [0.179, 0.225, 0.459],
    [0.214, 0.206, 0.505],
    [0.25, 0.188, 0.56],
    [0.286, 0.17, 0.702],
    [0.321, 0.151, 0.748],
    [0.357, 0.138, 0.748],
    [0.393, 0.119, 0.761],
    [0.429, 0.156, 0.807],
    [0.464, 0.165, 0.862],
    [0.5, 0.124, 0.881],
    [0.536, 0.078, 0.876],
    [0.571, 0.023, 0.844],
    [0.607, 0.028, 0.89],
    [0.643, 0.083, 0.945],
    [0.679, 0.128, 0.986],
    [0.714, 0.183, 0.945],
    [0.75, 0.229, 0.899],
    [0.786, 0.284, 0.844],
    [0.821, 0.33, 0.95],
    [0.857, 0.234, 0.986],
    [0.893, 0.229, 0.794],
    [0.929, 0.486, 0.647],
    [0.964, 0.532, 0.601],
  ],
];
function bands(e, t, a, n) {
  let r = spriteBands[t]?.[a];
  if (!r?.length) return !1;
  for (let o = 0; o < r.length; o++) {
    let [l, s, c] = r[o],
      u = o ? (r[o - 1][0] + l) / 2 : Math.max(0, l - 0.02),
      d = o < r.length - 1 ? (r[o + 1][0] + l) / 2 : Math.min(1, l + 0.02),
      m = n(s, u),
      h = n(c, d);
    e.push(Math.min(m.x, h.x), Math.min(m.y, h.y), Math.max(m.x, h.x), Math.max(m.y, h.y));
  }
  return !0;
}
function silhouette(e, t) {
  if (t.poly !== void 0) return t.poly;
  if (t.kind === 'decor') return (t.poly = null);
  let a = e.world,
    n = [],
    r = !1;
  if (t.kind === 'plant') {
    let o = shown(t.value),
      l = plantLook(o),
      s = project(o.x, o.y);
    s.y -= cellAt(a, o.x, o.y)?.elevation ?? 0;
    let c = spriteRect(l.atlas, l.index),
      u = 168 / Math.max(c.w, c.h),
      d = c.w * u,
      m = c.h * u,
      h = l.size / 168,
      p = h * l.wide;
    r = bands(n, l.atlas, l.index, (g, v) => ({
      x: s.x - 96 * p + (96 + l.flip * (-d / 2 + g * d)) * p,
      y: s.y - 178 * h + (178 - m * 0.94 + v * m) * h,
    }));
  } else if (t.kind === 'building') {
    let o = t.value,
      l = project(o.x, o.y);
    l.y -= cellAt(a, o.x, o.y)?.elevation ?? 0;
    let s = BUILDING_SIZES[o.kind]?.size ?? 132,
      c = buildingSprite(o),
      u = s,
      d = o.orientation ? -1 : 1,
      m = spriteRect(c.atlas, c.index),
      h = u / Math.max(m.w, m.h),
      p = m.w * h,
      g = m.h * h,
      v = l.y + s * 0.15;
    r = bands(n, c.atlas, c.index, (M, w) => ({ x: l.x + d * (-p / 2 + M * p), y: v - g * 0.94 + w * g }));
  } else if (t.kind === 'feature') {
    let o = t.value,
      l = project(o.x, o.y),
      s = o.kind === 'snowpeak' ? 7 : 6,
      c = spriteRect('settlement', s),
      u = 230 / Math.max(c.w, c.h),
      d = c.w * u,
      m = c.h * u;
    r = bands(n, 'settlement', s, (h, p) => ({ x: l.x - d / 2 + h * d, y: l.y + 30 - m * 0.94 + p * m }));
  } else {
    let o = t.value,
      l = project(o.x, o.y);
    (n.push(l.x - 10, l.y - 24, l.x + 10, l.y), (r = !0));
  }
  return ((t.poly = r ? new Float32Array(n) : null), t.poly);
}
var ANIMAL_SIZES = {
    deer: 38,
    fox: 28,
    sheep: 29,
    rabbit: 22,
    duck: 23,
    fish: 19,
    butterfly: 14,
    bee: 13,
    boar: 32,
    squirrel: 17,
    hedgehog: 17,
    stork: 34,
    heron: 34,
    otter: 26,
    cow: 44,
    goose: 27,
  },
  V8 = new WeakMap();
function drawAnimal(e, t, a, n, r, o, l) {
  let s = CATALOG[t.kind],
    c = s?.atlas === 'fauna' ? 'fauna' : 'animals',
    u = a[c],
    d = project(r.x, r.y),
    m = t.kind === 'butterfly' || t.kind === 'bee',
    h = o === PALETTES.carta,
    p = ANIMAL_SIZES[t.kind] ?? 14,
    g = n * 0.006 + t.id;
  if (t.kind === 'fish') {
    let w = project(t.tx, t.ty),
      y =
        Math.hypot(w.x - d.x, w.y - d.y) > 0.5
          ? Math.atan2((w.y - d.y) / 0.62, w.x - d.x)
          : t.direction > 0
            ? 0.68
            : Math.PI - 0.68,
      k = V8.get(t) ?? y,
      x = Math.atan2(Math.sin(y - k), Math.cos(y - k));
    ((k += Math.max(-0.08, Math.min(0.08, x))),
      V8.set(t, k),
      e.save(),
      e.translate(d.x, d.y),
      e.scale(1, 0.62),
      e.rotate(k + Math.PI / 2 + Math.sin(g * 1.7) * 0.12),
      ready(a.folio)
        ? sprite(
            e,
            a.folio,
            29 + (t.id % 4),
            0,
            p * 0.55,
            p * 1.15,
            0.66,
            1,
            'folio',
            0,
            'brightness(.62) saturate(.85)',
          )
        : sprite(
            e,
            u,
            CATALOG.fish?.sprite ?? 5,
            0,
            p * 0.47,
            p,
            0.62,
            1,
            'animals',
            0,
            'brightness(.58) saturate(.8)',
          ),
      e.restore(),
      (e.fillStyle = h ? 'rgba(118,160,160,.22)' : 'rgba(70,150,170,.2)'),
      e.beginPath(),
      e.ellipse(d.x, d.y, p * 0.42, p * 0.22, 0, 0, Math.PI * 2),
      e.fill(),
      (e.strokeStyle = h ? 'rgba(250,244,222,.45)' : 'rgba(225,252,248,.45)'),
      (e.lineWidth = 0.6),
      e.beginPath(),
      e.ellipse(d.x + Math.sin(g * 0.5) * 1.5, d.y - 1, p * 0.32, p * 0.1, 0, 3.6, 5.6),
      e.stroke());
    return;
  }
  ((e.fillStyle = 'rgba(42,50,40,.16)'),
    e.beginPath(),
    e.ellipse(d.x, d.y + 2, p * 0.3, p * 0.09, 0, 0, Math.PI * 2),
    e.fill());
  let v = Math.hypot(t.tx - t.x, t.ty - t.y) > 0.2,
    M = m
      ? Math.sin(g) * 2.3
      : t.kind === 'duck' || t.kind === 'goose'
        ? Math.sin(g * 0.45) * 0.25
        : v
          ? t.kind === 'rabbit'
            ? Math.max(0, Math.sin(g)) * 1.6
            : Math.abs(Math.sin(g)) * 0.45
          : 0;
  (sprite(
    e,
    u,
    s?.sprite ?? 0,
    d.x,
    d.y - M - (m ? 24 : 0),
    p,
    1,
    t.direction,
    c,
    0,
    t.health < 0.45 ? 'saturate(.3) brightness(.92)' : 'none',
  ),
    (t.kind === 'duck' || t.kind === 'goose' || t.kind === 'otter') &&
      isWaterCell(l, t.x, t.y) &&
      ((e.strokeStyle = h ? 'rgba(43,60,58,.4)' : 'rgba(215,252,245,.35)'),
      (e.lineWidth = 0.65),
      e.beginPath(),
      e.ellipse(d.x, d.y + 2, 8 + Math.sin(n * 0.002 + t.id), 2.2, 0, 0.2, 2.5),
      e.stroke()));
}
function drawWalker(e, t, a, n) {
  let r = project(t.x, t.y);
  r.y -= bridgeAt(n, t.x, t.y)?.buildProgress === 1 ? 7 : (cellAt(n, t.x, t.y)?.elevation ?? 0);
  let o = t.dx + t.dy < 0,
    l = t.dx - t.dy < 0 ? -1 : 1,
    s = (t.id % 2) * 2 + (o ? 1 : 0),
    c = t.walking ? Math.floor(t.phase) % 4 : 1,
    u = t.walking ? Math.sin((t.phase * Math.PI) / 2) : 0;
  ((e.fillStyle = 'rgba(20,36,28,.18)'),
    e.beginPath(),
    e.ellipse(r.x, r.y + 1, 5.7, 2.1, 0, 0, Math.PI * 2),
    e.fill(),
    ready(a.villagers)
      ? (e.save(),
        e.translate(r.x, r.y - Math.abs(u) * 0.65),
        e.rotate(u * 0.018),
        sprite(e, a.villagers, s * 4 + c, 0, 0, 24, 1, l, 'villagers'),
        e.restore())
      : sprite(e, a.characters, t.id % 2 ? 4 : 5, r.x, r.y - Math.abs(u), 24, 1, l, 'characters'));
}
// Milestone 2: the raiders' route from the beach to the stores, a ring on their target, and the
// towers' arrows in flight. Drawn each frame over the terrain, so not part of any tile cache.
function drawRaidRoute(e, t, a, n, r, o, q = 1) {
  let l = a.route;
  if (!l?.length) return;
  let f = 1 / Math.max(0.35, Math.min(1.5, q)); // keep strokes readable when zoomed out
  (e.save(),
    e.setLineDash([4 * f, 6 * f]),
    (e.lineDashOffset = r ? 0 : -n * 0.006 * f),
    (e.lineWidth = (o ? 3 : 2.2) * f),
    (e.strokeStyle = 'rgba(176,58,40,.8)'),
    e.beginPath());
  for (let c = 0; c < l.length; c += 2) {
    let u = project(l[c] + 0.5, l[c + 1] + 0.5);
    c ? e.lineTo(u.x, u.y) : e.moveTo(u.x, u.y);
  }
  (e.stroke(), e.setLineDash([]));
  let s = project(a.target.x, a.target.y);
  ((e.lineWidth = 2.2 * f),
    e.beginPath(),
    e.ellipse(s.x, s.y, 76, 38, 0, 0, Math.PI * 2),
    e.stroke(),
    (e.fillStyle = 'rgba(176,58,40,.92)'),
    (e.font = `600 ${Math.round(10 * f)}px system-ui, sans-serif`),
    (e.textAlign = 'center'),
    e.fillText(a.battle ? 'RAIDERS ASHORE' : 'RAID TARGET', s.x, s.y + 38 + 12 * f));
  let c = a.battle?.shots;
  if (c?.length && !r) {
    let u = stepProgress(t);
    ((e.strokeStyle = 'rgba(40,30,24,.85)'), (e.lineWidth = 1.2));
    for (let [d, m, h, p] of c) {
      let g = project(d, m),
        v = project(h, p),
        M = Math.min(1, u * 1.6),
        w = g.x + (v.x - g.x) * M,
        y = g.y - 34 + (v.y - 10 - (g.y - 34)) * M - Math.sin(M * Math.PI) * 18,
        k = Math.atan2(v.y - 10 - (g.y - 34), v.x - g.x);
      M < 1 && (e.beginPath(), e.moveTo(w - Math.cos(k) * 6, y - Math.sin(k) * 6), e.lineTo(w, y), e.stroke());
    }
  }
  e.restore();
}
function drawMilitary(e, t, a, n, r, o) {
  let l = project(t.x, t.y);
  if (t.down) {
    // The fallen lie where they fell until the fight ends.
    ((l.y -= cellAt(n, t.x, t.y)?.elevation ?? 0), e.save(), (e.globalAlpha = 0.5), e.translate(l.x, l.y));
    (e.rotate(t.enemy ? 1.35 : -1.35),
      ready(a.units)
        ? sprite(e, a.units, (t.enemy ? 2 : 0) * 4, 0, 0, 22, 1, 1, 'units')
        : sprite(e, a.norse, 6 + (t.id % 2), 0, 0, 22, 1, 1, 'norse'),
      e.restore());
    return;
  }
  ((l.y -= bridgeAt(n, t.x, t.y)?.buildProgress === 1 ? 7 : (cellAt(n, t.x, t.y)?.elevation ?? 0)),
    (e.fillStyle = t.enemy ? r.enemy : r.friendly),
    (e.strokeStyle = t.enemy ? r.enemy : r.friendly),
    (e.lineWidth = 1.4),
    t.enemy
      ? (e.beginPath(),
        e.moveTo(l.x - 5.5, l.y + 3),
        e.lineTo(l.x + 5.5, l.y + 3),
        e.lineTo(l.x, l.y - 1.5),
        e.closePath(),
        e.fill(),
        o &&
          (e.beginPath(),
          e.moveTo(l.x, l.y - 30),
          e.lineTo(l.x, l.y - 38),
          e.lineTo(l.x + 7, l.y - 35),
          e.closePath(),
          e.fill()))
      : (e.beginPath(),
        e.ellipse(l.x, l.y + 1, 5.5, 2.2, 0, 0, Math.PI * 2),
        e.stroke(),
        o && (e.beginPath(), e.arc(l.x, l.y - 33, 3, 0, Math.PI * 2), e.fill())));
  let s = (t.enemy ? 2 : 0) + (t.dx + t.dy < 0 ? 1 : 0),
    c = t.walking ? Math.floor(t.phase) % 4 : 0,
    u = t.walking ? Math.sin((t.phase * Math.PI) / 2) : 0;
  (e.save(),
    e.translate(l.x, l.y - Math.abs(u) * 0.55),
    e.rotate(u * 0.018),
    ready(a.units)
      ? sprite(e, a.units, s * 4 + c, 0, 0, 26, 1, t.dx - t.dy < 0 ? -1 : 1, 'units')
      : sprite(e, a.norse, 6 + (t.id % 2), 0, 0, 26, 1, 1, 'norse'),
    e.restore(),
    t.hp < 0.999 &&
      ((e.fillStyle = 'rgba(20,16,12,.55)'),
      e.fillRect(l.x - 7, l.y - 33, 14, 3),
      (e.fillStyle = t.enemy ? r.enemy : r.friendly),
      e.fillRect(l.x - 7, l.y - 33, 14 * Math.max(0, t.hp), 3)));
}
function drawMover(e, t, a, n, r) {
  if (a.ambient) return tw11DrawAmbient(e, t, a);
  a.animal
    ? (a.animal.kind !== 'fish' || !bridgeAt(t.world, a.x, a.y)) &&
      drawAnimal(e, a.animal, t.images, n, a, t.pal, t.world)
    : a.soldier
      ? drawMilitary(e, a.soldier, t.images, t.world, t.pal, r)
      : drawWalker(e, a.walker, t.images, t.world);
}
function waterCells(e) {
  let t = e.world;
  if ((shoreOf(e), e.water.rev !== (t.terrainRevision ?? 0) + t.placements * 0)) {
    ((e.water.rev = t.terrainRevision ?? 0), (e.water.grid = new Map()));
    for (let a of t.cells)
      if (a.land && a.pond && a.texture >= 0.52) {
        let n = Math.floor(a.x / 16) * 64 + Math.floor(a.y / 16),
          r = e.water.grid.get(n);
        (r || e.water.grid.set(n, (r = [])), r.push(a));
      }
  }
  return e.water.grid;
}
function fireCells(e, t) {
  let a = e.world;
  return (
    e.fire.rev !== a.revision &&
      t - e.fire.at > 900 &&
      ((e.fire.rev = a.revision), (e.fire.at = t), (e.fire.cells = a.cells.filter((n) => n.fire > 0.02))),
    e.fire.cells
  );
}
var q8 = new WeakMap();
function renderIsland(e, t, a, n, r, o, l, s, c, u, d = !1, m = 0, h = {}) {
  let p = { pending: !1, animating: !1 };
  if (n <= 0 || r <= 0) return p;
  let g = performance.now(),
    v = h.style ?? artStyle(),
    M = scene(e, t, l, v),
    w = v === 'carta',
    y = e.getTransform(),
    k = y.a || 1;
  ((M.season = seasonAt(t.time).index), (M.wet = isWet(t)));
  let x = (P) => (ready(P) ? (P.src.includes('/carta/') ? 'c' : 'p') : '-'),
    T = '';
  for (let P of Object.values(l)) T += x(P);
  let C = `${v}|${M.season}|${M.wet}|${x(l.shore)}${x(l.bridges)}`;
  C !== M.terrainStamp && (M.terrainStamp && M.terrain.invalidate(), (M.terrainStamp = C));
  let R = `${v}|${M.season}|${M.wet}|${T}`;
  R !== M.entityStamp && (M.entityStamp && M.entities.invalidate(), (M.entityStamp = R));
  let b = `${t.placements}|${t.plants.length}|${t.buildings.length}|${t.objects.length}|${t.features.length}|${t.plants[0]?.id}|${t.plants[t.plants.length - 1]?.id}|${t.terrainRevision ?? 0}`,
    A = b + R !== M.staticsStamp,
    E = !!M.statics && !A && M.staticsRevision !== t.revision;
  ((!M.statics || A || (E && g - M.staticsAt > 900)) &&
    ((M.statics = new i2(staticsFor(t, M.season))),
    (M.staticsStamp = b + R),
    (M.staticsAt = g),
    (M.staticsRevision = t.revision),
    M.entities.recheck(),
    M.terrain.recheck()),
    refreshField(M, g) && M.terrain.recheck(),
    (M.fieldRow < GRID_H ||
      M.fieldRevision !== t.revision ||
      (E && M.staticsRevision !== t.revision) ||
      M.status.todo > 0) &&
      (p.pending = !0));
  let V = -a.x / a.zoom,
    Z = -a.y / a.zoom,
    L = n / a.zoom,
    N = r / a.zoom,
    O = q8.get(t);
  (O || ((O = { last: o, clock: 0 }), q8.set(t, O)),
    !d && o && (O.clock += Math.min(100, Math.max(0, o - O.last))),
    (O.last = o));
  let z = (P, Re, J) =>
    P * a.zoom + a.x > -J && P * a.zoom + a.x < n + J && Re * a.zoom + a.y > -J && Re * a.zoom + a.y < r + J;
  a.zoom !== M.zoom && ((M.zoom = a.zoom), (M.zoomAt = g));
  let U = g - M.zoomAt < 140;
  U && (p.pending = !0);
  let Y = { camX: a.x, camY: a.y, zoom: a.zoom, dpr: k, width: n, height: r, zooming: U },
    W = U ? 0 : (h.budgetMs ?? 7);
  if (
    ((p.pending = M.terrain.draw(e, Y, g + W * 0.55, g) || p.pending),
    e.save(),
    e.setTransform(y),
    e.translate(a.x, a.y),
    e.scale(a.zoom, a.zoom),
    w && drawOrnaments(e, t, o, O.clock, z, a.zoom),
    M.season !== 3 && a.zoom > 0.22)
  ) {
    let P = waterCells(M),
      Re = cellRange({ x: V, y: Z, w: L, h: N }, 40);
    ((e.lineWidth = 0.8),
      (e.strokeStyle = w ? 'rgba(40,64,68,.45)' : 'rgba(211,255,242,.42)'),
      e.beginPath());
    for (let J = Math.floor(Re.x0 / 16); J <= Math.floor(Re.x1 / 16); J++)
      for (let X = Math.floor(Re.y0 / 16); X <= Math.floor(Re.y1 / 16); X++)
        for (let be of P.get(J * 64 + X) ?? []) {
          let je = (O.clock * 17e-5 + be.texture) % 1,
            zt = project(be.x + 0.5, be.y + 0.5);
          if (!z(zt.x, zt.y, 30)) continue;
          let vt = (je - 0.5) * 14;
          (e.moveTo(zt.x - 7 + vt, zt.y + vt * 0.35),
            e.quadraticCurveTo(zt.x + vt, zt.y - 1 + vt * 0.35, zt.x + 8 + vt, zt.y + 1 + vt * 0.35));
        }
    (e.stroke(), (p.animating = p.animating || !d));
  }
  let j = raidLocation(t);
  if (j?.spotted) {
    let P = project(j.water.x, j.water.y);
    (drawRaidRoute(e, t, j, o, d, h.accessibleMarkers, a.zoom),
      z(P.x, P.y, 180) &&
        sprite(e, l.norse, 4, P.x, P.y + (d ? 0 : Math.sin(o * 0.002) * 1.2), 100, 1, 1, 'norse'));
  }
  e.restore();
  let Ae = [],
    Xe = (P, Re, J, X, be) => {
      let je = project(P, Re);
      ((je.y -= cellAt(t, P, Re)?.elevation ?? 0),
        z(je.x, je.y, 80) &&
          Ae.push({
            x: P,
            y: Re,
            depth: P + Re,
            x0: je.x - J * 0.62,
            x1: je.x + J * 0.62,
            y0: je.y - J - X - 4,
            y1: je.y + 5,
            ...be,
          }));
    };
  for (let P of villageWalkers(t, o, d || o === 0)) Xe(P.x, P.y, 24, 2, { walker: P });
  for (let P of t.animals) {
    let Re = animalPose(P, o, d),
      J = P.kind === 'butterfly' || P.kind === 'bee';
    Xe(Re.x, Re.y, ANIMAL_SIZES[P.kind] ?? 16, J ? 28 : 3, { animal: P });
  }
  for (let P of militaryActors(t, o, d)) Xe(P.x, P.y, 26, h.accessibleMarkers ? 16 : 3, { soldier: P });
  if (a.zoom > 0.16)
    for (let P of tw11Ambient(t, M.season, o, d)) Xe(P.x, P.y, P.s, P.lift + 4, { ambient: P });
  (Ae.length && !d && (p.animating = !0),
    Ae.sort((P, Re) => P.depth - Re.depth),
    (p.pending = M.entities.draw(e, Y, g + W, g) || p.pending),
    e.save(),
    e.setTransform(y),
    e.translate(a.x, a.y),
    e.scale(a.zoom, a.zoom));
  let Fe = !!h.accessibleMarkers,
    ct = a.zoom * k,
    at = 0,
    qe = [],
    le = 0,
    de = 0,
    re = 0,
    Ue = 2048;
  for (let P of Ae) {
    let Re =
      M.statics && ct > 0.3
        ? M.statics.inRect(P.x0, P.y0, P.x1, P.y1).filter((Pe) => {
            if (Pe.depth <= P.depth) return !1;
            let ut = silhouette(M, Pe);
            if (!ut) return !1;
            for (let et = 0; et < ut.length; et += 4)
              if (!(ut[et + 2] < P.x0 || ut[et] > P.x1 || ut[et + 3] < P.y0 || ut[et + 1] > P.y1)) return !0;
            return !1;
          })
        : [];
    if (!Re.length) {
      qe.push({ m: P, x0: 0, y0: 0, w: 0, h: 0, sx: -1, sy: -1, front: Re });
      continue;
    }
    let J = (P.x0 + P.x1) / 2,
      X = (Pe) =>
        Re.some((ut) => {
          let et = silhouette(M, ut);
          for (let Mn = 0; Mn < et.length; Mn += 4)
            if (J >= et[Mn] && J <= et[Mn + 2] && Pe >= et[Mn + 1] && Pe <= et[Mn + 3]) return !0;
          return !1;
        }),
      be = (X(P.y1 - 6) ? 1 : 0) + (X((P.y0 + P.y1) / 2) ? 1 : 0) + (X(P.y0 + (P.y1 - P.y0) * 0.2) ? 1 : 0);
    if (be === 3) {
      P.animal || qe.push({ m: P, x0: 0, y0: 0, w: 0, h: 0, sx: -1, sy: -1, front: [], ghost: !0 });
      continue;
    }
    if (
      be === 0 &&
      Re.every((Pe) => {
        let ut = silhouette(M, Pe);
        for (let et = 0; et < ut.length; et += 4)
          if (
            ut[et] <= P.x1 - 2 &&
            ut[et + 2] >= P.x0 + 2 &&
            ut[et + 1] <= P.y1 - 2 &&
            ut[et + 3] >= P.y0 + 4
          )
            return !1;
        return !0;
      })
    ) {
      qe.push({ m: P, x0: 0, y0: 0, w: 0, h: 0, sx: -1, sy: -1, front: [] });
      continue;
    }
    let je = Math.floor((P.x0 * a.zoom + a.x) * k) - 1,
      zt = Math.floor((P.y0 * a.zoom + a.y) * k) - 1,
      vt = Math.ceil((P.x1 * a.zoom + a.x) * k) + 1 - je,
      nt = Math.ceil((P.y1 * a.zoom + a.y) * k) + 1 - zt;
    if (vt <= 0 || nt <= 0 || vt > 400 || nt > 400) {
      qe.push({ m: P, x0: je, y0: zt, w: vt, h: nt, sx: -1, sy: -1, front: [] });
      continue;
    }
    if ((le + vt > Ue && ((le = 0), (de += re + 1), (re = 0)), de + nt > Ue)) {
      qe.push({ m: P, x0: je, y0: zt, w: vt, h: nt, sx: -1, sy: -1, front: [] });
      continue;
    }
    (qe.push({ m: P, x0: je, y0: zt, w: vt, h: nt, sx: le, sy: de, front: Re }),
      (le += vt + 1),
      (re = Math.max(re, nt)),
      at++);
  }
  if (at) {
    let P = M.scratch,
      Re = Math.min(Ue, de + re + 2),
      J = de > 0 ? Ue : Math.max(64, le + 2);
    (P.width < J || P.height < Re) &&
      ((P.width = Math.max(P.width, J)), (P.height = Math.max(P.height, Re, 64)));
    let X = P.getContext('2d');
    (X.setTransform(1, 0, 0, 1, 0, 0),
      (X.globalCompositeOperation = 'source-over'),
      X.clearRect(0, 0, P.width, Math.min(P.height, Re + 2)));
    for (let be of qe)
      be.sx < 0 ||
        !be.front.length ||
        (X.setTransform(ct, 0, 0, ct, a.x * k - be.x0 + be.sx, a.y * k - be.y0 + be.sy),
        drawMover(X, M, be.m, o, Fe));
    (X.setTransform(1, 0, 0, 1, 0, 0),
      (X.globalCompositeOperation = 'destination-out'),
      (X.fillStyle = '#000'));
    for (let be of qe) {
      if (be.sx < 0 || !be.front.length) continue;
      let je = a.x * k - be.x0 + be.sx,
        zt = a.y * k - be.y0 + be.sy;
      for (let vt of be.front) {
        if (be.m.animal && vt.kind === 'plant') {
          (X.save(),
            X.beginPath(),
            X.rect(be.sx, be.sy, be.w, be.h),
            X.clip(),
            X.setTransform(ct, 0, 0, ct, je, zt),
            drawPlant(X, vt.value, M.images, M.world, ct, M.season, M.wet, vt, !0),
            X.restore(),
            (X.globalCompositeOperation = 'destination-out'));
          continue;
        }
        let nt = silhouette(M, vt);
        if (nt)
          for (let Pe = 0; Pe < nt.length; Pe += 4) {
            let ut = Math.max(be.sx, nt[Pe] * ct + je),
              et = Math.max(be.sy, nt[Pe + 1] * ct + zt),
              Mn = Math.min(be.sx + be.w, nt[Pe + 2] * ct + je),
              Tn = Math.min(be.sy + be.h, nt[Pe + 3] * ct + zt);
            Mn > ut && Tn > et && X.fillRect(ut, et, Mn - ut, Tn - et);
          }
      }
    }
    X.globalCompositeOperation = 'source-over';
  }
  for (let P of qe) {
    if (P.ghost) {
      let Re = e.globalAlpha;
      ((e.globalAlpha = Re * 0.42), drawMover(e, M, P.m, o, Fe), (e.globalAlpha = Re));
      continue;
    }
    if (P.sx < 0 || !P.front.length) {
      drawMover(e, M, P.m, o, Fe);
      continue;
    }
    (e.save(),
      e.setTransform(1, 0, 0, 1, 0, 0),
      e.drawImage(M.scratch, P.sx, P.sy, P.w, P.h, P.x0, P.y0, P.w, P.h),
      e.restore());
  }
  let Be = t.arrival,
    Je = Be ? Date.now() - Be.at : 1e9;
  if (Be && Je < 1800) {
    p.pending = !0;
    let P = project(Be.x, Be.y),
      Re = Je / 1800;
    (e.save(), (e.strokeStyle = w ? '#b8452f' : '#f6e3a5'));
    for (let J of o ? [0, 0.25] : [-1]) {
      let X = J < 0 ? 0.45 : Math.max(0, Math.min(1, (Re - J) / (1 - J)));
      X <= 0 ||
        ((e.globalAlpha = J < 0 ? 0.75 : (1 - X) * 0.85),
        (e.lineWidth = 2 / a.zoom),
        e.beginPath(),
        e.ellipse(P.x, P.y + 2, 10 + X * 34, (10 + X * 34) * 0.5, 0, 0, Math.PI * 2),
        e.stroke());
    }
    e.restore();
  }
  (drawOverlays(e, M, a, o, n, r, s, c, u, m, z, d, g, h),
    e.restore(),
    drawAtmosphere(e, M, t, a, o, n, r, d, w, h.timeScale ?? 1),
    (t.weather === 'rain' || t.weather === 'storm' || t.weather === 'snow') &&
      (p.animating = p.animating || !d || !!o));
  let Ft = globalThis;
  return (
    Ft.__twDebug &&
      (Ft.__twStats = {
        zoom: a.zoom,
        zooming: U,
        terrain: M.terrain.stats,
        entities: M.entities.stats,
        cache: spriteCacheInfo(),
      }),
    p
  );
}
function buildingStatus(e, t) {
  if (!isBuilt(t)) return { icon: null, text: '' };
  if (['watchtower', 'palisade', 'guardhall', 'beacon'].includes(t.kind)) return { icon: null, text: '' };
  let a = production(e, t);
  if (!a || a.rate === void 0) return { icon: null, text: '' };
  let n = a.capacity ?? 0;
  return n > 0 && t.stored >= n - 0.5
    ? { icon: 'full', text: 'Storage full \u2014 collect to resume' }
    : a.rate <= 0 && buildingResource(t.kind) !== 'gold'
      ? { icon: 'idle', text: a.reason ?? 'Not producing' }
      : t.stored >= 20
        ? { icon: 'ready', text: `${Math.floor(t.stored)} ready` }
        : { icon: null, text: '' };
}
function drawStatusSign(e, t, a, n, r, o) {
  let l = Math.max(0.9, 0.8 / r);
  (e.save(), e.translate(t, a), e.scale(l, l));
  let s =
    n === 'idle'
      ? o
        ? '#b8452f'
        : '#d86a4f'
      : n === 'full'
        ? o
          ? '#c89b3c'
          : '#e4b24c'
        : o
          ? '#5f7f4a'
          : '#6fae5a';
  ((e.fillStyle = o ? '#efe4c8' : '#fff8e4'),
    (e.strokeStyle = o ? '#2b2118' : '#1d3530'),
    (e.lineWidth = 1.6),
    e.beginPath(),
    e.moveTo(0, 12),
    e.lineTo(0, 4),
    e.stroke(),
    n === 'idle'
      ? (e.beginPath(),
        e.moveTo(-9, 4),
        e.lineTo(9, 4),
        e.lineTo(0, -12),
        e.closePath(),
        (e.fillStyle = s),
        e.fill(),
        e.stroke(),
        (e.fillStyle = '#fff'),
        e.fillRect(-1, -7, 2, 6),
        e.fillRect(-1, 0, 2, 2))
      : n === 'full'
        ? (e.beginPath(),
          e.rect(-8, -10, 16, 14),
          (e.fillStyle = s),
          e.fill(),
          e.stroke(),
          (e.strokeStyle = '#2b2118'),
          (e.lineWidth = 1.2),
          e.beginPath(),
          e.moveTo(-5, -5),
          e.lineTo(5, -5),
          e.moveTo(-5, -1),
          e.lineTo(5, -1),
          e.stroke())
        : (e.beginPath(),
          e.arc(0, -4, 8, 0, Math.PI * 2),
          (e.fillStyle = s),
          e.fill(),
          e.stroke(),
          (e.strokeStyle = '#fff'),
          (e.lineWidth = 1.8),
          e.beginPath(),
          e.moveTo(-3.5, -4),
          e.lineTo(-1, -1.5),
          e.lineTo(4, -7),
          e.stroke()),
    e.restore());
}
function drawOverlays(e, t, a, n, r, o, l, s, c, u, d, m, h, p) {
  let g = t.world,
    v = t.style === 'carta',
    M = t.pal;
  if (
    (t.status.rev !== g.revision && ((t.status.rev = g.revision), (t.status.todo = g.buildings.length)),
    p.statusIcons !== !1 && g.buildings.length && t.status.todo > 0)
  ) {
    let k = t.status,
      x = Math.min(12, k.todo);
    k.todo -= x;
    for (let T = 0; T < x; T++) {
      k.cursor = (k.cursor + 1) % g.buildings.length;
      let C = g.buildings[k.cursor];
      k.map.set(C.id, buildingStatus(g, C));
    }
    k.map.size > g.buildings.length * 2 && k.map.clear();
  }
  for (let k of g.buildings) {
    let x = project(k.x, k.y);
    if (((x.y -= cellAt(g, k.x, k.y)?.elevation ?? 0), !d(x.x, x.y, 160))) continue;
    let T = BUILDING_SIZES[k.kind]?.size ?? 132,
      C = !!c && Math.hypot(c.x - k.x, c.y - k.y) < 1.8;
    if (
      (C &&
        ((e.strokeStyle = v ? '#b8452f' : '#f6e3a5'),
        (e.lineWidth = 2 / a.zoom),
        e.beginPath(),
        e.ellipse(x.x, x.y + 3, T * 0.43, T * 0.18, 0, 0, Math.PI * 2),
        e.stroke()),
      !isBuilt(k) &&
        a.zoom > 0.4 &&
        ((e.fillStyle = v ? '#2b2118' : '#18343d'),
        e.fillRect(x.x - 35, x.y + T * 0.15 + 6, 70, 7),
        (e.fillStyle = v ? '#c89b3c' : '#e4c77f'),
        e.fillRect(x.x - 34, x.y + T * 0.15 + 7, 68 * k.buildProgress, 5)),
      p.statusIcons !== !1 && isBuilt(k) && a.zoom > 0.3)
    ) {
      let R = t.status.map.get(k.id);
      R &&
        R.icon &&
        R.icon !== 'ready' &&
        drawStatusSign(e, x.x + T * 0.28, x.y - T * 0.55, R.icon, a.zoom, v);
    }
    if (a.zoom >= 0.65 && (!isBuilt(k) || (l && Math.hypot(l.x - k.x, l.y - k.y) < 2) || C)) {
      let R = buildingResource(k.kind),
        b = x.y + T * 0.15 + (isBuilt(k) ? 8 : 19),
        A = Math.max(1, 0.8 / a.zoom);
      (e.save(),
        e.translate(x.x, b),
        e.scale(A, A),
        (e.fillStyle = v ? 'rgba(239,228,200,.95)' : '#142a2bec'),
        e.beginPath(),
        e.roundRect(-44, 0, 88, 21, 3),
        e.fill(),
        (e.strokeStyle = v ? '#2b2118' : '#ac9a6870'),
        (e.lineWidth = v ? 1 : 0.6),
        e.stroke(),
        (e.font = v ? 'italic 12px Georgia, serif' : '12px Arial'),
        (e.textAlign = 'center'),
        (e.fillStyle = v ? '#2b2118' : k.stored >= 1 ? '#e7cf91' : '#c4cdb6'),
        e.fillText(
          isBuilt(k)
            ? k.stored >= 1
              ? `${Math.floor(k.stored)} ${R}`
              : ['watchtower', 'palisade', 'guardhall'].includes(k.kind)
                ? 'On watch'
                : production(g, k).rate > 0
                  ? 'Working'
                  : 'Check site'
            : `${Math.round(k.buildProgress * 100)}% built`,
          0,
          15,
        ),
        e.restore());
    }
  }
  for (let k of g.bridges ?? [])
    if (k.buildProgress < 1 && a.zoom > 0.35) {
      let x = bridgeTiles(k),
        T = x[Math.floor(x.length / 2)],
        C = project(T.x, T.y);
      d(C.x, C.y, 80) && progressBar(e, T, k.buildProgress);
    }
  for (let k of fireCells(t, h)) {
    let x = project(k.x + 0.5, k.y + 0.5);
    if (d(x.x, x.y, 60))
      for (let T = 0; T < 3; T++) {
        let C = (n * 0.0013 + T * 0.33 + k.texture) % 1;
        ((e.fillStyle = `rgba(242,${133 + T * 26},59,${(1 - C) * k.fire})`),
          e.beginPath(),
          e.ellipse(x.x + (T - 1) * 8, x.y - C * 44, 7 * (1 - C) + 2, 12 * (1 - C) + 3, 0, 0, Math.PI * 2),
          e.fill());
      }
  }
  let w = ((g.time % 1) + 1) % 1,
    y =
      clamp((Math.cos(w * Math.PI * 2) - 0.1) / 0.8) *
      ((p.timeScale ?? 1) >= 50 ? 0 : (p.timeScale ?? 1) >= 10 ? 0.4 : (p.timeScale ?? 1) >= 3 ? 0.7 : 1);
  if (y > 0.05 && a.zoom > 0.12) {
    (e.save(), (e.globalCompositeOperation = 'lighter'));
    for (let k of g.buildings) {
      if (
        !isBuilt(k) ||
        ![
          'cottage',
          'market',
          'guardhall',
          'watchtower',
          'tavern',
          'chapel',
          'bakery',
          'smithy',
          'harbor',
          'lighthouse',
          'guildhall',
        ].includes(k.kind)
      )
        continue;
      let x = project(k.x, k.y);
      if (((x.y -= cellAt(g, k.x, k.y)?.elevation ?? 0), !d(x.x, x.y, 120))) continue;
      let T = m ? 1 : 0.9 + 0.1 * Math.sin(n * 0.011 + k.id * 1.7),
        C = (k.kind === 'lighthouse' ? 150 : k.kind === 'cottage' ? 46 : 64) * T,
        R = e.createRadialGradient(x.x, x.y - 6, 2, x.x, x.y - 6, C);
      (R.addColorStop(0, `rgba(255,196,110,${0.42 * y})`),
        R.addColorStop(0.45, `rgba(240,150,60,${0.16 * y})`),
        R.addColorStop(1, 'rgba(240,150,60,0)'),
        (e.fillStyle = R),
        e.fillRect(x.x - C, x.y - 6 - C, C * 2, C * 2));
    }
    e.restore();
  }
  if (a.zoom <= 0.55)
    for (let k of [
      { x: 136, y: 78, label: 'NORTHWATCH RIDGE' },
      { x: 83, y: 143, label: 'WESTERN WEALD' },
      { x: 299, y: 213, label: 'EASTWATER' },
      { x: 159, y: 252, label: 'SOUTHERN MEADOWS' },
      { x: 268, y: 95, label: 'BIRCH REACH' },
    ]) {
      let x = project(k.x, k.y);
      if (
        (e.save(),
        e.translate(x.x, x.y),
        e.scale(1 / a.zoom, 1 / a.zoom),
        (e.font = v ? 'italic 600 13px Georgia, serif' : '12px Georgia'),
        (e.textAlign = 'center'),
        (e.fillStyle = M.label),
        v)
      ) {
        ((e.letterSpacing = '3px'),
          e.fillText(k.label, 0, 0),
          (e.strokeStyle = 'rgba(43,33,24,.45)'),
          (e.lineWidth = 0.8));
        let T = e.measureText(k.label).width / 2;
        (e.beginPath(), e.moveTo(-T, 5), e.lineTo(T, 5), e.stroke());
      } else e.fillText(k.label, 0, 0);
      e.restore();
    }
  if (g.story.incident) {
    let k = project(g.story.incident.x, g.story.incident.y);
    ((e.strokeStyle = v ? '#b8452f' : '#f4b078'),
      (e.lineWidth = 2 / a.zoom),
      e.setLineDash([6 / a.zoom, 4 / a.zoom]),
      e.beginPath(),
      e.ellipse(k.x, k.y, (2.8 * TILE_W) / 1.25, (2.8 * TILE_H) / 1.25, 0, 0, Math.PI * 2),
      e.stroke(),
      e.setLineDash([]),
      (e.font = `${13 / a.zoom}px Georgia, serif`),
      (e.textAlign = 'center'),
      (e.fillStyle = v ? '#8e2f22' : '#ffe1ad'),
      e.fillText('RESTORATION SITE', k.x, k.y - (2.8 * TILE_H) / 1.25 - 12 / a.zoom));
  }
  if (l) {
    let k = cellAt(g, l.x, l.y),
      x = project(Math.floor(l.x), Math.floor(l.y));
    if (((x.y -= k?.elevation ?? 0), s && k?.land)) {
      ((e.strokeStyle = v ? 'rgba(43,33,24,.22)' : 'rgba(49,56,29,.18)'),
        (e.lineWidth = 0.8 / a.zoom),
        e.beginPath());
      for (let T = -4; T <= 4; T++)
        for (let C = -4; C <= 4; C++) {
          if (C * C + T * T > 18) continue;
          let R = cellAt(g, Math.floor(l.x) + C, Math.floor(l.y) + T);
          if (!R?.land) continue;
          let b = project(R.x, R.y);
          ((b.y -= R.elevation),
            e.moveTo(b.x, b.y),
            e.lineTo(b.x + TILE_W / 2, b.y + TILE_H / 2),
            e.lineTo(b.x, b.y + TILE_H),
            e.lineTo(b.x - TILE_W / 2, b.y + TILE_H / 2),
            e.closePath());
        }
      e.stroke();
    }
    if (
      ((e.strokeStyle = k?.land ? (v ? '#2b2118' : '#fffdf1') : v ? '#b8452f' : '#c77e69'),
      (e.lineWidth = 2 / a.zoom),
      diamond(e, x.x, x.y),
      (e.fillStyle = k?.land
        ? v
          ? 'rgba(239,228,200,.35)'
          : 'rgba(255,255,255,.18)'
        : 'rgba(181,68,52,.12)'),
      e.fill(),
      e.stroke(),
      s && k?.land)
    ) {
      let T = project(l.x, l.y);
      (e.setLineDash([4, 5]),
        e.beginPath(),
        e.ellipse(
          T.x,
          T.y,
          CATALOG[s]?.category === 'ground' ? 80 : 25,
          CATALOG[s]?.category === 'ground' ? 40 : 13,
          0,
          0,
          Math.PI * 2,
        ),
        e.stroke(),
        e.setLineDash([]));
    }
  }
  if (l && s) {
    let k = CATALOG[s];
    if (k && (isBuildingItem(k) || k.category === 'roads')) {
      let x = placementPreview(g, s, l.x, l.y, u),
        T = project(l.x, l.y);
      if (isBridge(s)) {
        let R = bridgePlan(g, s, l.x, l.y, u);
        R.bridge &&
          (e.save(),
          (e.globalAlpha = R.ok ? 0.65 : 0.3),
          drawBridge(e, { ...R.bridge, buildProgress: 1 }, t.images.bridges, a.zoom),
          e.restore());
      }
      if (isBuildingItem(k)) {
        let R = k.atlas ?? 'settlement';
        sprite(
          e,
          t.images[R],
          k.sprite ?? 0,
          T.x,
          T.y + (BUILDING_SIZES[s]?.size ?? 132) * 0.15,
          BUILDING_SIZES[s]?.size ?? 132,
          x.ok ? 0.68 : 0.35,
          u ? -1 : 1,
          R,
        );
      }
      (e.save(),
        e.translate(T.x, T.y),
        (e.strokeStyle = x.ok ? (v ? '#3f6b3a' : '#dbefb4') : v ? '#b8452f' : '#ef957d'),
        (e.fillStyle = x.ok ? '#aed07d26' : '#f27b6429'),
        (e.lineWidth = 2 / a.zoom));
      let C = BUILDING_SIZES[s]?.radius ?? 0.55;
      if (
        (e.beginPath(),
        e.ellipse(0, 0, (C * TILE_W) / 1.25, (C * TILE_H) / 1.25, 0, 0, Math.PI * 2),
        e.fill(),
        e.stroke(),
        r > 1e3 && o > 600)
      ) {
        e.scale(1 / a.zoom, 1 / a.zoom);
        let R = Math.min(0, r - (T.x * a.zoom + a.x) - 136),
          b = T.y * a.zoom + a.y < 250 ? 45 : -85;
        ((e.fillStyle = v ? 'rgba(239,228,200,.97)' : '#132e3ef2'),
          e.beginPath(),
          e.roundRect(R - 137, b, 274, 62, 4),
          e.fill(),
          (e.strokeStyle = x.ok ? (v ? '#2b2118' : '#9fb794') : '#df8f7b'),
          (e.lineWidth = 1),
          e.stroke(),
          (e.textAlign = 'center'),
          (e.font = v ? '13px Georgia, serif' : '13px Arial'),
          (e.fillStyle = v ? (x.ok ? '#2b2118' : '#8e2f22') : x.ok ? '#edddb0' : '#ffbaa4'),
          e.fillText(
            `${x.ok ? k.name : 'Cannot place here'} \xB7 ${k.materials ? 'mixed resources' : x.cost + ' gold'}`,
            R,
            b + 19,
          ),
          (e.font = '12px Arial'),
          (e.fillStyle = v ? '#4a3a2a' : '#d3dfd1'),
          e.fillText(x.reason, R, b + 37, 255),
          isBuildingItem(k) &&
            x.ok &&
            e.fillText(
              `${Ia[s]}d construction \xB7 est. ${Math.round(x.rate ?? 0)} ${x.resource}/day at this site`,
              R,
              b + 53,
              255,
            ));
      }
      e.restore();
    }
  }
}
function drawOrnaments(e, t, a, n, r, o) {
  let l = { x: -5250, y: 2520 };
  r(l.x, l.y, 600 * o + 50) &&
    (e.save(),
    (e.globalAlpha = 0.92),
    e.drawImage(compassRose(), l.x - 500, l.y - 500, 1e3, 1e3),
    e.restore());
  let s = { x: 4900, y: -2780 };
  if (
    (r(s.x, s.y, 760 * o + 50) &&
      e.drawImage(
        cartouche('TIDEWEALD', 'A true description of the northern haven'),
        s.x - 700,
        s.y - 242,
        1400,
        485,
      ),
    o < 0.05)
  )
    return;
  let c = [
      { x: -6700, y: -350, kind: 'serpent' },
      { x: 6600, y: 420, kind: 'whale' },
      { x: -900, y: -3780, kind: 'ship' },
      { x: 1600, y: 3560, kind: 'ship' },
      { x: 3900, y: 2950, kind: 'whale' },
      { x: -3600, y: -2700, kind: 'ship' },
      { x: -6200, y: 1500, kind: 'maelstrom' },
      { x: 6300, y: -2000, kind: 'kraken' },
    ],
    u = Math.max(1.3, 0.3 / o);
  c.forEach((d, m) => {
    if (r(d.x, d.y, 260 * u * o + 40))
      if (d.kind === 'serpent') drawSerpent(e, d.x, d.y, n + m * 4e4, u * 1.4);
      else if (d.kind === 'whale') drawWhale(e, d.x, d.y, n + m * 23e3, u * 1.2);
      else if (d.kind === 'maelstrom') tw11Maelstrom(e, d.x, d.y, n, u * 1.3);
      else if (d.kind === 'kraken') tw11Kraken(e, d.x, d.y, n + m * 17e3, u * 1.2);
      else {
        let h = ((n * 2e-5 + m * 0.37) % 1) * 2 - 1;
        drawShip(e, d.x + h * 420, d.y + h * 90, n + m * 999, u, m % 2 ? -1 : 1);
      }
  });
}
function drawAtmosphere(e, t, a, n, r, o, l, s, c, u = 1) {
  if (a.weather === 'rain' || a.weather === 'storm') {
    ((e.fillStyle =
      a.weather === 'storm'
        ? c
          ? 'rgba(40,48,60,.2)'
          : 'rgba(36,65,88,.19)'
        : c
          ? 'rgba(60,72,78,.06)'
          : 'rgba(65,100,118,.07)'),
      e.fillRect(0, 0, o, l),
      (e.strokeStyle = c ? 'rgba(43,50,58,.4)' : 'rgba(245,253,255,.50)'),
      (e.lineWidth = 1),
      e.beginPath());
    for (let v = 0; v < (a.weather === 'storm' ? 135 : 70); v++) {
      let M = ((v * 147.21 + r * 0.045) % (o + 50)) - 25,
        w = ((v * 83.71 + r * 0.43) % (l + 50)) - 25;
      (e.moveTo(M, w), e.lineTo(M - 5, w + 16));
    }
    e.stroke();
  }
  if (a.weather === 'snow') {
    ((e.fillStyle = 'rgba(255,255,255,.85)'), e.beginPath());
    for (let v = 0; v < 85; v++) {
      let M = (v * 137.1 + r * 0.017 + Math.sin(r * 5e-4 + v) * 20) % (o + 20),
        w = (v * 73.7 + r * 0.04) % (l + 20);
      (e.moveTo(M + 1.4 + (v % 3) * 0.5, w), e.arc(M, w, 1.4 + (v % 3) * 0.5, 0, Math.PI * 2));
    }
    (e.fill(), c && ((e.strokeStyle = 'rgba(43,33,24,.25)'), (e.lineWidth = 0.6), e.stroke()));
  }
  a.weather === 'drought' && ((e.fillStyle = 'rgba(243,191,87,.09)'), e.fillRect(0, 0, o, l));
  let d = u >= 50 ? 0 : u >= 10 ? 0.22 : u >= 3 ? 0.5 : 1,
    m = ((a.time % 1) + 1) % 1,
    h = Math.cos(m * Math.PI * 2),
    p = clamp((h - 0.1) / 0.8) * d,
    g = Math.exp(-(((h - 0.05) / 0.28) ** 2)) * d;
  if (c)
    (p > 0 && ((e.fillStyle = `rgba(26,32,70,${0.38 * p})`), e.fillRect(0, 0, o, l)),
      g > 0.05 && ((e.fillStyle = `rgba(214,128,62,${0.1 * g})`), e.fillRect(0, 0, o, l)));
  else {
    let v = Math.max(0, h) * 0.04;
    ((e.fillStyle = `rgba(32,66,99,${v})`), e.fillRect(0, 0, o, l));
  }
}

export { drawStatic, renderIsland };

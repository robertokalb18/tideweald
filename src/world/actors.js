// Recovered from the Tideweald v16.11 build. Module: world/actors
import { BUILDING_SIZES, GRID_W, HAVEN, isBuilt } from './catalog.js';
import { Kn } from './spatial-index.js';
import { announce, cellAt } from './world.js';
import { stepProgress } from '../core/step-clock.js';
import { raidPlan } from '../military/frontier.js';

var B6 = new WeakMap();
function landCells(e) {
  let t = B6.get(e);
  return (
    (!t || t.cells !== e.cells || t.placements !== e.placements) &&
      ((t = { cells: e.cells, placements: e.placements, land: e.cells.filter((a) => a.land) }), B6.set(e, t)),
    t.land
  );
}
var j6 = new WeakMap();
function plantSpatial(e) {
  let t = j6.get(e);
  return (
    (!t || t.items.length !== e.plants.length || t.items.some((a, n) => a !== e.plants[n])) &&
      ((t = { items: e.plants.slice(), index: new Kn(e.plants) }), j6.set(e, t)),
    t.index
  );
}
function rotateBuilding(e, t) {
  let a = e.buildings.find((n) => n.id === t);
  return a
    ? ((a.orientation = a.orientation ? 0 : 1),
      e.revision++,
      announce(e, 'Building turned to face the other isometric direction.'),
      !0)
    : !1;
}
var a8 = new WeakMap();
function state(e) {
  let t = a8.get(e);
  t ||
    ((t = {
      stamp: '',
      last: 0,
      clock: 0,
      actors: new Map(),
      buildings: new Kn(e.buildings),
      retreatUntil: 0,
    }),
    a8.set(e, t));
  let a = `${e.placements}/${e.buildings.length}/${e.buildings.filter(isBuilt).length}/${e.frontier.formation}`;
  if (t.stamp !== a) {
    ((t.stamp = a), (t.buildings = new Kn(e.buildings)));
    for (let n of t.actors.values())
      if (((n.target = ''), !clear(e, t, n.x, n.y))) {
        let r = closest(e, t, n);
        ((n.x = r.x), (n.y = r.y), (n.path = []));
      }
  }
  return t;
}
function clear(e, t, a, n) {
  let r = cellAt(e, a, n);
  return (
    !!r &&
    (r.land || !!r.road) &&
    (!r.pond || !!r.road) &&
    !r.rock &&
    r.elevation <= 12 &&
    !t.buildings.some(
      a,
      n,
      3,
      (o) => (o.x - a) ** 2 + (o.y - n) ** 2 < (BUILDING_SIZES[o.kind]?.radius ?? 1.3) ** 2,
    )
  );
}
function closest(e, t, a) {
  for (let n = 0; n <= 12; n++)
    for (let r = 0; r < (n ? 16 : 1); r++) {
      let o = (r * Math.PI) / 8,
        l = Math.floor(a.x + Math.cos(o) * n) + 0.5,
        s = Math.floor(a.y + Math.sin(o) * n) + 0.5;
      if (clear(e, t, l, s)) return { x: l, y: s };
    }
  return a;
}
function path(e, t, a, n) {
  let r = { x: Math.floor(a.x), y: Math.floor(a.y) },
    o = { x: Math.floor(n.x), y: Math.floor(n.y) },
    l = (h, p) => p * GRID_W + h,
    s = [r],
    c = new Map(),
    u = new Map();
  (c.set(l(r.x, r.y), -1), u.set(l(r.x, r.y), r));
  let d = -1;
  for (let h = 0; h < s.length && h < 1100; h++) {
    let p = s[h],
      g = l(p.x, p.y);
    if (p.x === o.x && p.y === o.y) {
      d = g;
      break;
    }
    for (let [v, M] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1],
    ]) {
      let w = p.x + v,
        y = p.y + M,
        k = l(w, y);
      c.has(k) ||
        Math.abs(w - r.x) > 19 ||
        Math.abs(y - r.y) > 19 ||
        !clear(e, t, w + 0.5, y + 0.5) ||
        (v && M && (!clear(e, t, p.x + v + 0.5, p.y + 0.5) || !clear(e, t, p.x + 0.5, p.y + M + 0.5))) ||
        (c.set(k, g), u.set(k, { x: w, y }), s.push({ x: w, y }));
    }
  }
  if (d < 0) return [];
  let m = [];
  for (; d !== -1; ) {
    let h = u.get(d);
    (m.push({ x: h.x + 0.5, y: h.y + 0.5 }), (d = c.get(d)));
  }
  return m.reverse().slice(1);
}
// Milestone 2: the raid's landing, target and route come from the simulation (frontier/battle).
// The ship and route are shown once the watch has spotted the sails: at once with a watchtower or
// beacon, otherwise on the last day before they land.
function raidLocation(e) {
  let t = e.frontier,
    a = t.pending;
  if (a?.kind !== 'raid') return;
  let n = t.battle ?? raidPlan(e, a),
    r = Math.floor(e.time + 1e-8) + 1,
    o = e.buildings.some((d) => (d.kind === 'watchtower' || d.kind === 'beacon') && isBuilt(d)),
    l = { x: n.landing[0] + 0.5, y: n.landing[1] + 0.5 },
    s = t.battle?.raiders.filter((d) => d.hp > 0 && d.s !== 'away' && d.s !== 'wait' && d.s !== 'down') ?? [],
    c = s.length
      ? { x: s.reduce((d, m) => d + m.x, 0) / s.length, y: s.reduce((d, m) => d + m.y, 0) / s.length }
      : l;
  return {
    id: a.id,
    water: { x: n.water[0] + 0.5, y: n.water[1] + 0.5 },
    landing: l,
    target: { x: n.tx, y: n.ty },
    route: n.route,
    spotted: !!t.battle || o || r >= a.dueDay - 1,
    watched: o,
    battle: t.battle,
    focus: c,
  };
}
/** Battle units for drawing, part of the way between the last two fixed steps. */
function battleActors(e, t, a, n, r) {
  let o = n || !a ? 1 : stepProgress(e),
    l = new Set(),
    s = (c, u, d) => {
      if (d && (c.s === 'wait' || c.s === 'away')) return;
      l.add(u);
      let m = t.actors.get(u);
      m ||
        ((m = { id: u, x: c.x, y: c.y, dx: 1, dy: 0, phase: 0, walking: !1, enemy: d, path: [], target: '' }),
        t.actors.set(u, m));
      let h = c.x - c.px,
        p = c.y - c.py;
      ((m.x = c.px + h * o),
        (m.y = c.py + p * o),
        Math.hypot(h, p) > 0.01 && ((m.dx = h), (m.dy = p)),
        (m.fighting = c.s === 'fight' || c.s === 'loot'),
        (m.walking = c.s !== 'down' && (Math.hypot(h, p) > 0.02 || m.fighting)),
        (m.phase = m.walking ? t.clock * (m.fighting ? 10 : 7) + u * 0.37 : 0),
        (m.hp = c.max ? c.hp / c.max : 1),
        (m.down = c.s === 'down'),
        (m.path = []),
        (m.target = ''));
    };
  r.guards.forEach((c, u) => s(c, u, !1));
  r.raiders.forEach((c, u) => s(c, 100 + u, !0));
  for (let [c] of t.actors) l.has(c) || t.actors.delete(c);
  return [...t.actors.values()];
}
function militaryActors(e, t, a = !1) {
  let n = state(e),
    r = n.last ? Math.min(0.1, Math.max(0, (t - n.last) / 1e3)) : 0;
  ((n.last = t), !a && t && (n.clock += r));
  if (e.frontier.battle) return battleActors(e, n, t, a, e.frontier.battle);
  let o = e.buildings.filter((d) => d.kind === 'guardhall' && isBuilt(d)),
    l = e.frontier.formation ?? 'patrol',
    c = new Set(),
    u = (d, m, h, p) => {
      c.add(d);
      let g = n.actors.get(d);
      g ||
        ((g = {
          ...closest(e, n, m),
          id: d,
          dx: 1,
          dy: 0,
          phase: 0,
          walking: !1,
          enemy: p,
          path: [],
          target: '',
        }),
        n.actors.set(d, g));
      let v = closest(e, n, h),
        M = `${v.x},${v.y}/${n.stamp}`;
      if (
        (g.target !== M &&
          ((g.target = M),
          (g.path = path(e, n, g, v)),
          // Back from a fight too far away to path home: rejoin the post.
          !g.path.length && Math.hypot(g.x - v.x, g.y - v.y) > 18 && ((g.x = v.x), (g.y = v.y))),
        (g.fighting = !1),
        (g.down = !1),
        (g.hp = 1),
        (g.walking = !1),
        !a && t && g.path.length)
      ) {
        let w = g.path[0],
          y = w.x - g.x,
          k = w.y - g.y,
          x = Math.hypot(y, k),
          T = Math.min(x, r * (p ? 0.9 : l === 'column' ? 1.1 : 0.8));
        (x &&
          clear(e, n, g.x + (y / x) * T, g.y + (k / x) * T) &&
          ((g.x += (y / x) * T),
          (g.y += (k / x) * T),
          (g.dx = y),
          (g.dy = k),
          (g.phase += T * 7),
          (g.walking = T > 0)),
          x < 0.05 && g.path.shift());
      }
      return g;
    };
  for (let d = 0; d < e.frontier.garrison; d++) {
    let m = o[Math.floor(d / 6) % Math.max(1, o.length)] ?? e.buildings.find(isBuilt) ?? HAVEN,
      h = d % 6,
      p =
        l === 'line'
          ? { x: h * 1.1 - 2.8, y: 0 }
          : l === 'column'
            ? { x: (h % 2) * 1.05, y: Math.floor(h / 2) * 1.1 }
            : { x: (h % 3) * 1.1 - 1.1, y: Math.floor(h / 3) * 1.1 },
      g = Math.floor(n.clock / 10) % 4,
      v =
        l === 'patrol'
          ? [
              [3, 4],
              [7, 4],
              [7, 8],
              [3, 8],
            ][g]
          : l === 'column'
            ? [
                [4, 4],
                [4, 8],
                [8, 8],
                [8, 4],
              ][g]
            : [
                [2, 5],
                [2, 5],
                [4, 5],
                [4, 5],
              ][g];
    u(d, { x: m.x + 2 + h * 0.5, y: m.y + 4 }, { x: m.x + v[0] + p.x, y: m.y + v[1] + p.y }, !1);
  }
  for (let [d] of n.actors) c.has(d) || n.actors.delete(d);
  return [...n.actors.values()];
}
function locateArmy(e) {
  return militaryActors(e, 0, !0).find((t) => !t.enemy);
}
var o8 = new WeakMap();
function animalPose(e, t, a = !1) {
  let n = o8.get(e);
  if (!n)
    return (
      (n = {
        x: e.x,
        y: e.y,
        fromX: e.x,
        fromY: e.y,
        targetX: e.x,
        targetY: e.y,
        changed: t,
        duration: 250,
        sample: t,
      }),
      o8.set(e, n),
      n
    );
  let r = a || t === 0 ? 1 : Math.max(0, Math.min(1, (t - n.changed) / n.duration));
  return (
    (n.x = n.fromX + (n.targetX - n.fromX) * r),
    (n.y = n.fromY + (n.targetY - n.fromY) * r),
    (n.targetX !== e.x || n.targetY !== e.y) &&
      ((n.fromX = n.x),
      (n.fromY = n.y),
      (n.targetX = e.x),
      (n.targetY = e.y),
      (n.duration = Math.max(80, Math.min(250, t - n.sample))),
      (n.changed = t),
      (n.sample = t)),
    (a || t === 0 || Math.hypot(e.x - n.x, e.y - n.y) > 3) &&
      ((n.x = n.fromX = n.targetX = e.x), (n.y = n.fromY = n.targetY = e.y), (n.changed = t)),
    n
  );
}

export { animalPose, landCells, locateArmy, militaryActors, plantSpatial, raidLocation, rotateBuilding };

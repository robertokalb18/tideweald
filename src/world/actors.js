// Recovered from the Tideweald v16.11 build. Module: world/actors
import { BUILDING_SIZES, GRID_W, HAVEN, isBuilt } from './catalog.js';
import { Kn } from './spatial-index.js';
import { announce, cellAt } from './world.js';

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
function raidLocation(e) {
  let t = state(e),
    a = e.frontier.pending;
  if (a?.kind !== 'raid') return;
  if (t.raid?.id === a.id) return t.raid;
  let n = e.buildings.find((s) => s.kind === 'guardhall' && isBuilt(s)) ?? e.buildings.find(isBuilt) ?? HAVEN,
    r,
    o = 1 / 0;
  for (let s of e.cells) {
    if (s.land && !s.pond) continue;
    let c = (s.x - n.x) ** 2 + (s.y - n.y) ** 2;
    if (c >= o) continue;
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([d, m]) => clear(e, t, s.x + d + 0.5, s.y + m + 0.5)) &&
      ((o = c), (r = { x: s.x + 0.5, y: s.y + 0.5 }));
  }
  let l = r ?? { x: n.x + 7, y: n.y + 7 };
  return ((t.raid = { id: a.id, water: l, landing: closest(e, t, l) }), t.raid);
}
function militaryActors(e, t, a = !1) {
  let n = state(e),
    r = n.last ? Math.min(0.1, Math.max(0, (t - n.last) / 1e3)) : 0;
  ((n.last = t), !a && t && (n.clock += r));
  let o = e.buildings.filter((d) => d.kind === 'guardhall' && isBuilt(d)),
    l = e.frontier.formation ?? 'patrol',
    s = raidLocation(e),
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
        (g.target !== M && ((g.target = M), (g.path = path(e, n, g, v))),
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
  if (s) {
    n.retreatUntil = n.clock + 7;
    for (let d = 0; d < Math.min(8, Math.max(4, Math.ceil(e.frontier.pending.strength / 5))); d++) {
      let m = Math.floor(n.clock / 9) % 2;
      u(
        100 + d,
        { x: s.landing.x + (d % 3), y: s.landing.y + Math.floor(d / 3) },
        { x: s.landing.x + (d % 3) * 1.2 + (m ? 3 : 1), y: s.landing.y + Math.floor(d / 3) * 1.2 + 2 },
        !0,
      );
    }
  } else if (n.raid && n.clock < n.retreatUntil)
    for (let d of n.actors.values()) d.enemy && u(d.id, d, n.raid.landing, !0);
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

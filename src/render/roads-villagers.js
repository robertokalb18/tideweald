// Recovered from the Tideweald v16.11 build. Module: render/roads-villagers
import { roadPattern, shape } from './chart.js';
import { BUILDING_SIZES, GRID_H, GRID_W, isBuilt } from '../world/catalog.js';
import { cellAt } from '../world/world.js';

var kindOf = (e) => (e.pond ? 'bridge' : e.road === 'paved' ? 'paved' : e.road === 'road' ? 'road' : 'path'),
  CM = { paved: 0.34, road: 0.3, path: 0.24, bridge: 0.3 },
  AM = {
    paved: ['#3b3128', '#5f6a5c'],
    road: ['#3b3128', '#69786a'],
    path: ['#5a4632', '#8c794c'],
    bridge: ['#3b2a1a', '#634222'],
  },
  RM = {
    paved: ['#d8d2bd', '#c9c7b2'],
    road: ['#d8d2bd', '#c9c7b2'],
    path: ['#d9bf86', '#c4a56a'],
    bridge: ['#b48850', '#b48850'],
  };
function drawRoads(e, t, a, n, r, o) {
  if (!a.length) return;
  let l = new Map(),
    s = new Map(),
    c = new Path2D(),
    u = !1,
    d = (h, p) => !!cellAt(t, h, p)?.road;
  for (let h of a) {
    let p = d(h.x, h.y - 1),
      g = d(h.x + 1, h.y),
      v = d(h.x, h.y + 1),
      M = d(h.x - 1, h.y),
      w = (p ? 1 : 0) | (g ? 2 : 0) | (v ? 4 : 0) | (M ? 8 : 0),
      y =
        (p && g && d(h.x + 1, h.y - 1) ? 1 : 0) |
        (v && g && d(h.x + 1, h.y + 1) ? 2 : 0) |
        (v && M && d(h.x - 1, h.y + 1) ? 4 : 0) |
        (p && M && d(h.x - 1, h.y - 1) ? 8 : 0),
      k = kindOf(h),
      x = CM[k],
      T = o(h.x + 0.5, h.y + 0.5),
      C = new DOMMatrix([29, 14.5, -29, 14.5, T.x, T.y - h.elevation]),
      R = l.get(k);
    (R || l.set(k, (R = new Path2D())), R.addPath(shape(w, y, x), C));
    let b = s.get(k);
    (b || s.set(k, (b = new Path2D())),
      b.addPath(shape(w, y, x + 0.05), C),
      h.snow > 0.15 && (c.addPath(shape(w, y, x), C), (u = !0)));
  }
  let m = ['path', 'road', 'paved', 'bridge'];
  for (let h of m) {
    let p = s.get(h);
    p && ((e.fillStyle = AM[h][r ? 0 : 1]), e.fill(p));
  }
  for (let h of m) {
    let p = l.get(h);
    p && ((e.fillStyle = n ? roadPattern(e, h, r) : RM[h][r ? 0 : 1]), e.fill(p));
  }
  u && ((e.fillStyle = 'rgba(239,246,250,.4)'), e.fill(c));
}
var E8 = new WeakMap(),
  N8 = 40,
  D8 = new Set([
    'farm',
    'market',
    'sawmill',
    'quarry',
    'fishery',
    'bakery',
    'smithy',
    'carpenter',
    'well',
    'chapel',
    'storehouse',
    'granary',
    'windmill',
    'watermill',
    'harbor',
    'guardhall',
    'watchtower',
    'tavern',
  ]),
  EM = new Set(['cottage', 'guardhall']),
  z8 = new WeakMap();
function passGrid(e) {
  let t = z8.get(e);
  if (t && t.placements === e.placements && t.cells === e.cells && t.n === e.buildings.length) return t.grid;
  let a = new Uint8Array(GRID_W * GRID_H);
  for (let n = 0; n < e.cells.length; n++) {
    let r = e.cells[n];
    (r.land || r.road) && (!r.pond || r.road) && !r.rock && r.elevation < 13 && (a[n] = r.road ? 2 : 1);
  }
  for (let n of e.buildings) {
    let r = (BUILDING_SIZES[n.kind]?.radius ?? 1.2) * Math.sqrt(0.65),
      o = r * r;
    for (let l = Math.max(0, Math.floor(n.y - r - 1)); l <= Math.min(GRID_H - 1, Math.ceil(n.y + r)); l++)
      for (let s = Math.max(0, Math.floor(n.x - r - 1)); s <= Math.min(GRID_W - 1, Math.ceil(n.x + r)); s++)
        (s + 0.5 - n.x) ** 2 + (l + 0.5 - n.y) ** 2 < o && (a[l * GRID_W + s] = 0);
  }
  return (
    (t = { placements: e.placements, cells: e.cells, n: e.buildings.length, grid: a }),
    z8.set(e, t),
    a
  );
}
function clear2(e, t, a) {
  let n = Math.floor(t),
    r = Math.floor(a);
  return n >= 0 && r >= 0 && n < GRID_W && r < GRID_H && passGrid(e)[r * GRID_W + n] > 0;
}
function door(e, t) {
  let a = passGrid(e),
    n,
    r = 1 / 0;
  for (let o = -3; o <= 3; o++)
    for (let l = -3; l <= 3; l++) {
      let s = Math.floor(t.x) + l,
        c = Math.floor(t.y) + o;
      if (s < 0 || c < 0 || s >= GRID_W || c >= GRID_H) continue;
      let u = a[c * GRID_W + s];
      if (!u) continue;
      let d = l * l + o * o - (u === 2 ? 12 : 0);
      d < r && ((n = { x: s + 0.5, y: c + 0.5 }), (r = d));
    }
  return n;
}
function findPath(e, t, a) {
  let n = passGrid(e),
    r = Math.floor(t.x),
    o = Math.floor(t.y),
    l = Math.floor(a.x),
    s = Math.floor(a.y),
    c = Math.max(0, Math.min(r, l) - 5),
    u = Math.max(0, Math.min(o, s) - 5),
    d = Math.min(GRID_W - 1, Math.max(r, l) + 5),
    m = Math.min(GRID_H - 1, Math.max(o, s) + 5),
    h = d - c + 1,
    p = m - u + 1;
  if (h * p > 2500) return null;
  let g = new Float32Array(h * p).fill(1 / 0),
    v = new Int32Array(h * p).fill(-1),
    M = [],
    w = [],
    y = (E, V) => {
      (M.push(E), w.push(V));
      let Z = M.length - 1;
      for (; Z > 0; ) {
        let L = (Z - 1) >> 1;
        if (w[L] <= w[Z]) break;
        (([M[L], M[Z]] = [M[Z], M[L]]), ([w[L], w[Z]] = [w[Z], w[L]]), (Z = L));
      }
    },
    k = () => {
      let E = M[0],
        V = M.pop(),
        Z = w.pop();
      if (M.length) {
        ((M[0] = V), (w[0] = Z));
        let L = 0;
        for (;;) {
          let N = 2 * L + 1,
            O = N + 1,
            z = L;
          if ((N < M.length && w[N] < w[z] && (z = N), O < M.length && w[O] < w[z] && (z = O), z === L))
            break;
          (([M[z], M[L]] = [M[L], M[z]]), ([w[z], w[L]] = [w[L], w[z]]), (L = z));
        }
      }
      return E;
    },
    x = (E, V) => (V - u) * h + (E - c),
    T = (E, V) => (E >= c && E <= d && V >= u && V <= m ? n[V * GRID_W + E] : 0);
  if (!T(r, o) || !T(l, s)) return null;
  let C = x(r, o),
    R = x(l, s);
  for (g[C] = 0, y(C, 0); M.length; ) {
    let E = k();
    if (E === R) break;
    let V = (E % h) + c,
      Z = Math.floor(E / h) + u,
      L = g[E];
    for (let N = -1; N <= 1; N++)
      for (let O = -1; O <= 1; O++) {
        if (!O && !N) continue;
        let z = V + O,
          U = Z + N,
          Y = T(z, U);
        if (!Y || (O && N && (!T(V + O, Z) || !T(V, Z + N)))) continue;
        let W = x(z, U),
          j = L + (O && N ? 1.414 : 1) * (Y === 2 ? 1 : 1.8);
        j < g[W] && ((g[W] = j), (v[W] = E), y(W, j + Math.hypot(z - l, U - s)));
      }
  }
  if (v[R] < 0 && R !== C) return null;
  let b = [];
  for (let E = R; E >= 0 && E !== C; E = v[E])
    b.push({ x: (E % h) + c + 0.5, y: Math.floor(E / h) + u + 0.5 });
  b.reverse();
  let A = [];
  for (let E = 0; E < b.length; E++) {
    let V = E ? b[E - 1] : { x: r + 0.5, y: o + 0.5 },
      Z = b[E],
      L = b[E + 1];
    (!L || Math.sign(Z.x - V.x) !== Math.sign(L.x - Z.x) || Math.sign(Z.y - V.y) !== Math.sign(L.y - Z.y)) &&
      A.push(Z);
  }
  return A;
}
var hash = (e) => (
    (e = Math.imul(e ^ (e >>> 16), 73244475)),
    (e = Math.imul(e ^ (e >>> 16), 73244475)),
    ((e ^ (e >>> 16)) >>> 0) / 4294967296
  ),
  isNight = (e) => {
    let t = ((e.time % 1) + 1) % 1;
    return t < 0.22 || t > 0.85;
  };
function spawn(e, t, a, n) {
  let r = t.id * 4 + a,
    o = n.get(r);
  if (o && clear2(e, o.x, o.y))
    return (
      (o.home = t),
      o.goal && !e.buildings.includes(o.goal) && ((o.goal = null), (o.path = []), (o.tx = o.x), (o.ty = o.y)),
      o
    );
  let l = door(e, t);
  return l
    ? {
        id: r,
        x: l.x,
        y: l.y,
        tx: l.x,
        ty: l.y,
        previousX: l.x,
        previousY: l.y,
        wait: 0.5 + hash(r) * 4,
        phase: r,
        walking: !1,
        dx: 1,
        dy: 0,
        home: t,
        path: [],
        goal: null,
        speed: 0.5 + hash(r + 7) * 0.16,
        lane: (hash(r + 13) - 0.5) * 0.24,
        trips: 0,
        ease: 0,
        indoors: !1,
        origin: l,
      }
    : null;
}
function nextTrip(e, t) {
  let a = isNight(e),
    n = t.id % 5 === 0,
    r = door(e, t.home) ?? t.origin,
    o = Math.hypot(t.x - r.x, t.y - r.y) < 0.8;
  if (a && !n) {
    if (o) {
      ((t.indoors = !0), (t.wait = 2 + hash(t.id + t.trips) * 3));
      return;
    }
    ((t.goal = t.home), (t.path = findPath(e, t, r) ?? []), t.trips++);
    return;
  }
  if (((t.indoors = !1), !o || (t.goal && t.goal !== t.home))) {
    ((t.goal = t.home), (t.path = findPath(e, t, r) ?? []), t.trips++);
    return;
  }
  let l = e.buildings.filter(
    (s) =>
      s !== t.home &&
      isBuilt(s) &&
      D8.has(s.kind) &&
      Math.abs(s.x - t.home.x) < 14 &&
      Math.abs(s.y - t.home.y) < 14,
  );
  if ((t.trips++, l.length)) {
    let s = l[Math.floor(hash(t.id * 31 + t.trips) * l.length)],
      c = door(e, s);
    if (c) {
      let u = findPath(e, t, c);
      if (u && u.length) {
        ((t.goal = s), (t.path = u));
        return;
      }
    }
  }
  for (let s = 0; s < 6; s++) {
    let c = hash(t.id + t.trips * 7 + s) * Math.PI * 2,
      u = 2 + hash(t.id * 3 + t.trips + s) * 3,
      d = Math.floor(t.home.x + Math.cos(c) * u) + 0.5,
      m = Math.floor(t.home.y + Math.sin(c) * u) + 0.5;
    if (!clear2(e, d, m)) continue;
    let h = findPath(e, t, { x: d, y: m });
    if (h && h.length) {
      ((t.goal = null), (t.path = h));
      return;
    }
  }
  t.wait = 2;
}
function villageWalkers(e, t, a = !1) {
  let n = E8.get(e),
    r = e.buildings.reduce((l, s) => l + (isBuilt(s) ? 1 : 0), 0);
  if (
    (n || ((n = { placements: -1, buildings: -1, walkers: [], last: t }), E8.set(e, n)),
    n.placements !== e.placements || n.buildings !== r)
  ) {
    let l = new Map(n.walkers.map((c) => [c.id, c])),
      s = [];
    for (let c of e.buildings) {
      if (s.length >= N8) break;
      if (!isBuilt(c)) continue;
      let u = EM.has(c.kind)
        ? c.id % 2
          ? 2
          : 1
        : D8.has(c.kind) && ['farm', 'market', 'sawmill'].includes(c.kind)
          ? 1
          : 0;
      for (let d = 0; d < u && s.length < N8; d++) {
        let m = spawn(e, c, d, l);
        m && s.push(m);
      }
    }
    ((n.walkers = s), (n.placements = e.placements), (n.buildings = r));
  }
  let o = a ? 0 : Math.min(0.05, Math.max(0, (t - n.last) / 1e3));
  n.last = t;
  for (let l of n.walkers) {
    if (!o) {
      l.walking = !1;
      continue;
    }
    let s = Math.hypot(l.tx - l.x, l.ty - l.y);
    if (s < 1e-6) {
      if (((l.x = l.tx), (l.y = l.ty), l.path.length)) {
        let m = l.path.shift();
        ((l.previousX = l.x),
          (l.previousY = l.y),
          (l.tx = m.x + l.lane),
          (l.ty = m.y - l.lane),
          clear2(e, l.tx, l.ty) || ((l.tx = m.x), (l.ty = m.y)));
        continue;
      }
      if (((l.walking = !1), (l.ease = 0), (l.wait -= o), l.wait > 0)) continue;
      (nextTrip(e, l),
        !l.path.length && !l.indoors
          ? (l.wait = 1.5)
          : l.path.length &&
            (l.wait =
              l.goal && l.goal !== l.home ? 3 + hash(l.id + l.trips) * 4 : 2 + hash(l.id * 5 + l.trips) * 3));
      continue;
    }
    l.ease = Math.min(1, l.ease + o * 3);
    let c = Math.min(s, o * l.speed * (0.35 + 0.65 * l.ease)),
      u = (l.tx - l.x) / s,
      d = (l.ty - l.y) / s;
    ((l.x += u * c), (l.y += d * c), (l.dx = u), (l.dy = d), (l.phase += c * 5), (l.walking = !0));
  }
  return n.walkers.filter((l) => !l.indoors);
}

export { drawRoads, villageWalkers };

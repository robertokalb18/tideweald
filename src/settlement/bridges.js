// Recovered from the Tideweald v16.11 build. Module: settlement/bridges
import { BUILDING_SIZES } from '../world/catalog.js';
import { cellAt } from '../world/world.js';

function bridgeTiles(e) {
  return Array.from({ length: e.length }, (t, a) => ({
    x: e.x + (e.orientation ? 0 : a),
    y: e.y + (e.orientation ? a : 0),
  }));
}
function bridgeAt(e, t, a) {
  let n = Math.floor(t),
    r = Math.floor(a);
  return (e.bridges ?? []).find((o) =>
    o.orientation ? n === o.x && r >= o.y && r < o.y + o.length : r === o.y && n >= o.x && n < o.x + o.length,
  );
}
function bridgeCost(e, t) {
  return {
    gold: t * (e === 'stone_bridge' ? 30 : 20),
    food: 0,
    timber: t * (e === 'stone_bridge' ? 4 : 8),
    stone: e === 'stone_bridge' ? t * 8 : 0,
  };
}
var bridgeDays = (e) => Number(((e.kind === 'stone_bridge' ? 1.4 : 0.7) + e.length * 0.15).toFixed(2)),
  bridgeCostText = (e) =>
    Object.entries(e)
      .filter(([, t]) => t > 0)
      .map(([t, a]) => `${a} ${t}`)
      .join(' \xB7 ');
function bridgePlan(e, t, a, n, r = 0) {
  let o = {
      ok: !1,
      cost: 0,
      materials: { timber: 0, stone: 0 },
      reason: 'Tap the river, then Turn to align the crossing.',
      bridge: void 0,
    },
    l = (T) => ({ ...o, reason: T }),
    s = cellAt(e, a, n);
  if (!s || !Number.isFinite(a) || !Number.isFinite(n)) return l('Choose water inside the map.');
  if (s.land && !s.pond) return l('Tap water between two banks. Turn switches the crossing direction.');
  if ((e.bridges?.length ?? 0) >= 128) return l('Bridge limit reached: 128 crossings.');
  let c = r ? 0 : 1,
    u = r ? 1 : 0,
    d = (T, C) => {
      let R = 1;
      for (let b of [-1, 1])
        for (let A = 1; A <= 14; A++) {
          let E = cellAt(e, s.x + T * A * b, s.y + C * A * b);
          if (!E || (E.land && !E.pond)) break;
          R++;
        }
      return R;
    },
    m = d(c, u),
    h = d(u, c);
  if (m > h + 1 && h <= 12)
    return l(`This runs along the water. Turn to cross it: ${h} tile${h === 1 ? '' : 's'} wide here.`);
  let p = (T) => {
      for (let C = 1; C <= 13; C++) {
        let R = cellAt(e, s.x + c * C * T, s.y + u * C * T);
        if (!R) return;
        if (R.land && !R.pond) return R;
      }
    },
    g = p(-1),
    v = p(1);
  if (!g || !v)
    return l(
      m > 12
        ? 'Too wide: choose a crossing of at most 12 water tiles.'
        : 'No bank in this direction. Turn the bridge or choose a narrower crossing.',
    );
  let M = Math.abs(g.x - v.x) + Math.abs(g.y - v.y) + 1;
  if (M > 14) return l('Too wide: choose a crossing of at most 12 water tiles.');
  let w = { id: e.nextId, kind: t, x: g.x, y: g.y, orientation: r, length: M, buildProgress: 0 },
    y = bridgeTiles(w);
  if (y.some((T) => bridgeAt(e, T.x, T.y))) return l('A crossing already occupies this span.');
  if (
    y.some((T) => {
      let C = cellAt(e, T.x, T.y);
      return C.rock || C.elevation > 12;
    })
  )
    return l('Both banks need flat, clear approaches.');
  if (
    y.some((T) =>
      e.buildings.some(
        (C) => Math.hypot(C.x - T.x - 0.5, C.y - T.y - 0.5) < (BUILDING_SIZES[C.kind]?.radius ?? 1.2) + 0.45,
      ),
    )
  )
    return l('Leave room around the buildings on both banks.');
  if (
    y.some((T) => e.plants.some((C) => C.health > 0 && Math.hypot(C.x - T.x - 0.5, C.y - T.y - 0.5) < 0.65))
  )
    return l('Clear plants from both approaches first.');
  let k = bridgeCost(t, M);
  return (
    (o.cost = k.gold),
    (o.materials = { timber: k.timber, stone: k.stone }),
    (o.bridge = w),
    Object.entries(k).filter(([T, C]) => e.wallet[T] < C).length
      ? { ...o, reason: `Need ${bridgeCostText(k)} for all ${M} sections.` }
      : { ...o, ok: !0, reason: `${M - 2} water tiles \xB7 ${bridgeCostText(k)} \xB7 ${bridgeDays(w)} days` }
  );
}
function removeBridge(e, t) {
  let a = e.bridges?.find((n) => n.id === t);
  if (!a) return !1;
  for (let n of bridgeTiles(a)) {
    let r = cellAt(e, n.x, n.y);
    r && (!r.land || r.pond) && (r.road = !1);
  }
  if (a.buildProgress < 1) {
    let n = bridgeCost(a.kind, a.length);
    for (let [r, o] of Object.entries(n)) e.wallet[r] += Math.floor(o * 0.5);
    e.spent -= Math.floor(n.gold * 0.5);
  }
  return ((e.bridges = e.bridges.filter((n) => n.id !== t)), e.placements++, e.revision++, !0);
}

export { bridgeAt, bridgeDays, bridgePlan, bridgeTiles, removeBridge };

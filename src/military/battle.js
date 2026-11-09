// Raids you can fight (Milestone 2).
//
// A raid is played out on the map. When the threat is announced, the raiders pick a target (the
// richest store) and a landing beach, and the route between them is fixed. On the due day the band
// lands and marches along that route. Guards leave their halls and act by formation; watchtowers and
// beacons shoot raiders in range; a palisade gate slows raiders near it and must be broken before
// the stores behind it can be looted. The outcome comes from what happens on the map.
//
// Rules for this module:
// - It runs only inside step() (through stepFrontier), in fixed sub-steps, with no randomness.
// - It imports only the grid leaf module, so the catalog can keep importing the military rules.
import { GRID_H, GRID_W, HAVEN } from '../world/grid.js';

export const SUBSTEPS = 5;
const DEFENSE_KINDS = new Set(['watchtower', 'palisade', 'guardhall', 'beacon']);
const TARGET_ORDER = ['storehouse', 'granary', 'market', 'harbor', 'tradingpost'];
const built = (b) => b.buildProgress >= 1 - 1e-8;

// Unit numbers are per island day. A raid of strength S has 10·S hit points and 73·S damage per
// day in total; one guard (3 defense) matches 3 points of raid strength in both.
export const GUARD = { hp: 30, dps: 220, speed: 50, reach: 0.95 };
export const RAIDER = { hpPer: 10, dpsPer: 73, speed: 42, reach: 0.95, notice: 1.4 };
export const FORMATIONS = {
  // Spread around the target; engage anything within reach of their beat; chase stragglers.
  patrol: { speed: 1, engage: 3.5, taken: 1, dealt: 1, pursue: 6, rally: 9, alarm: true },
  // Hold a shield wall across the route between the beach and the stores; take less damage; never chase.
  line: { speed: 0.9, engage: 1.3, taken: 0.7, dealt: 1, pursue: 0, rally: 2.5 },
  // March fast to meet the band on the beach; a charge on first contact; long pursuit; more exposed.
  column: { speed: 1.5, engage: 99, taken: 1.15, dealt: 1, pursue: 14, charge: 1.6, rally: 99 },
};
export const TOWERS = { watchtower: { range: 7.5, dps: 220 }, beacon: { range: 9, dps: 300 } };
export const PALISADE = { radius: 5.5, slow: 0.5, taken: 0.7, loot: 0.6, gate: 250 };
const LAND_GAP = 0.012; // days between raiders wading ashore
const MELEE_SLOTS = 2; // no more than two can strike at one man
const LOOT_RATE = 3; // a whole band strips the stores in a third of a day
const ROUT_AT = 0.35; // the band runs when it is down to 35% of its hit points
const LAST_LIGHT = 0.6; // days the band stays after it could have reached the stores
const GIVE_UP = 3.0; // hard stop

const cellOf = (w, x, y) => {
  const cx = Math.floor(x),
    cy = Math.floor(y);
  return cx >= 0 && cx < GRID_W && cy >= 0 && cy < GRID_H ? w.cells[cy * GRID_W + cx] : undefined;
};
const walkable = (c) => !!c && c.land && !c.rock && (!c.pond || !!c.road);
// Longships come in from the sea and row up rivers; they do not cross ponds.
const sea = (c) => !!c && (!c.land || c.waterType === 'river');
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** The building a raid makes for: the stores first, rotating between the top three of that kind. */
export function raidTarget(w, id) {
  const rank = (b) => {
    const i = TARGET_ORDER.indexOf(b.kind);
    return i < 0 ? TARGET_ORDER.length : i;
  };
  const pool = w.buildings
    .filter((b) => built(b) && !DEFENSE_KINDS.has(b.kind))
    .sort((a, b) => rank(a) - rank(b) || a.id - b.id);
  if (!pool.length) return { id: 0, kind: 'haven', x: HAVEN.x, y: HAVEN.y };
  const top = pool.filter((b) => rank(b) === rank(pool[0])).slice(0, 3);
  const b = top[id % top.length];
  return { id: b.id, kind: b.kind, x: b.x, y: b.y };
}

function coastal(w, x, y) {
  if (!walkable(cellOf(w, x, y))) return false;
  return sea(cellOf(w, x + 1, y)) || sea(cellOf(w, x - 1, y)) || sea(cellOf(w, x, y + 1)) || sea(cellOf(w, x, y - 1));
}

/** Breadth-first route over walkable ground, 8 directions without cutting corners. Cells as [x, y]. */
function findRoute(w, from, to) {
  const x0 = Math.max(0, Math.min(from.x, to.x) - 24),
    y0 = Math.max(0, Math.min(from.y, to.y) - 24),
    x1 = Math.min(GRID_W - 1, Math.max(from.x, to.x) + 24),
    y1 = Math.min(GRID_H - 1, Math.max(from.y, to.y) + 24),
    W = x1 - x0 + 1,
    H = y1 - y0 + 1,
    prev = new Int32Array(W * H).fill(-2),
    queue = new Int32Array(W * H),
    key = (x, y) => (y - y0) * W + (x - x0),
    ok = (x, y) => x >= x0 && x <= x1 && y >= y0 && y <= y1 && (walkable(cellOf(w, x, y)) || (x === to.x && y === to.y));
  let head = 0,
    tail = 0,
    found = -1;
  prev[key(from.x, from.y)] = -1;
  queue[tail++] = key(from.x, from.y);
  const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
  while (head < tail) {
    const k = queue[head++],
      x = (k % W) + x0,
      y = Math.floor(k / W) + y0;
    if (x === to.x && y === to.y) {
      found = k;
      break;
    }
    for (const [dx, dy] of DIRS) {
      const nx = x + dx,
        ny = y + dy;
      if (!ok(nx, ny) || prev[key(nx, ny)] !== -2) continue;
      if (dx && dy && (!ok(x + dx, y) || !ok(x, y + dy))) continue;
      prev[key(nx, ny)] = k;
      queue[tail++] = key(nx, ny);
    }
  }
  const route = [];
  if (found >= 0) {
    for (let k = found; k !== -1; k = prev[k]) route.push((k % W) + x0, Math.floor(k / W) + y0);
    const pairs = [];
    for (let i = route.length - 2; i >= 0; i -= 2) pairs.push(route[i], route[i + 1]);
    return pairs.slice(0, 600);
  }
  // No path over land (the stores are across water): wade in a straight line.
  const n = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
  for (let i = 0; i <= n && i < 300; i++)
    route.push(Math.round(from.x + ((to.x - from.x) * i) / n), Math.round(from.y + ((to.y - from.y) * i) / n));
  return route;
}

/**
 * Where a raid lands and how it walks. Decided once, when the threat is announced, so that the
 * player can see it (with a watchtower) and prepare. Deterministic: depends only on the island and id.
 */
export function planRaid(w, id) {
  const target = raidTarget(w, id),
    tx = Math.floor(target.x),
    ty = Math.floor(target.y),
    want = (id * 2.39996323) % (Math.PI * 2);
  let best = null,
    bestScore = Infinity;
  const scan = (R, minD, maxD, wide = false) => {
    for (let y = Math.max(0, ty - R); y <= Math.min(GRID_H - 1, ty + R); y++)
      for (let x = Math.max(0, tx - R); x <= Math.min(GRID_W - 1, tx + R); x++) {
        const d = Math.hypot(x + 0.5 - target.x, y + 0.5 - target.y);
        if (d < minD || d > maxD || !coastal(w, x, y)) continue;
        const a = Math.atan2(y + 0.5 - target.y, x + 0.5 - target.x),
          diff = Math.abs(((a - want + Math.PI * 3) % (Math.PI * 2)) - Math.PI),
          score = wide ? d + diff * 3 : diff * 10 + Math.abs(d - 16) * 0.35;
        if (score < bestScore) (bestScore = score), (best = { x, y });
      }
  };
  scan(30, 9, 30);
  if (!best) scan(Math.max(GRID_W, GRID_H), 0, Infinity, true);
  if (!best) best = { x: Math.min(GRID_W - 1, tx + 8), y: Math.min(GRID_H - 1, ty + 8) };
  // The ship waits a little way out to sea, beside the beach.
  let water = { x: best.x, y: best.y };
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
    if (!sea(cellOf(w, best.x + dx, best.y + dy))) continue;
    let k = 1;
    while (k < 3 && sea(cellOf(w, best.x + dx * (k + 1), best.y + dy * (k + 1)))) k++;
    water = { x: best.x + dx * k, y: best.y + dy * k };
    break;
  }
  return {
    target: target.id,
    tx: target.x,
    ty: target.y,
    landing: [best.x, best.y],
    water: [water.x, water.y],
    route: findRoute(w, best, { x: tx, y: ty }),
  };
}

const routePoint = (route, i) => ({ x: route[i * 2] + 0.5, y: route[i * 2 + 1] + 0.5 });
const routeLength = (route) => route.length / 2;

/** Counts of defenses in play, from the island's completed buildings. */
// Lore (Milestone 6) arrives through opts.lore: { shieldwall, bows, ditch }, worked out by the frontier rules.
function defenses(w, opts = {}) {
  const towers = [],
    palisades = [],
    halls = [];
  palisades.r = PALISADE.radius + (opts.lore?.ditch ? 1.5 : 0);
  for (const b of w.buildings) {
    if (!built(b)) continue;
    if (TOWERS[b.kind]) towers.push(b);
    else if (b.kind === 'palisade') palisades.push(b);
    else if (b.kind === 'guardhall') halls.push(b);
  }
  return { towers, palisades, halls };
}
const nearPalisade = (pals, p) => pals.some((q) => dist(q, p) <= (pals.r ?? PALISADE.radius));

/**
 * The band lands. `plan` comes from planRaid; `opts.structure` scales tower fire and gates
 * (council choice), `opts.morale` (50–100) scales guard damage.
 */
export function startBattle(w, threat, plan, opts = {}) {
  const S = Math.max(1, threat.strength),
    n = Math.max(3, Math.min(14, Math.round(S / 3))),
    { palisades, halls } = defenses(w, opts),
    land = { x: plan.landing[0] + 0.5, y: plan.landing[1] + 0.5 },
    target = { x: plan.tx, y: plan.ty },
    raiders = [],
    guards = [];
  for (let i = 0; i < n; i++)
    raiders.push({
      x: land.x + ((i % 3) - 1) * 0.45,
      y: land.y + (Math.floor(i / 3) % 2) * 0.45,
      hp: (S * RAIDER.hpPer) / n,
      max: (S * RAIDER.hpPer) / n,
      s: 'wait', // wait (still in the boat) · march · fight · loot · flee · down · away
      ri: 0,
      c: 0, // share of the plunder this raider carries
      // They wade ashore one by one, form up on the beach, then march in rows of three.
      wait: (n - 1) * LAND_GAP + 0.03 + Math.floor(i / 3) * 0.014,
    });
  const garrison = w.frontier.garrison ?? 0;
  for (let i = 0; i < garrison; i++) {
    const hall = halls[Math.floor(i / 6) % Math.max(1, halls.length)] ?? HAVEN,
      j = i % 6;
    guards.push({
      x: hall.x + 1.5 + (j % 3) * 0.6,
      y: hall.y + 1.5 + Math.floor(j / 3) * 0.6,
      hp: GUARD.hp,
      max: GUARD.hp,
      s: 'muster', // muster · fight · down
      ch: -1, // island time of first contact (column charge)
    });
  }
  for (const u of raiders) (u.px = u.x), (u.py = u.y);
  for (const u of guards) (u.px = u.x), (u.py = u.y);
  const protectedTarget = nearPalisade(palisades, target);
  return {
    id: threat.id,
    strength: S,
    t: 0,
    target: plan.target,
    tx: plan.tx,
    ty: plan.ty,
    landing: plan.landing,
    water: plan.water,
    route: plan.route,
    raiders,
    guards,
    gate: protectedTarget
      ? PALISADE.gate *
        palisades.filter((q) => dist(q, target) <= palisades.r).length *
        (opts.structure ?? 1) *
        (opts.lore?.ditch ? 1.5 : 1)
      : 0,
    gateMax: 0,
    lootTime: 0,
    burned: 0,
    routed: false,
    arrows: 0,
    shots: [],
  };
}

const vigor = (u) => 0.5 + (0.5 * u.hp) / u.max; // the wounded strike weaker
const alive = (u) => u.hp > 0 && u.s !== 'down' && u.s !== 'away';
const ashore = (u) => alive(u) && u.s !== 'wait';

function moveToward(w, u, goal, step) {
  const dx = goal.x - u.x,
    dy = goal.y - u.y,
    d = Math.hypot(dx, dy);
  if (d < 1e-6) return 0;
  const k = Math.min(1, step / d),
    nx = u.x + dx * k,
    ny = u.y + dy * k;
  // Guards keep to the land when they can: slide along one axis rather than step into water.
  if (!walkable(cellOf(w, nx, ny)) && walkable(cellOf(w, u.x, u.y))) {
    if (walkable(cellOf(w, nx, u.y))) return (u.x = nx), Math.abs(nx - u.x);
    if (walkable(cellOf(w, u.x, ny))) return (u.y = ny), Math.abs(ny - u.y);
  }
  u.x = nx;
  u.y = ny;
  return Math.min(step, d);
}

/** Moves a raider along the route (dir +1 inland, -1 back to the boat). Returns true at the end. */
function followRoute(u, route, dir, step, off = 0) {
  const len = routeLength(route);
  while (step > 1e-9) {
    const p = shifted(route, Math.max(0, Math.min(len - 1, u.ri)), off);
    const d = Math.hypot(p.x - u.x, p.y - u.y);
    if (d > step) {
      u.x += ((p.x - u.x) / d) * step;
      u.y += ((p.y - u.y) / d) * step;
      return false;
    }
    u.x = p.x;
    u.y = p.y;
    step -= d;
    const next = u.ri + dir;
    if (next < 0 || next >= len) return true;
    u.ri = next;
  }
  return false;
}

/** A route point moved sideways by `off` tiles, so a band walks three abreast. */
function shifted(route, i, off) {
  const p = routePoint(route, i);
  if (!off) return p;
  const len = routeLength(route),
    a = routePoint(route, Math.max(0, i - 1)),
    c = routePoint(route, Math.min(len - 1, i + 1)),
    dx = c.x - a.x,
    dy = c.y - a.y,
    l = Math.hypot(dx, dy) || 1;
  return { x: p.x - (dy / l) * off, y: p.y + (dx / l) * off };
}

/** The most hurt enemy within reach: guards finish a wounded man before turning to the next. */
function weakest(list, p, max, pred) {
  let best = null;
  for (const u of list)
    if (pred(u) && Math.hypot(u.x - p.x, u.y - p.y) <= max && (!best || u.hp < best.hp)) best = u;
  return best;
}

function nearest(list, p, max, pred = alive) {
  let best = null,
    bd = max;
  for (const u of list) {
    if (!pred(u)) continue;
    const d = Math.hypot(u.x - p.x, u.y - p.y);
    if (d <= bd) (bd = d), (best = u);
  }
  return best;
}

/** Where guard i stands when no raider is close, by formation. */
function post(b, form, i, count, alarm) {
  const len = routeLength(b.route),
    target = { x: b.tx, y: b.ty };
  if (form === 'line') {
    const k = Math.max(0, Math.min(len - 1, Math.round((len - 1) * 0.7))),
      a = routePoint(b.route, Math.max(0, k - 2)),
      c = routePoint(b.route, Math.min(len - 1, k + 2)),
      m = routePoint(b.route, k),
      dx = c.x - a.x,
      dy = c.y - a.y,
      l = Math.hypot(dx, dy) || 1,
      // A shield wall five wide; later ranks stand behind, toward the stores.
      rank = Math.floor(i / 5),
      inRank = Math.min(5, count - rank * 5),
      off = ((i % 5) - (inRank - 1) / 2) * 0.9;
    return { x: m.x + (-dy / l) * off + (dx / l) * rank * 0.8, y: m.y + (dx / l) * off + (dy / l) * rank * 0.8 };
  }
  if (form === 'column') {
    const p = routePoint(b.route, 0);
    return { x: p.x + (i % 2) * 0.8, y: p.y + Math.floor(i / 2) * 0.8 };
  }
  if (alarm) {
    // The patrol closes up in front of the stores, on the side the raiders come from.
    const k = Math.max(0, len - 4),
      m = shifted(b.route, k, ((i % 3) - 1) * 0.8),
      back = routePoint(b.route, Math.min(len - 1, k + 1)),
      row = Math.floor(i / 3) * 0.7,
      dx = back.x - m.x,
      dy = back.y - m.y,
      l = Math.hypot(dx, dy) || 1;
    return { x: m.x + (dx / l) * row, y: m.y + (dy / l) * row };
  }
  const a = (i / Math.max(1, count)) * Math.PI * 2 + 0.4;
  return { x: target.x + Math.cos(a) * 3.5, y: target.y + Math.sin(a) * 3.5 };
}

/**
 * Advances the battle by dt island days (one fixed step), in SUBSTEPS sub-steps.
 * Returns true when the battle is over. `opts.dry` (forecasts) leaves the island untouched.
 */
export function stepBattle(w, b, dt, opts = {}) {
  for (const u of b.raiders) (u.px = u.x), (u.py = u.y);
  for (const u of b.guards) (u.px = u.x), (u.py = u.y);
  b.shots = [];
  const sub = dt / SUBSTEPS,
    def = defenses(w, opts);
  for (let k = 0; k < SUBSTEPS; k++) if (subStep(w, b, sub, opts, k === 0, def)) return true;
  return false;
}

function subStep(w, b, dt, opts, record, def) {
  b.t += dt;
  const formName = FORMATIONS[w.frontier.formation] ? w.frontier.formation : 'patrol',
    form = FORMATIONS[formName],
    { towers, palisades } = def,
    structure = opts.structure ?? 1,
    morale = 0.75 + 0.25 * Math.min(1, Math.max(0.5, (opts.morale ?? 100) / 100)),
    target = { x: b.tx, y: b.ty },
    R = b.raiders,
    G = b.guards,
    n = R.length,
    maxHp = R.reduce((s, u) => s + u.max, 0);

  // Landing: one by one off the ship.
  R.forEach((u, i) => {
    if (u.s === 'wait' && b.t >= i * LAND_GAP) u.s = 'march';
  });

  // Morale of the band.
  const hpLeft = R.reduce((s, u) => s + (alive(u) ? u.hp : 0), 0);
  if (!b.routed && hpLeft < maxHp * ROUT_AT) {
    b.routed = true;
    for (const u of R) if (alive(u)) u.s = 'flee';
  }
  const taken = R.reduce((s, u) => s + u.c, 0);
  if (!b.routed && (taken >= 1 - 1e-9 || b.t >= routeLength(b.route) / RAIDER.speed + LAST_LIGHT))
    for (const u of R) if (alive(u) && u.s !== 'flee') u.s = 'flee';
  if (b.t >= GIVE_UP) for (const u of R) if (alive(u)) u.s = 'away';

  const looting = R.some((u) => alive(u) && u.s === 'loot');
  const dmgR = new Map(),
    dmgG = new Map(),
    hit = (m, u, v) => m.set(u, (m.get(u) ?? 0) + v);

  // Guards.
  // The horn: a raider ashore near the stores or near any guard.
  const alarm = R.some((u) => ashore(u) && u.s !== 'flee' && (dist(u, target) <= 14 || G.some((g) => alive(g) && dist(g, u) <= 6))),
    fights = G.filter((g) => alive(g) && g.s === 'fight'),
    onR = new Map(), // guards fighting each raider this sub-step
    onG = new Map(); // raiders fighting each guard
  G.forEach((g, i) => {
    if (!alive(g)) return;
    const fleeingOnly = (u) => ashore(u) && u.s === 'flee';
    const open = (u) => ashore(u) && u.s !== 'flee' && (onR.get(u) ?? 0) < MELEE_SLOTS,
      reach = form.engage;
    let foe =
      weakest(R, g, GUARD.reach, open) ??
      nearest(R, g, reach, open) ??
      nearest(R, g, reach, (u) => ashore(u) && u.s !== 'flee');
    if (!foe && formName === 'line' && looting) foe = nearest(R, g, 99, (u) => ashore(u) && u.s !== 'flee');
    // At the horn, guards within rally distance of a fight join it.
    if (!foe && fights.length) {
      const near = nearest(fights, g, form.rally, () => true);
      if (near) foe = nearest(R, near, 3, (u) => ashore(u) && u.s !== 'flee');
    }
    if (!foe && form.pursue) foe = nearest(R, g, form.pursue, fleeingOnly);
    const speed = GUARD.speed * form.speed * dt;
    if (foe) {
      const d = dist(g, foe);
      if (d > GUARD.reach * 0.85) moveToward(w, g, foe, Math.min(speed, d - GUARD.reach * 0.8));
      if (dist(g, foe) <= GUARD.reach && (onR.get(foe) ?? 0) < MELEE_SLOTS) {
        onR.set(foe, (onR.get(foe) ?? 0) + 1);
        if (g.ch < 0) g.ch = b.t;
        g.s = 'fight';
        const charge = form.charge && b.t - g.ch < 0.05 ? form.charge : 1;
        hit(dmgR, foe, GUARD.dps * form.dealt * charge * morale * vigor(g) * dt);
      } else g.s = 'muster';
    } else {
      g.s = 'muster';
      moveToward(w, g, post(b, formName, i, G.length, alarm && form.alarm), speed);
    }
  });

  // Raiders.
  const looters = [];
  R.forEach((u, i) => {
    if (!ashore(u)) return;
    const slow = nearPalisade(palisades, u) ? PALISADE.slow : 1;
    if (u.s === 'flee') {
      const back = followRoute(u, b.route, -1, RAIDER.speed * 1.1 * dt * slow);
      if (back) u.s = 'away';
      return;
    }
    const foe = nearest(G, u, RAIDER.notice, (g) => alive(g) && (onG.get(g) ?? 0) < MELEE_SLOTS);
    if (foe) {
      const d = dist(u, foe);
      if (d > RAIDER.reach * 0.85) moveToward(w, u, foe, Math.min(RAIDER.speed * dt * slow, d - RAIDER.reach * 0.8));
      if (dist(u, foe) <= RAIDER.reach) {
        onG.set(foe, (onG.get(foe) ?? 0) + 1);
        u.s = 'fight';
        const shield = nearPalisade(palisades, foe) ? PALISADE.taken : 1;
        hit(
          dmgG,
          foe,
          ((u.max * RAIDER.dpsPer) / RAIDER.hpPer) * vigor(u) * form.taken * shield * (opts.lore?.shieldwall ? 0.85 : 1) * dt,
        );
        return;
      }
    }
    // Make for the stores; once there, loot.
    const len = routeLength(b.route);
    const atStores = u.ri >= len - 1 && dist(u, target) <= 1.6;
    if (atStores) {
      u.s = 'loot';
      const a = (i / n) * Math.PI * 2;
      moveToward(w, u, { x: target.x + Math.cos(a) * 1.1, y: target.y + Math.sin(a) * 1.1 }, RAIDER.speed * dt);
      looters.push(u);
      return;
    }
    u.s = 'march';
    if (b.t < u.wait) return; // forming up on the beach
    if (followRoute(u, b.route, 1, RAIDER.speed * dt * slow, ((i % 3) - 1) * 0.6))
      moveToward(w, u, target, RAIDER.speed * dt);
  });

  // Towers and beacons loose arrows at the nearest raider ashore.
  for (const t of towers) {
    const spec = TOWERS[t.kind],
      foe = nearest(R, t, spec.range + (opts.lore?.bows ? 1 : 0), ashore);
    if (!foe) continue;
    hit(dmgR, foe, spec.dps * structure * (opts.lore?.bows ? 1.3 : 1) * dt);
    if (record && b.shots.length < 8) b.shots.push([t.x, t.y, foe.x, foe.y]), b.arrows++;
  }

  // Damage lands all at once.
  for (const [u, d] of dmgR) {
    u.hp -= d;
    if (u.hp <= 1e-9) (u.hp = 0), (u.s = 'down'), (u.c = 0); // what a fallen raider carried stays on the island
  }
  for (const [g, d] of dmgG) {
    g.hp -= d;
    if (g.hp <= 1e-9) (g.hp = 0), (g.s = 'down');
  }

  // Looting: first the palisade gate, then the stores.
  const still = looters.filter(alive);
  if (still.length) {
    b.lootTime += dt;
    if (b.gate > 0) {
      if (!b.gateMax) b.gateMax = b.gate;
      b.gate = Math.max(0, b.gate - still.reduce((s, u) => s + u.max * (RAIDER.dpsPer / RAIDER.hpPer), 0) * dt);
    } else {
      const share = (LOOT_RATE / n) * dt * (nearPalisade(palisades, target) ? PALISADE.loot : 1);
      let room = 1 - R.reduce((s, u) => s + u.c, 0);
      for (const u of still) {
        const take = Math.min(room, share);
        u.c += take;
        room -= take;
      }
    }
    // Fire: half the band at the stores, unopposed, behind no palisade.
    const guarded = G.some((g) => alive(g) && dist(g, target) <= 4);
    if (
      !b.burned &&
      b.target &&
      !b.gateMax &&
      !guarded &&
      b.lootTime >= 0.12 &&
      still.length >= Math.ceil(n * 0.5) &&
      !nearPalisade(palisades, target)
    ) {
      b.burned = b.target;
      if (!opts.dry) burn(w, b.target);
    }
  }

  return R.every((u) => !ashore(u));
}

function burn(w, id) {
  const bld = w.buildings.find((x) => x.id === id);
  if (!bld) return;
  bld.buildProgress = Math.min(bld.buildProgress, 0.8);
  bld.stored = 0;
  w.placements++;
  for (let y = Math.floor(bld.y) - 1; y <= Math.floor(bld.y) + 1; y++)
    for (let x = Math.floor(bld.x) - 1; x <= Math.floor(bld.x) + 1; x++) {
      const c = cellOf(w, x, y);
      if (c && c.land) c.fire = Math.max(c.fire ?? 0, 0.5);
    }
}

/** The tally of a finished (or forecast) battle. */
export function battleOutcome(b) {
  const lost = b.raiders.filter((u) => u.s === 'away').reduce((s, u) => s + u.c, 0),
    fell = b.raiders.filter((u) => u.s === 'down').length,
    fled = b.raiders.filter((u) => u.s === 'away').length,
    guardsDown = b.guards.filter((g) => g.s === 'down').length;
  return {
    lost: Math.min(1, lost),
    fell,
    fled,
    raiders: b.raiders.length,
    guardsDown,
    guards: b.guards.length,
    burned: b.burned,
    arrows: b.arrows,
    gateHeld: b.gateMax > 0 && b.gate > 0,
    repelled: !b.burned && lost < 0.2,
    days: b.t,
  };
}

/** Plays a battle to the end without touching the island. */
export function forecastBattle(w, b, opts = {}) {
  const copy = JSON.parse(JSON.stringify(b));
  for (let i = 0; i < 400; i++) if (stepBattle(w, copy, 0.025, { ...opts, dry: true })) break;
  return battleOutcome(copy);
}

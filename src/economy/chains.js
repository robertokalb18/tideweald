// Milestone 4: production chains. A chain workshop works fully only with a supplier close by; a supplied
// shipyard gives the island boats, and a supplied smithy gives it tools, which raise other buildings' output.
// Nothing here is saved: it is worked out from the buildings, so old saves load unchanged.
// Imports nothing that imports it back (see CLAUDE.md).

const built = (b) => b.buildProgress >= 1 - 1e-8;
export const SUPPLY_RANGE = 8; // tiles between a workshop and its supplier
export const UNSUPPLIED = 0.5; // output without a supplier ("bought-in" goods)

export const CHAINS = {
  bakery: {
    from: ['farm'],
    goods: 'barley',
    mill: { kinds: ['windmill', 'watermill'], range: 12, factor: 1.3 },
  },
  smokehouse: { from: ['fishery', 'pier'], goods: 'fish' },
  shipyard: { from: ['sawmill', 'carpenter'], goods: 'timber', gives: 'boats' },
  smithy: { from: ['quarry', 'stonemason'], goods: 'stone and bog iron', gives: 'tools' },
};
export const GOODS = {
  boats: { kinds: ['fishery', 'pier'], factor: 1.2, text: 'boats from the boatbuilders’ yard' },
  tools: { kinds: ['farm', 'sawmill', 'quarry'], factor: 1.15, text: 'tools from the forge' },
};

const cache = new WeakMap();
function index(world) {
  let n = 0;
  for (const b of world.buildings) built(b) && n++;
  const key = `${world.placements}|${world.buildings.length}|${n}`;
  let c = cache.get(world);
  if (c?.key === key) return c;
  const byKind = new Map();
  for (const b of world.buildings) {
    if (!built(b)) continue;
    byKind.has(b.kind) || byKind.set(b.kind, []);
    byKind.get(b.kind).push(b);
  }
  c = { key, byKind, supply: new Map(), goods: null };
  cache.set(world, c);
  return c;
}

/** Built buildings of the given kinds within `range` tiles of `b`, nearest first. */
export function nearby(world, b, kinds, range) {
  const { byKind } = index(world),
    out = [];
  for (const k of kinds)
    for (const o of byKind.get(k) ?? []) {
      const d = Math.hypot(o.x - b.x, o.y - b.y);
      o !== b && d <= range && out.push([d, o]);
    }
  return out.sort((p, q) => p[0] - q[0] || p[1].id - q[1].id).map(([, o]) => o);
}

/**
 * How well a chain workshop is supplied: `factor` multiplies its output, `links` are the supplier ids
 * (drawn on the map when it is selected), `missing` names what it lacks.
 */
export function supplyOf(world, b) {
  const chain = CHAINS[b.kind];
  if (!chain) return { factor: 1, links: [], missing: null, milled: false };
  const c = index(world);
  let s = c.supply.get(b.id);
  if (s) return s;
  const from = nearby(world, b, chain.from, SUPPLY_RANGE).slice(0, 3),
    mill = chain.mill ? nearby(world, b, chain.mill.kinds, chain.mill.range)[0] : null;
  s = {
    factor: (from.length ? 1 : UNSUPPLIED) * (from.length && mill ? chain.mill.factor : 1),
    links: [...from, ...(mill && from.length ? [mill] : [])].map((o) => o.id),
    missing: from.length ? null : chain.goods,
    milled: !!(mill && from.length),
  };
  c.supply.set(b.id, s);
  return s;
}

/** The island-wide goods made by supplied chain workshops: { boats, tools }. */
export function islandGoods(world) {
  const c = index(world);
  if (c.goods) return c.goods;
  const g = { boats: false, tools: false };
  for (const [kind, chain] of Object.entries(CHAINS))
    if (chain.gives) for (const b of c.byKind.get(kind) ?? []) if (!supplyOf(world, b).missing) g[chain.gives] = true;
  return (c.goods = g);
}

/** The multiplier boats and tools give a building of this kind. */
export function goodsBonus(world, kind) {
  const g = islandGoods(world);
  let f = 1;
  for (const [name, spec] of Object.entries(GOODS)) if (g[name] && spec.kinds.includes(kind)) f *= spec.factor;
  return f;
}

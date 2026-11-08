// Recovered from the Tideweald v16.11 build. Module: progression/orders
import { production } from '../economy/production.js';
import { tradeMultiplier } from './campaign.js';
import {
  Br,
  CATALOG,
  CATALOG_ITEMS,
  Ga,
  fs,
  isBuildingItem,
  isBuilt,
  itemCost,
  wn,
} from '../world/catalog.js';
import { announce } from '../world/world.js';

var pT = 3,
  p2 = 0.1,
  Of = 5,
  _f = {
    deliver: [
      'A Hebridean trader from Lewis',
      'The salt trader of L\xFCneburg',
      'Thorgerd of the hof',
      'The Haven shipwright',
      'A fishing fleet from the Dithmarsch',
      'The weald-reeve',
    ],
    build: [
      'The weald-reeve',
      'The Haven council',
      'Mara, keeper of the harbor',
      'A master mason from Bremen',
    ],
    wildlife: [
      'The walled garden',
      'Ivo the forester',
      'The miller\u2019s widow',
      'The children of the Haven',
    ],
    plant: ['Ivo the forester', 'The godi\u2019s forester', 'The walled garden'],
  },
  gT = {
    food: ['Grain for the winter tithe', 'Stores for a long voyage', 'Provisions for the fair'],
    timber: ['Oak for a knarr\u2019s keel', 'Planks for the new wharf', 'Beams for a guildhall'],
    stone: ['Stone for the hof walls', 'Ballast and quay stone', 'Millstones for the mill'],
  },
  c7 = [
    { kind: 'rabbit', amount: 6, title: 'Rabbits for the warren', noun: 'rabbits' },
    { kind: 'duck', amount: 6, title: 'Ducks for the mill pond', noun: 'ducks' },
    { kind: 'sheep', amount: 4, title: 'A small flock for wool', noun: 'sheep' },
    { kind: 'bee', amount: 6, title: 'Bees for the walled-garden hives', noun: 'bees' },
    { kind: 'butterfly', amount: 4, title: 'Butterflies for the herb garden', noun: 'butterflies' },
    { kind: 'fish', amount: 6, title: 'Fish to stock the river', noun: 'fish' },
    { kind: 'cow', amount: 4, title: 'Milk cows for the dairy', noun: 'cattle' },
    { kind: 'goose', amount: 6, title: 'Geese for the Winter Nights feast', noun: 'geese' },
    { kind: 'stork', amount: 4, title: 'Storks to nest on the hof roof', noun: 'storks' },
    { kind: 'squirrel', amount: 4, title: 'Squirrels for the forester\u2019s count', noun: 'red squirrels' },
    { kind: 'hedgehog', amount: 4, title: 'Hedgehogs for the kitchen gardens', noun: 'hedgehogs' },
    { kind: 'boar', amount: 4, title: 'Boar for the reeve\u2019s hunt', noun: 'wild boar' },
  ],
  u7 = [
    { kind: 'oak', amount: 6, title: 'An oak grove for future keels', noun: 'oak trees' },
    { kind: 'pine', amount: 6, title: 'Pines for resin and masts', noun: 'pine trees' },
    { kind: 'flowers', amount: 8, title: 'A meadow in flower', noun: 'flower patches' },
    { kind: 'berry', amount: 5, title: 'Berry thickets for the larder', noun: 'berry bushes' },
    { kind: 'hazel', amount: 5, title: 'Hazel coppice for wattle', noun: 'hazel shrubs' },
  ],
  d7 = 2;
function orderNeed(e) {
  let t =
    e.kind === 'wildlife'
      ? c7.find((a) => a.kind === e.target)?.noun
      : e.kind === 'plant'
        ? u7.find((a) => a.kind === e.target)?.noun
        : (CATALOG[e.target]?.name ?? e.target).toLowerCase();
  return e.kind === 'deliver'
    ? `Harvest ${e.amount.toLocaleString()} new ${e.target}, then deliver it`
    : e.kind === 'build'
      ? `Finish ${e.amount} new ${t}`
      : e.kind === 'wildlife'
        ? `Settle ${e.amount} new ${t} (each must thrive for ${d7} days)`
        : `Grow ${e.amount} new ${t} to maturity`;
}
function rng2(e) {
  let t = e >>> 0;
  return () => {
    t = (t + 1831565813) >>> 0;
    let a = t;
    return (
      (a = Math.imul(a ^ (a >>> 15), a | 1)),
      (a ^= a + Math.imul(a ^ (a >>> 7), a | 61)),
      ((a ^ (a >>> 14)) >>> 0) / 4294967296
    );
  };
}
var pick = (e, t) => t[Math.floor(e() * t.length) % t.length],
  Mc = null;
function outputRates(e) {
  if (Mc && Mc.w === e && Mc.revision === e.revision) return Mc.value;
  let t = {};
  for (let a of e.buildings)
    if (isBuilt(a)) {
      let n = production(e, a);
      t[n.resource] = (t[n.resource] ?? 0) + n.rate;
    }
  return ((Mc = { w: e, revision: e.revision, value: t }), t);
}
var dayOf = (e) => Math.floor(e.time) + 1;
function ordersUnlocked(e) {
  return e.story.started && (e.story.mode === 'sandbox' || e.story.chapter >= 1);
}
function board(e) {
  return (
    e.orders || (e.orders = { list: [], streak: 0, done: 0, nextId: 1, lastDay: 0, expired: 0 }),
    e.orders
  );
}
var streakBonus = (e) => 1 + Math.min(Of, e.streak) * p2;
function orderProgress(e, t) {
  let a = 0,
    n = !1;
  if (t.kind === 'deliver') {
    let r = t.target;
    ((a = Math.floor((e.story.collected[r] ?? 0) - t.base)), (n = a >= t.amount && e.wallet[r] < t.amount));
  } else
    t.kind === 'build'
      ? (a = e.buildings.filter((r) => r.id >= t.base && r.kind === t.target && isBuilt(r)).length)
      : t.kind === 'wildlife'
        ? (a = e.animals.filter(
            (r) => r.id >= t.base && r.kind === t.target && r.health > 0.2 && r.age >= d7,
          ).length)
        : (a = e.plants.filter(
            (r) => r.id >= t.base && r.kind === t.target && r.health > 0.2 && r.growth > 0.45,
          ).length);
  return (
    (a = Math.max(0, a)),
    { have: Math.min(a, t.amount), need: t.amount, ready: a >= t.amount && !n, short: n }
  );
}
function makeOrder(e, t) {
  let a = t.nextId,
    n = rng2((Math.imul(e.seed | 0, 2654435761) ^ Math.imul(a, 40503)) >>> 0),
    r = dayOf(e),
    o = ['deliver', 'deliver', 'build', 'wildlife', 'plant'],
    l = 1 + Math.min(1.5, (e.story.mode === 'campaign' ? e.story.chapter : e.time / 10) * 0.04),
    s = (u, d, m = fs[u] ?? 1) => Math.ceil(d / m) * (CATALOG[u]?.cost ?? 0),
    c = new Set(t.list.map((u) => u.kind + ':' + u.target));
  for (let u = 0; u < 12; u++) {
    let d = pick(n, o),
      m = null;
    if (d === 'deliver') {
      let h = pick(n, ['food', 'timber', 'stone']),
        p = Ga.find((M) => M.id === h),
        g = outputRates(e)[h] ?? 0;
      if (g <= 0) continue;
      let v = Math.max(30, Math.min(4e3, Math.round((g * (3 + n() * 3)) / 10) * 10));
      m = {
        kind: d,
        target: h,
        amount: v,
        reward: Math.max(20, Math.round(v * p.rate * tradeMultiplier(e) * 1.6)),
        patron: pick(n, _f.deliver),
        title: pick(n, gT[h]),
      };
    } else if (d === 'build') {
      let h = CATALOG_ITEMS.filter(
        (g) =>
          isBuildingItem(g) &&
          g.category === 'buildings' &&
          !(e.story.mode === 'campaign' && e.story.chapter < (g.unlock ?? 0)) &&
          itemCost(g).gold <= Math.max(400, e.wallet.gold * 1.2),
      );
      if (!h.length) continue;
      let p = pick(n, h);
      m = {
        kind: d,
        target: p.id,
        amount: 1,
        reward: Math.round((itemCost(p).gold * 0.45 + 60) * l),
        patron: pick(n, _f.build),
        title: `Raise a ${p.name.toLowerCase()}`,
      };
    } else if (d === 'wildlife') {
      let h = pick(n, c7);
      if (
        e.animals.length + h.amount > wn ||
        e.animals.filter((p) => p.kind === h.kind).length + h.amount > Br
      )
        continue;
      m = {
        kind: d,
        target: h.kind,
        amount: h.amount,
        reward: Math.round(Math.max(90 + h.amount * 25, s(h.kind, h.amount) * 1.6) * l),
        patron: pick(n, _f.wildlife),
        title: h.title,
      };
    } else {
      let h = pick(n, u7);
      if (!CATALOG[h.kind]) continue;
      m = {
        kind: d,
        target: h.kind,
        amount: h.amount,
        reward: Math.round(
          Math.max(
            80 + h.amount * 20,
            s(
              h.kind,
              h.amount,
              [
                'grass',
                'flowers',
                'clover',
                'fern',
                'heather',
                'lupine',
                'bluebells',
                'bracken',
                'reeds',
                'sedge',
              ].includes(h.kind)
                ? 5
                : 1,
            ) * 1.6,
          ) * l,
        ),
        patron: pick(n, _f.plant),
        title: h.title,
      };
    }
    if (!(!m || c.has(m.kind + ':' + m.target)))
      return (
        t.nextId++,
        {
          ...m,
          id: a,
          issued: r,
          due: r + 10 + Math.floor(n() * 7),
          base: m.kind === 'deliver' ? Math.floor(e.story.collected[m.target] ?? 0) : e.nextId,
        }
      );
  }
  return (t.nextId++, null);
}
function updateOrders(e) {
  if (!ordersUnlocked(e)) return !1;
  let t = board(e),
    a = dayOf(e),
    n = !1,
    r = t.list.length;
  ((t.list = t.list.filter((l) => l.due >= a)),
    t.list.length < r &&
      ((t.expired += r - t.list.length),
      (t.streak = 0),
      (n = !0),
      announce(e, 'An order ran out of time and the ship sailed on. A new order is on the board.')));
  let o = 0;
  for (; t.list.length < pT && o++ < 6; ) {
    let l = makeOrder(e, t);
    l && (t.list.push(l), (n = !0));
  }
  return ((t.lastDay = a), n);
}
function fulfilOrder(e, t) {
  let a = board(e),
    n = a.list.find((l) => l.id === t);
  if (!n || !orderProgress(e, n).ready) return 0;
  if (n.kind === 'deliver') {
    let l = n.target;
    if (e.wallet[l] < n.amount) return 0;
    e.wallet[l] -= n.amount;
  }
  let o = Math.round(n.reward * streakBonus(a));
  return (
    (e.wallet.gold += o),
    (e.earned += o),
    a.done++,
    (a.streak = Math.min(a.streak + 1, 999)),
    (a.list = a.list.filter((l) => l.id !== t)),
    announce(
      e,
      `${n.patron} is satisfied: +${o} gold${a.streak > 1 ? ` \xB7 seal streak ${a.streak}` : ''}.`,
    ),
    updateOrders(e),
    o
  );
}
function readyOrders(e) {
  return e.orders?.list.filter((t) => orderProgress(e, t).ready).length ?? 0;
}
var ORDER_LIMIT = 10;
function folioEntries() {
  return CATALOG_ITEMS.flatMap((e) =>
    e.category === 'animals'
      ? [{ section: 'wildlife', item: e }]
      : e.category === 'plants'
        ? [{ section: 'flora', item: e }]
        : e.category === 'landmarks'
          ? [{ section: 'wonders', item: e }]
          : isBuildingItem(e)
            ? [{ section: 'buildings', item: e }]
            : [],
  );
}
var p7 = null,
  entryIds = () => p7 ?? (p7 = new Set(folioEntries().map((e) => e.item.id))),
  milestoneReward = (e) => 50 + 25 * e,
  y7 = 500;
function nextPurse(e, t) {
  if (e >= t) return null;
  let a = (Math.floor(e / ORDER_LIMIT) + 1) * ORDER_LIMIT;
  return a < t
    ? { at: a, gold: milestoneReward(a / ORDER_LIMIT) }
    : { at: t, gold: y7 + (t % ORDER_LIMIT === 0 ? milestoneReward(t / ORDER_LIMIT) : 0) };
}
function updateFolio(e) {
  let t = !e.folio,
    a = new Set(e.folio ?? []),
    n = entryIds(),
    r = [],
    o = (h) => {
      n.has(h) && !a.has(h) && (a.add(h), r.push(h));
    };
  for (let h of e.animals) h.health > 0.2 && o(h.kind);
  for (let h of e.buildings) isBuilt(h) && o(h.kind);
  for (let h of e.plants) h.growth > 0.45 && h.health > 0.2 && !a.has(h.kind) && o(h.kind);
  if (t) return ((e.folio = r), []);
  if (!r.length) return r;
  let l = e.folio?.length ?? 0;
  e.folio = [...(e.folio ?? []), ...r];
  let s = e.folio.length,
    c = Math.floor(l / ORDER_LIMIT),
    u = Math.floor(s / ORDER_LIMIT),
    d = 0;
  for (let h = c + 1; h <= u; h++) d += milestoneReward(h);
  (s >= n.size && l < n.size && (d += y7), d && ((e.wallet.gold += d), (e.earned += d)));
  let m = CATALOG_ITEMS.find((h) => h.id === r[r.length - 1])?.name ?? '';
  return (
    announce(
      e,
      `Folio: ${r.length > 1 ? `${r.length} new leaves, including ${m}` : `${m} recorded`} \xB7 ${s}/${n.size}${d ? ` \xB7 the lawspeaker at the Althing sends ${d} gold` : ''}.`,
    ),
    r
  );
}
function folioProgress(e) {
  let t = entryIds().size,
    a = e.folio?.length ?? 0;
  return { have: a, total: t, next: nextPurse(a, t) };
}

export {
  ORDER_LIMIT,
  Of,
  dayOf,
  folioEntries,
  folioProgress,
  fulfilOrder,
  orderNeed,
  orderProgress,
  ordersUnlocked,
  p2,
  readyOrders,
  streakBonus,
  updateFolio,
  updateOrders,
};

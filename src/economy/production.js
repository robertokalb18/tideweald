// Recovered from the Tideweald v16.11 build. Module: economy/production
import { WORKSHOPS } from './workshops.js';
import { CHAINS, GOODS, SUPPLY_RANGE, goodsBonus, islandGoods, supplyOf } from './chains.js';
import { TIERS, houseNeeds, houseRent, houseResidents, nextNeed } from './needs.js';
import { DEFENSE_ITEMS, moraleMultiplier } from '../military/frontier.js';
import { buildingResource, charterRate, hasLandmark, tradeMultiplier } from '../progression/campaign.js';
import { councilEffects } from '../progression/council.js';
import { landCells } from '../world/actors.js';
import { CATALOG, Ga, buildRemaining, clamp, hf, isBuilt, jp } from '../world/catalog.js';
import { cottageIndex, isWater, productionContext } from '../world/ecosystem.js';
import { seasonAt } from '../world/seasons.js';
import { Qd } from '../world/spatial-index.js';
import { productionArea } from '../world/wildlife.js';
import { announce, cellAt } from '../world/world.js';

var O6 = new WeakMap();
function neighbours(e) {
  let t = 0;
  for (let o of e.buildings) isBuilt(o) && t++;
  let a = `${e.placements}|${e.buildings.length}|${t}`,
    n = O6.get(e);
  if (n && n.key === a) return n;
  n = { key: a, rivals: new Map(), services: new Map() };
  let r = e.buildings.filter(isBuilt);
  for (let o of r) {
    if (o.kind === 'quarry' || o.kind === 'sawmill' || o.kind === 'fishery') {
      let l = 0;
      for (let s of r)
        s !== o &&
          s.kind === o.kind &&
          Math.abs(s.x - o.x) < 6 &&
          Math.abs(s.y - o.y) < 6 &&
          Math.hypot(s.x - o.x, s.y - o.y) < 6 &&
          l++;
      n.rivals.set(o.id, l);
    }
    if (o.kind === 'cottage') {
      let l = new Set();
      for (let s of r)
        (s.kind === 'well' || s.kind === 'market' || s.kind === 'chapel') &&
          Math.hypot(s.x - o.x, s.y - o.y) < 6 &&
          l.add(s.kind);
      n.services.set(o.id, l.size);
    }
  }
  return (O6.set(e, n), n);
}
var rivals = (e, t) => neighbours(e).rivals.get(t.id) ?? 0,
  servicesNear = (e, t) => neighbours(e).services.get(t.id) ?? 0;
function production(e, t, a = !1) {
  let n = cellAt(e, t.x, t.y),
    r = buildingResource(t.kind),
    o = { resource: r, rate: 0, capacity: hasLandmark(e, 'granary') ? 600 : 300, reason: 'Working' };
  if (!isBuilt(t))
    return {
      ...o,
      reason: `Under construction \xB7 ${Math.ceil(buildRemaining(t) * 24)} island hours remaining`,
    };
  if (!n?.land || n.pond || n.rock || n.elevation > 12) return { ...o, reason: 'Needs dry, flat ground' };
  let l = clamp(1 - n.toxicity - n.radiation - n.fire),
    s = 1;
  for (let p of productionArea(e, t, 2.5)) p.road && (s = Math.max(s, 1 + jp[p.road]));
  if (l < 0.05) return { ...o, reason: 'Contamination has stopped production' };
  let c = 0,
    u = 'gold',
    d = 'Working';
  if (t.kind === 'farm') {
    u = 'food';
    let p = councilEffects(e);
    ((c =
      40 *
      p.farmRate *
      clamp((a ? Math.max(0.6, n.soil) : n.soil) * 1.5) *
      Math.max(p.dryFloor, clamp((a ? Math.max(0.45, n.moisture) : n.moisture) * 2, 0.2, 1)) *
      (seasonAt(e.time).index === 3 || e.weather === 'snow' ? 0.25 : 1)),
      n.moisture < 0.25 && !a && (d = 'Dry soil \u2014 add water or a river'));
  }
  if (t.kind === 'sawmill') {
    u = 'timber';
    let p = productionContext(e).plants.count(
      t.x,
      t.y,
      5,
      (g) => g.health > 0.4 && g.growth > 0.6 && !!CATALOG[g.kind]?.tree,
      3,
    );
    ((c = Math.min(24, p * 8) * councilEffects(e).extractRate),
      p || (d = 'Needs mature trees within five tiles'));
  }
  if (t.kind === 'quarry') {
    u = 'stone';
    let p = e.features.some((v) => v.kind !== 'hill' && Math.hypot(v.x - t.x, v.y - t.y) < 5),
      g = productionArea(e, t, 4).some((v) => v.rock);
    ((c = p || g ? 20 * councilEffects(e).extractRate : 0), c || (d = 'Needs a mountain or boulders nearby'));
  }
  if (
    (t.kind === 'fishery' &&
      ((u = 'food'),
      (c = productionArea(e, t, 4, !1).some((p) => isWater(p) && p.toxicity < 0.3 && p.radiation < 0.3)
        ? 30 * councilEffects(e).fishRate
        : 0),
      c || (d = 'Needs clean water nearby')),
    (t.kind === 'quarry' || t.kind === 'sawmill' || t.kind === 'fishery') && c > 0)
  ) {
    let p = rivals(e, t);
    p &&
      ((c /= 1 + 0.6 * p),
      (d = `Sharing its ${t.kind === 'quarry' ? 'stone deposit' : t.kind === 'sawmill' ? 'forest' : 'fishing ground'} with ${p} other ${{ quarry: ['quarry', 'quarries'], sawmill: ['sawpit', 'sawpits'], fishery: ['fishery', 'fisheries'] }[t.kind][p === 1 ? 0 : 1]}`));
  }
  if (
    (t.kind === 'market' &&
      (c = 2 + cottageIndex(e, productionContext(e)).count(t.x, t.y, 6, () => !0) * 0.7),
    t.kind === 'cottage')
  ) {
    // Milestone 4: rent follows the household's needs tier (economy/needs.js).
    let p = houseNeeds(e, t),
      g = nextNeed(e, t);
    ((c = houseRent(e, t)),
      (d = `Tier ${p.tier}, ${TIERS[p.tier].name} \xB7 ${TIERS[p.tier].residents} residents \xB7 rent ${c.toFixed(1)} gold/day${g ? ` \xB7 next tier needs ${g}` : ''}`));
  }
  if ((t.kind === 'farm' && hasLandmark(e, 'windmill') && (c *= 1.25), WORKSHOPS[t.kind])) {
    let p = WORKSHOPS[t.kind];
    ((u = p.resource),
      (c =
        p.rate *
        councilEffects(e).workshopRate *
        (t.kind === 'pier' ? councilEffects(e).fishRate : 1) *
        (t.kind === 'garden' && seasonAt(e.time).index === 3 ? 1 / 3 : 1)),
      (d = p.reason ?? 'Working'),
      p.water &&
        !productionArea(e, t, 4, !1).some(isWater) &&
        ((c = 0), (d = 'Needs water within four tiles')),
      p.trees &&
        !productionContext(e).plants.some(
          t.x,
          t.y,
          6,
          (g) => g.health > 0.3 && g.growth > 0.6 && !!CATALOG[g.kind]?.tree,
        ) &&
        ((c = 0), (d = 'Needs mature woodland within six tiles')),
      p.flowers &&
        !productionContext(e).plants.some(
          t.x,
          t.y,
          6,
          (g) => g.health > 0.3 && g.growth > 0.5 && Qd.has(g.kind),
        ) &&
        ((c = 0), (d = 'Needs flowering plants within six tiles')),
      p.inputs &&
        Object.entries(p.inputs).some(([g, v]) => e.wallet[g] < (v ?? 0) * 0.025) &&
        ((c = 0),
        (d =
          'Collect inputs: ' +
          Object.entries(p.inputs)
            .map(([g, v]) => `${v} ${g}/day`)
            .join(', '))));
  }
  if (
    (hf.some((p) => p.id === t.kind) &&
      ((u = buildingResource(t.kind)),
      (c = {
        granary: 12,
        windmill: 15,
        watermill: 18,
        harbor: 6,
        glasshouse: 25,
        lighthouse: 3,
        observatory: 5,
        guildhall: 10,
        sanctuary: 12,
      }[t.kind]),
      ['watermill', 'harbor'].includes(t.kind) &&
        !productionArea(e, t, 4, !1).some(
          (p) => isWater(p) && (t.kind !== 'watermill' || (p.land && p.pond)),
        ) &&
        ((c = 0), (d = 'Needs suitable water within four tiles'))),
    DEFENSE_ITEMS.some((p) => p.id === t.kind))
  )
    return {
      ...o,
      reason:
        t.kind === 'guardhall'
          ? 'Guard hall ready \xB7 train guards in Army'
          : t.kind === 'watchtower'
            ? 'On watch \xB7 +6 defense, earlier warnings'
            : 'Perimeter secured \xB7 +4 defense',
    };
  // Milestone 4: chains. A chain workshop without a supplier nearby works at half rate; boats and tools
  // from supplied workshops raise fishing, farming, sawing and quarrying.
  let chain = CHAINS[t.kind] ? supplyOf(e, t) : null,
    goods = goodsBonus(e, t.kind);
  if (c > 0 && chain) {
    c *= chain.factor;
    d === 'Working' &&
      (d = chain.missing
        ? `Half rate \xB7 no ${chain.missing} supplier within ${SUPPLY_RANGE} tiles`
        : chain.milled
          ? 'Working \xB7 flour from the mill +30%'
          : `Working \xB7 supplied with ${CHAINS[t.kind].goods}`);
  }
  if (c > 0 && goods > 1) {
    c *= goods;
    d === 'Working' &&
      (d = `Working \xB7 ${Object.entries(GOODS)
        .filter(([n, v]) => islandGoods(e)[n] && v.kinds.includes(t.kind))
        .map(([, v]) => v.text)
        .join(' and ')} +${Math.round((goods - 1) * 100)}%`);
  }
  let m = moraleMultiplier(e),
    h = e.story.mode === 'campaign' && e.weather === 'storm' ? (hasLandmark(e, 'lighthouse') ? 0.9 : 0.6) : 1;
  return {
    resource: u,
    rate: c * l * s * h * m,
    capacity: o.capacity,
    supply: chain ? chain.factor : 1,
    links: chain?.links ?? [],
    reason:
      m < 1
        ? `Low morale \xB7 production at ${Math.round(m * 100)}%`
        : l < 0.65
          ? 'Tainted ground is slowing production'
          : h < 1
            ? `Storm \u2014 production reduced by ${Math.round((1 - h) * 100)}%`
            : d === 'Working' && s > 1
              ? `Working \xB7 nearby road +${Math.round((s - 1) * 100)}%`
              : d,
  };
}
function collectGoods(e, t = !1) {
  let a = { gold: 0, food: Math.floor(e.orchardFood), timber: 0, stone: 0 };
  e.orchardFood -= a.food;
  for (let r of e.buildings) {
    let o = Math.floor(r.stored);
    ((a[buildingResource(r.kind)] += o), (r.stored -= o));
  }
  for (let r of Object.keys(a)) ((e.wallet[r] += a[r]), (e.story.collected[r] += a[r]));
  e.earned += a.gold;
  let n = Object.values(a).reduce((r, o) => r + o, 0);
  return (
    t ||
      announce(
        e,
        n
          ? `Collected ${Object.entries(a)
              .filter(([, r]) => r > 0)
              .map(([r, o]) => `${o} ${r}`)
              .join(', ')}. Trade goods in the Market for gold.`
          : 'Nothing ready yet. Let time pass while your settlement produces goods.',
      ),
    a
  );
}
var STORAGE_BASE = { food: 1500, timber: 600, stone: 500 };
function priceFactor(e, t) {
  if (t === 'gold') return 1;
  let a = STORAGE_BASE[t] * councilEffects(e).marketDepth,
    n = e.market?.[t] ?? 0;
  return a / (a + n);
}
function saleValue(e, t, a) {
  let n = Ga.find((s) => s.id === t);
  if (!n || t === 'gold' || a <= 0) return 0;
  let r = STORAGE_BASE[t] * councilEffects(e).marketDepth,
    o = e.market?.[t] ?? 0,
    l = (r / a) * Math.log((r + o + a) / (r + o));
  return Math.round(a * n.rate * tradeMultiplier(e) * l);
}
function tradeGoods(e, t, a) {
  if (!Ga.find((o) => o.id === t) || t === 'gold' || !Number.isInteger(a) || a <= 0 || a > e.wallet[t])
    return { ok: !1, message: 'Choose an amount you have in storage.' };
  let r = saleValue(e, t, a);
  return r < 1
    ? (announce(e, 'Trade at least two food to earn one gold. Your goods are unchanged.'),
      { ok: !1, message: e.message })
    : ((e.story.tradeGold += r),
      (e.wallet[t] -= a),
      (e.wallet.gold += r),
      (e.earned += r),
      (e.market = { food: 0, timber: 0, stone: 0, ...e.market }),
      (e.market[t] += a),
      announce(
        e,
        `Traded ${a} ${t} for ${r} gold.${priceFactor(e, t) < 0.8 ? ' Buyers are well supplied: prices recover over the next day or two.' : ''}`,
      ),
      { ok: !0, message: e.message });
}
function worldStats(e) {
  let t = landCells(e),
    a = Math.max(1, t.length),
    n = 0,
    r = 0,
    o = 0;
  for (let c of t) ((n += c.moisture), (r += c.soil), (c.toxicity > 0.15 || c.radiation > 0.15) && o++);
  let l = e.buildings.reduce((c, u) => c + Math.floor(u.stored), 0) + Math.floor(e.orchardFood),
    s = e.buildings.reduce((c, u) => c + (u.kind === 'cottage' ? houseResidents(e, u) : 0), 0);
  return {
    day: Math.floor(e.time + 1e-8) + 1,
    hour: Math.floor((e.time % 1) * 24),
    plants: e.plants.filter((c) => c.health > 0).length,
    mature: e.plants.filter((c) => c.health > 0 && c.growth > 0.7).length,
    animals: e.animals.length,
    moisture: Math.round((n / a) * 100),
    fertility: Math.round((r / a) * 100),
    pollution: Math.ceil((o / a) * 100),
    weather: e.weather,
    placements: e.placements,
    wallet: { ...e.wallet },
    buildings: e.buildings.filter(isBuilt).length,
    constructing: e.buildings.filter((c) => !isBuilt(c)).length,
    capacity: s,
    population: e.story.mode === 'campaign' ? Math.min(s, e.story.population) : s,
    ready: l,
    charter: charterRate(e),
    income: e.buildings.reduce((c, u) => {
      if (buildingResource(u.kind) !== 'gold') return c;
      let d = production(e, u);
      return c + d.rate;
    }, charterRate(e)),
    earned: Math.floor(e.earned),
    spent: e.spent,
    demoGold: e.demoGold,
  };
}

export { collectGoods, priceFactor, production, saleValue, servicesNear, tradeGoods, worldStats };

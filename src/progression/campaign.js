// Recovered from the Tideweald v16.11 build. Module: progression/campaign
import { production, servicesNear } from '../economy/production.js';
import { WORKSHOPS } from '../economy/workshops.js';
import { defenseStrength } from '../military/frontier.js';
import { COMMISSIONS, STORY_CHAPTERS } from './chapters.js';
import { choiceOf, councilEffects, decisionForChapter } from './council.js';
import { isBridge } from '../settlement/bridge-catalog.js';
import { bridgeAt, bridgePlan, bridgeTiles } from '../settlement/bridges.js';
import { landCells } from '../world/actors.js';
import {
  BUILDING_SIZES,
  Br,
  CATALOG,
  MAX_POPULATION,
  U6,
  fs,
  isBuildingItem,
  isBuilt,
  jp,
  supplyBlocked,
  wn,
} from '../world/catalog.js';
import { canStand, habitatOk, isWater, productionContext } from '../world/ecosystem.js';
import { seasonAt, seasonalWeather } from '../world/seasons.js';
import { Qd, is } from '../world/spatial-index.js';
import { df } from '../world/wildlife.js';
import { announce, cellAt, nearby } from '../world/world.js';
import { isExplored } from '../world/fog.js';
import { knows } from './lore.js';

var CHAPTERS = [
    {
      title: 'A foothold',
      period: 'The island crossing',
      voice: 'Mara \xB7 expedition leader',
      text: 'Around 985, twenty-five ships follow Erik the Red west from Iceland. A gale scatters the fleet, and ours is driven south to a wooded island no saga names. Twelve families wait with Skipper Elin while we find a safe harbor. Grow the first harvest and light the way home.',
      hint: 'Build a farm, add a pond or river beside it, then collect 30 food. A farm waters its own patch at first; fresh water keeps it productive.',
      reward: 80,
    },
    {
      title: 'Put down roots',
      period: 'The first woodland',
      voice: 'Ivo \xB7 island forester',
      text: 'We carried a carved roof beam from our old hall across the sea. I want our children to build their own. Tend this woodland, grow new trees, and cut only what the settlement can replace.',
      hint: 'Prepare rich soil, plant three trees, and water them. Most trees need about two wet days to mature. Collect 20 timber from a nearby sawpit.',
      reward: 120,
    },
    {
      title: 'A place to belong',
      period: 'Before the fleet returns',
      voice: 'Mara \xB7 expedition leader',
      text: 'Elin\u2019s sail is on the horizon. We can still return east\u2014or make a promise here. Raise homes around a market, where strangers can become neighbors and every family has a place.',
      hint: 'Build three longhouses and a market. A quarry near boulders or a mountain will provide the 15 stone we need.',
      reward: 160,
    },
    {
      title: 'The lost fleet returns',
      period: 'Fleet \xB7 by Day 30',
      voice: 'Skipper Elin \xB7 the Wayfarer',
      text: 'The fleet survived, but the northern gales are coming. On Day 30 I will attempt the passage. Let the waiting families see smoke from their own hearths\u2014and food enough to believe they can stay.',
      hint: 'Stock the harbor with 60 food, 20 timber, and 15 stone. Keep three safe longhouses and three healthy mature trees. The fleet sails as soon as everything is ready, from Day 12, and no later than Day 30.',
      reward: 350,
    },
    ...STORY_CHAPTERS,
  ],
  FLEET_DELIVERY = { gold: 0, food: 60, timber: 20, stone: 15 };
function safeCottages(e) {
  return e.buildings.filter(
    (t) =>
      t.kind === 'cottage' &&
      production(e, t).rate > 0 &&
      (() => {
        let a = cellAt(e, t.x, t.y);
        return a.toxicity + a.radiation < 0.3;
      })(),
  ).length;
}
function matureTrees(e) {
  return e.plants.filter((t) => t.growth >= 0.7 && t.health > 0.5 && CATALOG[t.kind]?.tree).length;
}
function steadyHarvest(e, t) {
  let a = e.story.dawn ?? [];
  if (a.length < 4) return 0;
  let n = 1 / 0;
  for (let r = 1; r < a.length; r++) n = Math.min(n, a[r][t] - a[r - 1][t]);
  return Math.max(0, Math.floor(n));
}
function servedHomes(e) {
  let t = 0;
  for (let a of e.buildings) a.kind === 'cottage' && isBuilt(a) && servicesNear(e, a) >= 3 && t++;
  return t;
}
function workshopKinds(e) {
  let t = new Set();
  for (let a of e.buildings)
    isBuilt(a) &&
      (WORKSHOPS[a.kind]?.rate ?? 0) > 0 &&
      !t.has(a.kind) &&
      production(e, a).rate > 0 &&
      t.add(a.kind);
  return t.size;
}
function campaignObjectives(e, t = e.story.chapter) {
  let a = (u) => e.buildings.filter((d) => d.kind === u && isBuilt(d)).length,
    n = (u, d, m) => ({ label: u, value: Math.min(m, Math.floor(d)), target: m, done: d >= m });
  if (t === 0)
    return [
      n('Build a barley farm', a('farm'), 1),
      n('Freshwater tiles', e.cells.filter((u) => u.land && u.pond).length, 6),
      n('Collect food', e.story.collected.food, 30),
    ];
  if (t === 1)
    return [
      n('Healthy mature trees', matureTrees(e), 3),
      n('Build a sawpit', a('sawmill'), 1),
      n('Collect timber', e.story.collected.timber, 20),
    ];
  if (t === 2)
    return [
      n('Build longhouses', a('cottage'), 3),
      n('Build a market', a('market'), 1),
      n('Collect stone', e.story.collected.stone, 15),
    ];
  if (t === 3)
    return [
      n('Food set aside', e.story.reserves.food, 60),
      n('Timber set aside', e.story.reserves.timber, 20),
      n('Stone set aside', e.story.reserves.stone, 15),
      n('Safe longhouses', safeCottages(e), 3),
      n('Healthy mature trees', matureTrees(e), 3),
    ];
  let r = currentChapter(e),
    o = e.plants.filter((u) => u.health > 0.5 && u.growth >= 0.7),
    l = e.story.incident,
    s = {
      morale: e.frontier.morale,
      foodReserve: e.wallet.food,
      timberReserve: e.wallet.timber,
      stoneReserve: e.wallet.stone,
      goldReserve: e.wallet.gold,
      localTrade: e.story.tradeGold - (e.story.chapterTrade ?? 0),
      newFood: e.story.collected.food - (e.story.chapterCollected?.food ?? 0),
      newTimber: e.story.collected.timber - (e.story.chapterCollected?.timber ?? 0),
      newStone: e.story.collected.stone - (e.story.chapterCollected?.stone ?? 0),
      events: e.frontier.resolved - (e.story.chapterEvents ?? 0),
      raids: e.frontier.raidsRepelled - (e.story.chapterRaids ?? 0),
      districts: new Set(
        e.buildings.filter(isBuilt).map((u) => `${Math.floor(u.x / 24)},${Math.floor(u.y / 24)}`),
      ).size,
      days: Math.floor(e.time - e.story.levelStarted + 1e-8),
      roads: landCells(e).filter((u) => u.road).length,
      paved: landCells(e).filter((u) => u.road === 'paved').length,
      trees: matureTrees(e),
      species: new Set(o.filter((u) => CATALOG[u.kind]?.tree).map((u) => u.kind)).size,
      orchards: o.filter((u) => is.has(u.kind)).length,
      flowers: o.filter((u) => Qd.has(u.kind)).length,
      animals: e.animals.filter((u) => u.health > 0.5).length,
      animalSpecies: new Set(e.animals.filter((u) => u.health > 0.5).map((u) => u.kind)).size,
      pollinators: e.animals.filter((u) => ['bee', 'butterfly'].includes(u.kind) && u.health > 0.5).length,
      freshwater: landCells(e).filter((u) => u.pond && u.toxicity < 0.2).length,
      housing: safeCottages(e) * 4,
      trade: e.story.tradeGold,
      steadyFood: steadyHarvest(e, 'food'),
      calmDays: Math.max(
        0,
        Math.floor(e.time + 1e-8) +
          1 -
          Math.max(Math.floor(e.story.levelStarted + 1e-8) + 1, e.frontier.lastShortageDay ?? 0),
      ),
      servedHomes: servedHomes(e),
      workshopKinds: workshopKinds(e),
      decision: (() => {
        let u = decisionForChapter(t);
        return u && choiceOf(e, u.id) ? 1 : 0;
      })(),
      defense: defenseStrength(e),
      guards: e.frontier.garrison,
      clean: l
        ? nearby(e, l.x, l.y, 2.8).filter((u) => u.toxicity < 0.15 && u.radiation < 0.15 && u.oil < 0.05)
            .length
        : 0,
    };
  for (let u of e.buildings) isBuilt(u) && (s[u.kind] = (s[u.kind] ?? 0) + 1);
  let c = () => {
    let u = [...new Set(e.animals.filter((d) => d.health > 0.5).map((d) => d.kind))].map(
      (d) => CATALOG[d]?.name.toLowerCase() ?? d,
    );
    return u.length ? ` (now: ${u.join(', ')})` : '';
  };
  return [
    ...(r.goals ?? []).map((u) =>
      n(
        u.label + (u.metric === 'animalSpecies' && (s[u.metric] ?? 0) < u.target ? c() : ''),
        s[u.metric] ?? 0,
        u.target,
      ),
    ),
    ...Object.entries(r.shipment ?? {}).map(([u, d]) =>
      n(`${u[0].toUpperCase() + u.slice(1)} delivered`, e.story.reserves[u], d),
    ),
  ];
}
function storyEvent(e, t, a) {
  (e.story.events.length >= 60 && e.story.events.shift(),
    e.story.events.push({ day: Math.floor(e.time + 1e-8) + 1, title: t, text: a }),
    announce(e, `${t}. ${a}`));
}
function beginCampaign(e) {
  e.story.started ||
    ((e.story.started = !0),
    storyEvent(
      e,
      'Landfall',
      'The Wayfarer sails for your harbor as soon as it is ready, by Day 30 at the latest. Give twelve settlers a home before the northern winter.',
    ),
    updateCampaign(e));
}
function currentChapter(e) {
  if (e.story.chapter < CHAPTERS.length) return CHAPTERS[e.story.chapter];
  let t = e.story.chapter - CHAPTERS.length,
    a = COMMISSIONS[t % COMMISSIONS.length],
    n = 1 + Math.min(5, Math.floor(t / COMMISSIONS.length)) * 0.2;
  return {
    ...a,
    title: `Commission ${t + 1} \xB7 ${a.title}`,
    shipment: Object.fromEntries(Object.entries(a.shipment ?? {}).map(([r, o]) => [r, Math.round(o * n)])),
    reward: Math.round(a.reward * n),
  };
}
function chapterDelivery(e) {
  return e.story.chapter === 3 ? FLEET_DELIVERY : (currentChapter(e).shipment ?? {});
}
function enterChapter(e) {
  let t = e.story;
  ((t.levelStarted = e.time),
    (t.chapterTrade = t.tradeGold),
    (t.chapterCollected = { ...t.collected }),
    (t.chapterEvents = e.frontier.resolved),
    (t.chapterRaids = e.frontier.raidsRepelled),
    (t.reserves = { gold: 0, food: 0, timber: 0, stone: 0 }),
    (t.incident = void 0));
  let a = {
    34: { title: 'The Red Sail fleet', factor: 1.1 },
    43: { title: 'Red Sails at every shore', factor: 1.1 },
    47: { title: 'The last Red Sail assault', factor: 1.15 },
  }[t.chapter];
  if (
    (a &&
      e.frontier.initialized &&
      ((e.frontier.scripted = a),
      e.frontier.pending ||
        (e.frontier.nextEventDay = Math.min(e.frontier.nextEventDay, Math.floor(e.time + 1e-8) + 1 + 4)),
      storyEvent(
        e,
        `${a.title} gathers`,
        'Scouts report the rivals\u2019 full fleet. It will strike as the next threat. Muster the watch and form a shield line.',
      )),
    t.chapter === 14)
  ) {
    let n = e.cells.filter(
        (o) =>
          o.land &&
          !o.pond &&
          !o.rock &&
          o.x > 168 &&
          o.x < 213 &&
          o.y > 144 &&
          o.y < 176 &&
          !e.buildings.some((l) => Math.hypot(l.x - o.x, l.y - o.y) < 5) &&
          !e.plants.some((l) => Math.hypot(l.x - o.x, l.y - o.y) < 4),
      ),
      r = n[Math.floor(n.length / 3)] ?? cellAt(e, 177.5, 156.5);
    t.incident = { x: r.x + 0.5, y: r.y + 0.5 };
    for (let o of nearby(e, t.incident.x, t.incident.y, 2.8)) ((o.oil = 0.8), (o.toxicity = 0.65));
    (e.revision++,
      storyEvent(
        e,
        'A barrel washed ashore',
        'A cask of whale oil has leaked on an empty patch. Locate the spill from your journal and restore the soil.',
      ));
  }
}
function completeChapter(e) {
  let t = e.story;
  if (t.mode !== 'campaign' || !t.started || t.chapter === 3 || !campaignObjectives(e).every((n) => n.done))
    return !1;
  let a = currentChapter(e);
  return (
    (e.wallet.gold += a.reward * (knows(e, 'runes') ? 1.1 : 1)),
    (e.earned += a.reward * (knows(e, 'runes') ? 1.1 : 1)),
    t.completed.push(t.chapter),
    (t.population = Math.max(t.population, a.settlers ?? 0)),
    t.chapter++,
    enterChapter(e),
    storyEvent(
      e,
      `${a.title} completed`,
      `+${a.reward} gold. ${t.chapter === CHAPTERS.length ? 'The Haven charter is complete. New commissions are now available.' : `Next: ${currentChapter(e).title}.`}`,
    ),
    t.chapter === CHAPTERS.length && !t.finale && covenantFinale(e),
    !0
  );
}
// Milestone 5: the campaign ends with the covenant. The record is kept in the save, the journal tells the
// epilogue, and the player chooses to keep taking commissions or to carry the island into free build.
var FINALE_TEXT =
  'Fourteen ships reached Greenland; ours reached Haven. The families who waded ashore with nothing now keep a hall, a hof and a harbor of their own, and the Red Sails have learned to row past. Tonight they swear the covenant again at the Thing stone: to keep the stores full, the watch awake and the island green, for their children\u2019s children.';
function covenantFinale(e) {
  let t = e.story;
  ((t.finale = {
    day: Math.floor(e.time + 1e-8) + 1,
    raids: e.frontier.raidsRepelled,
    winters: e.frontier.winters,
    population: t.population,
    buildings: e.buildings.filter(isBuilt).length,
    species: new Set(e.animals.filter((a) => a.health > 0.5).map((a) => a.kind)).size,
    decisions: (t.decisions ?? []).length,
  }),
    storyEvent(e, 'The covenant holds', FINALE_TEXT));
}
/** After the finale: the same island in free build, with threats and upkeep on until the player changes them. */
function openFreeBuild(e) {
  let t = e.story;
  return t.mode !== 'campaign' || !t.finale
    ? !1
    : (continueFreebuild(e),
      (t.rules = { threats: !0, upkeep: !0 }),
      e.revision++,
      storyEvent(
        e,
        'Free build',
        'Haven is yours to shape. Raids, weather and daily upkeep continue; change them in Settings under Free build rules.',
      ),
      !0);
}
function stockHarbor(e) {
  if (e.story.mode !== 'campaign') return 0;
  let t = chapterDelivery(e),
    a = 0;
  for (let n of ['gold', 'food', 'timber', 'stone']) {
    let r = Math.max(0, Math.min(Math.floor(e.wallet[n]), (t[n] ?? 0) - e.story.reserves[n]));
    ((e.wallet[n] -= r), (e.story.reserves[n] += r), (a += r));
  }
  return (
    announce(
      e,
      a
        ? 'Supplies delivered to this chapter. Delivered goods are protected and cannot be sold.'
        : 'Collect more supplies first. Only the remaining delivery is taken.',
    ),
    a
  );
}
var hasLandmark = (e, t) => productionContext(e).landmarks.has(t),
  constructionRate = (e) => (hasLandmark(e, 'guildhall') ? 1.25 : 1) * councilEffects(e).construction,
  charterRate = (e) =>
    Math.max(
      0,
      (e.story.settled ? 8 : 6) + (hasLandmark(e, 'observatory') ? 4 : 0) + councilEffects(e).charter,
    ),
  tradeMultiplier = (e) => (hasLandmark(e, 'harbor') ? 1.25 : 1) * councilEffects(e).salePrice,
  buildingResource = (e) =>
    WORKSHOPS[e]?.resource ??
    (['farm', 'fishery', 'granary', 'windmill', 'glasshouse'].includes(e)
      ? 'food'
      : ['sawmill', 'watermill'].includes(e)
        ? 'timber'
        : e === 'quarry'
          ? 'stone'
          : 'gold');
function continueFreebuild(e) {
  ((e.story.mode = 'sandbox'),
    (e.story.started = !0),
    (e.frontier.pending = void 0),
    (e.frontier.battle = void 0),
    (e.autoWeather = !1),
    (e.weather = 'sun'),
    announce(e, 'Free build. Your island is preserved; time and weather are yours to control.'));
}
var COMMISSION_START = 12;
function updateCampaign(e) {
  let t = e.story;
  if (t.mode !== 'campaign' || !t.started) return;
  let a = Math.floor(e.time + 1e-8) + 1,
    n = seasonAt(e.time),
    r = `${n.year}-${n.name}`;
  ((e.autoWeather = !1),
    t.ledgerDay !== a &&
      ((t.ledgerDay = a),
      (t.dawn = [
        ...(t.dawn ?? []),
        { food: t.collected.food, timber: t.collected.timber, stone: t.collected.stone },
      ].slice(-4))),
    (e.weather = seasonalWeather(e.time)),
    (t.chapter === 17 || t.chapter === 40) &&
      e.time - t.levelStarted < (t.chapter === 40 ? 6 : 4) &&
      (e.weather = 'drought'),
    (t.chapter === 21 || t.chapter === 41) &&
      e.time - t.levelStarted < (t.chapter === 41 ? 5 : 4) &&
      (e.weather = 'storm'),
    r !== t.lastSeason &&
      ((t.lastSeason = r),
      storyEvent(
        e,
        `${n.name} \xB7 Year ${n.year}`,
        [
          'Rain wakes the island. Fields and trees begin growing again.',
          'Warm days bring dry spells. Rivers keep the fields alive.',
          'Leaves turn and orchards yield 30% more. Store food and timber before winter.',
          'Snow settles on the island. Fields and orchards produce less; settlers burn timber for warmth.',
        ][n.index] +
          // v17: the first words of the game point at the river.
          (n.index === 0 && n.year === 1
            ? ' The river\u2019s low bank is the richest ground here, and on Day 5 the thaw will flood it for three days.'
            : ''),
      )));
  let o =
    !t.settled && t.chapter === 3 && a >= COMMISSION_START && campaignObjectives(e).every((l) => l.done);
  if (!t.settled && (a >= t.convoyDay || o))
    if (o) {
      let l = a < t.convoyDay;
      ((t.settled = !0),
        t.completed.push(3),
        (t.chapter = 4),
        (t.population = 12),
        enterChapter(e),
        (e.wallet.gold += 350),
        (e.earned += 350),
        storyEvent(
          e,
          l ? 'The Wayfarer arrives early' : 'The Wayfarer has arrived',
          `${l ? 'Elin saw your harbor fires and sailed at once. ' : ''}Twelve settlers have a new home. +350 gold; charter income is now 8 gold per day. Keep building.`,
        ));
    } else
      (t.missed++,
        (t.convoyDay = a + 3),
        storyEvent(
          e,
          'The fleet must wait',
          `The village is not ready. The next passage is Day ${t.convoyDay}. Your island and reserved supplies are safe.`,
        ));
}
function placementPreview(e, t, a, n, r = 0) {
  let o = CATALOG[t],
    l = cellAt(e, a, n),
    s = o?.cost ?? 0,
    c = (m) => ({ ok: !1, cost: s, reason: m });
  if (!o || !l || !Number.isFinite(a) || !Number.isFinite(n)) return c('Choose a tile inside the map');
  if (!isExplored(e, a, n))
    return c('Uncharted land. Build nearer the settlement, lay roads outward, or raise a watchtower to see further.');
  if (isBridge(t)) return bridgePlan(e, t, a, n, r);
  if (t === 'remove_bridge')
    return {
      ok: !!bridgeAt(e, a, n),
      cost: 0,
      reason: bridgeAt(e, a, n) ? 'Remove this whole crossing' : 'Tap an existing bridge',
    };
  if (bridgeAt(e, a, n) && (isBuildingItem(o) || o.category === 'roads'))
    return c('Keep the bridge approach clear. Use Remove bridge to dismantle it.');
  if (o.category === 'roads') {
    if (t === 'remove_road') {
      if (!l.road) return c('There is no road on this tile');
    } else {
      if (!l.land || l.pond || l.rock || l.elevation > 12) return c('Roads need dry, flat ground');
      if (
        e.buildings.some(
          (m) =>
            Math.hypot(m.x - (l.x + 0.5), m.y - (l.y + 0.5)) < (BUILDING_SIZES[m.kind]?.radius ?? 1.2) * 0.72,
        )
      )
        return c('Route the road around this building');
      if (e.plants.some((m) => m.health > 0 && Math.hypot(m.x - l.x - 0.5, m.y - l.y - 0.5) < 0.55))
        return c('Clear this plant before laying a road');
      if (l.road && ((s = Math.max(0, o.cost - (U6[l.road] ?? 0))), s === 0))
        return c('Already has this road or better \xB7 no gold spent');
    }
    return e.wallet.gold < s
      ? c(`Need ${s} gold`)
      : {
          ok: !0,
          cost: s,
          reason:
            t === 'remove_road'
              ? 'Remove this road tile'
              : `Nearby production +${Math.round(jp[t] * 100)}% \xB7 drag to paint`,
        };
  }
  if (e.wallet.gold < s) return c(`Need ${s} gold`);
  let u = supplyBlocked(e, o);
  if (u) return c(u);
  if (o.category === 'animals')
    return e.animals.length >= wn
      ? c(`The island has room for ${wn} animals`)
      : e.animals.filter((m) => m.kind === t).length >= Br
        ? c(`At most ${Br} ${o.name.toLowerCase()} \xB7 try another species`)
        : canStand(t, l)
          ? habitatOk(e, t, a, n)
            ? {
                ok: !0,
                cost: s,
                reason: `Good habitat here${(fs[t] ?? 1) > 1 ? ` \xB7 a family of ${fs[t]}` : ''}`,
              }
            : c(df[t] ?? 'This spot cannot support this animal')
          : c(t === 'fish' ? df.fish : 'Needs dry land beside the water');
  if (!isBuildingItem(o)) return { ok: !0, cost: s, reason: o.description };
  if (!l.land || l.pond || l.rock || l.elevation > 12) return c('Needs flat, dry ground');
  if (e.buildings.length >= MAX_POPULATION) return c('Settlement limit: 960 buildings');
  if (
    (e.bridges ?? []).some((m) =>
      bridgeTiles(m).some((h) => Math.hypot(h.x + 0.5 - a, h.y + 0.5 - n) < BUILDING_SIZES[t].radius + 0.45),
    )
  )
    return c('Leave room for the bridge and its approaches');
  if (
    e.buildings.some(
      (m) => Math.hypot(m.x - a, m.y - n) < BUILDING_SIZES[m.kind].radius + BUILDING_SIZES[t].radius,
    )
  )
    return c('Leave room between buildings');
  if (e.plants.some((m) => m.health > 0 && Math.hypot(m.x - a, m.y - n) < 1.1))
    return c('Clear these plants first');
  if (
    ['fishery', 'harbor', 'watermill', 'shipyard', 'pier'].includes(t) &&
    !nearby(e, a, n, 4, !1).some((m) => isWater(m) && (t !== 'watermill' || (m.land && m.pond)))
  )
    return c(t === 'watermill' ? 'Needs fresh water within four tiles' : 'Needs water within four tiles');
  let d = production(e, { id: 0, kind: t, x: a, y: n, progress: 0, buildProgress: 1, stored: 0 }, !0);
  return {
    ok: !0,
    cost: s,
    rate: d.rate,
    resource: d.resource,
    reason: d.reason,
    plain: d.plain,
    riverNote: d.riverNote,
  };
}
function cancelConstruction(e, t) {
  let a = e.buildings.find((r) => r.id === t);
  if (!a || isBuilt(a)) return 0;
  let n = Math.floor((CATALOG[a.kind]?.cost ?? 0) * 0.5);
  ((e.buildings = e.buildings.filter((r) => r.id !== t)), (e.wallet.gold += n), (e.spent -= n));
  for (let [r, o] of Object.entries(CATALOG[a.kind]?.materials ?? {})) e.wallet[r] += Math.floor(o * 0.5);
  return (
    e.revision++,
    announce(e, `Construction cancelled. ${n} gold and 50% of each material recovered.`),
    n
  );
}

export { CHAPTERS, enterChapter, beginCampaign, buildingResource, campaignObjectives, cancelConstruction, chapterDelivery, charterRate, completeChapter, constructionRate, continueFreebuild, currentChapter, hasLandmark, placementPreview, stockHarbor, tradeMultiplier, updateCampaign,
  FINALE_TEXT,
  covenantFinale,
  openFreeBuild,
};

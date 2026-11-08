// Recovered from the Tideweald v16.11 build. Module: military/frontier
import { WORKSHOPS } from '../economy/workshops.js';
import { councilEffects } from '../progression/council.js';
import { seasonAt } from '../world/seasons.js';

var DEFENSE_ITEMS = [
    {
      id: 'watchtower',
      name: 'Watchtower',
      category: 'buildings',
      icon: 'shield',
      atlas: 'norse',
      sprite: 0,
      color: '#238ba3',
      cost: 130,
      materials: { timber: 25, stone: 15 },
      unlock: 4,
      description:
        'Adds 6 defense. A completed tower gives four days of warning before the next threat, instead of three.',
    },
    {
      id: 'palisade',
      name: 'Palisade gate',
      category: 'buildings',
      icon: 'shield',
      atlas: 'norse',
      sprite: 1,
      color: '#ac8045',
      cost: 90,
      materials: { timber: 35, stone: 5 },
      unlock: 4,
      description:
        'Adds 4 settlement defense. A shared defensive perimeter protects the whole island; road connections are not required.',
    },
    {
      id: 'guardhall',
      name: 'Guard hall',
      category: 'buildings',
      icon: 'shield',
      atlas: 'norse',
      sprite: 2,
      color: '#207d94',
      cost: 200,
      materials: { food: 20, timber: 40, stone: 25 },
      unlock: 4,
      description:
        'Provides room for six guards. Train pairs in Army. Each guard adds 3 defense and needs food and gold daily.',
    },
  ],
  empty = () => ({ gold: 0, food: 0, timber: 0, stone: 0 }),
  createFrontier = () => ({
    initialized: !1,
    lastDay: 0,
    nextEventDay: 0,
    eventNumber: 0,
    garrison: 0,
    training: 0,
    trainingReady: 0,
    lastReliefDay: 0,
    morale: 100,
    raidsRepelled: 0,
    resolved: 0,
    winters: 0,
    spoiledFood: 0,
    losses: empty(),
    upkeep: empty(),
  }),
  completed = (e, t) => e.buildings.filter((a) => a.kind === t && a.buildProgress >= 1 - 1e-8).length,
  frontierActive = (e) => e.story.mode === 'campaign' && e.story.started && e.story.settled,
  guardCapacity = (e) => Math.min(18, completed(e, 'guardhall') * 6),
  defenseStrength = (e) =>
    Math.round(
      (completed(e, 'watchtower') * 6 + completed(e, 'palisade') * 4 + completed(e, 'beacon') * 8) *
        councilEffects(e).structureDefense,
    ) +
    e.frontier.garrison * 3,
  moraleMultiplier = (e) =>
    frontierActive(e) ? Math.max(0.65, councilEffects(e).moraleFloor / 100, e.frontier.morale / 100) : 1,
  foodCapacity = (e) => 1e3 + completed(e, 'granary') * 1500 + completed(e, 'storehouse') * 800,
  foodSpoilage = (e) =>
    frontierActive(e)
      ? Math.floor(Math.max(0, e.wallet.food - foodCapacity(e)) * 0.2 * councilEffects(e).spoilage)
      : 0;
function dailyNeeds(e) {
  if (!frontierActive(e)) return empty();
  let t = e.story.population,
    a = e.frontier.garrison,
    n = councilEffects(e),
    r = e.buildings.filter((l) => l.buildProgress >= 1 - 1e-8),
    o = n.workshopDues ? r.filter((l) => (WORKSHOPS[l.kind]?.rate ?? 0) > 0).length * n.workshopDues : 0;
  return {
    gold: a + Math.floor(r.length / 2) + o,
    food: Math.ceil((t * 0.45 + a * 0.75) * n.foodUpkeep) + foodSpoilage(e),
    timber: (seasonAt(e.time).index === 3 ? Math.ceil((t / 8) * n.winterFuel) : 0) + Math.floor(r.length / 4),
    stone: 0,
  };
}
function log(e, t, a) {
  let n = Math.floor(e.time + 1e-8) + 1;
  (e.story.events.push({ day: n, title: t, text: a }),
    e.story.events.length > 60 && e.story.events.shift(),
    (e.message = t + '. ' + a),
    e.noticeId++);
}
var THREAT_ADVICE = {
    raid: 'Build watchtowers and palisades; train guards in a completed guard hall. Matching the enemy strength prevents the raid losses; below 70% they burn a building.',
    flood: 'Granaries keep stores dry: each prevents 30% of flood losses, up to 80%.',
    wildfire:
      'At least 25 clean freshwater tiles reduce losses by 65%. Keep rivers and ponds across the island.',
    gale: 'A lighthouse prevents 65% of gale losses. Each granary adds 15%, up to 85% total protection.',
    blizzard:
      'Keep at least three days of firewood in your stores for 65% protection. A walled garden adds 20%.',
  },
  RAID_CURVE = [
    [0, 10],
    [11, 20],
    [19, 32],
    [23, 40],
    [32, 70],
    [34, 90],
    [35, 100],
    [43, 140],
    [47, 160],
  ];
function raidStrength(e, t) {
  let a = e.story.mode === 'campaign' ? Math.min(47, e.story.chapter) : Math.min(47, Math.floor(e.time / 20)),
    n = 0;
  for (; n < RAID_CURVE.length - 2 && RAID_CURVE[n + 1][0] <= a; ) n++;
  let [r, o] = RAID_CURVE[n],
    [l, s] = RAID_CURVE[n + 1],
    c = o + (s - o) * Math.min(1, Math.max(0, (a - r) / (l - r)));
  return Math.round((Math.max(10 + Math.min(t, 4) * 2, c * 0.9) + (t % 3)) * councilEffects(e).raidStrength);
}
var FORMATION_FACTOR = { line: 1.15, patrol: 1.05, column: 1 },
  effectiveDefense = (e) => defenseStrength(e) * FORMATION_FACTOR[e.frontier.formation ?? 'patrol'];
function threatProtection(e, t) {
  return t.kind === 'raid'
    ? Math.min(1, effectiveDefense(e) / t.strength)
    : t.kind === 'flood'
      ? Math.min(0.8, completed(e, 'granary') * 0.3)
      : t.kind === 'gale'
        ? Math.min(0.85, (completed(e, 'lighthouse') ? 0.65 : 0) + completed(e, 'granary') * 0.15)
        : t.kind === 'wildfire'
          ? e.cells.filter((a) => a.land && a.pond && a.toxicity < 0.2).length >= 25
            ? 0.65
            : 0.1
          : Math.min(
              0.85,
              (e.wallet.timber >= Math.ceil(e.story.population / 8) * 3 ? 0.65 : 0) +
                (completed(e, 'glasshouse') ? 0.2 : 0),
            );
}
function projectedLoss(e, t) {
  let a = (1 - threatProtection(e, t)) * councilEffects(e).threatLoss,
    n = t.kind === 'raid';
  return {
    gold: Math.ceil(Math.min(e.wallet.gold * (n ? 0.16 : 0.07), n ? 80 + t.strength * 3 : 50) * a),
    food: Math.ceil(Math.min(e.wallet.food * (n ? 0.2 : 0.26), 100 + t.strength) * a),
    timber: Math.ceil(Math.min(e.wallet.timber * (n ? 0.18 : 0.2), 75) * a),
    stone: Math.ceil(Math.min(e.wallet.stone * (n ? 0.08 : 0.03), 30) * a),
  };
}
var trainingPairs = (e) => {
    let t = e.frontier;
    return t.training
      ? t.trainingQueue?.length
        ? t.trainingQueue
        : Array.from({ length: Math.ceil(t.training / 2) }, () => t.trainingReady)
      : [];
  },
  trainingSlots = (e) => Math.min(completed(e, 'guardhall'), Math.ceil(guardCapacity(e) / 2));
function trainingBlock(e) {
  let t = e.frontier,
    a = guardCapacity(e),
    n = trainingPairs(e).length;
  return e.story.started
    ? a === 0
      ? 'Complete a Guard hall first (Chapter 5 unlock).'
      : t.garrison + t.training + 2 > a
        ? 'Every bed is taken. Add another Guard hall for six more, up to 18 soldiers.'
        : n >= trainingSlots(e)
          ? n === 1
            ? 'This Guard hall is already training a pair. Each hall trains two at a time.'
            : `All ${n} Guard halls are training. Each hall trains two at a time.`
          : e.wallet.gold < 80 || e.wallet.food < 12 || e.wallet.timber < 10
            ? 'Training two guards costs 80 gold, 12 food and 10 timber.'
            : ''
    : 'Begin the expedition first.';
}
function trainGuards(e) {
  let t = e.frontier,
    a = trainingBlock(e);
  if (a) return (log(e, 'Training unavailable', a), !1);
  ((e.wallet.gold -= 80), (e.wallet.food -= 12), (e.wallet.timber -= 10), (e.spent += 80));
  let n = [...trainingPairs(e), e.time + 1];
  return (
    (t.trainingQueue = n),
    (t.training = n.length * 2),
    (t.trainingReady = Math.min(...n)),
    e.revision++,
    log(
      e,
      'The watch begins',
      n.length > 1
        ? `Two more volunteers begin training. ${n.length} pairs are in training across your Guard halls.`
        : 'Two volunteers will finish training in one day.',
    ),
    !0
  );
}
function dismissGuards(e) {
  let t = e.frontier;
  return t.garrison
    ? ((t.garrison = Math.max(0, t.garrison - 2)),
      e.revision++,
      log(e, 'Home from the watch', 'Up to two guards return to their trades. Their daily upkeep ends.'),
      !0)
    : !1;
}
function reliefAvailable(e) {
  return (
    frontierActive(e) &&
    e.wallet.gold < 80 &&
    e.wallet.food < 25 &&
    Math.floor(e.time + 1e-8) + 1 >= e.frontier.lastReliefDay + 12
  );
}
function requestRelief(e) {
  if (!reliefAvailable(e)) return !1;
  let t = { gold: 200, food: 60, timber: 25, stone: 10 };
  for (let a of Object.keys(t)) e.wallet[a] += t[a];
  return (
    (e.frontier.lastReliefDay = Math.floor(e.time + 1e-8) + 1),
    e.revision++,
    log(
      e,
      'The covenant answers',
      'A neighboring crew sends 200 gold, 60 food, 25 timber and 10 stone. Rebuild, then return the kindness.',
    ),
    !0
  );
}
function resolveThreat(e, t) {
  let a = e.frontier,
    n = projectedLoss(e, t);
  for (let u of Object.keys(n))
    ((n[u] = Math.min(e.wallet[u], n[u])), (e.wallet[u] -= n[u]), (a.losses[u] += n[u]));
  let r = t.kind === 'raid' && effectiveDefense(e) >= t.strength;
  (r && a.raidsRepelled++,
    t.kind === 'raid' && !r && effectiveDefense(e) < t.strength * 0.5 && a.garrison > 0 && a.garrison--);
  let o = '';
  if (t.kind === 'raid' && !r && effectiveDefense(e) < t.strength * 0.7) {
    let u =
      e.buildings
        .filter(
          (d) =>
            d.buildProgress >= 0.99999999 &&
            !['watchtower', 'palisade', 'guardhall', 'beacon'].includes(d.kind),
        )
        .sort((d, m) => d.id - m.id)[t.id % 7] ?? null;
    u && ((u.buildProgress = 0.8), (u.stored = 0), (o = u.kind), e.placements++);
  }
  if (t.kind === 'wildfire' && threatProtection(e, t) < 0.5) {
    let u = e.plants.find((d) => d.health > 0.5 && d.growth > 0.7);
    if (u) {
      for (let d of e.plants)
        Math.hypot(d.x - u.x, d.y - u.y) < 3 && (d.health = Math.max(0.15, d.health - 0.25));
      for (let d of e.cells) Math.hypot(d.x + 0.5 - u.x, d.y + 0.5 - u.y) < 2.2 && (d.fire = 0.5);
    }
  }
  let l = Object.values(n).reduce((u, d) => u + d, 0);
  ((a.morale = Math.max(50, a.morale - (l ? 6 : 0))), a.resolved++);
  let s = r ? 'The harbor holds' : t.kind === 'raid' ? 'Raiders take supplies' : `${t.title} passes`,
    c = l
      ? `Lost ${Object.entries(n)
          .filter(([, u]) => u > 0)
          .map(([u, d]) => `${Math.ceil(d)} ${u}`)
          .join(
            ', ',
          )}. ${o ? `They set fire to a ${o.replace(/_/g, ' ')}; builders are repairing it.` : 'Homes and delivered cargo are safe.'} ${t.kind === 'raid' ? 'Strengthen the watch before their next return.' : 'Your preparations reduced the damage.'}`
      : r
        ? 'Your preparations kept every stored supply safe.'
        : 'No stored supplies were lost. Check the daily needs before continuing.';
  ((a.lastReport = { day: Math.floor(e.time + 1e-8) + 1, kind: t.kind, title: s, text: c, losses: n }),
    log(e, s, c),
    (a.pending = void 0),
    (a.nextEventDay = Math.floor(e.time + 1e-8) + 1 + 8 + (a.resolved % 3)));
}
function stepFrontier(e) {
  let t = e.frontier,
    a = Math.floor(e.time + 1e-8) + 1;
  if (t.training && e.time + 1e-8 >= t.trainingReady) {
    let r = [];
    for (let o of trainingPairs(e)) {
      if (e.time + 1e-8 < o) {
        r.push(o);
        continue;
      }
      t.garrison + 2 <= guardCapacity(e)
        ? ((t.garrison += 2), log(e, 'Guards ready', 'Two trained guards have joined the harbor watch.'))
        : ((e.wallet.gold += 80),
          (e.wallet.food += 12),
          (e.wallet.timber += 10),
          (e.spent = Math.max(0, e.spent - 80)),
          log(
            e,
            'Training refunded',
            'The guard hall no longer has room. All training supplies were returned.',
          ));
    }
    ((t.training = r.length * 2),
      (t.trainingQueue = r.length ? r : void 0),
      (t.trainingReady = r.length ? Math.min(...r) : 0));
  }
  if (!frontierActive(e)) return;
  if (!t.initialized) {
    ((t.initialized = !0),
      (t.lastDay = a),
      (t.nextEventDay = a + 6),
      log(
        e,
        'The northern covenant',
        'Settlers now need daily food, and buildings need timber for repairs; winter needs firewood too. Build the watch and keep supplies ready. Your first threat is at least six days away.',
      ));
    return;
  }
  if (a > t.lastDay) {
    t.lastDay = a;
    let r = dailyNeeds(e);
    t.spoiledFood += foodSpoilage(e);
    let o = !1;
    for (let c of Object.keys(r)) {
      let u = Math.min(e.wallet[c], r[c]);
      ((e.wallet[c] -= u), (t.upkeep[c] += u), u + 1e-8 < r[c] && (o = !0));
    }
    let l = t.morale,
      s = councilEffects(e);
    (o && (t.lastShortageDay = a),
      (t.morale = Math.max(
        50,
        s.moraleFloor,
        Math.min(
          100,
          t.morale +
            (o ? -8 : Math.max(0, (4 + (completed(e, 'chapel') ? 2 : 0)) * s.moraleGainScale + s.moraleGain)),
        ),
      )),
      o &&
        l > 65 &&
        t.morale <= 65 &&
        log(
          e,
          'The hearths are struggling',
          'Food, guard pay or winter timber ran short. Production slows with morale. Collect supplies to recover; the charter still pays daily gold.',
        ),
      seasonAt(e.time).index === 0 &&
        seasonAt(e.time).day === 1 &&
        (t.winters++, log(e, 'Spring returns', 'Another winter behind us. The covenant has held.')));
  }
  t.pending && a >= t.pending.dueDay && resolveThreat(e, t.pending);
  let n = completed(e, 'watchtower') || completed(e, 'beacon') ? 4 : 3;
  if (!t.pending && a >= t.nextEventDay - n) {
    let r = t.eventNumber++,
      o = seasonAt(t.nextEventDay - 1).index,
      l = t.scripted,
      s = l || r % 2 === 1 ? 'raid' : ['flood', 'wildfire', 'gale', 'blizzard'][o],
      c =
        l?.title ??
        {
          raid: 'Red Sail raiders',
          flood: 'River flood',
          wildfire: 'Dry lightning',
          gale: 'Atlantic gale',
          blizzard: 'Deep frost',
        }[s];
    ((t.pending = {
      id: r + 1,
      kind: s,
      dueDay: Math.max(a + n, t.nextEventDay),
      strength: Math.round(raidStrength(e, r) * (l?.factor ?? 1)),
      title: c,
    }),
      (t.scripted = void 0),
      log(e, `${c} approaching`, `Due Day ${t.pending.dueDay}. ${THREAT_ADVICE[s]}`));
  }
}

export {
  DEFENSE_ITEMS,
  THREAT_ADVICE,
  createFrontier,
  dailyNeeds,
  defenseStrength,
  dismissGuards,
  foodCapacity,
  foodSpoilage,
  frontierActive,
  guardCapacity,
  moraleMultiplier,
  projectedLoss,
  reliefAvailable,
  requestRelief,
  stepFrontier,
  threatProtection,
  trainGuards,
  trainingBlock,
  trainingPairs,
  trainingSlots,
};

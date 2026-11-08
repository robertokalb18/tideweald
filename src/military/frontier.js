// Recovered from the Tideweald v16.11 build. Module: military/frontier
import { WORKSHOPS } from '../economy/workshops.js';
import { councilEffects } from '../progression/council.js';
import { seasonAt } from '../world/seasons.js';
import { battleOutcome, forecastBattle, planRaid, startBattle, stepBattle } from './battle.js';

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
        'Archers shoot raiders within 7 tiles. The watch spots raiders\u2019 sails as soon as a raid is sighted, and you get four days of warning instead of three. Counts 6 toward defense.',
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
        'Raiders within 5 tiles move at half speed, and they must break the gate before they can loot stores behind it or set them alight. Guards fighting near it take less harm. Counts 4 toward defense.',
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
        'Room for six guards. Train pairs in Army. When raiders land, guards leave the hall and fight by their formation. Each needs food and gold daily.',
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
  // Milestone 5: free build can switch on threats and daily upkeep (story.rules); the campaign always has both.
  threatsOn = (e) =>
    e.story.started && (e.story.mode === 'campaign' ? !!e.story.settled : !!e.story.rules?.threats),
  upkeepOn = (e) =>
    e.story.started && (e.story.mode === 'campaign' ? !!e.story.settled : !!e.story.rules?.upkeep),
  frontierActive = (e) => threatsOn(e) || upkeepOn(e),
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
    upkeepOn(e)
      ? Math.floor(Math.max(0, e.wallet.food - foodCapacity(e)) * 0.2 * councilEffects(e).spoilage)
      : 0;
function dailyNeeds(e) {
  if (!upkeepOn(e)) return empty();
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
    raid: 'They land on the shore and march on the stores. Towers shoot raiders within 7 tiles, a palisade gate shields stores within 5 tiles, and guards fight by formation. If half the band reaches unguarded stores, they set them alight.',
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
// Raids are fought on the map (battle.js). Everything below is how the frontier rules start a
// battle, forecast it for the Army panel, and settle it.
var battleOpts = (e) => ({ structure: councilEffects(e).structureDefense, morale: e.frontier.morale }),
  peekPlans = new WeakMap();
/** The raid's landing, target and route: saved on the threat, or worked out (and not saved) for a peek. */
function raidPlan(e, t, save = !1) {
  if (t.route) return t;
  let a = peekPlans.get(e);
  if (a?.id !== t.id) peekPlans.set(e, (a = { id: t.id, plan: planRaid(e, t.id) }));
  return save && Object.assign(t, a.plan), a.plan;
}
var forecasts = new WeakMap();
/** Plays the coming (or current) raid to its end on a copy, with the island as it is now. */
function raidForecast(e, t) {
  let a = e.frontier,
    n = [
      t.id,
      a.formation ?? 'patrol',
      a.garrison,
      e.placements,
      e.buildings.reduce((o, l) => o + (l.buildProgress >= 1 - 1e-8 ? 1 : 0), 0),
      Math.round(a.morale / 5),
      councilEffects(e).structureDefense,
      a.battle ? Math.floor(a.battle.t * 10) : -1,
    ].join('|'),
    r = forecasts.get(e);
  if (r?.key === n) return r.value;
  let o = a.battle ?? startBattle(e, t, raidPlan(e, t), battleOpts(e)),
    l = forecastBattle(e, o, battleOpts(e));
  return (forecasts.set(e, { key: n, value: l }), l);
}
function guardsLost(e) {
  return e.repelled ? Math.floor(e.guardsDown / 2) : Math.ceil(e.guardsDown / 2);
}
function landRaid(e, t, a) {
  let n = e.frontier,
    r = raidPlan(e, t, !0);
  ((n.battle = startBattle(e, t, r, battleOpts(e))),
    (n.battle.plunder = lossCaps(e, t, councilEffects(e).threatLoss)),
    log(
      e,
      `${t.title} land`,
      n.garrison
        ? `${n.battle.raiders.length} raiders are coming ashore. ${n.garrison} guards leave their halls (${{ patrol: 'patrol', line: 'shield line', column: 'marching column' }[n.formation ?? 'patrol']}). You can change formation while they fight.`
        : `${n.battle.raiders.length} raiders are coming ashore, and no guards stand in their way.`,
    ));
}
function resolveRaid(e, t, a) {
  let n = e.frontier,
    r = battleOutcome(a),
    o = {};
  for (let d of Object.keys(a.plunder))
    ((o[d] = Math.min(e.wallet[d], Math.ceil(a.plunder[d] * r.lost))), (e.wallet[d] -= o[d]), (n.losses[d] += o[d]));
  let l = Math.min(n.garrison, guardsLost(r));
  ((n.garrison -= l), r.repelled && n.raidsRepelled++);
  let s = Object.values(o).reduce((d, m) => d + m, 0);
  ((n.morale = Math.max(50, n.morale - (s || l ? 6 : 0))), n.resolved++);
  let c = e.buildings.find((d) => d.id === r.burned),
    u = [
      `${r.fell} of ${r.raiders} raiders fell${r.fled ? `; ${r.fled} rowed away` : ''}.`,
      r.arrows ? `The towers loosed ${r.arrows} volleys.` : '',
      r.gateHeld ? 'The palisade gate held.' : '',
      r.guardsDown
        ? l
          ? `${l} guard${l === 1 ? '' : 's'} fell${r.guardsDown > l ? `; ${r.guardsDown - l} wounded will recover` : ''}.`
          : `${r.guardsDown} guard${r.guardsDown === 1 ? ' was' : 's were'} wounded and will recover.`
        : r.guards
          ? 'Every guard came home.'
          : '',
      s
        ? `They carried off ${Object.entries(o)
            .filter(([, d]) => d > 0)
            .map(([d, m]) => `${m} ${d}`)
            .join(', ')}.`
        : 'No stores were taken.',
      c ? `They set fire to the ${c.kind.replace(/_/g, ' ')}; builders are repairing it.` : '',
    ]
      .filter(Boolean)
      .join(' '),
    d = r.repelled ? 'The harbor holds' : 'Raiders take supplies';
  ((n.lastReport = {
    day: Math.floor(e.time + 1e-8) + 1,
    kind: 'raid',
    title: d,
    text: u,
    losses: o,
    battle: { fell: r.fell, fled: r.fled, raiders: r.raiders, guardsDown: r.guardsDown, guardsLost: l },
  }),
    log(e, d, u),
    (n.pending = void 0),
    (n.battle = void 0),
    (n.nextEventDay = Math.floor(e.time + 1e-8) + 1 + 8 + (n.resolved % 3)));
}
function threatProtection(e, t) {
  return t.kind === 'raid'
    ? 1 - raidForecast(e, t).lost
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
  return lossCaps(e, t, (1 - threatProtection(e, t)) * councilEffects(e).threatLoss);
}
function lossCaps(e, t, a) {
  let n = t.kind === 'raid';
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
  if (t.battle) return (log(e, 'Not now', 'Raiders are ashore. Guards stand down after the fight.'), !1);
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
  // Raids are fought on the map and settled by resolveRaid; this handles the weather threats.
  let r = !1,
    o = '';
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
function stepFrontier(e, dt = 0.025) {
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
  if (a > t.lastDay && !upkeepOn(e)) t.lastDay = a;
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
  if (t.pending?.kind === 'raid') {
    // A raid sighted before v16.13 has no landing yet: decide it now, inside the step.
    (t.pending.route || raidPlan(e, t.pending, !0),
      !t.battle && a >= t.pending.dueDay && landRaid(e, t.pending, a),
      t.battle && stepBattle(e, t.battle, dt, battleOpts(e)) && resolveRaid(e, t.pending, t.battle));
  } else t.pending && a >= t.pending.dueDay && resolveThreat(e, t.pending);
  let n = completed(e, 'watchtower') || completed(e, 'beacon') ? 4 : 3;
  if (!t.pending && threatsOn(e) && a >= t.nextEventDay - n) {
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
      s === 'raid' && raidPlan(e, t.pending, !0),
      (t.scripted = void 0),
      log(e, `${c} approaching`, `Due Day ${t.pending.dueDay}. ${THREAT_ADVICE[s]}`));
  }
}

export {
  threatsOn,
  upkeepOn,
  raidForecast,
  raidPlan,
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

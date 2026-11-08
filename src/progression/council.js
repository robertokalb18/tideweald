// Recovered from the Tideweald v16.11 build. Module: progression/council

var COUNCIL_DECISIONS = [
    {
      id: 'market',
      chapter: 18,
      title: 'The market charter',
      voice: 'Skipper Elin \xB7 traders\u2019 council',
      prompt:
        'The neighboring crews will trade with us, but on whose terms? The craftsmen want a guild law; the boat crews want open scales.',
      options: {
        a: {
          title: 'Open scales',
          effect: 'Sale prices +10%, and buyers absorb 50% more before prices dip.',
        },
        b: {
          title: 'A guild law',
          effect: 'Workshops produce 15% more; each working workshop pays 1 gold a day in dues.',
        },
      },
    },
    {
      id: 'stores',
      chapter: 27,
      title: 'Sharing the stores',
      voice: 'Mara \xB7 council of the valleys',
      prompt:
        'Coast and valleys must agree how grain is kept. One common granary, or every family its own plot and loft?',
      options: {
        a: {
          title: 'One common granary',
          effect:
            'Food spoils half as fast above your reserve; settlers eat 10% more as rations are shared out.',
        },
        b: { title: 'Family plots', effect: 'Farms produce 15% more food.' },
      },
    },
    {
      id: 'timber',
      chapter: 30,
      title: 'The shipbuilder\u2019s offer',
      voice: 'Ivo \xB7 keeper of the woods',
      prompt:
        'The shipbuilder offers iron saws and wedges for our timber. Faster work, but the woods will feel it.',
      options: {
        a: {
          title: 'Take the tools',
          effect: 'Sawpits and quarries produce 25% more; morale recovers 1 point a day slower.',
        },
        b: {
          title: 'Keep the old ways',
          effect: 'Trees grow 25% faster and wild animals move in twice as often.',
        },
      },
    },
    {
      id: 'redsail',
      chapter: 32,
      title: 'Answer to the Red Sails',
      voice: 'Skipper Elin \xB7 harbor watch',
      prompt: 'The Red Sail captain offers to spare us for a yearly toll. Do we pay, or build walls?',
      options: {
        a: {
          title: 'Raise the walls',
          effect: 'Watchtowers, palisades and beacons give 50% more defense; wary merchants pay 8% less.',
        },
        b: {
          title: 'Pay the toll',
          effect: 'Raids come 25% weaker; the toll costs 2 gold a day from the charter.',
        },
      },
    },
    {
      id: 'council',
      chapter: 36,
      title: 'Who sits at the council',
      voice: 'Mara \xB7 council of shores',
      prompt:
        'The delegates ask who should hold the seats: the master craftsmen, or one elder from every family?',
      options: {
        a: { title: 'The masters', effect: 'Construction is 20% faster.' },
        b: {
          title: 'The families',
          effect: 'Morale never drops below 80, so production never falls below 80%.',
        },
      },
    },
    {
      id: 'water',
      chapter: 40,
      title: 'Water rights',
      voice: 'Ivo \xB7 keeper of the woods',
      prompt: 'The wells are failing. Dig deep wells for the fields, or dike the marsh for fish ponds?',
      options: {
        a: { title: 'Deep wells', effect: 'Farms never lose more than 20% to dry soil or drought.' },
        b: { title: 'Dike the marsh', effect: 'Fisheries and piers produce 30% more food.' },
      },
    },
    {
      id: 'winter',
      chapter: 42,
      title: 'The winter law',
      voice: 'Mara \xB7 village council',
      prompt: 'This winter the stores must last. Strict rations, or open hearths so nobody sits in the cold?',
      options: {
        a: { title: 'Strict rations', effect: 'Settlers eat 20% less; morale recovers half as fast.' },
        b: {
          title: 'Open hearths',
          effect: 'Winter firewood use rises 50%; morale recovers 2 points a day faster.',
        },
      },
    },
    {
      id: 'legacy',
      chapter: 46,
      title: 'What we leave behind',
      voice: 'Mara \xB7 keeper of the charter',
      prompt:
        'The charter allows one last great work. A school for the children, or an infirmary for the hard years?',
      options: {
        a: { title: 'A school', effect: 'The charter pays 4 more gold every day.' },
        b: { title: 'An infirmary', effect: 'Every storm, frost, flood or raid takes 25% less.' },
      },
    },
  ],
  decisionForChapter = (e) => COUNCIL_DECISIONS.find((t) => t.chapter === e),
  choiceOf = (e, t) => e.story.decisions?.find((a) => a.id === t)?.choice,
  b6 = new WeakMap(),
  v6 = null;
function councilEffects(e) {
  let t = e.story.decisions;
  if (!t?.length) return v6 ?? (v6 = computeEffects(e));
  let a = b6.get(t);
  return (a || ((a = computeEffects(e)), b6.set(t, a)), a);
}
function computeEffects(e) {
  let t = (a) => choiceOf(e, a);
  return {
    salePrice: (t('market') === 'a' ? 1.1 : 1) * (t('redsail') === 'a' ? 0.92 : 1),
    marketDepth: t('market') === 'a' ? 1.5 : 1,
    workshopRate: t('market') === 'b' ? 1.15 : 1,
    workshopDues: t('market') === 'b' ? 1 : 0,
    spoilage: t('stores') === 'a' ? 0.5 : 1,
    foodUpkeep: (t('stores') === 'a' ? 1.1 : 1) * (t('winter') === 'a' ? 0.8 : 1),
    farmRate: t('stores') === 'b' ? 1.15 : 1,
    extractRate: t('timber') === 'a' ? 1.25 : 1,
    treeGrowth: t('timber') === 'b' ? 1.25 : 1,
    wildlife: t('timber') === 'b' ? 2 : 1,
    moraleGain: (t('timber') === 'a' ? -1 : 0) + (t('winter') === 'b' ? 2 : 0),
    moraleGainScale: t('winter') === 'a' ? 0.5 : 1,
    structureDefense: t('redsail') === 'a' ? 1.5 : 1,
    raidStrength: t('redsail') === 'b' ? 0.75 : 1,
    charter: (t('redsail') === 'b' ? -2 : 0) + (t('legacy') === 'a' ? 4 : 0),
    construction: t('council') === 'a' ? 1.2 : 1,
    moraleFloor: t('council') === 'b' ? 80 : 0,
    dryFloor: t('water') === 'a' ? 0.8 : 0,
    fishRate: t('water') === 'b' ? 1.3 : 1,
    winterFuel: t('winter') === 'b' ? 1.5 : 1,
    threatLoss: t('legacy') === 'b' ? 0.75 : 1,
  };
}
function decide(e, t, a) {
  let n = COUNCIL_DECISIONS.find((l) => l.id === t);
  if (!n || choiceOf(e, t) || (a !== 'a' && a !== 'b')) return !1;
  ((e.story.decisions = [
    ...(e.story.decisions ?? []),
    { id: t, choice: a, day: Math.floor(e.time + 1e-8) + 1 },
  ]),
    e.revision++,
    e.placements++);
  let r = n.options[a],
    o = `${r.title}: ${r.effect}`;
  return (
    e.story.events.push({
      day: Math.floor(e.time + 1e-8) + 1,
      title: `The council decides \xB7 ${n.title}`,
      text: o,
    }),
    e.story.events.length > 60 && e.story.events.shift(),
    (e.message = `The council decides: ${o}`),
    e.noticeId++,
    !0
  );
}

export { COUNCIL_DECISIONS, choiceOf, councilEffects, decide, decisionForChapter };

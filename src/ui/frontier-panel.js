// Recovered from the Tideweald v16.11 build. Module: ui/frontier-panel
import * as jsxRuntime from 'react/jsx-runtime';
import { production } from '../economy/production.js';
import { WORKSHOPS } from '../economy/workshops.js';
import {
  THREAT_ADVICE,
  dailyNeeds,
  defenseStrength,
  dismissGuards,
  foodCapacity,
  foodSpoilage,
  frontierActive,
  guardCapacity,
  projectedLoss,
  reliefAvailable,
  requestRelief,
  threatProtection,
  trainGuards,
  trainingBlock,
  trainingPairs,
  trainingSlots,
} from '../military/frontier.js';
import { charterRate, hasLandmark } from '../progression/campaign.js';
import { I0, Nd, Rd, Sd, Td, U4, W0, Yn, Z4, dp } from './icons.js';
import { Dialog, DialogDescription, DialogTitle, IslandDialogContent } from './kit.js';
import { isBuilt } from '../world/catalog.js';
import { SEASON_NAMES, seasonAt } from '../world/seasons.js';
import { is } from '../world/spatial-index.js';

function settlementLedger(e) {
  let t = { gold: charterRate(e), food: 0, timber: 0, stone: 0 },
    a = { ...t },
    n = { gold: 0, food: Math.floor(e.orchardFood), timber: 0, stone: 0 },
    r = { gold: 0, food: 0, timber: 0, stone: 0 },
    o = 0,
    l = 0;
  for (let m of e.buildings) {
    let h = production(e, m),
      p = h.resource;
    if (((n[p] += Math.floor(m.stored)), (t[p] += h.rate), m.stored + 1e-6 >= h.capacity)) h.rate > 0 && o++;
    else if (((a[p] += h.rate), h.rate > 0))
      for (let [g, v] of Object.entries(WORKSHOPS[m.kind]?.inputs ?? {})) r[g] += v ?? 0;
    isBuilt(m) &&
      h.rate === 0 &&
      !['watchtower', 'palisade', 'guardhall', 'well', 'storehouse', 'chapel', 'beacon'].includes(m.kind) &&
      l++;
  }
  let s = seasonAt(e.time).index,
    c =
      e.plants.filter((m) => is.has(m.kind) && m.growth > 0.8 && m.health > 0.5).length *
      3 *
      (s === 3 ? (hasLandmark(e, 'glasshouse') ? 0.75 : 0.25) : s === 2 ? 1.3 : 1) *
      (hasLandmark(e, 'glasshouse') ? 1.5 : 1);
  ((t.food += c), e.orchardFood < 300 ? (a.food += c) : c > 0 && o++);
  let u = dailyNeeds(e),
    d = ['gold', 'food', 'timber', 'stone'];
  return {
    full: o,
    stalled: l,
    foodCapacity: foodCapacity(e),
    spoilage: foodSpoilage(e),
    rows: d.map((m) => ({
      resource: m,
      gross: a[m],
      capacity: t[m],
      upkeep: u[m],
      inputs: r[m],
      cost: u[m] + r[m],
      net: a[m] - u[m] - r[m],
      ready: n[m],
      wallet: e.wallet[m],
      dawnShort: e.wallet[m] < u[m],
    })),
  };
}
var mT = [Sd, Nd, W0, Rd],
  resourceText = (e) =>
    Object.entries(e)
      .filter(([, t]) => t > 0)
      .map(([t, a]) => `${Math.ceil(a)} ${t}`)
      .join(' \xB7 ') || 'None';
function FrontierPanel({
  world: e,
  open: t,
  onOpen: a,
  onChange: n,
  onBuild: r,
  onLocate: o,
  onThreatLocate: l,
}) {
  let s = seasonAt(e.time),
    c = e.frontier,
    u = c.pending,
    d = dailyNeeds(e),
    m = frontierActive(e),
    h = guardCapacity(e),
    p = !!trainingBlock(e),
    g = trainingPairs(e),
    v = trainingSlots(e),
    M = Math.floor(e.time + 1e-8) + 1;
  return (0, jsxRuntime.jsx)(Dialog, {
    open: t,
    onOpenChange: a,
    children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
      className: 'frontier-dialog',
      children: [
        (0, jsxRuntime.jsx)(DialogTitle, { children: 'Army & seasons' }),
        (0, jsxRuntime.jsxs)(DialogDescription, { children: ['Recruit, locate & protect \xB7 Day ', M] }),
        u &&
          (0, jsxRuntime.jsxs)('section', {
            className: 'threat-card',
            role: 'status',
            children: [
              (0, jsxRuntime.jsxs)('span', {
                className: 'watch-label',
                children: [
                  (0, jsxRuntime.jsx)(dp, { size: 17 }),
                  ' WARNING \xB7 ',
                  Math.max(0, u.dueDay - M),
                  ' DAYS',
                ],
              }),
              (0, jsxRuntime.jsx)('h3', { children: u.title }),
              (0, jsxRuntime.jsxs)('p', {
                children: [
                  'Arrives Day ',
                  u.dueDay,
                  u.kind === 'raid' ? ` \xB7 enemy strength ${u.strength}` : '',
                  '. ',
                  THREAT_ADVICE[u.kind],
                ],
              }),
              (0, jsxRuntime.jsxs)('div', {
                className: 'watch-metrics',
                children: [
                  (0, jsxRuntime.jsxs)('strong', {
                    children: [
                      Math.round(threatProtection(e, u) * 100),
                      '%',
                      (0, jsxRuntime.jsx)('small', { children: 'current protection' }),
                    ],
                  }),
                  (0, jsxRuntime.jsxs)('strong', {
                    children: [
                      defenseStrength(e),
                      (0, jsxRuntime.jsx)('small', { children: 'settlement defense' }),
                    ],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)('p', {
                className: 'loss-preview',
                children: [
                  'If it arrived now: ',
                  Object.values(projectedLoss(e, u)).some((w) => w > 0)
                    ? 'lose ' + resourceText(projectedLoss(e, u))
                    : 'no supply losses',
                  '. Your stores and defenses on arrival determine the final losses.',
                ],
              }),
              u.kind === 'raid' &&
                (0, jsxRuntime.jsxs)('button', {
                  className: 'watch-build',
                  onClick: () => {
                    (a(!1), l());
                  },
                  children: ['Find approaching raiders ', (0, jsxRuntime.jsx)(I0, { size: 16 })],
                }),
            ],
          }),
        (0, jsxRuntime.jsxs)('section', {
          className: 'watch-section army-controls',
          children: [
            (0, jsxRuntime.jsxs)('h3', {
              children: [(0, jsxRuntime.jsx)(dp, { size: 18 }), ' Harbor guard \xB7 ', c.garrison, ' / ', h],
            }),
            (0, jsxRuntime.jsx)('p', { children: '2 soldiers \xB7 80 gold, 12 food, 10 timber \xB7 1 day' }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'watch-actions',
              children: [
                (0, jsxRuntime.jsxs)('button', {
                  disabled: p,
                  onClick: () => {
                    (trainGuards(e), n());
                  },
                  children: [
                    (0, jsxRuntime.jsx)(Td, { size: 16 }),
                    v > 1
                      ? `Train 2 soldiers \xB7 ${Math.max(0, v - g.length)} of ${v} halls free`
                      : 'Train 2 soldiers',
                  ],
                }),
                (0, jsxRuntime.jsxs)('button', {
                  disabled: !c.garrison,
                  onClick: () => {
                    (a(!1), o());
                  },
                  children: [(0, jsxRuntime.jsx)(I0, { size: 16 }), 'Find soldiers (', c.garrison, ')'],
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('button', {
              className: 'watch-build',
              onClick: () => {
                (a(!1), r('guardhall'));
              },
              children: 'Build Guard hall \xB7 6 beds',
            }),
            (0, jsxRuntime.jsx)('p', {
              className: 'training-reason',
              role: 'status',
              children: g.length
                ? `${g.length * 2} in training \xB7 next pair ready in ${Math.max(0, Math.min(...g) - e.time).toFixed(1)} days.${p ? ' ' + trainingBlock(e) : ' Another hall is free to train.'} Close this panel to resume time.`
                : p
                  ? trainingBlock(e)
                  : 'Ready. Each Guard hall trains two soldiers at a time; they gather beside their halls.',
            }),
            (0, jsxRuntime.jsx)('div', {
              className: 'army-formation',
              role: 'group',
              'aria-label': 'Army formation',
              children: [
                ['patrol', 'Patrol'],
                ['line', 'Shield line'],
                ['column', 'Marching column'],
              ].map(([w, y]) =>
                (0, jsxRuntime.jsx)(
                  'button',
                  {
                    'aria-pressed': (c.formation ?? 'patrol') === w,
                    onClick: () => {
                      ((c.formation = w), e.revision++, n());
                    },
                    children: y,
                  },
                  w,
                ),
              ),
            }),
            (0, jsxRuntime.jsx)('p', {
              children: 'Shield line: +15% against raiders. Patrol: +5%. Column: for moving out.',
            }),
            (0, jsxRuntime.jsxs)('details', {
              className: 'army-details',
              children: [
                (0, jsxRuntime.jsx)('summary', { children: 'Defense, upkeep & stand down' }),
                (0, jsxRuntime.jsxs)('div', {
                  className: 'watch-metrics',
                  children: [
                    (0, jsxRuntime.jsxs)('strong', {
                      children: [
                        defenseStrength(e),
                        (0, jsxRuntime.jsx)('small', { children: 'total defense' }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('strong', {
                      children: [
                        c.raidsRepelled,
                        (0, jsxRuntime.jsx)('small', { children: 'raids repelled' }),
                      ],
                    }),
                  ],
                }),
                (0, jsxRuntime.jsx)('p', {
                  children:
                    'Each guard adds 3 defense and costs 1 gold and 0.75 food a day. Watchtowers add 6 defense, palisades 4. A raid that meets less than 70% of its strength burns a building.',
                }),
                (0, jsxRuntime.jsxs)('div', {
                  className: 'watch-actions',
                  children: [
                    (0, jsxRuntime.jsxs)('button', {
                      onClick: () => {
                        (a(!1), r('watchtower'));
                      },
                      children: ['Build watchtower ', (0, jsxRuntime.jsx)(Yn, { size: 17 })],
                    }),
                    (0, jsxRuntime.jsx)('button', {
                      disabled: !c.garrison,
                      onClick: () => {
                        (dismissGuards(e), n());
                      },
                      children: 'Stand down two',
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        (0, jsxRuntime.jsxs)('section', {
          className: `season-banner season-${s.index}`,
          children: [
            (0, jsxRuntime.jsxs)('span', {
              children: ['YEAR ', s.year, ' \xB7 ', s.name.toUpperCase(), ' \xB7 DAY ', s.day, ' OF 12'],
            }),
            (0, jsxRuntime.jsxs)('h2', { children: [s.name, ' in Haven'] }),
            (0, jsxRuntime.jsx)('p', {
              children: [
                'Rain awakens bright meadows and fills the rivers.',
                'Long days warm the soil. Keep crops watered through dry spells.',
                'Amber leaves fall; orchards yield 30% more. Fill the winter stores.',
                'Snow covers the fields. Farms yield 25%; residents burn timber to stay warm.',
              ][s.index],
            }),
            (0, jsxRuntime.jsxs)('strong', {
              children: [s.next, ' begins in ', s.remaining, ' day', s.remaining === 1 ? '' : 's'],
            }),
          ],
        }),
        (0, jsxRuntime.jsx)('div', {
          className: 'season-wheel',
          'aria-label': 'Four seasons',
          children: SEASON_NAMES.map((w, y) => {
            let k = mT[y];
            return (0, jsxRuntime.jsxs)(
              'span',
              {
                className: s.index === y ? 'current' : '',
                children: [(0, jsxRuntime.jsx)(k, { size: 21 }), w],
              },
              w,
            );
          }),
        }),
        !u &&
          (0, jsxRuntime.jsxs)('section', {
            className: 'watch-calm',
            children: [
              (0, jsxRuntime.jsx)(Yn, {}),
              (0, jsxRuntime.jsxs)('div', {
                children: [
                  (0, jsxRuntime.jsx)('strong', {
                    children: m ? 'Quiet on the horizon' : 'A sheltered beginning',
                  }),
                  (0, jsxRuntime.jsx)('p', {
                    children: m
                      ? 'The next threat will be announced here. A watchtower adds one extra warning day.'
                      : 'Daily upkeep and threats begin after the first settlers arrive. Free build remains peaceful.',
                  }),
                ],
              }),
            ],
          }),
        (0, jsxRuntime.jsxs)('section', {
          className: 'watch-section',
          children: [
            (0, jsxRuntime.jsxs)('h3', {
              children: [(0, jsxRuntime.jsx)(Z4, { size: 18 }), ' Keep the hearths supplied'],
            }),
            m
              ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                  children: [
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'watch-metrics',
                      children: [
                        (0, jsxRuntime.jsxs)('strong', {
                          children: [
                            e.story.population,
                            (0, jsxRuntime.jsx)('small', { children: 'settlers to feed' }),
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('strong', {
                          children: [
                            c.morale,
                            '%',
                            (0, jsxRuntime.jsxs)('small', {
                              children: ['morale \xB7 production ', Math.max(65, c.morale), '%'],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('p', {
                      children: [
                        'Each dawn the village uses ',
                        (0, jsxRuntime.jsx)('b', { children: resourceText(d) }),
                        '. Shortages lower morale and production.',
                      ],
                    }),
                    foodSpoilage(e) > 0 &&
                      (0, jsxRuntime.jsxs)('p', {
                        className: 'ledger-alert',
                        children: [
                          foodSpoilage(e),
                          ' food will spoil at dawn: stores hold ',
                          foodCapacity(e).toLocaleString(),
                          '. Sell or deliver the surplus, or build a granary.',
                        ],
                      }),
                    (0, jsxRuntime.jsxs)('details', {
                      className: 'army-details',
                      children: [
                        (0, jsxRuntime.jsx)('summary', { children: 'How upkeep works' }),
                        (0, jsxRuntime.jsx)('p', {
                          children:
                            'Food feeds settlers and guards. Timber repairs buildings (one a day for every four) and heats homes in winter. One gold per two completed buildings pays for common works. Supplies come from your stores at dawn, so collect harvests or keep Auto-collect on. Full supplies restore 4 morale a day. Delivered chapter cargo is never touched.',
                        }),
                        (0, jsxRuntime.jsxs)('p', {
                          children: [
                            'Food stores hold ',
                            foodCapacity(e).toLocaleString(),
                            ': each granary adds 1,500 and a storehouse 800. Above that, 20% of the excess spoils each dawn. Total spoiled: ',
                            c.spoiledFood,
                            '.',
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('p', {
                          children: [
                            'Spent on upkeep: ',
                            resourceText(c.upkeep),
                            (0, jsxRuntime.jsx)('br', {}),
                            'Lost to events: ',
                            resourceText(c.losses),
                          ],
                        }),
                      ],
                    }),
                  ],
                })
              : (0, jsxRuntime.jsx)('p', {
                  children:
                    e.story.mode === 'sandbox'
                      ? 'Free build has no upkeep, spoilage or threats. Your settlers live on the island\u2019s bounty.'
                      : 'Daily upkeep begins when the first settlers arrive with the fleet.',
                }),
          ],
        }),
        c.lastReport &&
          (0, jsxRuntime.jsxs)('section', {
            className: 'watch-report',
            children: [
              (0, jsxRuntime.jsxs)('span', { children: ['LAST EVENT \xB7 DAY ', c.lastReport.day] }),
              (0, jsxRuntime.jsx)('h3', { children: c.lastReport.title }),
              (0, jsxRuntime.jsx)('p', { children: c.lastReport.text }),
            ],
          }),
        m &&
          (0, jsxRuntime.jsxs)('section', {
            className: 'watch-section',
            children: [
              (0, jsxRuntime.jsxs)('h3', {
                children: [(0, jsxRuntime.jsx)(U4, { size: 18 }), ' The covenant\u2019s promise'],
              }),
              (0, jsxRuntime.jsx)('p', {
                children:
                  'If gold falls below 80 and food below 25, ask neighboring crews for recovery supplies. Available once every 12 days; the daily charter also continues through shortages.',
              }),
              (0, jsxRuntime.jsx)('button', {
                className: 'watch-build',
                disabled: !reliefAvailable(e),
                onClick: () => {
                  (requestRelief(e), n());
                },
                children: 'Request recovery supplies',
              }),
            ],
          }),
        (0, jsxRuntime.jsx)('p', {
          className: 'watch-footnote',
          children:
            'Four seasons of 12 days make a 48-day year. Time pauses while you plan, and nothing happens while you are away.',
        }),
      ],
    }),
  });
}

export { FrontierPanel, settlementLedger };

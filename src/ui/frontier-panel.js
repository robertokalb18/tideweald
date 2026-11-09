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
  raidForecast,
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
import { CATALOG, isBuilt } from '../world/catalog.js';
import { raidLocation } from '../world/actors.js';
import { RIVAL, atPeace, expeditionStatus, payTribute, sendLongships, tributeCost } from '../military/rival.js';
import { knows } from '../progression/lore.js';
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
var FORMATION_NOTES = {
    patrol:
      'Patrol: guards walk a ring around the raiders\u2019 target and close up in front of it when the horn sounds. They chase raiders who run.',
    line: 'Shield line: a wall five wide across the raiders\u2019 path, between the beach and their target. Guards take less harm, but they do not chase.',
    column:
      'Marching column: guards march fast to meet the band on the beach and charge. They chase far, but take more harm.',
  },
  buildingName = (e, t) => {
    let a = e.buildings.find((n) => n.id === t);
    return a ? (CATALOG[a.kind]?.name ?? a.kind).toLowerCase() : 'haven';
  },
  // What the watch can tell about the coming (or current) raid.
  raidIntel = (e, t) => {
    let a = raidLocation(e);
    if (!a) return null;
    let n = e.frontier.battle,
      r = a.spotted ? raidForecast(e, t) : null,
      o = buildingName(e, n?.target ?? t.target),
      l = Math.round(Math.hypot(a.landing.x - a.target.x, a.landing.y - a.target.y));
    if (n) {
      let c = n.raiders.filter((m) => m.hp > 0 && m.s !== 'down' && m.s !== 'away').length,
        u = n.guards.filter((m) => m.s !== 'down').length,
        d = Math.round(n.raiders.reduce((m, h) => m + h.c, 0) * 100);
      return {
        label: 'RAIDERS ASHORE',
        lines: [
          `${c} of ${n.raiders.length} raiders still fighting \xB7 ${u} of ${n.guards.length} guards standing${d ? ` \xB7 ${d}% of the ${o}\u2019s goods carried off` : ''}${n.gate > 0 ? ' \xB7 the palisade gate holds' : ''}.`,
          forecastText(r, o),
        ],
      };
    }
    return {
      label: null,
      lines: a.spotted
        ? [
            `${a.watched ? 'The watchtower has' : 'Fishermen have'} spotted their sails. They will land ${l} tiles from the ${o} and march on it; their route is marked on the map.`,
            forecastText(r, o),
          ]
        : [
            `They will make for the ${o}, but no one knows where they will land. A watchtower or beacon would spot their sails at once; otherwise they are seen on Day ${t.dueDay - 1}.`,
          ],
    };
  },
  forecastText = (e, t) =>
    e
      ? 'Forecast if nothing changes: ' +
        (e.burned
          ? `they reach the ${t} unopposed and set it alight.`
          : e.repelled
            ? e.lost > 0.01
              ? `they are driven off with ${Math.round(e.lost * 100)}% of its goods.`
              : e.gateHeld
                ? 'the palisade gate holds until they give up.'
                : `they are driven off${e.fell ? `; about ${e.fell} of ${e.raiders} fall` : ''}.`
            : `they get away with ${Math.round(e.lost * 100)}% of the ${t}\u2019s goods.`) +
        (e.guardsDown ? ` About ${e.guardsDown} guard${e.guardsDown === 1 ? '' : 's'} would be cut down.` : '')
      : '';
// Milestone 7: the Red Sail jarl. Tribute buys peace; longships (Knarr building and a boatbuilders' yard)
// take half the guards away for six days to strike his island.
function jarlSection(e, t, a) {
  let n = t.rival,
    r = Math.floor(e.time + 1e-8) + 1,
    o = e.buildings.some((s) => s.kind === 'shipyard' && isBuilt(s)),
    l = expeditionStatus(e, knows(e, 'knarr'), o, knows(e, 'shieldwall'));
  return (0, jsxRuntime.jsxs)('section', {
    className: 'jarl-panel',
    children: [
      (0, jsxRuntime.jsx)('h3', { children: 'The Red Sail jarl' }),
      (0, jsxRuntime.jsx)('p', {
        children: [
          `Strength ${n.strength}: his raids are ${Math.round(Math.max(0.85, Math.min(1.3, 0.85 + n.strength / 200)) * 100)}% as hard as an ordinary band. `,
          atPeace(e)
            ? `At peace until Day ${n.peaceUntil}: no raids, though storms still come.`
            : `He gathers more ships every ${RIVAL.every} days.`,
          n.expedition ? ` Your longships are at sea with ${n.expedition.sent} guards, home on Day ${n.expedition.back}.` : '',
        ].join(''),
      }),
      (0, jsxRuntime.jsxs)('div', {
        className: 'trade-buttons jarl-actions',
        children: [
          (0, jsxRuntime.jsxs)('button', {
            disabled: atPeace(e) || e.wallet.gold < tributeCost(e),
            onClick: () => {
              payTribute(e).ok && a?.();
            },
            children: ['Pay tribute', (0, jsxRuntime.jsx)('small', { children: `${tributeCost(e)} gold \xB7 ${RIVAL.peaceDays} days of peace` })],
          }),
          (0, jsxRuntime.jsxs)('button', {
            disabled: !l.ok,
            onClick: () => {
              sendLongships(e, knows(e, 'knarr'), o, knows(e, 'shieldwall')).ok && a?.();
            },
            children: [
              'Send longships',
              (0, jsxRuntime.jsx)('small', { children: l.ok ? `${l.reason} \xB7 ${l.odds}` : l.reason }),
            ],
          }),
        ],
      }),
    ],
  });
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
    M = Math.floor(e.time + 1e-8) + 1,
    I = u?.kind === 'raid' ? raidIntel(e, u) : null,
    hidden = I && !raidLocation(e)?.spotted;
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
                  ...(I?.label ? [' ', I.label] : [' WARNING \xB7 ', Math.max(0, u.dueDay - M), ' DAYS']),
                ],
              }),
              (0, jsxRuntime.jsx)('h3', { children: u.title }),
              (0, jsxRuntime.jsxs)('p', {
                children: [
                  e.frontier.battle ? 'Landed Day ' : 'Arrives Day ',
                  u.dueDay,
                  u.kind === 'raid' ? ` \xB7 enemy strength ${u.strength}` : '',
                  '. ',
                  THREAT_ADVICE[u.kind],
                ],
              }),
              ...(I?.lines ?? [])
                .filter(Boolean)
                .map((w, y) => (0, jsxRuntime.jsx)('p', { className: 'raid-intel', children: w }, `intel${y}`)),
              (0, jsxRuntime.jsxs)('div', {
                className: 'watch-metrics',
                children: [
                  (0, jsxRuntime.jsxs)('strong', {
                    children: [
                      hidden ? '?' : Math.round(threatProtection(e, u) * 100),
                      hidden ? '' : '%',
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
                children: hidden
                  ? ['If it arrived now: unknown until their sails are spotted.']
                  : [
                      e.frontier.battle ? 'If the fight goes as forecast: ' : 'If it arrived now: ',
                      Object.values(projectedLoss(e, u)).some((w) => w > 0)
                        ? 'lose ' + resourceText(projectedLoss(e, u))
                        : 'no supply losses',
                      u.kind === 'raid'
                        ? '. Formation, guards and where your towers and gates stand decide the result.'
                        : '. Your stores and defenses on arrival determine the final losses.',
                    ],
              }),
              u.kind === 'raid' &&
                (0, jsxRuntime.jsxs)('button', {
                  className: 'watch-build',
                  onClick: () => {
                    (a(!1), l());
                  },
                  children: [
                    e.frontier.battle ? 'Watch the fight ' : hidden ? 'Show their target ' : 'Show the landing ',
                    (0, jsxRuntime.jsx)(I0, { size: 16 }),
                  ],
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
              className: 'formation-note',
              children:
                FORMATION_NOTES[c.formation ?? 'patrol'] +
                (e.frontier.battle ? ' You can change formation during the fight.' : ''),
            }),
            c.rival && jarlSection(e, c, n),
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
                    'Defense is a rough guide: each guard counts 3, a watchtower 6, a palisade gate 4. In a raid, where they stand decides it: towers shoot raiders within 7 tiles, and a palisade gate shields stores within 5 tiles. If half the band reaches unguarded stores, they set them alight. Each guard costs 1 gold and 0.75 food a day.',
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

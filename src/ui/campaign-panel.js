// Recovered from the Tideweald v16.11 build. Module: ui/campaign-panel
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import {
  CHAPTERS,
  campaignObjectives,
  chapterDelivery,
  completeChapter,
  continueFreebuild,
  currentChapter,
  stockHarbor,
} from '../progression/campaign.js';
import { ACTS } from '../progression/chapters.js';
import { COUNCIL_DECISIONS, choiceOf, decide, decisionForChapter } from '../progression/council.js';
import { Character, Emblem } from './character.js';
import { Ad, Er, I0, I4, Md, Nr, Ql, X4, qn } from './icons.js';
import { Dialog, DialogDescription, DialogTitle, IslandDialogContent } from './kit.js';
import { hf } from '../world/catalog.js';

function CampaignPanel({
  resume: e,
  world: t,
  open: a,
  onOpen: n,
  onChange: r,
  onBegin: o,
  onSupplies: l,
  onLocate: s,
}) {
  let c = t.story,
    u = currentChapter(t),
    d = campaignObjectives(t),
    m = d.every((L) => L.done),
    h = Math.floor(t.time + 1e-8) + 1,
    p = Math.min(ACTS.length - 1, Math.floor(c.chapter / 4)),
    g = chapterDelivery(t),
    v = c.chapter >= CHAPTERS.length,
    [M, w] = (0, React.useState)(null),
    y = M ?? p,
    [k, x] = (0, React.useState)(null),
    T = c.mode === 'campaign' ? decisionForChapter(c.chapter) : void 0,
    C = T ? choiceOf(t, T.id) : void 0,
    R = (c.decisions ?? [])
      .map((L) => ({ d: L, info: COUNCIL_DECISIONS.find((N) => N.id === L.id) }))
      .filter((L) => L.info),
    b = Math.round((d.reduce((L, N) => L + N.value / N.target, 0) / Math.max(1, d.length)) * 100),
    A = () => {
      (continueFreebuild(t), r(), n(!1));
    },
    E = () => {
      (completeChapter(t), w(null), r(), n(!1));
    },
    V = u.voice.startsWith('Ivo') ? 1 : u.voice.startsWith('Skipper') ? 2 : 0,
    Z = Object.entries(g).filter(([, L]) => L > 0);
  return (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
    children: [
      c.mode === 'campaign' &&
        c.started &&
        (0, jsxRuntime.jsxs)('button', {
          className: `mobile-mission ${m ? 'ready' : ''}`,
          onClick: () => (m && c.chapter !== 3 ? E() : n(!0)),
          'aria-label':
            m && c.chapter !== 3 ? `Complete chapter ${c.chapter + 1} and continue` : 'Open current mission',
          children: [
            (0, jsxRuntime.jsx)('span', {
              className: 'mission-number',
              children: v ? '\u221E' : String(c.chapter + 1).padStart(2, '0'),
            }),
            (0, jsxRuntime.jsxs)('span', {
              children: [
                (0, jsxRuntime.jsx)('strong', { children: u.title }),
                (0, jsxRuntime.jsx)('small', {
                  children: m
                    ? c.chapter === 3
                      ? h < 12
                        ? 'Fleet arrives Day 12'
                        : 'Fleet on its way'
                      : `Complete & continue \xB7 +${u.reward} gold`
                    : (() => {
                        let L = d.find((N) => !N.done);
                        return L
                          ? `${L.label}${L.target > 1 ? ` \xB7 ${Math.min(L.value, L.target)}/${L.target}` : ''}`
                          : '';
                      })(),
                }),
              ],
            }),
            m && c.chapter !== 3
              ? (0, jsxRuntime.jsx)(Er, { size: 22 })
              : (0, jsxRuntime.jsx)(qn, { size: 20 }),
          ],
        }),
      c.mode === 'campaign' &&
        c.started &&
        (0, jsxRuntime.jsxs)('section', {
          className: 'chapter-panel',
          'aria-label': 'Expedition objectives',
          children: [
            (0, jsxRuntime.jsxs)('button', {
              className: 'chapter-top',
              onClick: () => {
                (w(null), n(!0));
              },
              children: [
                (0, jsxRuntime.jsx)('span', {
                  children: v
                    ? `COUNCIL COMMISSION ${c.chapter - CHAPTERS.length + 1}`
                    : `CHAPTER ${String(c.chapter + 1).padStart(2, '0')} / ${CHAPTERS.length}`,
                }),
                (0, jsxRuntime.jsx)(Ql, { size: 17 }),
              ],
            }),
            (0, jsxRuntime.jsx)(Character, { person: V, className: 'chapter-portrait' }),
            (0, jsxRuntime.jsx)('h2', { children: u.title }),
            (0, jsxRuntime.jsx)('div', {
              className: 'chapter-meter',
              role: 'progressbar',
              'aria-label': 'Chapter progress',
              'aria-valuenow': b,
              'aria-valuemin': 0,
              'aria-valuemax': 100,
              children: (0, jsxRuntime.jsx)('span', { style: { width: `${b}%` } }),
            }),
            (0, jsxRuntime.jsxs)('button', {
              className: 'mobile-objective',
              onClick: () => (m && c.chapter !== 3 ? E() : n(!0)),
              children: [
                m
                  ? c.chapter === 3
                    ? 'Ready for the next passage'
                    : 'Complete chapter \xB7 claim reward'
                  : `Next: ${d.find((L) => !L.done)?.label}`,
                (0, jsxRuntime.jsx)(qn, { size: 14 }),
              ],
            }),
            (0, jsxRuntime.jsx)('ul', {
              className: 'compact-objectives',
              children: d
                .slice(0, 3)
                .map((L) =>
                  (0, jsxRuntime.jsxs)(
                    'li',
                    {
                      className: L.done ? 'done' : '',
                      children: [
                        L.done
                          ? (0, jsxRuntime.jsx)(Er, { size: 13 })
                          : (0, jsxRuntime.jsx)('span', { className: 'objective-mark' }),
                        (0, jsxRuntime.jsx)('span', { children: L.label }),
                        (0, jsxRuntime.jsxs)('b', { children: [L.value, '/', L.target] }),
                      ],
                    },
                    L.label,
                  ),
                ),
            }),
            (0, jsxRuntime.jsx)('div', {
              className: 'chapter-action',
              children:
                c.chapter !== 3 && m
                  ? (0, jsxRuntime.jsxs)('button', {
                      className: 'chapter-claim',
                      onClick: E,
                      children: [
                        'Complete chapter ',
                        (0, jsxRuntime.jsxs)('span', {
                          children: ['+', u.reward, ' ', (0, jsxRuntime.jsx)(Nr, { size: 13 })],
                        }),
                      ],
                    })
                  : (0, jsxRuntime.jsxs)('button', {
                      onClick: () => n(!0),
                      children: [
                        Z.length ? 'Goals & deliveries' : 'Expedition journal',
                        (0, jsxRuntime.jsx)(qn, { size: 15 }),
                      ],
                    }),
            }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'convoy-clock',
              children: [
                (0, jsxRuntime.jsx)(Ad, { size: 16 }),
                (0, jsxRuntime.jsx)('span', {
                  children: c.settled
                    ? `${c.population} settlers \xB7 ${ACTS[p].title}`
                    : `First fleet \xB7 Day ${c.convoyDay}`,
                }),
                !c.settled &&
                  (0, jsxRuntime.jsxs)('b', { children: [Math.max(0, c.convoyDay - h), 'd left'] }),
              ],
            }),
          ],
        }),
      c.mode === 'campaign' &&
        !c.started &&
        (0, jsxRuntime.jsxs)('div', {
          className: 'title-lockup',
          'aria-hidden': 'true',
          children: [
            (0, jsxRuntime.jsx)(Emblem, { size: 84, plate: !0 }),
            (0, jsxRuntime.jsx)('strong', { children: 'Tideweald' }),
            (0, jsxRuntime.jsx)('span', { children: 'A Northern Covenant' }),
          ],
        }),
      c.mode === 'campaign' &&
        !c.started &&
        (0, jsxRuntime.jsxs)('section', {
          className: 'arrival-briefing',
          'aria-label': 'Expedition briefing',
          children: [
            (0, jsxRuntime.jsx)(Character, { className: 'briefing-portrait' }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'briefing-kicker',
              children: [
                (0, jsxRuntime.jsx)(Md, { size: 19 }),
                (0, jsxRuntime.jsx)('span', { children: 'TIDEWEALD \xB7 A 48-CHAPTER VOYAGE' }),
              ],
            }),
            (0, jsxRuntime.jsx)('h1', { children: 'A world worth staying for.' }),
            (0, jsxRuntime.jsxs)('p', {
              className: 'briefing-lead',
              children: [
                'A scattered fleet. A northern shore.',
                ' ',
                (0, jsxRuntime.jsx)('br', {}),
                'Bring your people home.',
              ],
            }),
            (0, jsxRuntime.jsx)('p', {
              children:
                'Inspired by the Norse crossing of 985, when twenty-five ships sailed west with Erik the Red and only fourteen arrived, your fictional fleet must build a new home. Reunite by Day 30, endure four seasons, guard the harbor, and forge a covenant across 48 chapters.',
            }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'briefing-forecast',
              children: [
                (0, jsxRuntime.jsxs)('span', {
                  children: [
                    (0, jsxRuntime.jsx)(Ad, { size: 18 }),
                    (0, jsxRuntime.jsx)('b', { children: '48 chapters' }),
                    (0, jsxRuntime.jsx)('small', { children: 'A growing story' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)('span', {
                  children: [
                    (0, jsxRuntime.jsx)(Md, { size: 18 }),
                    (0, jsxRuntime.jsx)('b', { children: 'Four seasons' }),
                    (0, jsxRuntime.jsx)('small', { children: 'Prepare. Protect. Thrive.' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)('span', {
                  children: [
                    (0, jsxRuntime.jsx)(Ql, { size: 18 }),
                    (0, jsxRuntime.jsx)('b', { children: 'A lasting haven' }),
                    (0, jsxRuntime.jsx)('small', { children: '160 settlers to welcome' }),
                  ],
                }),
              ],
            }),
            e &&
              (0, jsxRuntime.jsxs)('button', {
                className: 'begin-expedition resume-island',
                onClick: e.onResume,
                children: [e.label, ' ', (0, jsxRuntime.jsx)(qn, { size: 18 })],
              }),
            (0, jsxRuntime.jsxs)('button', {
              className: `begin-expedition ${e ? 'secondary-begin' : ''}`,
              onClick: o,
              children: [
                e ? 'Begin a new expedition' : 'Begin expedition',
                ' ',
                (0, jsxRuntime.jsx)(qn, { size: 18 }),
              ],
            }),
            (0, jsxRuntime.jsx)('button', {
              className: 'freebuild-link',
              onClick: A,
              children: 'Free build \xB7 all wonders unlocked',
            }),
            (0, jsxRuntime.jsx)('small', {
              className: 'briefing-note',
              children: 'Pause whenever you like. Fast-forward construction and the seasons.',
            }),
          ],
        }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: a,
        onOpenChange: n,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'journal-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, {
              className: 'journal-title',
              children: 'The northern covenant',
            }),
            (0, jsxRuntime.jsxs)(DialogDescription, {
              children: [
                'Expedition journal \xB7 Day ',
                h,
                ' \xB7 ',
                Math.min(CHAPTERS.length, c.completed.length),
                ' of ',
                CHAPTERS.length,
                ' chapters completed',
              ],
            }),
            c.mode === 'sandbox'
              ? (0, jsxRuntime.jsxs)('div', {
                  className: 'freebuild-journal',
                  children: [
                    (0, jsxRuntime.jsx)(Md, { size: 32 }),
                    (0, jsxRuntime.jsx)('h3', { children: 'Your island, at your pace.' }),
                    (0, jsxRuntime.jsx)('p', {
                      children:
                        'All nine wonders are available in Build \u2192 Wonders. Each requires gold, food, timber, and stone. Build an economy, shape the land, and control the weather. A new island begins the 48-chapter expedition.',
                    }),
                  ],
                })
              : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                  children: [
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'journal-next',
                      children: [
                        (0, jsxRuntime.jsxs)('strong', {
                          children: ['Chapter ', c.chapter + 1, ' \xB7 ', u.title],
                        }),
                        m && c.chapter !== 3
                          ? (0, jsxRuntime.jsxs)('button', {
                              className: 'journal-primary',
                              onClick: E,
                              children: ['Complete & continue \xB7 +', u.reward, ' gold'],
                            })
                          : (0, jsxRuntime.jsx)('span', {
                              children: m
                                ? h < 12
                                  ? 'Ready: the fleet arrives on Day 12'
                                  : 'Ready: the fleet is on its way'
                                : `Next: ${d.find((L) => !L.done)?.label}`,
                            }),
                      ],
                    }),
                    y !== p
                      ? (0, jsxRuntime.jsxs)('div', {
                          className: 'future-chapters',
                          children: [
                            CHAPTERS.slice(y * 4, y * 4 + 4).map((L, N) =>
                              (0, jsxRuntime.jsxs)(
                                'article',
                                {
                                  children: [
                                    (0, jsxRuntime.jsxs)('span', { children: ['CHAPTER ', y * 4 + N + 1] }),
                                    (0, jsxRuntime.jsx)('h3', { children: L.title }),
                                    (0, jsxRuntime.jsx)('p', { children: L.text }),
                                    hf
                                      .filter((O) => O.unlock === y * 4 + N)
                                      .map((O) =>
                                        (0, jsxRuntime.jsxs)(
                                          'small',
                                          { children: ['Unlocks: ', O.name] },
                                          O.id,
                                        ),
                                      ),
                                  ],
                                },
                                L.title,
                              ),
                            ),
                            (0, jsxRuntime.jsx)('button', {
                              className: 'journal-primary',
                              onClick: () => w(null),
                              children: 'Return to current chapter',
                            }),
                          ],
                        })
                      : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                          children: [
                            (0, jsxRuntime.jsxs)('div', {
                              className: 'journal-letter',
                              children: [
                                (0, jsxRuntime.jsx)(Character, { person: V, className: 'letter-portrait' }),
                                (0, jsxRuntime.jsx)('span', { children: u.voice }),
                                (0, jsxRuntime.jsx)('h3', { children: u.title }),
                                (0, jsxRuntime.jsx)('p', { children: u.text }),
                              ],
                            }),
                            T &&
                              !C &&
                              (0, jsxRuntime.jsxs)('section', {
                                className: 'council-decision',
                                'aria-label': 'Council decision',
                                children: [
                                  (0, jsxRuntime.jsxs)('span', {
                                    className: 'eyebrow',
                                    children: ['THE COUNCIL MUST DECIDE \xB7 ', T.voice.toUpperCase()],
                                  }),
                                  (0, jsxRuntime.jsx)('h3', { children: T.title }),
                                  (0, jsxRuntime.jsx)('p', { children: T.prompt }),
                                  (0, jsxRuntime.jsx)('div', {
                                    className: 'council-options',
                                    role: 'radiogroup',
                                    'aria-label': T.title,
                                    children: ['a', 'b'].map((L) =>
                                      (0, jsxRuntime.jsxs)(
                                        'button',
                                        {
                                          role: 'radio',
                                          'aria-checked': k === L,
                                          className: k === L ? 'chosen' : '',
                                          onClick: () => x(L),
                                          children: [
                                            (0, jsxRuntime.jsx)('b', { children: T.options[L].title }),
                                            (0, jsxRuntime.jsx)('small', { children: T.options[L].effect }),
                                          ],
                                        },
                                        L,
                                      ),
                                    ),
                                  }),
                                  (0, jsxRuntime.jsx)('button', {
                                    className: 'journal-primary',
                                    disabled: !k,
                                    onClick: () => {
                                      k && decide(t, T.id, k) && (x(null), r());
                                    },
                                    children: k ? `Decide: ${T.options[k].title}` : 'Choose one path',
                                  }),
                                  (0, jsxRuntime.jsx)('small', {
                                    className: 'council-note',
                                    children: 'This choice is permanent for this island.',
                                  }),
                                ],
                              }),
                            (0, jsxRuntime.jsx)('ul', {
                              className: 'journal-objectives',
                              children: d.map((L) =>
                                (0, jsxRuntime.jsxs)(
                                  'li',
                                  {
                                    className: L.done ? 'done' : '',
                                    children: [
                                      (0, jsxRuntime.jsxs)('span', {
                                        children: [
                                          L.done
                                            ? (0, jsxRuntime.jsx)(Er, { size: 16 })
                                            : (0, jsxRuntime.jsx)('span', { className: 'objective-mark' }),
                                          L.label,
                                        ],
                                      }),
                                      (0, jsxRuntime.jsxs)('b', { children: [L.value, ' / ', L.target] }),
                                    ],
                                  },
                                  L.label,
                                ),
                              ),
                            }),
                            (0, jsxRuntime.jsx)('p', {
                              className: 'journal-hint',
                              children:
                                T && C
                                  ? u.hint
                                      .replace(/^[^.]*\bjournal\b[^.]*\.\s*/i, '')
                                      .replace(/^Then (\w)/, (L, N) => N.toUpperCase())
                                  : u.hint,
                            }),
                            c.incident &&
                              (0, jsxRuntime.jsxs)('button', {
                                className: 'locate-spill',
                                onClick: () => {
                                  (s(c.incident), n(!1));
                                },
                                children: [(0, jsxRuntime.jsx)(I0, { size: 17 }), 'Locate spill on island'],
                              }),
                            Z.length > 0 &&
                              (0, jsxRuntime.jsxs)('div', {
                                className: 'harbor-reserves',
                                children: [
                                  (0, jsxRuntime.jsxs)('p', {
                                    children: [
                                      (0, jsxRuntime.jsx)(X4, { size: 17 }),
                                      ' Deliver collected supplies. Each chapter requires a new shipment.',
                                    ],
                                  }),
                                  (0, jsxRuntime.jsx)('div', {
                                    children: Z.map(([L, N]) =>
                                      (0, jsxRuntime.jsxs)(
                                        'span',
                                        {
                                          children: [
                                            (0, jsxRuntime.jsxs)('b', {
                                              children: [c.reserves[L], ' / ', N],
                                            }),
                                            L,
                                            (0, jsxRuntime.jsxs)('small', {
                                              children: [Math.floor(t.wallet[L]), ' available'],
                                            }),
                                          ],
                                        },
                                        L,
                                      ),
                                    ),
                                  }),
                                  (0, jsxRuntime.jsx)('button', {
                                    className: 'journal-primary',
                                    disabled: !Z.some(([L, N]) => t.wallet[L] >= 1 && c.reserves[L] < N),
                                    onClick: () => {
                                      (stockHarbor(t), r());
                                    },
                                    children: 'Deliver available supplies',
                                  }),
                                ],
                              }),
                            (0, jsxRuntime.jsxs)('div', {
                              className: 'journal-buttons',
                              children: [
                                c.chapter !== 3
                                  ? (0, jsxRuntime.jsxs)('button', {
                                      className: 'journal-primary',
                                      disabled: !m,
                                      onClick: E,
                                      children: ['Complete chapter \xB7 +', u.reward, ' gold'],
                                    })
                                  : (0, jsxRuntime.jsx)('p', {
                                      children: m
                                        ? `Ready. The ship arrives ${h < 12 ? 'on Day 12' : 'within the day'}.`
                                        : 'Prepare the reserves, longhouses, and forest for the next passage.',
                                    }),
                                (0, jsxRuntime.jsx)('button', {
                                  onClick: () => {
                                    (n(!1), l());
                                  },
                                  children: 'Open Build',
                                }),
                              ],
                            }),
                          ],
                        }),
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'journal-status',
                      children: [
                        (0, jsxRuntime.jsx)(Ad, { size: 22 }),
                        (0, jsxRuntime.jsxs)('div', {
                          children: [
                            (0, jsxRuntime.jsx)('strong', {
                              children: v
                                ? 'The charter is fulfilled'
                                : c.settled
                                  ? `${c.population} settlers call Haven home`
                                  : `First passage: Day ${c.convoyDay}`,
                            }),
                            (0, jsxRuntime.jsx)('span', {
                              children: v
                                ? 'Keep growing with rotating council commissions.'
                                : c.settled
                                  ? 'Each age brings new arrivals, buildings, and responsibilities.'
                                  : c.missed
                                    ? 'The ship will try again. All your progress is safe.'
                                    : 'Prepare food, woodland, homes, and harbor reserves.',
                            }),
                          ],
                        }),
                        (0, jsxRuntime.jsx)('b', {
                          children: v ? '160' : `${c.chapter + 1}/${CHAPTERS.length}`,
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('div', {
                      className: 'age-selector',
                      role: 'group',
                      'aria-label': 'Campaign stages',
                      children: ACTS.map((L, N) =>
                        (0, jsxRuntime.jsxs)(
                          'button',
                          {
                            'aria-pressed': y === N,
                            className: y === N ? 'selected' : '',
                            onClick: () => w(N),
                            children: [
                              (0, jsxRuntime.jsxs)('small', { children: ['AGE ', N + 1] }),
                              (0, jsxRuntime.jsx)('strong', { children: L.title }),
                              N > p && (0, jsxRuntime.jsx)(I4, { size: 13 }),
                            ],
                          },
                          L.title,
                        ),
                      ),
                    }),
                    (0, jsxRuntime.jsx)('p', { className: 'age-subtitle', children: ACTS[y].subtitle }),
                    (0, jsxRuntime.jsx)('div', {
                      className: 'chapter-timeline',
                      'aria-label': 'Story chapters',
                      children: CHAPTERS.slice(y * 4, y * 4 + 4).map((L, N) => {
                        let O = y * 4 + N;
                        return (0, jsxRuntime.jsxs)(
                          'div',
                          {
                            className: c.completed.includes(O)
                              ? 'finished'
                              : c.chapter === O
                                ? 'current'
                                : '',
                            children: [
                              (0, jsxRuntime.jsx)('span', {
                                children: c.completed.includes(O)
                                  ? (0, jsxRuntime.jsx)(Er, { size: 14 })
                                  : String(O + 1).padStart(2, '0'),
                              }),
                              (0, jsxRuntime.jsx)('b', { children: L.title }),
                            ],
                          },
                          L.title,
                        );
                      }),
                    }),
                    R.length > 0 &&
                      (0, jsxRuntime.jsxs)('details', {
                        className: 'forecast-details',
                        open: !!T && !!C,
                        children: [
                          (0, jsxRuntime.jsxs)('summary', {
                            children: ['Council decisions \xB7 ', R.length],
                          }),
                          R.map(({ d: L, info: N }) =>
                            (0, jsxRuntime.jsxs)(
                              'article',
                              {
                                children: [
                                  (0, jsxRuntime.jsxs)('small', { children: ['DAY ', L.day] }),
                                  (0, jsxRuntime.jsxs)('b', {
                                    children: [N.title, ': ', N.options[L.choice].title],
                                  }),
                                  (0, jsxRuntime.jsx)('p', { children: N.options[L.choice].effect }),
                                ],
                              },
                              L.id,
                            ),
                          ),
                        ],
                      }),
                    (0, jsxRuntime.jsxs)('details', {
                      className: 'forecast-details',
                      children: [
                        (0, jsxRuntime.jsx)('summary', { children: 'Weather & expedition log' }),
                        (0, jsxRuntime.jsx)('p', {
                          children:
                            'Every season lasts 12 island days: spring rain, summer dry spells, autumn leaves and winter snow. After the first arrival, food, guard pay and winter fuel are consumed daily. Threats give at least three days of warning in Army & seasons. Chapters 18 and 22 still bring four-day weather challenges. A lighthouse reduces storm disruption. Missed fleet dates retry after three days without losing your island.',
                        }),
                        c.events
                          .slice(-12)
                          .reverse()
                          .map((L, N) =>
                            (0, jsxRuntime.jsxs)(
                              'article',
                              {
                                children: [
                                  (0, jsxRuntime.jsxs)('small', { children: ['DAY ', L.day] }),
                                  (0, jsxRuntime.jsx)('b', { children: L.title }),
                                  (0, jsxRuntime.jsx)('p', { children: L.text }),
                                ],
                              },
                              N,
                            ),
                          ),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('button', {
                      className: 'freebuild-link',
                      onClick: A,
                      children: 'Continue this island in Free build',
                    }),
                  ],
                }),
            (0, jsxRuntime.jsxs)('details', {
              className: 'forecast-details',
              children: [
                (0, jsxRuntime.jsx)('summary', { children: 'The real settlers behind the story' }),
                (0, jsxRuntime.jsxs)('p', {
                  children: [
                    'Around 985, Erik the Red led twenty-five ships from Iceland to settle Greenland; only fourteen are believed to have arrived. Norse settlers farmed barley and hay, kept sheep and cattle, fished and hunted seals, and traded wool and walrus ivory across the North Atlantic. Haven, its council, and the Red Sail rivals are fictional; the Renaissance music comes from a later age. ',
                    (0, jsxRuntime.jsx)('a', {
                      href: 'https://whc.unesco.org/en/list/1536',
                      target: '_blank',
                      rel: 'noreferrer',
                      children: 'Explore Norse Greenland (Kujataa) with UNESCO',
                    }),
                    '.',
                  ],
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('p', {
              className: 'journal-session-note',
              children:
                'Time pauses while you plan and returns to your previous speed when you close the journal. No purchase is needed to complete any chapter.',
            }),
          ],
        }),
      }),
    ],
  });
}

export { CampaignPanel };

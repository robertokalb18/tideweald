// Recovered from the Tideweald v16.11 build. Module: ui/orders-panel
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import {
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
  streakBonus,
} from '../progression/orders.js';
import { Er, Nr, P0, lv, q0 } from './icons.js';
import {
  Dialog,
  DialogDescription,
  DialogTitle,
  IslandDialogContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './kit.js';
import { CATALOG } from '../world/catalog.js';

var kT = [
  ['wildlife', 'Wildlife'],
  ['flora', 'Flora'],
  ['buildings', 'Buildings'],
  ['wonders', 'Wonders'],
];
function OrdersPanel({ world: e, open: t, onOpen: a, onChange: n, tab: r, onTab: o, visual: l }) {
  let [s, c] = (0, React.useState)('wildlife'),
    u = e.orders,
    d = dayOf(e),
    m = ordersUnlocked(e),
    h = u ? streakBonus(u) : 1,
    p = new Set(e.folio ?? []),
    g = folioProgress(e);
  return (0, jsxRuntime.jsx)(Dialog, {
    open: t,
    onOpenChange: a,
    children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
      className: 'orders-dialog',
      children: [
        (0, jsxRuntime.jsx)(DialogTitle, { children: 'Orders & folio' }),
        (0, jsxRuntime.jsxs)(DialogDescription, {
          children: ['Passing ships and patrons pay above market for goods and deeds \xB7 Day ', d],
        }),
        (0, jsxRuntime.jsxs)(Tabs, {
          value: r,
          onValueChange: o,
          children: [
            (0, jsxRuntime.jsxs)(TabsList, {
              className: 'market-tabs',
              children: [
                (0, jsxRuntime.jsxs)(TabsTrigger, {
                  value: 'orders',
                  children: [(0, jsxRuntime.jsx)(q0, { size: 15 }), 'Orders'],
                }),
                (0, jsxRuntime.jsxs)(TabsTrigger, {
                  value: 'folio',
                  children: [(0, jsxRuntime.jsx)(lv, { size: 15 }), 'Folio \xB7 ', g.have, '/', g.total],
                }),
              ],
            }),
            (0, jsxRuntime.jsx)(TabsContent, {
              value: 'orders',
              children: m
                ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                    children: [
                      (0, jsxRuntime.jsxs)('div', {
                        className: 'orders-streak',
                        'aria-label': `Seal streak ${u?.streak ?? 0}`,
                        children: [
                          Array.from({ length: Of }, (v, M) =>
                            (0, jsxRuntime.jsx)('i', { className: M < (u?.streak ?? 0) ? 'on' : '' }, M),
                          ),
                          (0, jsxRuntime.jsx)('span', {
                            children:
                              (u?.streak ?? 0) > 0
                                ? `Seal streak ${u.streak} \xB7 rewards +${Math.round((h - 1) * 100)}%`
                                : `Finish orders in a row for up to +${Math.round(Of * p2 * 100)}% pay`,
                          }),
                        ],
                      }),
                      (0, jsxRuntime.jsx)('ul', {
                        className: 'orders-list',
                        children: (u?.list ?? []).map((v) => {
                          let M = orderProgress(e, v),
                            w = v.due - d,
                            y = Math.round(v.reward * h),
                            k = CATALOG[v.target];
                          return (0, jsxRuntime.jsxs)(
                            'li',
                            {
                              className: `order-card ${M.ready ? 'ready' : ''}`,
                              children: [
                                k && v.kind !== 'deliver'
                                  ? (0, jsxRuntime.jsx)('span', { className: 'order-visual', children: l(k) })
                                  : (0, jsxRuntime.jsx)('span', {
                                      className: `order-visual order-goods goods-${v.target}`,
                                    }),
                                (0, jsxRuntime.jsxs)('div', {
                                  children: [
                                    (0, jsxRuntime.jsx)('small', { children: v.patron }),
                                    (0, jsxRuntime.jsx)('strong', { children: v.title }),
                                    (0, jsxRuntime.jsxs)('span', {
                                      className: 'order-need',
                                      children: [
                                        orderNeed(v),
                                        M.short
                                          ? (0, jsxRuntime.jsxs)('em', {
                                              className: 'order-short',
                                              children: [
                                                ' \xB7 keep ',
                                                v.amount.toLocaleString(),
                                                ' ',
                                                v.target,
                                                ' in store to hand over',
                                              ],
                                            })
                                          : null,
                                      ],
                                    }),
                                    (0, jsxRuntime.jsx)('span', {
                                      className: 'order-bar',
                                      'aria-hidden': 'true',
                                      children: (0, jsxRuntime.jsx)('i', {
                                        style: { width: `${Math.round((M.have / M.need) * 100)}%` },
                                      }),
                                    }),
                                    (0, jsxRuntime.jsxs)('span', {
                                      className: 'order-meta',
                                      children: [
                                        (0, jsxRuntime.jsxs)('span', {
                                          children: [M.have.toLocaleString(), ' / ', M.need.toLocaleString()],
                                        }),
                                        (0, jsxRuntime.jsxs)('span', {
                                          className: w <= 2 ? 'due-soon' : '',
                                          children: [
                                            (0, jsxRuntime.jsx)(P0, { size: 12 }),
                                            w <= 0 ? 'Last day' : `${w} days`,
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, jsxRuntime.jsxs)('button', {
                                  className: 'order-claim',
                                  disabled: !M.ready,
                                  onClick: () => {
                                    fulfilOrder(e, v.id) && n();
                                  },
                                  'aria-label': `${v.kind === 'deliver' ? 'Deliver' : 'Claim'} ${v.title} for ${y} gold`,
                                  children: [
                                    M.ready
                                      ? (0, jsxRuntime.jsx)(Er, { size: 15 })
                                      : (0, jsxRuntime.jsx)(Nr, { size: 15 }),
                                    (0, jsxRuntime.jsx)('span', {
                                      children: M.ready
                                        ? v.kind === 'deliver'
                                          ? 'Deliver'
                                          : 'Claim'
                                        : 'Reward',
                                    }),
                                    (0, jsxRuntime.jsxs)('b', { children: ['+', y.toLocaleString()] }),
                                  ],
                                }),
                              ],
                            },
                            v.id,
                          );
                        }),
                      }),
                      (0, jsxRuntime.jsxs)('p', {
                        className: 'orders-note',
                        children: [
                          'Orders count only what you harvest, build, settle or grow after they arrive, and pay about 1.6\xD7 the market for goods. When one expires the ship sails on; nothing is lost but the streak. ',
                          u ? `${u.done} completed so far.` : '',
                        ],
                      }),
                    ],
                  })
                : (0, jsxRuntime.jsx)('p', {
                    className: 'orders-empty',
                    children:
                      'The first ships call once Chapter 1 is complete. Build the foothold and bring in the harvest.',
                  }),
            }),
            (0, jsxRuntime.jsxs)(TabsContent, {
              value: 'folio',
              children: [
                (0, jsxRuntime.jsxs)('div', {
                  className: 'folio-head',
                  children: [
                    (0, jsxRuntime.jsx)('span', {
                      className: 'folio-meter',
                      'aria-hidden': 'true',
                      children: (0, jsxRuntime.jsx)('i', {
                        style: { width: `${(g.have / g.total) * 100}%` },
                      }),
                    }),
                    (0, jsxRuntime.jsxs)('span', {
                      children: [
                        g.have,
                        ' of ',
                        g.total,
                        ' leaves \xB7 ',
                        g.next ? `next purse at ${g.next.at} (${g.next.gold} gold)` : 'the folio is complete',
                      ],
                    }),
                  ],
                }),
                (0, jsxRuntime.jsx)('div', {
                  className: 'catalog-filters folio-sections',
                  role: 'group',
                  'aria-label': 'Folio sections',
                  children: kT.map(([v, M]) => {
                    let w = folioEntries().filter((y) => y.section === v);
                    return (0, jsxRuntime.jsxs)(
                      'button',
                      {
                        'aria-pressed': s === v,
                        onClick: () => c(v),
                        children: [M, ' ', w.filter((y) => p.has(y.item.id)).length, '/', w.length],
                      },
                      v,
                    );
                  }),
                }),
                (0, jsxRuntime.jsx)('ul', {
                  className: 'folio-grid',
                  children: folioEntries()
                    .filter((v) => v.section === s)
                    .map(({ item: v }) => {
                      let M = p.has(v.id);
                      return (0, jsxRuntime.jsxs)(
                        'li',
                        {
                          className: M ? 'recorded' : 'unknown',
                          title: M ? v.description : 'Not yet recorded. Add it or let it grow on the island.',
                          children: [l(v), (0, jsxRuntime.jsx)('span', { children: M ? v.name : '?' })],
                        },
                        v.id,
                      );
                    }),
                }),
                (0, jsxRuntime.jsxs)('p', {
                  className: 'orders-note',
                  children: [
                    'A leaf is filled the first time a living animal, a mature plant or a finished building exists on the island. Every ',
                    ORDER_LIMIT,
                    ' leaves the lawspeaker at the Althing sends a purse, and a larger one for the complete folio.',
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  });
}

export { OrdersPanel };

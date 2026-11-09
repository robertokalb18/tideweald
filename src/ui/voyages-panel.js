// Milestone 7: the Voyages tab of the market dialog.
import * as jsxRuntime from 'react/jsx-runtime';
import { ROUTES, ROUTE_BY_ID, cargoText, fleetSize, returnText, sendVoyage, voyageDays, voyageStatus } from '../economy/voyages.js';

const h = jsxRuntime.jsx,
  hs = jsxRuntime.jsxs;

export function VoyagesPanel({ world, onChange }) {
  const fleet = fleetSize(world),
    out = world.story.voyages ?? [];
  return hs('div', {
    className: 'voyages-panel ledger-panel',
    children: [
      h('h3', { children: fleet ? `Knarrs: ${fleet - out.length} in harbor, ${out.length} at sea` : 'No knarrs yet' }),
      h('p', {
        children:
          'Learn Knarr building (Lore, tier III) and finish a merchant harbor: each harbor can send one knarr at a time. The cargo leaves now; the knarr comes home with silver after the voyage.',
      }),
      ...out.map((v, i) =>
        h('p', { className: 'voyage-out', children: `At sea: ${ROUTE_BY_ID[v.route].name}, home on Day ${v.back}.` }, `out${i}`),
      ),
      ...ROUTES.map((r) => {
        const s = voyageStatus(world, r.id);
        return hs(
          'div',
          {
            className: 'trade-row lore-row',
            children: [
              hs('div', {
                children: [
                  h('b', { children: r.name }),
                  h('span', {
                    children: `${r.text} Takes ${cargoText(r)}; brings ${returnText(r)}; ${voyageDays(world, r)} days.`,
                  }),
                ],
              }),
              h('div', {
                className: 'trade-buttons',
                children: h('button', {
                  disabled: !s.ok,
                  'aria-label': `Send a knarr to ${r.name}: ${s.reason}`,
                  onClick: () => {
                    sendVoyage(world, r.id).ok && onChange?.(r);
                  },
                  children: s.ok ? ['Sail', h('small', { children: s.reason })] : h('small', { children: s.reason }),
                }),
              }),
            ],
          },
          r.id,
        );
      }),
    ],
  });
}

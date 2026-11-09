// Milestone 6: the Lore tab of the market dialog. Twelve crafts in three tiers.
import * as jsxRuntime from 'react/jsx-runtime';
import { LORE, learnLore, loreStatus } from '../progression/lore.js';

const h = jsxRuntime.jsx,
  hs = jsxRuntime.jsxs;

export function LorePanel({ world, onChange }) {
  const learned = world.story.lore?.length ?? 0;
  return hs('div', {
    className: 'lore-panel ledger-panel',
    children: [
      h('h3', { children: `Crafts learned: ${learned} of ${LORE.length}` }),
      h('p', {
        children:
          'Each craft is learned once and kept with the island. Tier II needs two tier I crafts; tier III needs two tier II crafts. Some need a finished building first.',
      }),
      ...[1, 2, 3].map((tier) =>
        hs(
          'section',
          {
            className: 'lore-tier',
            children: [
              h('h4', { children: ['Tier I', 'Tier II', 'Tier III'][tier - 1] }),
              ...LORE.filter((l) => l.tier === tier).map((l) => {
                const s = loreStatus(world, l.id);
                return hs(
                  'div',
                  {
                    className: 'trade-row lore-row' + (s.learned ? ' is-learned' : ''),
                    children: [
                      hs('div', {
                        children: [h('b', { children: l.name }), h('span', { children: l.text })],
                      }),
                      h('div', {
                        className: 'trade-buttons',
                        children: h('button', {
                          disabled: !s.ok,
                          'aria-label': s.learned ? `${l.name} learned` : `Learn ${l.name}: ${s.reason}`,
                          onClick: () => {
                            learnLore(world, l.id).ok && onChange?.(l);
                          },
                          children: s.learned ? 'Learned' : s.ok ? ['Learn', h('small', { children: s.reason })] : h('small', { children: s.reason }),
                        }),
                      }),
                    ],
                  },
                  l.id,
                );
              }),
            ],
          },
          tier,
        ),
      ),
    ],
  });
}

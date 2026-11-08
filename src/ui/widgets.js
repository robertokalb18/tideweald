// Recovered from the Tideweald v16.11 build. Module: ui/widgets
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { Nt } from '../audio/sfx.js';
import { WORKSHOPS } from '../economy/workshops.js';
import { buildingResource } from '../progression/campaign.js';
import { UI_SPRITE_RECTS } from '../render/sprite-rects.js';
import { spriteRect } from '../render/sprites.js';
import { atlasUrl } from '../render/tile-cache.js';
import { Emblem } from './character.js';
import {
  B4,
  Cd,
  D4,
  Ed,
  J4,
  K4,
  L4,
  N4,
  Nd,
  Nr,
  O4,
  P4,
  Q4,
  R4,
  Rd,
  S4,
  Sd,
  T4,
  V4,
  W0,
  W4,
  Yn,
  _4,
  as,
  av,
  cp,
  ev,
  fp,
  j4,
  lp,
  np,
  nv,
  qn,
  tv,
  up,
  w4,
} from './icons.js';
import { haptic } from './shell.js';
import { CATALOG, Ga, isBuilt, itemCost } from '../world/catalog.js';
import { announce } from '../world/world.js';

function LaunchScreen({ ready: e, status: t }) {
  let [a, n] = (0, React.useState)(!0),
    [r, o] = (0, React.useState)(!1),
    [l, s] = (0, React.useState)(!1);
  return (
    (0, React.useEffect)(() => {
      let c = setTimeout(() => s(!0), 650);
      return () => clearTimeout(c);
    }, []),
    (0, React.useEffect)(() => {
      if (!e || !l || r) return;
      let c = 0,
        u = requestAnimationFrame(() => {
          c = requestAnimationFrame(() => o(!0));
        });
      return () => {
        (cancelAnimationFrame(u), cancelAnimationFrame(c));
      };
    }, [e, l, r]),
    (0, React.useEffect)(() => {
      if (!r) return;
      let c = setTimeout(() => n(!1), reduce() ? 0 : 420);
      return () => clearTimeout(c);
    }, [r]),
    a
      ? (0, jsxRuntime.jsxs)('div', {
          className: `launch-screen ${r ? 'leaving' : ''}`,
          'aria-hidden': r,
          role: 'status',
          'aria-label': 'Loading Tideweald',
          children: [
            (0, jsxRuntime.jsx)('div', {
              className: 'launch-mark',
              children: (0, jsxRuntime.jsx)(Emblem, { size: 112, plate: !0 }),
            }),
            (0, jsxRuntime.jsx)('div', { className: 'launch-word', children: 'Tideweald' }),
            (0, jsxRuntime.jsx)('div', { className: 'launch-tag', children: 'A Northern Covenant' }),
            (0, jsxRuntime.jsx)('div', {
              className: 'launch-status',
              children: t ?? 'Charting the island\u2026',
            }),
          ],
        })
      : null
  );
}
function reduce() {
  try {
    return matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return !1;
  }
}
var MOTION_SCALE = 0.25;
function demolishQuote(e, t) {
  let a = e.buildings.find((s) => s.id === t);
  if (!a || !isBuilt(a)) return null;
  let n = CATALOG[a.kind];
  if (!n) return null;
  let r = itemCost(n),
    o = { gold: 0, food: 0, timber: 0, stone: 0 };
  for (let s of Object.keys(o)) o[s] = Math.floor((r[s] ?? 0) * MOTION_SCALE);
  let l = Math.floor(a.stored);
  return { building: a, name: n.name, refund: o, stored: l, resource: buildingResource(a.kind) };
}
function demolishBuilding(e, t) {
  let a = demolishQuote(e, t);
  if (!a) return !1;
  for (let n of Object.keys(a.refund)) e.wallet[n] += a.refund[n];
  return (
    (e.wallet[a.resource] += a.stored),
    (e.buildings = e.buildings.filter((n) => n.id !== t)),
    e.placements++,
    e.revision++,
    announce(
      e,
      `${a.name} dismantled. Salvaged ${
        Object.entries(a.refund)
          .filter(([, n]) => n > 0)
          .map(([n, r]) => `${r} ${n}`)
          .join(', ') || 'nothing'
      }${a.stored ? ` and ${a.stored} stored ${a.resource}` : ''}.`,
    ),
    !0
  );
}
var BASE_OUTPUT = {
  farm: { resource: 'food', amount: 40 },
  sawmill: { resource: 'timber', amount: 24 },
  quarry: { resource: 'stone', amount: 20 },
  fishery: { resource: 'food', amount: 30 },
  market: { resource: 'gold', amount: 2 },
  cottage: { resource: 'gold', amount: 0.8 },
};
function buildingFlows(e, t) {
  let a = WORKSHOPS[e],
    n = [],
    r = t ?? (a ? a.rate : (BASE_OUTPUT[e]?.amount ?? 0));
  r > 0 && n.push({ resource: a?.resource ?? BASE_OUTPUT[e]?.resource ?? buildingResource(e), amount: r });
  for (let [o, l] of Object.entries(a?.inputs ?? {})) l && n.push({ resource: o, amount: -l });
  return (e === 'guardhall' && n.push({ resource: 'gold', amount: 0 }), n.filter((o) => o.amount !== 0));
}
var qC = '\u2212',
  signed = (e, t = 0) => {
    let a =
      Math.abs(e) < 10 && t === 0 && Math.abs(e) % 1 > 0 ? Math.abs(e).toFixed(1) : Math.abs(e).toFixed(t);
    return `${e < 0 ? qC : '+'}${Number(a).toLocaleString(void 0, { maximumFractionDigits: 1 })}`;
  };
var YC = {
  coins: Nr,
  wheat: as,
  axe: w4,
  store: Ed,
  house: P4,
  route: Cd,
  droplet: lp,
  layers: W4,
  recycle: ev,
  waves: fp,
  sand: fp,
  mountain: V4,
  sprout: up,
  clover: N4,
  flower: B4,
  tree: nv,
  pine: av,
  leaf: W0,
  cherry: T4,
  mushroom: up,
  rabbit: Q4,
  paw: K4,
  bird: S4,
  fish: _4,
  butterfly: np,
  bee: np,
  oil: lp,
  fuel: j4,
  radiation: J4,
  flask: L4,
  trash: tv,
  flame: O4,
  sparkles: cp,
  shield: Yn,
  eraser: D4,
  sun: Nd,
  rain: Sd,
  storm: R4,
  snow: Rd,
};
function Icon({ name: e, size: t = 20 }) {
  let a = YC[e] ?? W0;
  return (0, jsxRuntime.jsx)(a, { size: t, strokeWidth: 1.7, 'aria-hidden': 'true' });
}
function ItemVisual({ item: e }) {
  if (e.sprite === void 0)
    return (0, jsxRuntime.jsx)('span', {
      className: 'material-icon',
      style: { color: e.color },
      children: (0, jsxRuntime.jsx)(Icon, { name: e.icon, size: 31 }),
    });
  let t = e.atlas ?? 'flora',
    a = spriteRect(t, e.sprite),
    n = UI_SPRITE_RECTS[t]?.[e.sprite],
    r = n ? { ...a, x: n[0], y: n[1], w: n[2], h: n[3] } : a,
    o = Math.max(r.w, r.h);
  return (0, jsxRuntime.jsx)('span', {
    className: 'item-sprite-frame',
    children: (0, jsxRuntime.jsx)('span', {
      className: 'atlas-sprite',
      style: {
        width: `${(r.w / o) * 100}%`,
        height: `${(r.h / o) * 100}%`,
        backgroundImage: `url('${atlasUrl(t)}')`,
        backgroundSize: `${(r.iw / r.w) * 100}% ${(r.ih / r.h) * 100}%`,
        backgroundPosition: `${(r.x / (r.iw - r.w)) * 100}% ${(r.y / (r.ih - r.h)) * 100}%`,
      },
    }),
  });
}
function Flows({ flows: e, perDay: t = !0 }) {
  return e.length
    ? (0, jsxRuntime.jsx)('span', {
        className: 'flows',
        children: e.map((a, n) =>
          (0, jsxRuntime.jsxs)(
            'span',
            {
              className: `delta ${a.amount < 0 ? 'loss' : 'gain'}`,
              children: [
                signed(a.amount),
                ' ',
                Ga.find((r) => r.id === a.resource)?.name.toLowerCase(),
                t ? '/day' : '',
              ],
            },
            n,
          ),
        ),
      })
    : null;
}
function Row({ icon: e, tone: t, label: a, sub: n, onClick: r, danger: o }) {
  return (0, jsxRuntime.jsxs)('button', {
    className: `list-row ${o ? 'danger' : ''}`,
    onClick: () => {
      (haptic(), Nt.tap(), r());
    },
    children: [
      (0, jsxRuntime.jsx)('span', {
        className: `row-icon tone-${t}`,
        children: (0, jsxRuntime.jsx)(e, { size: 17, strokeWidth: 2 }),
      }),
      (0, jsxRuntime.jsxs)('span', {
        className: 'row-text',
        children: [
          (0, jsxRuntime.jsx)('b', { children: a }),
          n && (0, jsxRuntime.jsx)('small', { children: n }),
        ],
      }),
      (0, jsxRuntime.jsx)(qn, { size: 17, className: 'row-chevron' }),
    ],
  });
}
var buildTime = (e) => (e < 1 ? `${Math.round(e * 24)} h` : `${e} ${e === 1 ? 'day' : 'days'}`),
  localFlag = (e) => {
    try {
      return localStorage.getItem('tw-flag-' + e) === '1';
    } catch {
      return !1;
    }
  },
  setLocalFlag = (e) => {
    try {
      localStorage.setItem('tw-flag-' + e, '1');
    } catch {}
  };

export {
  Flows,
  Icon,
  ItemVisual,
  LaunchScreen,
  Row,
  buildTime,
  buildingFlows,
  demolishBuilding,
  demolishQuote,
  localFlag,
  setLocalFlag,
  signed,
};

// Recovered from the Tideweald v16.11 build. Module: ui/island-canvas
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { renderIsland } from '../render/scene.js';
import { ATLASES, artStyle, atlasUrl, onArtStyle } from '../render/tile-cache.js';
import { TILE_H, TILE_W, project, unproject } from '../render/world-draw.js';
import { onSettings, settings } from './settings.js';
import { GRID_H, GRID_W, HAVEN, Hr } from '../world/catalog.js';
import { cellAt } from '../world/world.js';

var cT = (0, React.forwardRef)(function (
    {
      orientation: t,
      paused: a,
      speed: n = 1,
      world: r,
      previewPoint: o,
      selected: l,
      inspected: s,
      mapOpen: c,
      onPlace: u,
      onInspect: d,
      onZoom: m,
    },
    h,
  ) {
    let p = (0, React.useRef)(null),
      g = (0, React.useRef)(null),
      v = (0, React.useRef)({ x: 0, y: 0, zoom: 1 }),
      M = (0, React.useRef)(null),
      w = (0, React.useRef)({
        speed: n,
        orientation: t,
        paused: a,
        selected: l,
        inspected: s,
        previewPoint: o,
        mapOpen: c,
        onPlace: u,
        onInspect: d,
        onZoom: m,
      });
    w.current = {
      speed: n,
      orientation: t,
      paused: a,
      selected: l,
      inspected: s,
      previewPoint: o,
      mapOpen: c,
      onPlace: u,
      onInspect: d,
      onZoom: m,
    };
    let y = (0, React.useRef)({ width: 0, height: 0 }),
      k = (0, React.useRef)(new Map()),
      x = (0, React.useRef)({
        x: 0,
        y: 0,
        startX: 0,
        startY: 0,
        moved: !1,
        pinch: 0,
        multi: !1,
        painted: new Set(),
        lastPaint: null,
      }),
      T = (N, O = 0.51) => {
        let z = project(N.x, N.y);
        ((v.current.x = y.current.width * 0.5 - z.x * v.current.zoom),
          (v.current.y = y.current.height * O - z.y * v.current.zoom));
      },
      C = (0, React.useRef)(!1),
      R = (N, O) => {
        let z = project(N.x, N.y);
        v.current.y + z.y * v.current.zoom > y.current.height * (O + 0.15) && T(N, O);
      },
      b = () => {
        ((v.current.zoom = y.current.width < 760 ? 0.8 : 0.95),
          T(r.current.buildings[0] ?? HAVEN),
          w.current.onZoom(v.current.zoom));
      },
      A = () => {
        let { width: N, height: O } = y.current;
        ((v.current = {
          x: N * 0.5,
          y: O * 0.51,
          zoom: Math.max(
            0.02,
            Math.min(
              (N - 60) / (((GRID_W + GRID_H) * TILE_W) / 2),
              (O - 30) / (((GRID_W + GRID_H) * TILE_H) / 2),
              0.65,
            ),
          ),
        }),
          w.current.onZoom(v.current.zoom));
      },
      E = (N, O = y.current.width / 2, z = y.current.height / 2) => {
        let U = v.current,
          Y = Math.max(0.02, Math.min(2.5, U.zoom * N)),
          W = Y / U.zoom;
        ((U.x = O - (O - U.x) * W), (U.y = z - (z - U.y) * W), (U.zoom = Y), Z());
      },
      V = (0, React.useRef)({ timer: 0, last: 0 }),
      Z = () => {
        let N = V.current;
        if (N.timer) return;
        let O = () => {
            ((N.timer = 0),
              (N.last = performance.now()),
              w.current.onZoom(Math.round(v.current.zoom * 100) / 100));
          },
          z = Math.max(0, 150 - (performance.now() - N.last));
        N.timer = setTimeout(O, z);
      };
    (0, React.useEffect)(() => () => clearTimeout(V.current.timer || void 0), []);
    let L = (N, O) => {
      let z = p.current?.getBoundingClientRect();
      if (
        !z ||
        N < z.left ||
        O < z.top ||
        N > z.right ||
        O > z.bottom ||
        document.elementFromPoint(N, O) !== p.current
      )
        return null;
      let U = unproject(N - z.left, O - z.top, v.current),
        Y = cellAt(r.current, U.x, U.y)?.elevation ?? 0;
      return Y ? unproject(N - z.left, O - z.top + Y * v.current.zoom, v.current) : U;
    };
    return (
      (0, React.useImperativeHandle)(h, () => ({
        pointAt: L,
        fit: A,
        home: b,
        homeIfIdle: () => {
          !C.current && y.current.width && b();
        },
        focus: T,
        reveal: R,
        zoom: E,
        hover: (N) => {
          M.current = N;
        },
      })),
      (0, React.useEffect)(() => {
        let N = p.current;
        if (!N) return;
        let O = N.getContext('2d', { alpha: !1 });
        if (!O) return;
        let z = {},
          U = artStyle(),
          Y = !0,
          W = (J, X, be) => {
            let je = new Image();
            ((je.decoding = 'async'),
              (je.onload = () => {
                !Y || X !== U || ((z[J] = je), (Ae = !0));
              }),
              (je.onerror = () => {
                Y &&
                  X === U &&
                  setTimeout(() => {
                    Y && X === U && !(z[J]?.complete && z[J].src.includes(`/${X}/`)) && W(J, X, !1);
                  }, 5e3);
              }),
              (je.src = atlasUrl(J, X)),
              (be || !z[J]) && (z[J] = je));
          },
          j = (J = !1) => {
            for (let X of Object.keys(ATLASES)) X === 'roads' || X === 'trees' || W(X, U, J);
          },
          Ae = !0;
        j(!0);
        let Xe = onArtStyle((J) => {
            ((U = J), j(), (Ae = !0));
          }),
          Fe = onSettings(() => {
            Ae = !0;
            let J = N.getBoundingClientRect(),
              X = Math.min(devicePixelRatio || 1, settings().batterySaver ? 1 : 1.5);
            Math.round(J.width * X) !== N.width &&
              ((N.width = J.width * X), (N.height = J.height * X), O.setTransform(X, 0, 0, X, 0, 0));
          }),
          ct = new ResizeObserver(() => {
            let J = N.getBoundingClientRect(),
              X = Math.min(devicePixelRatio || 1, settings().batterySaver ? 1 : 1.5),
              be = !y.current.width,
              je = y.current;
            (k.current.clear(),
              (x.current.moved = !0),
              (x.current.multi = !1),
              (y.current = { width: J.width, height: J.height }),
              (N.width = J.width * X),
              (N.height = J.height * X),
              O.setTransform(X, 0, 0, X, 0, 0),
              be && J.width > 0
                ? C.current ||
                  ((v.current.zoom = J.width < 760 ? 0.7 : 0.72), T(HAVEN), w.current.onZoom(v.current.zoom))
                : J.width
                  ? ((v.current.x += (J.width - je.width) / 2),
                    (v.current.y += (J.height - je.height) / 2),
                    w.current.previewPoint && T(w.current.previewPoint))
                  : (y.current = { width: 0, height: 0 }));
          });
        ct.observe(N);
        let at = window.matchMedia('(prefers-reduced-motion: reduce)'),
          qe = 0,
          le = 0,
          de = 0,
          re = '',
          Ue = !0,
          Be = !0,
          Je = '',
          Ft = matchMedia('(pointer: coarse)'),
          P = (J) => {
            if (((qe = requestAnimationFrame(P)), document.hidden)) return;
            if (globalThis.__twDebug) globalThis.__tw = { w: r.current, cam: v.current };
            let X = w.current,
              be = v.current,
              je = settings(),
              zt = `${r.current.islandId}|${r.current.cells.length}|${be.x.toFixed(2)}|${be.y.toFixed(2)}|${be.zoom.toFixed(4)}|${y.current.width}x${y.current.height}|${r.current.revision}|${r.current.placements}|${X.selected}|${X.paused}|${X.orientation}|${JSON.stringify(X.previewPoint ?? M.current)}|${JSON.stringify(X.inspected)}|${U}|${X.mapOpen}`,
              vt = zt !== re || Ae,
              nt = at.matches || je.reducedMotion,
              Pe = je.batterySaver ? 33 : nt ? 80 : Ft.matches ? 33 : 14,
              ut = `${be.x.toFixed(1)}|${be.y.toFixed(1)}|${be.zoom.toFixed(3)}`;
            if (
              (X.speed >= 100 && ut === Je && J - le < 120) ||
              ((Je = ut), !vt && !Ue && !(Be && !X.paused)) ||
              (!vt && !Ue && J - le < Pe) ||
              (vt && J - le < (je.batterySaver ? 33 : 8))
            )
              return;
            if (((re = zt), (Ae = !1), (le = J), !r.current.cells.length)) {
              ((O.fillStyle = U === 'carta' ? '#9dbdb0' : '#153a38'),
                O.fillRect(0, 0, y.current.width, y.current.height),
                (Ue = !1),
                (Be = !1));
              return;
            }
            let et = renderIsland(
              O,
              r.current,
              be,
              y.current.width,
              y.current.height,
              nt ? 0 : J,
              z,
              X.previewPoint ?? M.current,
              X.selected,
              X.inspected,
              X.paused,
              X.orientation,
              {
                style: U,
                statusIcons: je.statusIcons,
                accessibleMarkers: je.accessibleMarkers,
                budgetMs: je.batterySaver ? 5 : 7,
                timeScale: X.speed,
              },
            );
            ((Ue = et.pending),
              (Be = et.animating || (!X.paused && !nt)),
              (X.mapOpen || y.current.width > 1e3) &&
                J - de > 1200 &&
                (drawMinimap(g.current, r.current, be, y.current.width, y.current.height, U), (de = J)));
          };
        qe = requestAnimationFrame(P);
        let Re = (J) => {
          (J.preventDefault(), (C.current = !0));
          let X = N.getBoundingClientRect();
          E(Math.exp(-J.deltaY * 0.0015), J.clientX - X.left, J.clientY - X.top);
        };
        return (
          N.addEventListener('wheel', Re, { passive: !1 }),
          () => {
            ((Y = !1),
              ct.disconnect(),
              cancelAnimationFrame(qe),
              N.removeEventListener('wheel', Re),
              Xe(),
              Fe());
          }
        );
      }, [r]),
      (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
        children: [
          (0, jsxRuntime.jsx)('canvas', {
            ref: p,
            className: `island-canvas ${l ? 'placing' : ''}`,
            'aria-label':
              'Island sandbox. Drag to explore, scroll or pinch to zoom. With a supply selected, tap to position then confirm Build here. Arrow keys move the cursor; Enter places or inspects.',
            tabIndex: 0,
            onPointerDown: (N) => {
              (N.currentTarget.setPointerCapture(N.pointerId),
                k.current.set(N.pointerId, { x: N.clientX, y: N.clientY }));
              let O = x.current;
              if (
                ((O.x = N.clientX),
                (O.y = N.clientY),
                (O.startX = N.clientX),
                (O.startY = N.clientY),
                (O.moved = !1),
                O.painted.clear(),
                (O.lastPaint = L(N.clientX, N.clientY)),
                (O.multi = k.current.size > 1),
                O.multi)
              ) {
                let [z, U] = Array.from(k.current.values());
                O.pinch = Math.hypot(z.x - U.x, z.y - U.y);
              }
            },
            onPointerMove: (N) => {
              let O = x.current;
              if (((M.current = L(N.clientX, N.clientY)), !!k.current.has(N.pointerId))) {
                if ((k.current.set(N.pointerId, { x: N.clientX, y: N.clientY }), k.current.size > 1)) {
                  let [z, U] = Array.from(k.current.values()),
                    Y = Math.hypot(z.x - U.x, z.y - U.y),
                    W = N.currentTarget.getBoundingClientRect();
                  (O.pinch &&
                    (E(Y / O.pinch, (z.x + U.x) / 2 - W.left, (z.y + U.y) / 2 - W.top), (C.current = !0)),
                    (O.pinch = Y),
                    (O.moved = !0),
                    (O.multi = !0));
                  return;
                }
                if ((Math.hypot(N.clientX - O.startX, N.clientY - O.startY) > 5 && (O.moved = !0), O.moved))
                  if (l && Hr.includes(l)) {
                    let z = L(N.clientX, N.clientY);
                    if (z) {
                      let U = O.lastPaint ?? z,
                        Y = Math.max(1, Math.ceil(Math.hypot(z.x - U.x, z.y - U.y) * 2));
                      for (let W = 0; W <= Y; W++) {
                        let j = Math.floor(U.x + ((z.x - U.x) * W) / Y),
                          Ae = Math.floor(U.y + ((z.y - U.y) * W) / Y),
                          Xe = `${j},${Ae}`;
                        O.painted.has(Xe) || (O.painted.add(Xe), u(l, j + 0.5, Ae + 0.5));
                      }
                      O.lastPaint = z;
                    }
                  } else
                    ((v.current.x += N.clientX - O.x), (v.current.y += N.clientY - O.y), (C.current = !0));
                ((O.x = N.clientX), (O.y = N.clientY));
              }
            },
            onPointerUp: (N) => {
              if (!k.current.has(N.pointerId)) return;
              let O = x.current;
              if ((k.current.delete(N.pointerId), !O.moved && !O.multi)) {
                let z = L(N.clientX, N.clientY);
                z && (l ? u(l, z.x, z.y) : d(z));
              }
              if (k.current.size === 1) {
                let z = Array.from(k.current.values())[0];
                ((O.x = z.x), (O.y = z.y), (O.startX = z.x), (O.startY = z.y), (O.moved = !0));
              }
              O.pinch = 0;
            },
            onPointerCancel: (N) => {
              (k.current.delete(N.pointerId), (x.current.moved = !0));
            },
            onContextMenu: (N) => N.preventDefault(),
            onPointerLeave: () => {
              k.current.size || (M.current = null);
            },
            onKeyDown: (N) => {
              if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(N.key)) {
                N.preventDefault();
                let O = M.current ?? { ...HAVEN };
                (N.key === 'ArrowLeft' && O.x--,
                  N.key === 'ArrowRight' && O.x++,
                  N.key === 'ArrowUp' && O.y--,
                  N.key === 'ArrowDown' && O.y++,
                  (O.x = Math.max(0.5, Math.min(GRID_W - 0.5, O.x))),
                  (O.y = Math.max(0.5, Math.min(GRID_H - 0.5, O.y))),
                  (M.current = O),
                  N.key === 'Enter' || N.key === ' '
                    ? l
                      ? u(l, O.x, O.y)
                      : cellAt(r.current, O.x, O.y)?.land && d(O)
                    : T(O));
              }
            },
          }),
          (0, jsxRuntime.jsxs)('aside', {
            className: 'world-map',
            'data-open': c,
            children: [
              (0, jsxRuntime.jsxs)('div', {
                children: [
                  (0, jsxRuntime.jsx)('span', { children: 'TIDEWEALD' }),
                  (0, jsxRuntime.jsxs)('span', { children: [GRID_W, ' \xD7 ', GRID_H] }),
                ],
              }),
              (0, jsxRuntime.jsx)('canvas', {
                ref: g,
                width: 420,
                height: 240,
                tabIndex: 0,
                role: 'button',
                'aria-label': 'Island map. Click to navigate; press Enter to return to your settlement.',
                onKeyDown: (N) => {
                  (N.key === 'Enter' || N.key === ' ') && (N.preventDefault(), b());
                },
                onPointerDown: (N) => {
                  let O = N.currentTarget.getBoundingClientRect(),
                    z = unproject(
                      ((N.clientX - O.left) * 420) / O.width,
                      ((N.clientY - O.top) * 240) / O.height,
                      va,
                    );
                  z.x >= 0 && z.x < GRID_W && z.y >= 0 && z.y < GRID_H && T(z);
                },
              }),
              (0, jsxRuntime.jsx)('div', {
                className: 'district-jumps',
                children: [
                  ['West', 83, 143],
                  ['North', 136, 78],
                  ['Birch', 268, 95],
                  ['East', 299, 213],
                  ['South', 159, 252],
                  ['Haven', HAVEN.x, HAVEN.y],
                ].map(([N, O, z]) =>
                  (0, jsxRuntime.jsx)(
                    'button',
                    {
                      onClick: () => {
                        (b(), T({ x: Number(O), y: Number(z) }));
                      },
                      children: N,
                    },
                    N,
                  ),
                ),
              }),
              (0, jsxRuntime.jsxs)('div', {
                className: 'map-caption',
                children: [
                  (0, jsxRuntime.jsxs)('span', {
                    children: [(0, jsxRuntime.jsx)('i', {}), 'Settlement \xB7 24-tile districts'],
                  }),
                  (0, jsxRuntime.jsx)('button', { onClick: b, children: 'Return home' }),
                ],
              }),
            ],
          }),
        ],
      })
    );
  }),
  i7 = cT,
  va = {
    x: 210,
    y: 118,
    zoom: Math.min(390 / (((GRID_W + GRID_H) * TILE_W) / 2), 218 / (((GRID_W + GRID_H) * TILE_H) / 2)),
  },
  o7 = new WeakMap();
function drawMinimap(e, t, a, n, r, o = 'carta') {
  let l = e?.getContext('2d');
  if (!l) return;
  let s = `${t.placements}/${t.plants.length}/${t.buildings.length}/${o}`,
    c = o === 'carta',
    u = o7.get(t);
  if (!u || u.stamp !== s) {
    let d = 1 / 0,
      m = -1 / 0,
      h = 1 / 0,
      p = -1 / 0;
    for (let x of t.cells)
      if (x.land) {
        let T = project(x.x, x.y);
        ((d = Math.min(d, T.x - TILE_W / 2)),
          (m = Math.max(m, T.x + TILE_W / 2)),
          (h = Math.min(h, T.y)),
          (p = Math.max(p, T.y + TILE_H)));
      }
    Number.isFinite(d) &&
      ((va.zoom = Math.min(390 / Math.max(1, m - d), 218 / Math.max(1, p - h))),
      (va.x = 210 - (d + m) * 0.5 * va.zoom),
      (va.y = 118 - (h + p) * 0.5 * va.zoom));
    let g = u?.canvas ?? document.createElement('canvas');
    ((g.width = 420), (g.height = 240));
    let v = g.getContext('2d');
    ((v.fillStyle = c ? '#9dbdb0' : '#132e3c'),
      v.fillRect(0, 0, 420, 240),
      v.save(),
      v.translate(va.x, va.y),
      v.scale(va.zoom, va.zoom));
    let M = document.createElement('canvas');
    ((M.width = GRID_W), (M.height = GRID_H));
    let w = M.getContext('2d'),
      y = w.createImageData(GRID_W, GRID_H);
    for (let x of t.cells) {
      if (!x.land) continue;
      let T = c
          ? x.pond
            ? [127, 176, 170]
            : x.rock
              ? [180, 173, 152]
              : x.toxicity + x.radiation > 0.3
                ? [171, 102, 80]
                : x.soil > 0.5
                  ? [164, 184, 114]
                  : [226, 208, 158]
          : x.pond
            ? [98, 169, 180]
            : x.rock
              ? [162, 169, 158]
              : x.toxicity + x.radiation > 0.3
                ? [171, 102, 80]
                : x.soil > 0.5
                  ? [105, 135, 79]
                  : [165, 156, 114],
        C = (x.y * GRID_W + x.x) * 4;
      ((y.data[C] = T[0]), (y.data[C + 1] = T[1]), (y.data[C + 2] = T[2]), (y.data[C + 3] = 255));
    }
    w.putImageData(y, 0, 0);
    let k = project(0, 0);
    (v.save(),
      v.transform(TILE_W / 2, TILE_H / 2, -TILE_W / 2, TILE_H / 2, k.x, k.y),
      (v.imageSmoothingEnabled = !1),
      v.drawImage(M, 0, 0),
      v.restore());
    for (let x of t.plants) {
      if (x.health <= 0) continue;
      let T = project(x.x, x.y);
      ((v.fillStyle = c ? '#4f6a3c' : '#375738'), v.fillRect(T.x - 10, T.y - 10, 20, 20));
    }
    for (let x of t.buildings) {
      let T = project(x.x, x.y);
      ((v.fillStyle = c ? '#b8452f' : '#ffe6a6'), v.fillRect(T.x - 22, T.y - 22, 44, 44));
    }
    ((v.strokeStyle = c ? 'rgba(43,33,24,.18)' : '#c9e4db38'), (v.lineWidth = 1 / va.zoom), v.beginPath());
    for (let x = 24; x < GRID_W; x += 24) {
      let T = project(x, 0),
        C = project(x, GRID_H);
      (v.moveTo(T.x, T.y), v.lineTo(C.x, C.y));
    }
    for (let x = 24; x < GRID_H; x += 24) {
      let T = project(0, x),
        C = project(GRID_W, x);
      (v.moveTo(T.x, T.y), v.lineTo(C.x, C.y));
    }
    (v.stroke(), v.restore(), (u = { canvas: g, stamp: s }), o7.set(t, u));
  }
  (l.drawImage(u.canvas, 0, 0),
    l.save(),
    l.translate(va.x, va.y),
    l.scale(va.zoom, va.zoom),
    (l.strokeStyle = o === 'carta' ? '#2b2118' : '#edf0d6'),
    (l.lineWidth = 1.5 / va.zoom),
    l.strokeRect(-a.x / a.zoom, -a.y / a.zoom, n / a.zoom, r / a.zoom),
    l.restore());
}

export { i7 };

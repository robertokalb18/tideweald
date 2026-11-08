// Recovered from the Tideweald v16.11 build. Module: ui/home
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { Nt, unlockSfx } from '../audio/sfx.js';
import { s7 } from '../audio/soundtrack.js';
import { advanceWorld } from '../core/simulation.js';
import {
  collectGoods,
  priceFactor,
  production,
  saleValue,
  tradeGoods,
  worldStats,
} from '../economy/production.js';
import { frontierActive } from '../military/frontier.js';
import { describeBackup, isNativeApp, nativePlatform, shareFile } from '../persistence/save.js';
import {
  CHAPTERS,
  beginCampaign,
  buildingResource,
  campaignObjectives,
  cancelConstruction,
  constructionRate,
  currentChapter,
  placementPreview,
  tradeMultiplier,
} from '../progression/campaign.js';
import {
  orderProgress,
  ordersUnlocked,
  readyOrders,
  updateFolio,
  updateOrders,
} from '../progression/orders.js';
import { artStyle, onArtStyle, setArtStyle } from '../render/tile-cache.js';
import { isBridge } from '../settlement/bridge-catalog.js';
import { bridgeAt, bridgeDays, removeBridge } from '../settlement/bridges.js';
import { addItem, setWeather } from '../settlement/tools.js';
import { CampaignPanel } from './campaign-panel.js';
import { Character, Emblem } from './character.js';
import {
  diaryClear,
  diaryEnabled,
  diaryExport,
  diaryLog,
  diaryNote,
  diarySession,
  diarySummary,
  diaryTick,
  onDiary,
  setDiaryEnabled,
} from './diary.js';
import { FrontierPanel, settlementLedger } from './frontier-panel.js';
import {
  $0,
  $4,
  C4,
  Cd,
  E4,
  Ed,
  Er,
  F4,
  G0,
  G4,
  H4,
  Jl,
  Nr,
  P0,
  Ql,
  Td,
  V0,
  Y4,
  Yn,
  Zn,
  as,
  cp,
  cv,
  es,
  hp,
  ip,
  q0,
  q4,
  qn,
  rp,
  rv,
  sp,
  sv,
  ts,
} from './icons.js';
import { i7 } from './island-canvas.js';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogDescription,
  DialogTitle,
  IslandDialogContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './kit.js';
import { OrdersPanel } from './orders-panel.js';
import { onSettings, settings, updateSettings } from './settings.js';
import { haptic, useAppShell } from './shell.js';
import { useIslandSave } from './use-island-save.js';
import {
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
} from './widgets.js';
import { locateArmy, raidLocation, rotateBuilding } from '../world/actors.js';
import {
  CATALOG_ITEMS,
  GRID_H,
  GRID_W,
  Ga,
  Hr,
  Ia,
  P6,
  Ur,
  buildRemaining,
  costLabel,
  isBuildingItem,
  isBuilt,
  itemCost,
  supplyBlocked,
} from '../world/catalog.js';
import { seasonAt } from '../world/seasons.js';
import { announce, cellAt, createWorld, emptyWorld } from '../world/world.js';

function Home() {
  (useAppShell(),
    (0, React.useEffect)(() => {
      let S = () => unlockSfx();
      return (
        document.addEventListener('pointerdown', S, { once: !0, capture: !0 }),
        () => document.removeEventListener('pointerdown', S, !0)
      );
    }, []));
  let [e] = (0, React.useState)(() => emptyWorld('campaign')),
    t = (0, React.useRef)(e),
    a = (0, React.useRef)(null),
    [n, r] = (0, React.useState)(() => worldStats(t.current)),
    [o, l] = (0, React.useState)(!1),
    [s, c] = (0, React.useState)('buildings'),
    [u, d] = (0, React.useState)(0),
    [m, h] = (0, React.useState)(8),
    [p, g] = (0, React.useState)(!1),
    [v, M] = (0, React.useState)('trade'),
    [w, y] = (0, React.useState)(0),
    [k, x] = (0, React.useState)('all'),
    T = (0, React.useRef)(0);
  T.current = w;
  let [C, R] = (0, React.useState)(null),
    [b, A] = (0, React.useState)(1),
    [E, V] = (0, React.useState)(!0),
    [Z, L] = (0, React.useState)('sun');
  (0, React.useEffect)(() => y(0), [C]);
  let [N, O] = (0, React.useState)(!1),
    [z, U] = (0, React.useState)(!1),
    [Y, W] = (0, React.useState)(null),
    [j, Ae] = (0, React.useState)(null),
    [Xe, Fe] = (0, React.useState)(!1),
    [ct, at] = (0, React.useState)('orders'),
    qe = (0, React.useRef)(0),
    le = (0, React.useRef)(-1),
    [de, re] = (0, React.useState)(!1),
    [Ue, Be] = (0, React.useState)(!1),
    [Je, Ft] = (0, React.useState)('all'),
    [P, Re] = (0, React.useState)(!1),
    [J, X] = (0, React.useState)(!1),
    [be, je] = (0, React.useState)(!1),
    [zt, vt] = (0, React.useState)(1),
    [nt, Pe] = (0, React.useState)(null),
    [ut, et] = (0, React.useState)(null),
    [Mn, Tn] = (0, React.useState)(
      'Drag an item onto the map. Gold is spent only when a placement succeeds.',
    ),
    [cn, Jf] = (0, React.useState)({ text: t.current.message, id: 0 }),
    [T9, C9] = (0, React.useState)(-1),
    [og, A9] = (0, React.useState)(null),
    [eh, ig] = (0, React.useState)({}),
    lg = (0, React.useRef)(null);
  lg.current = og;
  let Bc = (0, React.useRef)(null),
    sg = (0, React.useRef)(0),
    jc = (0, React.useRef)(-1),
    R9 = (0, React.useRef)(0),
    th = (0, React.useRef)(null),
    ah = (0, React.useRef)({ ready: !1, built: 0, threat: -1, chapter: 0, notice: 0, report: -1 }),
    [rl, nh] = (0, React.useState)(null),
    [E9, cg] = (0, React.useState)(!1),
    [ug, dg] = (0, React.useState)(''),
    [N9, fg] = (0, React.useState)(!1),
    [za, rh] = (0, React.useState)(!1),
    [z9, Hc] = (0, React.useState)(null),
    hg = (0, React.useRef)(1),
    ao = (0, React.useRef)(null);
  (0, React.useEffect)(() => {
    ao.current && (E || b !== hg.current) && ((ao.current = null), rh(!1));
  }, [E, b]);
  let [oh, D9] = (0, React.useState)({ can: !1, on: !1 });
  (0, React.useEffect)(() => {
    let S = document,
      B = () =>
        D9({
          can: !!(S.fullscreenEnabled || S.webkitFullscreenEnabled),
          on: !!(S.fullscreenElement || S.webkitFullscreenElement),
        });
    return (
      B(),
      document.addEventListener('fullscreenchange', B),
      document.addEventListener('webkitfullscreenchange', B),
      () => {
        (document.removeEventListener('fullscreenchange', B),
          document.removeEventListener('webkitfullscreenchange', B));
      }
    );
  }, []);
  let _9 = () => {
      let S = document,
        B = document.documentElement;
      try {
        oh.on
          ? S.exitFullscreen
            ? S.exitFullscreen().catch(() => {})
            : S.webkitExitFullscreen?.()
          : B.requestFullscreen
            ? B.requestFullscreen({ navigationUI: 'hide' }).catch(() =>
                announce(t.current, 'This viewer does not allow full screen.'),
              )
            : B.webkitRequestFullscreen?.();
      } catch {}
    },
    [Uc, mg] = (0, React.useState)(!1),
    [pg, gg] = (0, React.useState)(!1),
    [yg, bg] = (0, React.useState)(''),
    [vg, xg] = (0, React.useState)(0),
    [kg, wg] = (0, React.useState)(0),
    [O9, Ls] = (0, React.useState)(''),
    [Pc, Sg] = (0, React.useState)('carta'),
    [hi, Mg] = (0, React.useState)(() => settings()),
    [ih, Wc] = (0, React.useState)(!1);
  ((0, React.useEffect)(() => {
    (Sg(artStyle()), Mg(settings()));
    let S = onArtStyle(Sg),
      B = onSettings(Mg);
    return () => {
      (S(), B());
    };
  }, []),
    (0, React.useEffect)(() => {
      let S = document.documentElement;
      ((S.dataset.art = Pc),
        (S.dataset.text = hi.largeText ? 'large' : 'normal'),
        (S.dataset.battery = hi.batterySaver ? 'on' : 'off'),
        (S.dataset.reducedMotion = hi.reducedMotion ? 'true' : 'false'));
    }, [Pc, hi.largeText, hi.batterySaver, hi.reducedMotion]));
  let Tg = (0, React.useRef)('menu');
  Y && (Tg.current = Y);
  let Bs = Tg.current,
    lr = (0, React.useRef)(null),
    js = (0, React.useRef)({ speed: b, paused: E }),
    Hs = (0, React.useRef)({ y: 0, moved: !1 }),
    Ic = (0, React.useRef)(0),
    Cg = pg || rl !== null || de || Xe || P || p || J || z || be || ih || Y !== null || o || j !== null;
  js.current = { speed: b, paused: E || Cg };
  let lh = [
      o && 'build',
      p && 'market',
      de && 'army',
      Xe && 'orders',
      P && 'journal',
      J && 'help',
      ih && 'settings',
      z && 'saves',
      Y,
    ]
      .filter(Boolean)
      .join(','),
    Ag = (0, React.useRef)('');
  ((0, React.useEffect)(() => {
    let S = new Set(Ag.current.split(','));
    for (let B of lh.split(',')) B && !S.has(B) && diaryLog('open', t.current, B);
    Ag.current = lh;
  }, [lh]),
    (0, React.useEffect)(() => {
      let S = window.matchMedia('(max-width:1000px), (max-height:600px)'),
        B = window.matchMedia('(max-width:1000px) and (min-height:740px)'),
        ae = () => {
          h(S.matches ? 120 : 8);
        };
      return (
        ae(),
        S.addEventListener('change', ae),
        B.addEventListener('change', ae),
        () => {
          (S.removeEventListener('change', ae), B.removeEventListener('change', ae));
        }
      );
    }, [s]),
    (0, React.useEffect)(() => {
      d((S) => Math.min(S, Math.ceil(CATALOG_ITEMS.filter((B) => B.category === s).length / m) - 1));
    }, [m, s]));
  let ze = (0, React.useCallback)(() => {
      let S = performance.now();
      if (S - qe.current > 1200) {
        ((qe.current = S), updateOrders(t.current), updateFolio(t.current));
        let ee = readyOrders(t.current);
        if (le.current >= 0 && ee > le.current) {
          let rt = t.current.orders?.list.find((ot) => orderProgress(t.current, ot).ready);
          rt &&
            announce(
              t.current,
              `Order ready: ${rt.title}. Open Orders to ${rt.kind === 'deliver' ? 'deliver' : 'claim'} it.`,
            );
        }
        le.current = ee;
      }
      let B = worldStats(t.current);
      r(B);
      {
        let ee = t.current,
          rt = ee.buildings.reduce((U9, P9) => U9 + (isBuilt(P9) ? 1 : 0), 0),
          ot = ee.frontier.pending?.id ?? -1,
          bt = ee.frontier.battle?.id ?? -1,
          Kt = ah.current,
          ol = ee.frontier.lastReport?.day ?? -1;
        (Kt.ready &&
          (rt > Kt.built && (Nt.built(), diaryLog('built', ee, String(rt))),
          ot !== -1 && ot !== Kt.threat && (Nt.horn(), diaryLog('threat', ee, ee.frontier.pending?.title)),
          // Raiders ashore: sound the horn and drop to normal speed so the fight can be watched.
          bt !== -1 &&
            bt !== Kt.battle &&
            (Nt.horn(), diaryLog('battle', ee, ee.frontier.pending?.title), js.current.speed > 1 && A(1)),
          ol !== Kt.report && ol !== -1 && diaryLog('event', ee, ee.frontier.lastReport?.title),
          ee.story.mode === 'campaign' &&
            ee.story.chapter > Kt.chapter &&
            (nh({ from: Kt.chapter, to: ee.story.chapter }),
            Nt.fanfare(),
            diaryLog('chapter', ee, String(Kt.chapter + 1))),
          ee.noticeId !== Kt.notice && ee.message.startsWith('Wildlife') && Nt.chirp()),
          (ah.current = {
            ready: !0,
            built: rt,
            threat: ot,
            battle: bt,
            chapter: ee.story.chapter,
            notice: ee.noticeId,
            report: ol,
          }));
      }
      let ae = Bc.current,
        se = {};
      for (let ee of Ga) se[ee.id] = Math.floor(B.wallet[ee.id]);
      if (ae) {
        let ee = {};
        for (let rt of Ga) {
          let ot = se[rt.id] - ae[rt.id];
          Math.abs(ot) >= Math.max(25, Math.abs(lg.current?.[rt.id] ?? 0) * 0.5) &&
            (ee[rt.id] = { id: ++R9.current, kind: ot < 0 ? 'loss' : 'gain' });
        }
        if (Object.keys(ee).length) {
          ig((ot) => ({ ...ot, ...ee }));
          let rt = new Set(Object.values(ee).map((ot) => ot.id));
          setTimeout(
            () =>
              ig((ot) => {
                let Kt = { ...ot };
                for (let ol in Kt) rt.has(Kt[ol].id) && delete Kt[ol];
                return Kt;
              }),
            1100,
          );
        }
      }
      Bc.current = se;
      let ke = t.current.story.chapter;
      (th.current === 0 &&
        ke >= 1 &&
        !t.current.autoCollect &&
        t.current.story.mode === 'campaign' &&
        ((t.current.autoCollect = !0),
        announce(
          t.current,
          'Auto-collect is now on: harvests go straight to your stores. Switch it off in the time panel (tap the clock).',
        )),
        (th.current = ke));
      let Mt = performance.now(),
        ht = t.current.revision;
      if (t.current.story.started && ht !== jc.current && (js.current.paused || Mt - sg.current > 2500)) {
        ((sg.current = Mt), (jc.current = ht));
        let ee = settlementLedger(t.current);
        A9(Object.fromEntries(ee.rows.map((rt) => [rt.resource, rt.net])));
      }
      (L(t.current.autoWeather ? 'auto' : t.current.weather),
        t.current.noticeId !== Ic.current &&
          ((Ic.current = t.current.noticeId), Jf({ text: t.current.message, id: t.current.noticeId })));
    }, []),
    L9 = (0, React.useCallback)(() => {
      ((ah.current.ready = !1),
        (Ic.current = t.current.noticeId),
        (Bc.current = null),
        (le.current = -1),
        (th.current = null),
        (jc.current = -1),
        V(!0));
      let S = t.current;
      (Jf({
        text:
          S.story.started || S.story.mode === 'sandbox'
            ? `Welcome back. Day ${Math.floor(S.time + 1e-8) + 1}${S.story.mode === 'campaign' ? ` \xB7 Chapter ${S.story.chapter + 1}` : ''}. Time is paused until you press play.`
            : S.message,
        id: -Date.now(),
      }),
        a.current?.homeIfIdle(),
        diarySession(S, nativePlatform()),
        ze());
    }, [ze]),
    he = useIslandSave(t, L9),
    Rg = (0, React.useRef)(!1);
  ((0, React.useEffect)(() => {
    (he.failing &&
      !Rg.current &&
      (diaryLog('save-fail', t.current, he.error.slice(0, 80)),
      announce(
        t.current,
        'Not saved to the cloud. Your island is kept on this device and saves again when the connection returns. More \u2192 Saved progress has details.',
      ),
      ze()),
      (Rg.current = he.failing));
  }, [he.failing, ze]),
    (0, React.useEffect)(() => (mg(diaryEnabled()), onDiary(() => mg(diaryEnabled()))), []),
    (0, React.useEffect)(() => {
      if (!Uc) return;
      let B = setInterval(() => {
          !document.hidden && t.current.cells.length && diaryTick(t.current);
        }, 3e4),
        ae = () => {
          !document.hidden && t.current.cells.length && diarySession(t.current, nativePlatform());
        };
      return (
        document.addEventListener('visibilitychange', ae),
        () => {
          (clearInterval(B), document.removeEventListener('visibilitychange', ae));
        }
      );
    }, [Uc]));
  let sh = (0, React.useRef)(0),
    ch = (0, React.useCallback)(
      (S, B, ae) => {
        let se = addItem(t.current, S, B, ae, T.current);
        (haptic(se.ok ? 'tap' : 'warning'), se.ok ? Nt.place() : Nt.refuse());
        {
          let ke = CATALOG_ITEMS.find((Mt) => Mt.id === S);
          ke &&
            (isBuildingItem(ke) || isBridge(S)) &&
            diaryLog(se.ok ? 'place' : 'refused', t.current, se.ok ? S : `${S}: ${se.message.slice(0, 60)}`);
        }
        return (
          Pe(null),
          sh.current ||
            (sh.current = requestAnimationFrame(() => {
              ((sh.current = 0), ze());
            })),
          se
        );
      },
      [ze],
    ),
    uh = (0, React.useCallback)(
      (S, B, ae) => {
        let se = CATALOG_ITEMS.find((ke) => ke.id === S);
        se && (isBuildingItem(se) || isBridge(se.id))
          ? (Ae({ id: S, p: { x: B, y: ae } }), R(S), l(!1), Pe(null))
          : ch(S, B, ae);
      },
      [ch],
    ),
    ga = () => {
      (R(null), Ae(null), Pe(null), a.current?.hover(null));
    },
    dh = (S = 'buildings') => {
      (ga(), c(S), Ft('all'), x('all'), d(0), W(null), O(!1), l(!0));
    },
    Eg = () => {
      let S = t.current,
        B = S.story.mode === 'campaign' ? campaignObjectives(S) : [],
        ae = B.find((ke) => ke.label.startsWith('Council decision')),
        se = B.filter((ke) => ke !== ae);
      return {
        on: !0,
        council: !!ae && !ae.done && se.every((ke) => ke.done),
        built: S.buildings.filter(isBuilt).length,
        threat: S.frontier.pending?.id ?? -1,
        battle: S.frontier.battle?.id ?? -1,
        report: S.frontier.lastReport?.day ?? -1,
        chapter: S.story.chapter,
        goals:
          S.story.mode === 'campaign' &&
          S.story.chapter !== 3 &&
          campaignObjectives(S).every((ke) => ke.done),
        start: S.time,
        orders: readyOrders(S),
        spoiled: S.frontier.spoiledFood,
        full: S.autoCollect ? 0 : S.buildings.reduce((ke, Mt) => ke + (Mt.stored >= 299 ? 1 : 0), 0),
      };
    },
    un = (S) => {
      (diaryLog('skip-stop', t.current, S.slice(0, 48)),
        (ao.current = null),
        rh(!1),
        A(1),
        V(!0),
        announce(t.current, S),
        ze());
    },
    Ng = 30,
    B9 = () =>
      t.current.story.mode === 'campaign' ? `Chapter ${t.current.story.chapter + 1}` : 'A new commission',
    j9 = () => {
      let S = t.current,
        B = ao.current;
      if (!B) return;
      let ae = Eg(),
        se = S.time - B.start,
        ke =
          se < 1
            ? `${Math.max(1, Math.round(se * 24))} hour${Math.round(se * 24) === 1 ? '' : 's'}`
            : `${Math.round(se)} day${Math.round(se) === 1 ? '' : 's'}`;
      if (ae.built > B.built)
        return un(`Construction finished after ${ke}. Time paused so you can plan the next step.`);
      if (ae.threat !== B.threat && ae.threat !== -1)
        return un(`${S.frontier.pending?.title ?? 'A threat'} sighted. Time paused: open Army to prepare.`);
      if (ae.battle !== B.battle && ae.battle !== -1)
        return un('Raiders are coming ashore. Time paused: press play to watch the fight, or open Army to change formation.');
      if (ae.report !== B.report)
        return un(
          S.frontier.lastReport?.title
            ? `${S.frontier.lastReport.title}. Time paused.`
            : 'An event resolved. Time paused.',
        );
      if (ae.goals)
        return un('Chapter goals reached. Time paused: tap the quest card to complete the chapter.');
      if (ae.council)
        return un('Everything is ready except the council\u2019s decision. Open the journal to choose.');
      if (ae.chapter !== B.chapter) return un(`${B9()} begins. Time paused.`);
      if (ae.full > B.full)
        return un('A building\u2019s storage is full. Time paused: tap the harvest button to collect.');
      if (ae.spoiled - B.spoiled > 60)
        return un(
          'Food is spoiling in full stores. Time paused: sell surplus in the Market or build a granary.',
        );
      if (ae.orders > B.orders) return un('An order is ready to hand over. Time paused: open Orders.');
      if (S.time - B.start >= Ng) return un(`Skipped ${Ng} days: nothing needed you. Time paused.`);
    },
    zg = () => {
      let S = Eg();
      if (S.goals) {
        (announce(
          t.current,
          'Chapter goals are already met. Tap the quest card to complete the chapter first.',
        ),
          ze());
        return;
      }
      if (S.council) {
        (announce(t.current, 'The council is waiting for your decision. Open the journal to choose.'), ze());
        return;
      }
      (localFlag('skip-taught') || setLocalFlag('skip-taught'),
        diaryLog('skip', t.current),
        (ao.current = S),
        (hg.current = b),
        rh(!0),
        V(!1),
        W(null));
    };
  ((0, React.useEffect)(() => {
    if (!za) return;
    let S = 0,
      B = 0,
      ae = performance.now(),
      se = () => {
        let ke = performance.now(),
          Mt = ke - ae;
        ae = ke;
        let ht = Mt > 40 ? 22 : 9;
        for (; ao.current && !js.current.paused && performance.now() - ke < ht; )
          (advanceWorld(t.current, 0.05), j9());
        ao.current &&
          (performance.now() - B > 200 && (ze(), (B = performance.now())), (S = requestAnimationFrame(se)));
      };
    return ((S = requestAnimationFrame(se)), () => cancelAnimationFrame(S));
  }, [za]),
    (0, React.useEffect)(() => {
      let S = performance.now(),
        B = 0,
        ae = setInterval(() => {
          let se = performance.now(),
            ke = Math.min((se - S) / 1e3, 0.4);
          ((S = se),
            !js.current.paused &&
              !document.hidden &&
              !ao.current &&
              (advanceWorld(t.current, (ke * js.current.speed) / 90), se - B >= 500 && (ze(), (B = se))));
        }, 250);
      return () => clearInterval(ae);
    }, [ze]),
    (0, React.useEffect)(() => {
      o && C9(cn.id);
    }, [o]),
    (0, React.useEffect)(() => {
      if (cn.id === 0) return;
      let S = setTimeout(() => Jf((B) => ({ ...B, text: '' })), 6500);
      return () => clearTimeout(S);
    }, [cn.id]),
    (0, React.useEffect)(() => {
      let S = (ht) => {
          (announce(
            t.current,
            `${ht.item.name}: ${ht.blocked}. ${ht.item.materials ? 'Produce and collect goods to fund this wonder.' : 'Trade goods in the Market.'}`,
          ),
            Tn(ht.item.description + ' ' + costLabel(ht.item)),
            haptic('warning'),
            ze());
        },
        B = (ht) => {
          let ee = lr.current;
          if (ee) {
            if (((ee.x = ht.clientX), (ee.y = ht.clientY), !ee.active)) {
              let rt = ee.x - ee.startX,
                ot = ee.y - ee.startY;
              if (ee.touch) {
                if ((Math.abs(rt) > 10 && Math.abs(rt) > Math.abs(ot)) || ot > 12) {
                  lr.current = null;
                  return;
                }
                if (ot < -14 && -ot >= Math.abs(rt) * 0.8) {
                  if (ee.blocked) {
                    ((lr.current = null), S(ee));
                    return;
                  }
                  ((ee.active = !0), l(!1), R(ee.item.id), haptic());
                }
              } else Math.hypot(rt, ot) > 7 && ((ee.active = !0), l(!1), R(ee.item.id));
            }
            ee.active &&
              (ht.preventDefault(),
              et({ item: ee.item, x: ee.x, y: ee.y }),
              a.current?.hover(a.current.pointAt(ee.x, ee.y)));
          }
        },
        ae = (ht) => {
          let ee = lr.current;
          if (ee) {
            if (((lr.current = null), !ee.active && ee.blocked)) {
              S(ee);
              return;
            }
            if (ee.active) {
              let rt = a.current?.pointAt(ht.clientX, ht.clientY);
              (rt && uh(ee.item.id, rt.x, rt.y),
                R(
                  Hr.includes(ee.item.id) || isBuildingItem(ee.item) || isBridge(ee.item.id)
                    ? ee.item.id
                    : null,
                ));
            } else (R(ee.item.id), Tn(ee.item.description), l(!1));
            (et(null), a.current?.hover(null));
          }
        },
        se = () => {
          ((lr.current = null), et(null), R(null), Ae(null), a.current?.hover(null));
        },
        ke = () => {
          lr.current && se();
        },
        Mt = (ht) => {
          if (ht.key === 'Escape') {
            (se(), Pe(null), Be(!1), Hc(null));
            return;
          }
          let ee = ht.target;
          if (
            ht.metaKey ||
            ht.ctrlKey ||
            ht.altKey ||
            (ee && (/INPUT|TEXTAREA|SELECT/.test(ee.tagName) || ee.isContentEditable)) ||
            document.querySelector('[role=dialog],[role=alertdialog]')
          )
            return;
          let rt = t.current.story.started,
            ot = ht.key.toLowerCase();
          ot === ' ' && rt && !(ee instanceof HTMLButtonElement) && !(ee instanceof HTMLCanvasElement)
            ? (ht.preventDefault(), V((Kt) => !Kt))
            : ['1', '2', '3', '4'].includes(ot) && rt
              ? (A([1, 3, 10, 20][Number(ot) - 1]), V(!1))
              : ot === 'b'
                ? l((Kt) => !Kt)
                : ot === 'o'
                  ? (at('orders'), Fe(!0))
                  : ot === 'm'
                    ? g(!0)
                    : ot === 'j'
                      ? Re(!0)
                      : ot === 'r' && y((Kt) => (Kt ? 0 : 1));
        };
      return (
        window.addEventListener('pointermove', B, { passive: !1 }),
        window.addEventListener('pointerup', ae),
        window.addEventListener('pointercancel', se),
        window.addEventListener('keydown', Mt),
        window.addEventListener('resize', ke),
        () => {
          (window.removeEventListener('pointermove', B),
            window.removeEventListener('pointerup', ae),
            window.removeEventListener('pointercancel', se),
            window.removeEventListener('keydown', Mt),
            window.removeEventListener('resize', ke));
        }
      );
    }, [uh, ze]),
    (0, React.useEffect)(() => {
      let S = document.modelContext;
      if (!S?.registerTool) return;
      let B = new AbortController(),
        ae = [
          {
            name: 'get_island',
            description:
              'Read island statistics, catalog, plants, animals, and cell conditions. Coordinates are grid x 0\u2013383 and y 0\u2013319.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: !1 },
            annotations: { readOnlyHint: !0 },
            execute: () => ({
              stats: worldStats(t.current),
              catalog: CATALOG_ITEMS,
              story: t.current.story,
              buildings: t.current.buildings,
              features: t.current.features,
              plants: t.current.plants,
              animals: t.current.animals,
              cells: t.current.cells,
            }),
          },
          {
            name: 'add_island_supply',
            description:
              'Place one supply at an island position using the same rules as the drag-and-drop interface.',
            inputSchema: {
              type: 'object',
              properties: {
                item: { enum: CATALOG_ITEMS.map((se) => se.id) },
                x: { type: 'number', minimum: 0, maximum: GRID_W - 0.01 },
                y: { type: 'number', minimum: 0, maximum: GRID_H - 0.01 },
              },
              required: ['item', 'x', 'y'],
              additionalProperties: !1,
            },
            annotations: { readOnlyHint: !1 },
            execute: (se) => {
              let ke = se;
              if (
                !ke ||
                !CATALOG_ITEMS.some((ht) => ht.id === ke.item) ||
                !Number.isFinite(ke.x) ||
                !Number.isFinite(ke.y)
              )
                throw Error('Provide a valid item and finite island coordinates.');
              let Mt = addItem(t.current, ke.item, ke.x, ke.y);
              return (ze(), Mt);
            },
          },
          {
            name: 'set_island_weather',
            description: 'Set island weather or enable natural cycles.',
            inputSchema: {
              type: 'object',
              properties: { weather: { enum: ['auto', ...Ur.map((se) => se.id)] } },
              required: ['weather'],
              additionalProperties: !1,
            },
            annotations: { readOnlyHint: !1 },
            execute: (se) => {
              let ke = se;
              if (!ke || !['auto', ...Ur.map((Mt) => Mt.id)].includes(ke.weather))
                throw Error('Choose a valid weather type.');
              return (setWeather(t.current, ke.weather), ze(), worldStats(t.current));
            },
          },
          {
            name: 'advance_island_day',
            description:
              'Advance one island day in Free build only. The campaign uses real-time speeds of 1, 3 or 10 times.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: !1 },
            annotations: { readOnlyHint: !1 },
            execute: () => {
              if (t.current.story.mode !== 'sandbox')
                throw Error('Day skipping is only available in Free build.');
              return (advanceWorld(t.current, 1), ze(), worldStats(t.current));
            },
          },
          {
            name: 'collect_settlement_goods',
            description:
              'Collect ready goods from buildings and orchards, as the visible Collect harvest button does.',
            inputSchema: { type: 'object', properties: {}, additionalProperties: !1 },
            annotations: { readOnlyHint: !1 },
            execute: () => {
              let se = collectGoods(t.current);
              return (ze(), se);
            },
          },
        ];
      for (let se of ae)
        try {
          Promise.resolve(S.registerTool(se, { signal: B.signal })).catch(() => {});
        } catch {}
      return () => B.abort();
    }, [ze]));
  let oa = CATALOG_ITEMS.find((S) => S.id === C),
    Ya = nt ? cellAt(t.current, nt.x, nt.y) : null,
    fh = CATALOG_ITEMS.filter(
      (S) =>
        S.category === s &&
        (!isBuildingItem(S) ||
          k === 'all' ||
          (k === 'available' && !supplyBlocked(t.current, S)) ||
          (k === 'food' && buildingResource(S.id) === 'food') ||
          (k === 'materials' && ['timber', 'stone'].includes(buildingResource(S.id))) ||
          (k === 'defense' && ['guardhall', 'watchtower', 'palisade', 'beacon'].includes(S.id)) ||
          (k === 'civic' &&
            buildingResource(S.id) === 'gold' &&
            !['guardhall', 'watchtower', 'palisade', 'beacon'].includes(S.id))) &&
        (s !== 'plants' ||
          Je === 'all' ||
          (Je === 'trees' && S.tree) ||
          (Je === 'woodland' &&
            ['hazel', 'juniper', 'fern', 'bracken', 'mushroom', 'berry'].includes(S.id)) ||
          (Je === 'flowers' &&
            ['flowers', 'clover', 'heather', 'lupine', 'bluebells', 'grass'].includes(S.id)) ||
          (Je === 'wetland' && ['reeds', 'sedge', 'willow', 'alder'].includes(S.id))),
    ),
    hh = Math.ceil(fh.length / m),
    Dt = nt ? t.current.buildings.find((S) => Math.hypot(S.x - nt.x, S.y - nt.y) < 1.8) : void 0,
    no = nt ? bridgeAt(t.current, nt.x, nt.y) : void 0,
    Gc = Dt ? production(t.current, Dt) : null,
    Cn = p && v === 'ledger' ? settlementLedger(t.current) : null,
    jn = seasonAt(t.current.time),
    xa = t.current.frontier.pending,
    mh = Ur.find((S) => S.id === n.weather),
    H9 = () => {
      (diaryLog('new-island', t.current),
        (t.current = createWorld('campaign')),
        he.startedNew(),
        (Bc.current = null),
        (jc.current = -1),
        (Ic.current = -1),
        V(!0),
        A(1),
        R(null),
        Ae(null),
        Pe(null),
        l(!1),
        a.current?.home(),
        ze(),
        he.save(!0));
    },
    sr = j ? placementPreview(t.current, j.id, j.p.x, j.p.y, w) : null,
    ph =
      !!j &&
      !!sr?.ok &&
      !isBridge(j.id) &&
      !['watchtower', 'palisade', 'guardhall', 'well', 'storehouse', 'chapel', 'beacon'].includes(j.id) &&
      (sr?.rate ?? 0) <= 0,
    gh = j ? `${j.id}|${j.p.x.toFixed(1)}|${j.p.y.toFixed(1)}|${w}` : '';
  return (0, jsxRuntime.jsxs)('main', {
    className: `sandbox ${t.current.story.mode === 'sandbox' ? 'free-mode' : ''} ${C ? 'tool-active' : ''} ${o ? 'catalog-open' : ''} ${Ue ? 'scenic-view' : ''} ${t.current.story.mode === 'campaign' && !t.current.story.started ? 'at-title' : ''} ${E ? 'is-paused' : ''}`,
    children: [
      (0, jsxRuntime.jsx)('div', {
        className: 'map-viewport',
        children: (0, jsxRuntime.jsx)(i7, {
          paused: E || Cg,
          speed: za ? 100 : b,
          ref: a,
          previewPoint: j?.p ?? null,
          world: t,
          orientation: w,
          selected: C,
          inspected: nt,
          mapOpen: N,
          onPlace: uh,
          onInspect: (S) => {
            if (N) {
              O(!1);
              return;
            }
            cellAt(t.current, S.x, S.y)
              ? (Pe(S), window.matchMedia('(max-width:760px)').matches && a.current?.reveal(S, 0.3))
              : Pe(null);
          },
          onZoom: vt,
        }),
      }),
      (0, jsxRuntime.jsxs)('header', {
        className: 'topbar',
        children: [
          (0, jsxRuntime.jsxs)('div', {
            className: 'brand',
            children: [
              (0, jsxRuntime.jsx)('span', {
                className: 'brand-mark',
                children: (0, jsxRuntime.jsx)(Emblem, { size: 40, plate: !0 }),
              }),
              (0, jsxRuntime.jsxs)('span', {
                children: [
                  (0, jsxRuntime.jsx)('strong', { children: 'Tideweald' }),
                  (0, jsxRuntime.jsx)('button', {
                    className: 'save-status',
                    'aria-label': 'Saved progress',
                    onClick: () => {
                      (W(null), U(!0));
                    },
                    children: he.status,
                  }),
                ],
              }),
            ],
          }),
          (0, jsxRuntime.jsxs)('div', {
            className: 'header-actions',
            children: [
              (0, jsxRuntime.jsx)(s7, {}),
              (0, jsxRuntime.jsxs)('button', {
                className: `icon-button watch-button ${xa ? 'has-threat' : ''}`,
                'aria-label': 'Open Army and recruit soldiers',
                onClick: () => {
                  (re(!0), l(!1));
                },
                children: [
                  (0, jsxRuntime.jsx)(Yn, { size: 18 }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      'Army ',
                      (0, jsxRuntime.jsx)('b', { children: t.current.frontier.garrison }),
                      t.current.frontier.training > 0 ? ' +2' : '',
                    ],
                  }),
                ],
              }),
              (() => {
                let S = readyOrders(t.current);
                return (0, jsxRuntime.jsxs)('button', {
                  className: `icon-button orders-button ${S ? 'has-ready' : ''}`,
                  'aria-label': `Orders and folio${S ? `, ${S} ready to claim` : ''}`,
                  onClick: () => {
                    (Fe(!0), l(!1));
                  },
                  children: [
                    (0, jsxRuntime.jsx)(q0, { size: 18 }),
                    (0, jsxRuntime.jsx)('span', { children: 'Orders' }),
                    S > 0 && (0, jsxRuntime.jsx)('b', { className: 'orders-badge', children: S }),
                  ],
                });
              })(),
              (0, jsxRuntime.jsx)('button', {
                className: 'icon-button mobile-menu-button',
                'aria-label': 'Game menu',
                onClick: () => {
                  (W('menu'), l(!1), Pe(null), O(!1));
                },
                children: (0, jsxRuntime.jsx)(G4, { size: 22 }),
              }),
              (0, jsxRuntime.jsx)('button', {
                className: 'icon-button',
                'aria-label': 'Open expedition journal',
                onClick: () => {
                  (Re(!0), l(!1));
                },
                children: (0, jsxRuntime.jsx)(Ql, { size: 20 }),
              }),
              (0, jsxRuntime.jsx)('button', {
                className: 'icon-button scenic-desktop',
                'aria-label': 'Scenic view',
                onClick: () => {
                  (ga(), l(!1), O(!1), Be(!0));
                },
                children: (0, jsxRuntime.jsx)(G0, { size: 20 }),
              }),
              (0, jsxRuntime.jsx)('button', {
                className: 'icon-button',
                'aria-label': 'Settings and art style',
                onClick: () => Wc(!0),
                children: (0, jsxRuntime.jsx)(hp, { size: 19 }),
              }),
              (0, jsxRuntime.jsx)('button', {
                className: 'icon-button',
                'aria-label': 'How to play',
                onClick: () => X(!0),
                children: (0, jsxRuntime.jsx)(ip, { size: 20 }),
              }),
              (0, jsxRuntime.jsx)('button', {
                className: 'icon-button',
                'aria-label': 'Start a new island',
                onClick: () => je(!0),
                children: (0, jsxRuntime.jsx)(V0, { size: 19 }),
              }),
            ],
          }),
        ],
      }),
      (0, jsxRuntime.jsxs)('div', {
        className: 'resource-bar',
        'aria-label': 'Settlement resources',
        children: [
          Ga.map((S) => {
            let B = og?.[S.id] ?? 0,
              ae = Math.abs(B) < 0.05 ? '' : B < 0 ? 'loss' : 'gain';
            return (0, jsxRuntime.jsxs)(
              'div',
              {
                className: `resource resource-${S.id} ${ae === 'loss' ? 'is-falling' : ''}`,
                'aria-label': `${S.name}: ${Math.floor(n.wallet[S.id])}${ae ? `, ${B < 0 ? 'losing' : 'gaining'} ${Math.abs(B).toFixed(1)} per day` : ''}`,
                children: [
                  (0, jsxRuntime.jsx)(Icon, { name: S.icon, size: 20 }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      (0, jsxRuntime.jsx)('small', { children: S.name }),
                      (0, jsxRuntime.jsx)(
                        'strong',
                        {
                          className: eh[S.id] ? `pulse-${eh[S.id].kind}` : void 0,
                          children: Math.floor(n.wallet[S.id]).toLocaleString(),
                        },
                        eh[S.id]?.id ?? 0,
                      ),
                      ae &&
                        (0, jsxRuntime.jsxs)('em', {
                          className: `resource-rate delta ${ae}`,
                          title: `${B < 0 ? 'Losing' : 'Gaining'} ${Math.abs(B).toFixed(1)} ${S.name.toLowerCase()} per island day at current rates (Market \u2192 Daily ledger)`,
                          children: [signed(B), '/d'],
                        }),
                    ],
                  }),
                ],
              },
              S.id,
            );
          }),
          (0, jsxRuntime.jsxs)('button', {
            className: 'market-button',
            onClick: () => g(!0),
            'aria-label': 'Open market and gold shop',
            children: [
              (0, jsxRuntime.jsx)(Ed, { size: 20 }),
              (0, jsxRuntime.jsx)('span', { children: 'Market' }),
            ],
          }),
        ],
      }),
      xa &&
        !o &&
        !C &&
        !j &&
        !de &&
        (0, jsxRuntime.jsxs)('button', {
          className: 'threat-strip',
          'aria-label': 'View approaching threat',
          onClick: () => {
            (re(!0), Pe(null));
          },
          children: [
            (0, jsxRuntime.jsx)(Yn, { size: 20 }),
            (0, jsxRuntime.jsxs)('span', {
              children: [
                xa.title,
                (0, jsxRuntime.jsxs)('small', {
                  children: t.current.frontier.battle
                    ? ['Ashore now \xB7 Tap to change formation or watch the fight']
                    : ['Day ', xa.dueDay, ' \xB7 Tap for defenses and expected losses'],
                }),
              ],
            }),
          ],
        }),
      (0, jsxRuntime.jsxs)(Collapsible, {
        open: o,
        onOpenChange: (S) => {
          (l(S), S && (ga(), W(null), O(!1)));
        },
        className: `supply-drawer ${o ? 'expanded' : ''}`,
        children: [
          (0, jsxRuntime.jsxs)(CollapsibleContent, {
            className: 'supply-content',
            children: [
              (0, jsxRuntime.jsxs)('div', {
                className: 'supply-heading',
                children: [
                  (0, jsxRuntime.jsxs)('div', {
                    children: [
                      (0, jsxRuntime.jsx)('span', {
                        className: 'eyebrow',
                        children: 'YOUR SETTLEMENT, YOUR DESIGN',
                      }),
                      (0, jsxRuntime.jsx)('h1', { children: 'Build & shape the world' }),
                    ],
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    className: 'supply-count',
                    children: [
                      CATALOG_ITEMS.length,
                      (0, jsxRuntime.jsx)('small', { children: 'possibilities' }),
                    ],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)(Tabs, {
                value: s,
                onValueChange: (S) => {
                  S !== s &&
                    (c(S),
                    Ft('all'),
                    x('all'),
                    d(0),
                    Tn('Drag an item onto the map. Gold is spent only when a placement succeeds.'));
                },
                children: [
                  (0, jsxRuntime.jsx)(TabsList, {
                    className: 'category-tabs',
                    'aria-label': 'Supply categories',
                    children: P6.filter((S) => S.id !== 'hazards' || t.current.story.mode === 'sandbox').map(
                      (S) =>
                        (0, jsxRuntime.jsxs)(
                          TabsTrigger,
                          {
                            value: S.id,
                            children: [
                              (0, jsxRuntime.jsx)(Icon, { name: S.icon, size: 16 }),
                              (0, jsxRuntime.jsx)('span', { children: S.name }),
                            ],
                          },
                          S.id,
                        ),
                    ),
                  }),
                  (s === 'buildings' || s === 'landmarks') &&
                    (0, jsxRuntime.jsx)('div', {
                      className: 'catalog-filters',
                      role: 'group',
                      'aria-label': 'Building types',
                      children: [
                        ['all', 'All'],
                        ['available', 'Can build'],
                        ['food', 'Food'],
                        ['materials', 'Materials'],
                        ['civic', 'Civic'],
                        ['defense', 'Defense'],
                      ].map(([S, B]) =>
                        (0, jsxRuntime.jsx)(
                          'button',
                          {
                            'aria-pressed': k === S,
                            onClick: () => {
                              (x(S), d(0));
                            },
                            children: B,
                          },
                          S,
                        ),
                      ),
                    }),
                  s === 'plants' &&
                    (0, jsxRuntime.jsx)('div', {
                      className: 'flora-filters',
                      role: 'group',
                      'aria-label': 'Plant habitats',
                      children: [
                        ['all', 'All'],
                        ['trees', 'Trees'],
                        ['woodland', 'Woodland'],
                        ['flowers', 'Meadow'],
                        ['wetland', 'Waterside'],
                      ].map(([S, B]) =>
                        (0, jsxRuntime.jsx)(
                          'button',
                          {
                            'aria-pressed': Je === S,
                            onClick: () => {
                              (Ft(S), d(0));
                            },
                            children: B,
                          },
                          S,
                        ),
                      ),
                    }),
                  (0, jsxRuntime.jsx)(
                    TabsContent,
                    {
                      value: s,
                      className: 'supply-grid',
                      children: fh.slice(u * m, (u + 1) * m).map((S) =>
                        (0, jsxRuntime.jsxs)(
                          'button',
                          {
                            className: `supply-card ${C === S.id ? 'chosen' : ''} ${supplyBlocked(t.current, S) ? 'unaffordable' : ''}`,
                            'aria-label': `Add ${S.name} for ${costLabel(S)}`,
                            'aria-pressed': C === S.id,
                            'aria-disabled': !!supplyBlocked(t.current, S) && S.category !== 'roads',
                            title: `${supplyBlocked(t.current, S) || costLabel(S)} \xB7 ${S.description}`,
                            onMouseEnter: () =>
                              Tn(
                                S.description +
                                  (Ia[S.id]
                                    ? ` Construction: ${Ia[S.id]} island days (${Math.round(Ia[S.id] * 90)} seconds at 1\xD7).`
                                    : ''),
                              ),
                            onFocus: () => Tn(S.description),
                            onPointerDown: (B) => {
                              if (B.button !== 0) return;
                              let ae = B.pointerType !== 'mouse',
                                se = S.category !== 'roads' && supplyBlocked(t.current, S);
                              if (ae) {
                                lr.current = {
                                  item: S,
                                  startX: B.clientX,
                                  startY: B.clientY,
                                  x: B.clientX,
                                  y: B.clientY,
                                  active: !1,
                                  touch: !0,
                                  blocked: se,
                                };
                                return;
                              }
                              if (
                                (B.preventDefault(),
                                B.currentTarget.closest('main')?.setPointerCapture(B.pointerId),
                                se)
                              ) {
                                (announce(
                                  t.current,
                                  `${S.name}: ${supplyBlocked(t.current, S)}. ${S.materials ? 'Produce and collect goods to fund this wonder.' : 'Trade goods in the Market.'}`,
                                ),
                                  Tn(S.description + ' ' + costLabel(S)),
                                  ze());
                                return;
                              }
                              lr.current = {
                                item: S,
                                startX: B.clientX,
                                startY: B.clientY,
                                x: B.clientX,
                                y: B.clientY,
                                active: !1,
                                touch: !1,
                                blocked: !1,
                              };
                            },
                            onClick: (B) => {
                              if (B.detail === 0) {
                                if (supplyBlocked(t.current, S) && S.category !== 'roads') {
                                  (announce(t.current, supplyBlocked(t.current, S)), ze());
                                  return;
                                }
                                (R(S.id), Tn(S.description), l(!1));
                              }
                            },
                            children: [
                              (0, jsxRuntime.jsx)(ItemVisual, { item: S }),
                              (0, jsxRuntime.jsx)('span', { children: S.name }),
                              isBridge(S.id) &&
                                (0, jsxRuntime.jsx)('em', {
                                  className: 'build-duration',
                                  children: 'per section \xB7 span priced on map',
                                }),
                              Ia[S.id] &&
                                (0, jsxRuntime.jsxs)('em', {
                                  className: 'build-duration',
                                  children: [
                                    (0, jsxRuntime.jsx)(P0, { size: 11 }),
                                    buildTime(Ia[S.id]),
                                    ' to build',
                                  ],
                                }),
                              isBuildingItem(S) && (0, jsxRuntime.jsx)(Flows, { flows: buildingFlows(S.id) }),
                              S.materials
                                ? (0, jsxRuntime.jsx)('span', {
                                    className: 'material-costs',
                                    children: Ga.filter((B) => itemCost(S)[B.id] > 0).map((B) =>
                                      (0, jsxRuntime.jsxs)(
                                        'small',
                                        {
                                          className: n.wallet[B.id] < itemCost(S)[B.id] ? 'short' : '',
                                          children: [
                                            (0, jsxRuntime.jsx)(Icon, { name: B.icon, size: 12 }),
                                            itemCost(S)[B.id],
                                          ],
                                        },
                                        B.id,
                                      ),
                                    ),
                                  })
                                : (0, jsxRuntime.jsxs)('small', {
                                    className: 'item-cost',
                                    children: [
                                      (0, jsxRuntime.jsx)(Nr, { size: 13 }),
                                      S.cost,
                                      (0, jsxRuntime.jsx)('span', {
                                        children:
                                          S.category === 'roads'
                                            ? '/ tile'
                                            : Hr.includes(S.id)
                                              ? '/ section'
                                              : '',
                                      }),
                                    ],
                                  }),
                              S.unlock !== void 0 &&
                                t.current.story.mode === 'campaign' &&
                                t.current.story.chapter < S.unlock &&
                                (0, jsxRuntime.jsxs)('strong', {
                                  className: 'unlock-label',
                                  children: ['Chapter ', S.unlock + 1],
                                }),
                            ],
                          },
                          S.id,
                        ),
                      ),
                    },
                    s,
                  ),
                ],
              }),
              hh > 1 &&
                (0, jsxRuntime.jsxs)('div', {
                  className: 'catalog-pages',
                  children: [
                    (0, jsxRuntime.jsx)('button', {
                      'aria-label': 'Previous catalog page',
                      disabled: u === 0,
                      onClick: () => d((S) => S - 1),
                      children: (0, jsxRuntime.jsx)(C4, { size: 18 }),
                    }),
                    (0, jsxRuntime.jsxs)('span', {
                      children: [
                        u + 1,
                        ' / ',
                        hh,
                        (0, jsxRuntime.jsxs)('small', { children: [fh.length, ' choices'] }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('button', {
                      'aria-label': 'Next catalog page',
                      disabled: u >= hh - 1,
                      onClick: () => d((S) => S + 1),
                      children: (0, jsxRuntime.jsx)(qn, { size: 18 }),
                    }),
                  ],
                }),
              (0, jsxRuntime.jsxs)('p', {
                className: 'supply-description',
                children: [
                  (0, jsxRuntime.jsx)(q4, { size: 15 }),
                  (0, jsxRuntime.jsx)('span', { children: Mn }),
                ],
              }),
            ],
          }),
          (0, jsxRuntime.jsx)(CollapsibleTrigger, {
            asChild: !0,
            children: (0, jsxRuntime.jsxs)('button', {
              className: 'drawer-handle',
              'aria-label': o ? 'Close supplies \u2014 drag up' : 'Open supplies \u2014 drag down',
              onPointerDown: (S) => {
                ((Hs.current = { y: S.clientY, moved: !1 }), S.currentTarget.setPointerCapture(S.pointerId));
              },
              onPointerMove: (S) => {
                if (!S.currentTarget.hasPointerCapture(S.pointerId)) return;
                let B = S.clientY - Hs.current.y;
                Math.abs(B) > 14 && ((Hs.current.moved = !0), l(B > 0));
              },
              onClick: (S) => {
                Hs.current.moved && (S.preventDefault(), (Hs.current.moved = !1));
              },
              children: [
                (0, jsxRuntime.jsx)('span', { className: 'handle-grip' }),
                (0, jsxRuntime.jsxs)('span', {
                  children: [
                    (0, jsxRuntime.jsx)(F4, { size: 16 }),
                    o ? 'Drag a supply onto your island' : 'Build & terrain',
                    (0, jsxRuntime.jsx)('span', {
                      className: 'handle-hint',
                      children: o ? '' : ' \xB7 pull down',
                    }),
                  ],
                }),
                (0, jsxRuntime.jsx)(rp, { size: 16, className: o ? 'turned' : '' }),
              ],
            }),
          }),
        ],
      }),
      (0, jsxRuntime.jsxs)('div', {
        className: 'left-hud',
        children: [
          '    ',
          (0, jsxRuntime.jsx)(CampaignPanel, {
            world: t.current,
            open: P,
            onOpen: (S) => {
              (Re(S), S && (l(!1), Pe(null)));
            },
            onLocate: (S) => {
              (a.current?.focus(S), Pe(null), R('cleanup'));
            },
            onChange: () => {
              (ze(), he.save(!0), t.current.story.mode === 'sandbox' && V(!1));
            },
            onBegin: () => {
              (beginCampaign(t.current), diaryLog('begin', t.current), V(!1), ze(), he.save(!0));
            },
            onSupplies: () => dh(),
            resume:
              !he.hasCloudSave && he.backup && !t.current.story.started && t.current.story.mode === 'campaign'
                ? {
                    label: `Continue \xB7 ${describeBackup(he.backup)}`,
                    onResume: () => {
                      he.restoreLocal(he.backup);
                    },
                  }
                : void 0,
          }),
          (0, jsxRuntime.jsxs)('aside', {
            className: 'settlement-panel',
            children: [
              (0, jsxRuntime.jsxs)('div', {
                className: 'settlement-heading',
                children: [
                  (0, jsxRuntime.jsx)('span', { className: 'eyebrow', children: 'YOUR OUTPOST' }),
                  (0, jsxRuntime.jsxs)('span', {
                    title: 'Housing capacity',
                    children: [(0, jsxRuntime.jsx)(rv, { size: 15 }), n.capacity, ' beds'],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)('div', {
                className: 'settlement-numbers',
                children: [
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      (0, jsxRuntime.jsx)('b', { children: n.buildings }),
                      ' built',
                      n.constructing > 0 ? ` \xB7 ${n.constructing} rising` : '',
                    ],
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [(0, jsxRuntime.jsx)('b', { children: n.plants }), ' plants'],
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [(0, jsxRuntime.jsx)('b', { children: n.animals }), ' animals'],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)('button', {
                className: 'collect-button',
                disabled: n.ready < 1,
                onClick: () => {
                  (collectGoods(t.current), ze());
                },
                children: [
                  (0, jsxRuntime.jsx)(as, { size: 20 }),
                  (0, jsxRuntime.jsx)('span', { children: 'Collect harvest' }),
                  (0, jsxRuntime.jsx)('b', { children: n.ready }),
                ],
              }),
              (0, jsxRuntime.jsxs)('label', {
                className: 'auto-collect',
                children: [
                  (0, jsxRuntime.jsx)('input', {
                    type: 'checkbox',
                    'aria-label': 'Auto-collect harvests',
                    checked: t.current.autoCollect,
                    onChange: (S) => {
                      ((t.current.autoCollect = S.target.checked), ze());
                    },
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      'Auto-collect',
                      (0, jsxRuntime.jsx)('span', { className: 'auto-extra', children: ' harvests' }),
                    ],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)('small', {
                children: [n.population, ' settlers \xB7 Charter +', n.charter, ' gold/day'],
              }),
            ],
          }),
        ],
      }),
      t.current.story.mode === 'sandbox' &&
        n.placements === 0 &&
        !o &&
        (0, jsxRuntime.jsxs)('div', {
          className: 'empty-world',
          children: [
            (0, jsxRuntime.jsx)('span', { className: 'eyebrow', children: 'AN UNCHARTED ISLAND' }),
            (0, jsxRuntime.jsx)('h2', { children: 'Found your settlement.' }),
            (0, jsxRuntime.jsxs)('p', {
              children: [
                'Build a farm. Collect your first harvest.',
                (0, jsxRuntime.jsx)('br', {}),
                'Trade it for the gold to expand.',
              ],
            }),
            (0, jsxRuntime.jsxs)('button', {
              onClick: () => {
                (c('buildings'), d(0), l(!0));
              },
              children: ['Build your first farm ', (0, jsxRuntime.jsx)(rp, { size: 16 })],
            }),
          ],
        }),
      Ya &&
        (0, jsxRuntime.jsxs)('aside', {
          className: 'patch-inspector',
          children: [
            (0, jsxRuntime.jsx)('button', {
              className: 'close-inspector',
              'aria-label': 'Close patch details',
              onClick: () => Pe(null),
              children: (0, jsxRuntime.jsx)(Zn, { size: 16 }),
            }),
            (0, jsxRuntime.jsx)('span', {
              className: 'eyebrow',
              children: Dt ? 'SETTLEMENT BUILDING' : 'TERRAIN INSPECTOR',
            }),
            (0, jsxRuntime.jsx)('h3', {
              children: Dt
                ? CATALOG_ITEMS.find((S) => S.id === Dt.kind)?.name
                : Ya.land
                  ? Ya.waterType === 'river'
                    ? 'River'
                    : Ya.pond
                      ? 'Freshwater pond'
                      : Ya.elevation > 12
                        ? 'High ground'
                        : Ya.rock
                          ? 'Rocky ground'
                          : Ya.soil > 0.45
                            ? 'Rich earth'
                            : 'Open ground'
                  : 'Ocean',
            }),
            Dt &&
              (0, jsxRuntime.jsxs)('button', {
                className: 'rotate-building',
                onClick: () => {
                  (rotateBuilding(t.current, Dt.id), ze());
                },
                children: [
                  (0, jsxRuntime.jsx)(V0, { size: 16 }),
                  'Turn building \xB7 ',
                  Dt.orientation ? 'NW\u2013SE' : 'NE\u2013SW',
                ],
              }),
            Dt &&
              Gc &&
              (0, jsxRuntime.jsxs)('div', {
                className: 'production-info',
                children: [
                  (0, jsxRuntime.jsx)('b', {
                    children: isBuilt(Dt)
                      ? Gc.rate > 0
                        ? (0, jsxRuntime.jsx)(Flows, { flows: buildingFlows(Dt.kind, Gc.rate) })
                        : 'No output at the moment'
                      : `Building \xB7 ${Math.round(Dt.buildProgress * 100)}%`,
                  }),
                  (0, jsxRuntime.jsx)('span', { children: Gc.reason }),
                  isBuilt(Dt)
                    ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                        children: [
                          (0, jsxRuntime.jsxs)('p', {
                            children: [Math.floor(Dt.stored), ' ready to collect'],
                          }),
                          Dt.kind === 'guardhall' &&
                            (0, jsxRuntime.jsx)('button', {
                              className: 'watch-build',
                              onClick: () => {
                                (Pe(null), re(!0));
                              },
                              children: 'Recruit soldiers \xB7 Army',
                            }),
                          (() => {
                            let S = demolishQuote(t.current, Dt.id);
                            if (!S) return null;
                            let B = Ga.filter((ae) => S.refund[ae.id] > 0)
                              .map((ae) => `${signed(S.refund[ae.id])} ${ae.name.toLowerCase()}`)
                              .join(' ');
                            return z9 === Dt.id
                              ? (0, jsxRuntime.jsxs)('div', {
                                  className: 'demolish-confirm',
                                  children: [
                                    (0, jsxRuntime.jsxs)('p', {
                                      children: [
                                        'Dismantle this ',
                                        S.name.toLowerCase(),
                                        '? You salvage ',
                                        (0, jsxRuntime.jsx)('span', {
                                          className: 'delta gain',
                                          children: B || 'nothing',
                                        }),
                                        S.stored
                                          ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                                              children: [
                                                ' and its ',
                                                (0, jsxRuntime.jsxs)('span', {
                                                  className: 'delta gain',
                                                  children: [S.stored, ' stored ', S.resource],
                                                }),
                                              ],
                                            })
                                          : null,
                                        '. This cannot be undone.',
                                      ],
                                    }),
                                    (0, jsxRuntime.jsx)('button', {
                                      className: 'cancel-construction',
                                      onClick: () => {
                                        (demolishBuilding(t.current, Dt.id), Hc(null), Pe(null), ze());
                                      },
                                      children: 'Dismantle',
                                    }),
                                    (0, jsxRuntime.jsx)('button', {
                                      className: 'keep-building',
                                      onClick: () => Hc(null),
                                      children: 'Keep it',
                                    }),
                                  ],
                                })
                              : (0, jsxRuntime.jsx)('button', {
                                  className: 'demolish-building',
                                  onClick: () => Hc(Dt.id),
                                  children: 'Dismantle\u2026 \xB7 salvage 25%',
                                });
                          })(),
                        ],
                      })
                    : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                        children: [
                          (0, jsxRuntime.jsx)('progress', {
                            max: '1',
                            value: Dt.buildProgress,
                            'aria-label': 'Construction progress',
                          }),
                          (0, jsxRuntime.jsxs)('p', {
                            children: [
                              E
                                ? 'Work paused'
                                : `${Math.ceil((buildRemaining(Dt) * 90) / b / constructionRate(t.current))} seconds at ${b}\xD7`,
                              ' \xB7 no production yet',
                            ],
                          }),
                          (0, jsxRuntime.jsx)('button', {
                            className: 'cancel-construction',
                            onClick: () => {
                              (cancelConstruction(t.current, Dt.id), Pe(null), ze());
                            },
                            children: 'Cancel \xB7 recover 50% of all resources',
                          }),
                        ],
                      }),
                ],
              }),
            no &&
              (0, jsxRuntime.jsxs)('div', {
                className: 'building-output',
                children: [
                  (0, jsxRuntime.jsx)('b', {
                    children: no.kind === 'stone_bridge' ? 'Stone bridge' : 'Timber bridge',
                  }),
                  (0, jsxRuntime.jsx)('p', {
                    children:
                      no.buildProgress >= 1
                        ? 'Open for crossing'
                        : `${Math.round(no.buildProgress * 100)}% built \xB7 ${((1 - no.buildProgress) * bridgeDays(no)).toFixed(1)} island days left`,
                  }),
                  (0, jsxRuntime.jsx)('button', {
                    className: 'cancel-construction',
                    onClick: () => {
                      (removeBridge(t.current, no.id), Pe(null), ze());
                    },
                    children: no.buildProgress < 1 ? 'Cancel \xB7 recover 50%' : 'Remove bridge',
                  }),
                ],
              }),
            [
              ['Moisture', Ya.moisture],
              ['Fertility', Ya.soil],
              ...(Ya.toxicity > 0.01 ? [['Fouled ground', Ya.toxicity]] : []),
              ...(Ya.radiation > 0.01 ? [['Taint', Ya.radiation]] : []),
            ].map(([S, B]) =>
              (0, jsxRuntime.jsxs)(
                'div',
                {
                  className: 'condition',
                  children: [
                    (0, jsxRuntime.jsx)('span', { children: S }),
                    (0, jsxRuntime.jsx)('meter', {
                      min: '0',
                      max: '1',
                      value: Number(B),
                      'aria-label': String(S),
                    }),
                    (0, jsxRuntime.jsxs)('b', { children: [Math.round(Number(B) * 100), '%'] }),
                  ],
                },
                String(S),
              ),
            ),
          ],
        }),
      (0, jsxRuntime.jsxs)('div', {
        className: 'camera-controls',
        children: [
          (0, jsxRuntime.jsx)('button', {
            className: 'icon-button map-toggle',
            'aria-label': N ? 'Hide island map' : 'Show island map',
            'aria-expanded': N,
            onClick: () => O((S) => !S),
            children: (0, jsxRuntime.jsx)(sp, { size: 18 }),
          }),
          (0, jsxRuntime.jsxs)('button', {
            className: 'roads-shortcut',
            'aria-label': 'Build roads',
            onClick: () => {
              (c('roads'), d(0), l(!0), Pe(null));
            },
            children: [
              (0, jsxRuntime.jsx)(Cd, { size: 18 }),
              (0, jsxRuntime.jsx)('span', { children: 'Roads' }),
            ],
          }),
          (0, jsxRuntime.jsx)('button', {
            className: `icon-button ${C ? '' : 'active'}`,
            'aria-label': 'Move and inspect',
            onClick: () => {
              (ga(), l(!1));
            },
            children: (0, jsxRuntime.jsx)(H4, { size: 19 }),
          }),
          (0, jsxRuntime.jsx)('span', { className: 'control-divider' }),
          (0, jsxRuntime.jsx)('button', {
            className: 'icon-button',
            'aria-label': 'Zoom in',
            onClick: () => a.current?.zoom(1.25),
            children: (0, jsxRuntime.jsx)(Td, { size: 20 }),
          }),
          (0, jsxRuntime.jsxs)('span', { className: 'zoom-label', children: [Math.round(zt * 100), '%'] }),
          (0, jsxRuntime.jsx)('button', {
            className: 'icon-button',
            'aria-label': 'Zoom out',
            onClick: () => a.current?.zoom(0.8),
            children: (0, jsxRuntime.jsx)($4, { size: 20 }),
          }),
          (0, jsxRuntime.jsx)('button', {
            className: 'icon-button',
            'aria-label': 'Return to settlement',
            onClick: () => a.current?.home(),
            children: (0, jsxRuntime.jsx)(Y4, { size: 18 }),
          }),
          (0, jsxRuntime.jsx)('button', {
            className: 'icon-button',
            'aria-label': 'Fit whole island',
            onClick: () => a.current?.fit(),
            children: (0, jsxRuntime.jsx)(G0, { size: 18 }),
          }),
        ],
      }),
      (0, jsxRuntime.jsxs)('div', {
        className: 'bottom-dock',
        children: [
          (0, jsxRuntime.jsx)('div', {
            className: 'notice-slot',
            'data-threat': !!t.current.frontier.pending,
            'data-stale': o && cn.id <= T9,
            children:
              oa && !ut
                ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                    children: [
                      cn.text &&
                        (0, jsxRuntime.jsx)(
                          'p',
                          { className: 'island-notice tool-notice', role: 'status', children: cn.text },
                          cn.id,
                        ),
                      (0, jsxRuntime.jsxs)('div', {
                        className: 'selected-chip',
                        children: [
                          (0, jsxRuntime.jsx)(Icon, { name: oa.icon, size: 17 }),
                          (0, jsxRuntime.jsx)('strong', { children: oa.name }),
                          (0, jsxRuntime.jsxs)('span', {
                            children: [
                              oa.materials
                                ? costLabel(oa)
                                : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                                    children: [(0, jsxRuntime.jsx)(Nr, { size: 13 }), oa.cost],
                                  }),
                              isBridge(oa.id)
                                ? ' / section \xB7 tap water to span'
                                : oa.category === 'roads'
                                  ? ' / tile \xB7 drag to paint'
                                  : Hr.includes(oa.id)
                                    ? ' / section \xB7 drag to paint'
                                    : Ia[oa.id]
                                      ? ` \xB7 ${buildTime(Ia[oa.id])} to build`
                                      : ' \xB7 tap to place',
                            ],
                          }),
                          (0, jsxRuntime.jsx)('button', {
                            'aria-label': 'Stop placing supplies',
                            onClick: ga,
                            children: (0, jsxRuntime.jsx)(Zn, { size: 15 }),
                          }),
                        ],
                      }),
                    ],
                  })
                : (0, jsxRuntime.jsx)(
                    'p',
                    { className: 'island-notice', role: 'status', children: cn.text },
                    cn.id,
                  ),
          }),
          (0, jsxRuntime.jsxs)('div', {
            className: 'simulation-controls',
            children: [
              (0, jsxRuntime.jsxs)('div', {
                className: 'clock-block',
                children: [
                  (0, jsxRuntime.jsx)(P0, { size: 18 }),
                  (0, jsxRuntime.jsxs)('div', {
                    children: [
                      (0, jsxRuntime.jsxs)('strong', {
                        children: [
                          jn.name,
                          ' \xB7 Day ',
                          n.day,
                          (0, jsxRuntime.jsxs)('span', {
                            children: [' \xB7 ', String(n.hour).padStart(2, '0'), ':00'],
                          }),
                        ],
                      }),
                      (0, jsxRuntime.jsx)('small', {
                        children: E ? 'Time is paused' : b === 1 ? 'Settlement time' : `${b}\xD7 time-lapse`,
                      }),
                    ],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)('div', {
                className: 'time-controls',
                children: [
                  (0, jsxRuntime.jsx)('button', {
                    className: 'play-button',
                    disabled: !t.current.story.started,
                    'aria-label': E ? 'Resume time' : 'Pause time',
                    onClick: () => V((S) => !S),
                    children: E
                      ? (0, jsxRuntime.jsx)($0, { size: 17, fill: 'currentColor' })
                      : (0, jsxRuntime.jsx)(ts, { size: 17, fill: 'currentColor' }),
                  }),
                  (0, jsxRuntime.jsx)('div', {
                    className: 'speed-options',
                    role: 'group',
                    'aria-label': 'Time-lapse speed',
                    children: [1, 3, 10, 20].map((S) =>
                      (0, jsxRuntime.jsxs)(
                        'button',
                        {
                          disabled: !t.current.story.started,
                          'aria-label': `${S} times speed`,
                          'aria-pressed': b === S,
                          className: b === S ? 'active' : '',
                          onClick: () => {
                            (A(S), V(!1));
                          },
                          children: [S, '\xD7'],
                        },
                        S,
                      ),
                    ),
                  }),
                  (0, jsxRuntime.jsxs)('button', {
                    className: `skip-day skip-ahead ${za ? 'active' : ''}`,
                    disabled: !t.current.story.started,
                    'aria-pressed': za,
                    'aria-label': 'Skip ahead until something needs you',
                    title:
                      'Fast-forwards up to 30 days and stops when a building finishes, a threat appears, goals are met or an order is ready',
                    onClick: () => (za ? un('Skip ahead stopped.') : zg()),
                    children: [
                      (0, jsxRuntime.jsx)(Jl, { size: 16 }),
                      (0, jsxRuntime.jsx)('span', { children: za ? `Day ${n.day} \xB7 stop` : 'Skip ahead' }),
                    ],
                  }),
                  t.current.story.mode === 'sandbox' &&
                    (0, jsxRuntime.jsxs)('button', {
                      className: 'skip-day',
                      disabled: !t.current.story.started,
                      'aria-label': 'Fast-forward one day',
                      onClick: () => {
                        (advanceWorld(t.current, 1), ze());
                      },
                      children: [
                        (0, jsxRuntime.jsx)(Jl, { size: 16 }),
                        (0, jsxRuntime.jsx)('span', { children: '+1 day' }),
                      ],
                    }),
                ],
              }),
              (0, jsxRuntime.jsx)('div', {
                className: 'weather-control',
                children: (0, jsxRuntime.jsxs)(Select, {
                  value: Z,
                  onValueChange: (S) => {
                    (setWeather(t.current, S), ze());
                  },
                  children: [
                    (0, jsxRuntime.jsxs)(SelectTrigger, {
                      disabled: t.current.story.mode === 'campaign',
                      title:
                        t.current.story.mode === 'campaign'
                          ? 'Expedition weather follows the forecast in your journal'
                          : 'Choose weather',
                      className: 'weather-trigger',
                      'aria-label': 'Island weather',
                      children: [
                        (0, jsxRuntime.jsx)(Icon, { name: Z === 'auto' ? 'sparkles' : mh.icon, size: 21 }),
                        (0, jsxRuntime.jsxs)('span', {
                          children: [
                            (0, jsxRuntime.jsx)('small', {
                              children: t.current.story.mode === 'campaign' ? 'FORECAST' : 'WEATHER',
                            }),
                            (0, jsxRuntime.jsx)(SelectValue, {
                              children: (0, jsxRuntime.jsx)('span', {
                                children: Z === 'auto' ? 'Natural cycle' : mh.name,
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)(SelectContent, {
                      position: 'popper',
                      side: 'top',
                      className: 'weather-menu',
                      children: [
                        Ur.map((S) =>
                          (0, jsxRuntime.jsx)(
                            SelectItem,
                            {
                              value: S.id,
                              children: (0, jsxRuntime.jsxs)('span', {
                                className: 'weather-option',
                                children: [
                                  (0, jsxRuntime.jsx)(Icon, { name: S.icon, size: 17 }),
                                  (0, jsxRuntime.jsx)('span', { children: S.name }),
                                ],
                              }),
                            },
                            S.id,
                          ),
                        ),
                        (0, jsxRuntime.jsx)(SelectItem, {
                          value: 'auto',
                          children: (0, jsxRuntime.jsxs)('span', {
                            className: 'weather-option',
                            children: [(0, jsxRuntime.jsx)(cp, { size: 17 }), 'Natural cycle'],
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
              }),
            ],
          }),
          (0, jsxRuntime.jsxs)('div', {
            className: 'dock-footnote',
            children: [
              (0, jsxRuntime.jsx)('span', { children: 'Hand: pan \xB7 scroll or pinch: zoom' }),
              (0, jsxRuntime.jsx)('span', {
                children:
                  t.current.story.mode === 'campaign'
                    ? `Chapter ${t.current.story.chapter + 1} \xB7 The Haven charter`
                    : 'Free build',
              }),
            ],
          }),
        ],
      }),
      j &&
        sr &&
        (0, jsxRuntime.jsxs)('div', {
          className: 'placement-bar',
          'aria-label': 'Confirm building placement',
          children: [
            (0, jsxRuntime.jsxs)('div', {
              children: [
                (0, jsxRuntime.jsx)('strong', { children: CATALOG_ITEMS.find((S) => S.id === j.id)?.name }),
                (0, jsxRuntime.jsx)('small', {
                  children: sr.ok
                    ? isBridge(j.id)
                      ? sr.reason
                      : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                          children: [
                            (0, jsxRuntime.jsxs)('span', {
                              className: 'delta loss',
                              children: [
                                Ga.filter((S) => itemCost(CATALOG_ITEMS.find((B) => B.id === j.id))[S.id] > 0)
                                  .map(
                                    (S) =>
                                      `${signed(-itemCost(CATALOG_ITEMS.find((B) => B.id === j.id))[S.id])} ${S.name.toLowerCase()}`,
                                  )
                                  .join(' '),
                                ' now',
                              ],
                            }),
                            ' \xB7 ',
                            ['watchtower', 'palisade', 'guardhall'].includes(j.id)
                              ? {
                                  watchtower: '+6 defense',
                                  palisade: '+4 defense',
                                  guardhall: '6 guard beds',
                                }[j.id]
                              : (sr.rate ?? 0) > 0
                                ? (0, jsxRuntime.jsx)(Flows, { flows: buildingFlows(j.id, sr.rate ?? 0) })
                                : 'no output on this site',
                          ],
                        })
                    : sr.reason,
                }),
              ],
            }),
            (0, jsxRuntime.jsxs)('button', {
              className: 'rotate-building',
              onClick: () => y((S) => (S ? 0 : 1)),
              'aria-label': 'Rotate building preview',
              'aria-pressed': w === 1,
              children: [(0, jsxRuntime.jsx)(V0, { size: 17 }), 'Turn'],
            }),
            (0, jsxRuntime.jsxs)('button', {
              className: `confirm-build ${ph ? 'confirm-warn' : ''}`,
              disabled: !sr.ok,
              onClick: () => {
                if (ph && ug !== gh) {
                  (dg(gh), haptic('warning'));
                  return;
                }
                ch(j.id, j.p.x, j.p.y).ok && (ga(), dg(''), cg(!0), setTimeout(() => cg(!1), 450));
              },
              children: [
                (0, jsxRuntime.jsx)(Er, { size: 18 }),
                ph ? (ug === gh ? 'Build anyway' : 'No output here') : 'Build here',
              ],
            }),
            (0, jsxRuntime.jsx)('button', {
              className: 'cancel-placement',
              'aria-label': 'Cancel building placement',
              onClick: ga,
              children: (0, jsxRuntime.jsx)(Zn, { size: 20 }),
            }),
          ],
        }),
      (() => {
        let S = readyOrders(t.current),
          B = t.current.story.started,
          ae = String(n.hour).padStart(2, '0');
        return (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
          children: [
            (0, jsxRuntime.jsxs)('div', {
              className: `hud-time ${za ? 'is-skipping' : ''}`,
              children: [
                (0, jsxRuntime.jsx)('button', {
                  className: 'hud-play',
                  disabled: !B,
                  'aria-label': E ? 'Resume time' : 'Pause time',
                  onClick: () => {
                    (haptic(), Nt.tap(), V((se) => !se));
                  },
                  children: E
                    ? (0, jsxRuntime.jsx)($0, { size: 16, fill: 'currentColor' })
                    : (0, jsxRuntime.jsx)(ts, { size: 16, fill: 'currentColor' }),
                }),
                (0, jsxRuntime.jsxs)('button', {
                  className: 'hud-clock',
                  'aria-label': `Day ${n.day}, ${jn.name}. Open time controls`,
                  onClick: () => {
                    (haptic(), Nt.tap(), W('time'), l(!1), Pe(null), O(!1));
                  },
                  children: [
                    (0, jsxRuntime.jsx)(Icon, { name: ['rain', 'sun', 'leaf', 'snow'][jn.index], size: 17 }),
                    (0, jsxRuntime.jsxs)('span', {
                      children: [
                        (0, jsxRuntime.jsxs)('strong', { children: ['Day ', n.day] }),
                        (0, jsxRuntime.jsx)('small', {
                          children: za ? 'Skipping\u2026' : E ? 'Paused' : `${ae}:00 \xB7 ${b}\xD7`,
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
            B &&
              !N9 &&
              !za &&
              !o &&
              !j &&
              !localFlag('skip-taught') &&
              (n.constructing > 0 ||
                (t.current.story.mode === 'campaign' &&
                  t.current.story.chapter === 3 &&
                  campaignObjectives(t.current).every((se) => se.done))) &&
              (0, jsxRuntime.jsxs)('div', {
                className: 'coach-bubble',
                role: 'note',
                children: [
                  (0, jsxRuntime.jsxs)('button', {
                    className: 'coach-open',
                    onClick: () => {
                      (haptic(), setLocalFlag('skip-taught'), fg(!0), W('time'));
                    },
                    children: [
                      (0, jsxRuntime.jsx)(Jl, { size: 16 }),
                      (0, jsxRuntime.jsxs)('span', {
                        children: [
                          (0, jsxRuntime.jsx)('b', { children: 'Waiting for builders?' }),
                          ' Skip ahead fast-forwards until something needs you.',
                        ],
                      }),
                    ],
                  }),
                  (0, jsxRuntime.jsx)('button', {
                    className: 'coach-x',
                    'aria-label': 'Dismiss tip',
                    onClick: () => {
                      (setLocalFlag('skip-taught'), fg(!0));
                    },
                    children: (0, jsxRuntime.jsx)(Zn, { size: 14 }),
                  }),
                ],
              }),
            n.ready > 0 &&
              !j &&
              (0, jsxRuntime.jsxs)('button', {
                className: 'harvest-fab',
                onClick: () => {
                  (haptic('success'), Nt.coin(), collectGoods(t.current), ze());
                },
                'aria-label': `Collect ${n.ready} ready goods`,
                children: [
                  (0, jsxRuntime.jsx)(as, { size: 24 }),
                  (0, jsxRuntime.jsx)('b', { children: n.ready > 999 ? '999+' : n.ready }),
                ],
              }),
            (0, jsxRuntime.jsxs)('nav', {
              className: `tab-bar ${j ? 'has-placement' : ''} ${E9 ? 'guard' : ''}`,
              'aria-label': 'Island actions',
              children: [
                (0, jsxRuntime.jsxs)('button', {
                  className: 'tab tab-orders',
                  'aria-label': `Orders and folio${S ? `, ${S} ready to claim` : ''}`,
                  onClick: () => {
                    (haptic(), Nt.tap(), ga(), l(!1), at('orders'), Fe(!0));
                  },
                  children: [
                    (0, jsxRuntime.jsxs)('span', {
                      className: 'tab-icon',
                      children: [
                        (0, jsxRuntime.jsx)(q0, { size: 23 }),
                        S > 0 && (0, jsxRuntime.jsx)('b', { className: 'tab-badge', children: S }),
                        !ordersUnlocked(t.current) &&
                          (0, jsxRuntime.jsx)('i', { className: 'tab-lock', 'aria-hidden': 'true' }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('span', { className: 'tab-label', children: 'Orders' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)('button', {
                  className: `tab tab-army ${xa ? 'alert' : ''}`,
                  'aria-label': xa
                    ? `Army: ${xa.title}, Day ${xa.dueDay}`
                    : `Army, ${t.current.frontier.garrison} soldiers`,
                  onClick: () => {
                    (haptic(), Nt.tap(), ga(), l(!1), re(!0));
                  },
                  children: [
                    (0, jsxRuntime.jsxs)('span', {
                      className: 'tab-icon',
                      children: [
                        (0, jsxRuntime.jsx)(Yn, { size: 23 }),
                        xa
                          ? (0, jsxRuntime.jsx)('b', { className: 'tab-badge', children: '!' })
                          : t.current.frontier.garrison > 0
                            ? (0, jsxRuntime.jsx)('i', {
                                className: 'tab-count',
                                children: t.current.frontier.garrison,
                              })
                            : t.current.story.mode === 'campaign' && !frontierActive(t.current)
                              ? (0, jsxRuntime.jsx)('i', { className: 'tab-lock', 'aria-hidden': 'true' })
                              : null,
                      ],
                    }),
                    (0, jsxRuntime.jsx)('span', { className: 'tab-label', children: 'Army' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)('button', {
                  className: 'tab tab-build',
                  'aria-expanded': o,
                  'aria-label': o ? 'Close build menu' : 'Build',
                  onClick: () => {
                    (haptic(), Nt.tap(), o ? l(!1) : dh());
                  },
                  children: [
                    (0, jsxRuntime.jsx)('span', {
                      className: 'build-orb',
                      children: o
                        ? (0, jsxRuntime.jsx)(Zn, { size: 26, strokeWidth: 2.5 })
                        : (0, jsxRuntime.jsx)(sv, { size: 25, strokeWidth: 2 }),
                    }),
                    (0, jsxRuntime.jsx)('span', { className: 'tab-label', children: o ? 'Close' : 'Build' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)('button', {
                  className: 'tab tab-market',
                  'aria-label': 'Market and trade',
                  onClick: () => {
                    (haptic(), Nt.tap(), ga(), l(!1), M('trade'), g(!0));
                  },
                  children: [
                    (0, jsxRuntime.jsx)('span', {
                      className: 'tab-icon',
                      children: (0, jsxRuntime.jsx)(Ed, { size: 23 }),
                    }),
                    (0, jsxRuntime.jsx)('span', { className: 'tab-label', children: 'Market' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)('button', {
                  className: 'tab tab-more',
                  'aria-label': 'More: goals, map, music, settings',
                  onClick: () => {
                    (haptic(), Nt.tap(), W('menu'), l(!1), Pe(null), O(!1));
                  },
                  children: [
                    (0, jsxRuntime.jsxs)('span', {
                      className: 'tab-icon',
                      children: [
                        (0, jsxRuntime.jsx)(cv, { size: 22 }),
                        he.failing &&
                          (0, jsxRuntime.jsx)('b', {
                            className: 'tab-badge warn',
                            'aria-label': 'Not saved to the cloud',
                            children: '!',
                          }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('span', { className: 'tab-label', children: 'More' }),
                  ],
                }),
              ],
            }),
          ],
        });
      })(),
      C &&
        !j &&
        (0, jsxRuntime.jsxs)('div', {
          className: 'mobile-tool-hint',
          children: [
            (0, jsxRuntime.jsxs)('span', {
              children: [
                (0, jsxRuntime.jsx)('strong', { children: oa?.name }),
                oa && isBridge(oa.id)
                  ? ' \xB7 Tap the water'
                  : oa && isBuildingItem(oa)
                    ? ' \xB7 Tap the ground'
                    : Hr.includes(C)
                      ? ' \xB7 Drag to paint'
                      : ' \xB7 Tap to place',
              ],
            }),
            (0, jsxRuntime.jsx)('button', {
              'aria-label': 'Cancel selected tool',
              onClick: ga,
              children: (0, jsxRuntime.jsx)(Zn, { size: 20 }),
            }),
          ],
        }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: Y !== null,
        onOpenChange: (S) => {
          S || W(null);
        },
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: `mobile-control-dialog sheet-${Bs}`,
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: Bs === 'time' ? 'Island time' : 'More' }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              className: Bs === 'menu' ? 'sr-only' : '',
              children:
                Bs === 'time'
                  ? `${jn.name}, Year ${jn.year} \xB7 ${mh.name} \xB7 ${E ? 'Paused' : 'Time resumes when this panel closes.'}`
                  : 'Plan your island, manage resources, or adjust your game.',
            }),
            Bs === 'time'
              ? (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                  children: [
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'time-hero',
                      children: [
                        (0, jsxRuntime.jsx)('span', {
                          className: 'time-hero-icon',
                          children: (0, jsxRuntime.jsx)(Icon, {
                            name: ['rain', 'sun', 'leaf', 'snow'][jn.index],
                            size: 26,
                          }),
                        }),
                        (0, jsxRuntime.jsxs)('div', {
                          children: [
                            (0, jsxRuntime.jsxs)('strong', {
                              children: [
                                'Day ',
                                n.day,
                                ' ',
                                (0, jsxRuntime.jsxs)('span', {
                                  children: ['\xB7 ', String(n.hour).padStart(2, '0'), ':00'],
                                }),
                              ],
                            }),
                            (0, jsxRuntime.jsxs)('small', {
                              children: [
                                E ? 'Paused' : za ? 'Skipping ahead' : `${b}\xD7 time`,
                                ' \xB7 ',
                                jn.remaining,
                                ' days to ',
                                jn.next.toLowerCase(),
                              ],
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'segmented',
                      role: 'group',
                      'aria-label': 'Time speed',
                      children: [
                        (0, jsxRuntime.jsx)('button', {
                          'aria-label': 'Pause time',
                          'aria-pressed': E,
                          onClick: () => {
                            (haptic(), Nt.tap(), V(!0), W(null));
                          },
                          children: (0, jsxRuntime.jsx)(ts, { size: 16, fill: 'currentColor' }),
                        }),
                        [1, 3, 10, 20].map((S) =>
                          (0, jsxRuntime.jsxs)(
                            'button',
                            {
                              'aria-label': `Set speed ${S} times`,
                              'aria-pressed': b === S && !E,
                              onClick: () => {
                                (haptic(), Nt.tap(), A(S), V(!1), W(null));
                              },
                              children: [S, '\xD7'],
                            },
                            S,
                          ),
                        ),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('button', {
                      className: `skip-card ${za ? 'active' : ''}`,
                      disabled: !t.current.story.started,
                      onClick: () => {
                        (haptic(), Nt.tap(), za ? un('Skip ahead stopped.') : zg());
                      },
                      children: [
                        (0, jsxRuntime.jsx)('span', {
                          className: 'row-icon tone-blue',
                          children: (0, jsxRuntime.jsx)(Jl, { size: 18 }),
                        }),
                        (0, jsxRuntime.jsxs)('span', {
                          className: 'row-text',
                          children: [
                            (0, jsxRuntime.jsx)('b', { children: za ? 'Stop skipping' : 'Skip ahead' }),
                            (0, jsxRuntime.jsx)('small', {
                              children:
                                'Up to 30 days. Stops when a building finishes, a threat appears, goals are met or an order is ready.',
                            }),
                          ],
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'list-group',
                      children: [
                        (0, jsxRuntime.jsxs)('button', {
                          className: `list-row ${xa ? 'danger' : ''}`,
                          onClick: () => {
                            (haptic(), Nt.tap(), W(null), re(!0));
                          },
                          children: [
                            (0, jsxRuntime.jsx)('span', {
                              className: `row-icon ${xa ? 'tone-red' : 'tone-green'}`,
                              children: (0, jsxRuntime.jsx)(Yn, { size: 17 }),
                            }),
                            (0, jsxRuntime.jsxs)('span', {
                              className: 'row-text',
                              children: [
                                (0, jsxRuntime.jsx)('b', { children: xa ? xa.title : 'Army & seasons' }),
                                (0, jsxRuntime.jsx)('small', {
                                  children: xa
                                    ? `Expected Day ${xa.dueDay} \xB7 prepare defenses`
                                    : `${jn.next} in ${jn.remaining} days`,
                                }),
                              ],
                            }),
                            (0, jsxRuntime.jsx)(qn, { size: 17, className: 'row-chevron' }),
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('label', {
                          className: 'list-row toggle-row',
                          children: [
                            (0, jsxRuntime.jsx)('span', {
                              className: 'row-icon tone-ochre',
                              children: (0, jsxRuntime.jsx)(as, { size: 17 }),
                            }),
                            (0, jsxRuntime.jsxs)('span', {
                              className: 'row-text',
                              children: [
                                (0, jsxRuntime.jsx)('b', { children: 'Auto-collect harvests' }),
                                (0, jsxRuntime.jsx)('small', {
                                  children: 'Goods go straight to your stores',
                                }),
                              ],
                            }),
                            (0, jsxRuntime.jsx)('input', {
                              type: 'checkbox',
                              className: 'switch',
                              checked: t.current.autoCollect,
                              onChange: (S) => {
                                (haptic(), (t.current.autoCollect = S.target.checked), ze());
                              },
                            }),
                          ],
                        }),
                        t.current.story.mode === 'sandbox' &&
                          (0, jsxRuntime.jsxs)('label', {
                            className: 'list-row mobile-weather',
                            children: [
                              (0, jsxRuntime.jsx)('span', {
                                className: 'row-icon tone-blue',
                                children: (0, jsxRuntime.jsx)(E4, { size: 17 }),
                              }),
                              (0, jsxRuntime.jsx)('span', {
                                className: 'row-text',
                                children: (0, jsxRuntime.jsx)('b', { children: 'Weather' }),
                              }),
                              (0, jsxRuntime.jsxs)('select', {
                                'aria-label': 'Choose free-build weather',
                                value: Z,
                                onChange: (S) => {
                                  (setWeather(t.current, S.target.value), ze());
                                },
                                children: [
                                  Ur.map((S) =>
                                    (0, jsxRuntime.jsx)('option', { value: S.id, children: S.name }, S.id),
                                  ),
                                  (0, jsxRuntime.jsx)('option', { value: 'auto', children: 'Natural cycle' }),
                                ],
                              }),
                            ],
                          }),
                        t.current.story.mode === 'sandbox' &&
                          (0, jsxRuntime.jsxs)('button', {
                            className: 'list-row',
                            onClick: () => {
                              (haptic(), Nt.tap(), advanceWorld(t.current, 1), ze());
                            },
                            children: [
                              (0, jsxRuntime.jsx)('span', {
                                className: 'row-icon tone-teal',
                                children: (0, jsxRuntime.jsx)(Jl, { size: 17 }),
                              }),
                              (0, jsxRuntime.jsx)('span', {
                                className: 'row-text',
                                children: (0, jsxRuntime.jsx)('b', { children: 'Advance one day' }),
                              }),
                            ],
                          }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('p', {
                      className: 'sheet-footnote',
                      children: 'Buildings take island time to finish. Time pauses while menus are open.',
                    }),
                  ],
                })
              : (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                  children: [
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'more-hero',
                      children: [
                        (0, jsxRuntime.jsx)(Emblem, { size: 52, plate: !0 }),
                        (0, jsxRuntime.jsxs)('div', {
                          children: [
                            (0, jsxRuntime.jsx)('strong', {
                              children:
                                t.current.story.mode === 'campaign'
                                  ? `Chapter ${t.current.story.chapter + 1} \xB7 Haven charter`
                                  : 'Free build',
                            }),
                            (0, jsxRuntime.jsx)('small', { children: he.status }),
                          ],
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'more-stats',
                      children: [
                        (0, jsxRuntime.jsxs)('span', {
                          children: [
                            (0, jsxRuntime.jsx)('b', { children: n.population }),
                            (0, jsxRuntime.jsx)('small', { children: 'settlers' }),
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('span', {
                          children: [
                            (0, jsxRuntime.jsx)('b', { children: n.buildings }),
                            (0, jsxRuntime.jsx)('small', { children: 'buildings' }),
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('span', {
                          children: [
                            (0, jsxRuntime.jsx)('b', { children: n.plants }),
                            (0, jsxRuntime.jsx)('small', { children: 'plants' }),
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('span', {
                          children: [
                            (0, jsxRuntime.jsx)('b', { children: n.animals }),
                            (0, jsxRuntime.jsx)('small', { children: 'animals' }),
                          ],
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'list-group',
                      role: 'group',
                      'aria-label': 'Your island',
                      children: [
                        (0, jsxRuntime.jsx)(Row, {
                          icon: Ql,
                          tone: 'green',
                          label: 'Goals & story',
                          sub: 'Chapter goals, rewards and forecast',
                          onClick: () => {
                            (W(null), Re(!0));
                          },
                        }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: sp,
                          tone: 'blue',
                          label: 'Island map',
                          sub: 'Travel to any district',
                          onClick: () => {
                            (ga(), W(null), O(!0));
                          },
                        }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: as,
                          tone: 'ochre',
                          label: 'Daily ledger',
                          sub: 'Output, costs and upkeep',
                          onClick: () => {
                            (W(null), M('ledger'), g(!0));
                          },
                        }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: Cd,
                          tone: 'brown',
                          label: 'Roads & bridges',
                          onClick: () => dh('roads'),
                        }),
                        oh.can &&
                          (0, jsxRuntime.jsx)(Row, {
                            icon: G0,
                            tone: 'blue',
                            label: oh.on ? 'Exit full screen' : 'Full screen',
                            sub: 'Hide the browser and system bars',
                            onClick: () => {
                              (W(null), _9());
                            },
                          }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: G0,
                          tone: 'teal',
                          label: 'Scenic view',
                          sub: 'Hide the controls',
                          onClick: () => {
                            (ga(), W(null), Be(!0));
                          },
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'list-group',
                      role: 'group',
                      'aria-label': 'Game',
                      children: [
                        (0, jsxRuntime.jsx)(Row, {
                          icon: es,
                          tone: 'red',
                          label: 'Music',
                          sub: 'The northern consort \xB7 25 pieces',
                          onClick: () => {
                            (W(null), window.dispatchEvent(new Event('tideweald:music')));
                          },
                        }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: hp,
                          tone: 'purple',
                          label: 'Look & settings',
                          sub: 'Art style, battery saver, text size',
                          onClick: () => {
                            (W(null), Wc(!0));
                          },
                        }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: Yn,
                          tone: 'green',
                          label: 'Saved progress',
                          sub: he.status,
                          onClick: () => {
                            (W(null), U(!0));
                          },
                        }),
                        (0, jsxRuntime.jsx)(Row, {
                          icon: ip,
                          tone: 'blue',
                          label: 'How to play',
                          onClick: () => {
                            (W(null), X(!0));
                          },
                        }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('div', {
                      className: 'list-group',
                      role: 'group',
                      'aria-label': 'Start again',
                      children: (0, jsxRuntime.jsx)(Row, {
                        icon: V0,
                        tone: 'red',
                        danger: !0,
                        label: 'New island',
                        onClick: () => {
                          (W(null), je(!0));
                        },
                      }),
                    }),
                  ],
                }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(OrdersPanel, {
        world: t.current,
        open: Xe,
        onOpen: Fe,
        onChange: ze,
        tab: ct,
        onTab: at,
        visual: (S) => (0, jsxRuntime.jsx)(ItemVisual, { item: S }),
      }),
      (0, jsxRuntime.jsx)(FrontierPanel, {
        world: t.current,
        open: de,
        onOpen: re,
        onChange: ze,
        onBuild: (S) => {
          (ga(), l(!1), R(S), Tn(CATALOG_ITEMS.find((B) => B.id === S)?.description ?? ''));
        },
        onThreatLocate: () => {
          let S = raidLocation(t.current);
          S && (ga(), l(!1), O(!1), a.current?.home(), a.current?.focus(S.spotted ? S.focus : S.target));
        },
        onLocate: () => {
          let S = locateArmy(t.current);
          S &&
            (ga(),
            l(!1),
            Pe(null),
            O(!1),
            a.current?.home(),
            a.current?.focus(S),
            announce(
              t.current,
              `${t.current.frontier.garrison} soldiers move near their Guard halls, marked with blue circles. Close panels and resume time to watch formations.`,
            ),
            ze());
        },
      }),
      oa &&
        cn.text &&
        !j &&
        (0, jsxRuntime.jsx)('p', { className: 'mobile-feedback', role: 'status', children: cn.text }),
      ut &&
        (0, jsxRuntime.jsxs)('div', {
          className: 'drag-ghost',
          style: { left: ut.x, top: ut.y },
          children: [
            (0, jsxRuntime.jsx)(ItemVisual, { item: ut.item }),
            (0, jsxRuntime.jsx)('span', { children: ut.item.name }),
          ],
        }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: p,
        onOpenChange: g,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'market-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: 'The island market' }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              children: 'Trade surplus harvests for gold. Keep enough for upkeep and chapter deliveries.',
            }),
            (0, jsxRuntime.jsxs)(Tabs, {
              value: v,
              onValueChange: M,
              children: [
                (0, jsxRuntime.jsxs)(TabsList, {
                  className: 'market-tabs',
                  children: [
                    (0, jsxRuntime.jsx)(TabsTrigger, { value: 'trade', children: 'Trade goods' }),
                    (0, jsxRuntime.jsx)(TabsTrigger, { value: 'ledger', children: 'Daily ledger' }),
                  ],
                }),
                (0, jsxRuntime.jsxs)(TabsContent, {
                  value: 'trade',
                  children: [
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'market-balance',
                      children: [
                        (0, jsxRuntime.jsx)(Nr, { size: 22 }),
                        (0, jsxRuntime.jsx)('strong', {
                          children: Math.floor(n.wallet.gold).toLocaleString(),
                        }),
                        (0, jsxRuntime.jsx)('span', { children: 'gold available' }),
                      ],
                    }),
                    (0, jsxRuntime.jsx)('p', {
                      className: 'market-instruction',
                      children: 'Collect harvests first, then sell your stored goods.',
                    }),
                    (0, jsxRuntime.jsx)('div', {
                      className: 'trade-list',
                      children: Ga.filter((S) => S.id !== 'gold').map((S) =>
                        (0, jsxRuntime.jsxs)(
                          'div',
                          {
                            className: 'trade-row',
                            children: [
                              (0, jsxRuntime.jsx)(Icon, { name: S.icon, size: 26 }),
                              (0, jsxRuntime.jsxs)('div', {
                                children: [
                                  (0, jsxRuntime.jsx)('b', { children: S.name }),
                                  (0, jsxRuntime.jsxs)('span', {
                                    children: [
                                      Math.floor(n.wallet[S.id]),
                                      ' stored \xB7 ',
                                      (
                                        S.rate *
                                        tradeMultiplier(t.current) *
                                        priceFactor(t.current, S.id)
                                      ).toFixed(2),
                                      ' gold each',
                                      priceFactor(t.current, S.id) < 0.95 ? ' \xB7 recovering' : '',
                                    ],
                                  }),
                                ],
                              }),
                              (0, jsxRuntime.jsxs)('div', {
                                className: 'trade-buttons',
                                children: [
                                  [10, 100].map((B) =>
                                    (0, jsxRuntime.jsxs)(
                                      'button',
                                      {
                                        disabled: n.wallet[S.id] < B,
                                        'aria-label': `Sell ${B} ${S.name} for ${saleValue(t.current, S.id, B)} gold`,
                                        onClick: () => {
                                          (tradeGoods(t.current, S.id, B).ok &&
                                            (Nt.coin(), diaryLog('sale', t.current, `${B} ${S.id}`)),
                                            ze());
                                        },
                                        children: [
                                          'Sell ',
                                          B,
                                          (0, jsxRuntime.jsxs)('small', {
                                            children: ['+', saleValue(t.current, S.id, B).toLocaleString()],
                                          }),
                                        ],
                                      },
                                      B,
                                    ),
                                  ),
                                  (0, jsxRuntime.jsxs)('button', {
                                    disabled: n.wallet[S.id] < 1,
                                    className: 'sell-all',
                                    'aria-label': `Sell all ${S.name}`,
                                    onClick: () => {
                                      let B = Math.floor(t.current.wallet[S.id]);
                                      (tradeGoods(t.current, S.id, B).ok &&
                                        (Nt.coin(), diaryLog('sale', t.current, `${B} ${S.id} (all)`)),
                                        ze());
                                    },
                                    children: [
                                      'Sell all',
                                      (0, jsxRuntime.jsxs)('small', {
                                        children: [
                                          '+',
                                          saleValue(
                                            t.current,
                                            S.id,
                                            Math.floor(n.wallet[S.id]),
                                          ).toLocaleString(),
                                        ],
                                      }),
                                    ],
                                  }),
                                ],
                              }),
                            ],
                          },
                          S.id,
                        ),
                      ),
                    }),
                    (0, jsxRuntime.jsx)('p', {
                      className: 'market-note',
                      children:
                        'Farms, fisheries and fruit trees produce food. Selling a lot at once lowers the price for a few days.',
                    }),
                  ],
                }),
                (0, jsxRuntime.jsx)(TabsContent, {
                  value: 'ledger',
                  children:
                    Cn &&
                    (0, jsxRuntime.jsxs)('div', {
                      className: 'ledger-panel',
                      children: [
                        (0, jsxRuntime.jsx)('h3', { children: 'The next island day' }),
                        (0, jsxRuntime.jsx)('p', {
                          children:
                            'Current output, workshop inputs and daily upkeep. Rates change with weather, seasons, soil and morale. Food above the granary reserve spoils gradually.',
                        }),
                        (0, jsxRuntime.jsxs)('table', {
                          children: [
                            (0, jsxRuntime.jsx)('thead', {
                              children: (0, jsxRuntime.jsxs)('tr', {
                                children: [
                                  (0, jsxRuntime.jsx)('th', { children: 'Resource' }),
                                  (0, jsxRuntime.jsx)('th', { children: 'Output' }),
                                  (0, jsxRuntime.jsx)('th', { children: 'Costs' }),
                                  (0, jsxRuntime.jsx)('th', { children: 'Net / day' }),
                                ],
                              }),
                            }),
                            (0, jsxRuntime.jsx)('tbody', {
                              children: Cn.rows.map((S) =>
                                (0, jsxRuntime.jsxs)(
                                  'tr',
                                  {
                                    children: [
                                      (0, jsxRuntime.jsx)('th', {
                                        children: Ga.find((B) => B.id === S.resource)?.name,
                                      }),
                                      (0, jsxRuntime.jsx)('td', { children: S.gross.toFixed(1) }),
                                      (0, jsxRuntime.jsxs)('td', { children: ['\u2212', S.cost.toFixed(1)] }),
                                      (0, jsxRuntime.jsx)('td', {
                                        className: S.net < 0 ? 'ledger-short' : 'ledger-surplus',
                                        children: signed(Number(S.net.toFixed(1))),
                                      }),
                                    ],
                                  },
                                  S.resource,
                                ),
                              ),
                            }),
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('p', {
                          children: [
                            'Food reserve capacity: ',
                            Cn.foodCapacity.toLocaleString(),
                            '. Expected spoilage at dawn: ',
                            Cn.spoilage,
                            ' (included in upkeep).',
                          ],
                        }),
                        (0, jsxRuntime.jsxs)('p', {
                          children: [
                            t.current.autoCollect
                              ? 'Auto-collect is on.'
                              : 'Harvests wait in buildings until collected. Enable Auto-collect to move them to your stores.',
                            ' Workshop inputs are consumed while producing; upkeep comes out of your wallet at dawn.',
                          ],
                        }),
                        Cn.rows
                          .filter((S) => S.dawnShort)
                          .map((S) =>
                            (0, jsxRuntime.jsxs)(
                              'p',
                              {
                                className: 'ledger-alert',
                                children: [
                                  'Collect ',
                                  Math.ceil(S.upkeep - S.wallet),
                                  ' more ',
                                  S.resource,
                                  ' before dawn. ',
                                  S.ready,
                                  ' ready to harvest.',
                                ],
                              },
                              S.resource,
                            ),
                          ),
                        Cn.full > 0 &&
                          (0, jsxRuntime.jsxs)('p', {
                            className: 'ledger-alert',
                            children: [
                              Cn.full,
                              ' full storage ',
                              Cn.full === 1 ? 'site is' : 'sites are',
                              ' paused. Collect to restore output.',
                            ],
                          }),
                        Cn.stalled > 0 &&
                          (0, jsxRuntime.jsxs)('p', {
                            className: 'ledger-alert',
                            children: [
                              Cn.stalled,
                              ' completed ',
                              Cn.stalled === 1 ? 'building has' : 'buildings have',
                              ' no output. Tap a building to check its site.',
                            ],
                          }),
                        n.ready > 0 &&
                          (0, jsxRuntime.jsxs)('button', {
                            className: 'watch-build',
                            onClick: () => {
                              (collectGoods(t.current), ze());
                            },
                            children: ['Collect ', n.ready, ' ready goods'],
                          }),
                        (0, jsxRuntime.jsx)('p', {
                          className: 'ledger-note',
                          children:
                            'A snapshot of today\u2019s rates, not a guaranteed forecast. Trades, construction, chapter rewards and event losses are excluded.',
                        }),
                      ],
                    }),
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('p', { className: 'shop-feedback', role: 'status', children: cn.text }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: J,
        onOpenChange: X,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'help-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: 'How to play Tideweald' }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              children: 'Shape the land, feed your people, guard the harbor.',
            }),
            (0, jsxRuntime.jsxs)('ol', {
              className: 'help-steps',
              children: [
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Build.' }),
                    ' Tap Build, choose a card, tap the ground, then Build here. Gold is spent only when a placement succeeds. Buildings take island time to finish.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Pick good ground.' }),
                    ' Farms want moist soil, fisheries clean water, sawpits mature trees, quarries rock. Producers of the same kind share their ground, so spread them out. The bar under a placement shows what a site will make.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Use time.' }),
                    ' Tap the clock for speeds. Skip ahead fast-forwards until something needs you. Time pauses while a menu is open.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Trade and feed.' }),
                    ' Sell surplus in the Market. Prices dip when you sell a lot at once and recover over a few days. Settlers eat every day, buildings need timber for repairs and winter needs firewood; the Daily ledger shows the balance.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Roads and bridges.' }),
                    ' Drag roads to speed up nearby work. For a bridge, tap the water, Turn it across the banks, then confirm the full span.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Follow the story.' }),
                    ' 48 chapters lead from a first harvest to a town of 160. Goals are under More \u2192 Goals & story. Some chapters ask the council to decide between two paths.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Guard the village.' }),
                    ' Raiders and storms are announced days ahead under Army. Guards, watchtowers and palisades protect you; a raid that breaks through can burn a building.',
                  ],
                }),
                (0, jsxRuntime.jsxs)('li', {
                  children: [
                    (0, jsxRuntime.jsx)('b', { children: 'Wildlife moves in.' }),
                    ' Meadows, woods, flowers and clean water draw animals by themselves. Sheep and cattle must be bought.',
                  ],
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('p', {
              className: 'help-tip desktop-only',
              children:
                'Keyboard: Space pauses \xB7 1\u20134 set speed \xB7 B Build \xB7 M Market \xB7 O Orders \xB7 J journal \xB7 R turns a building \xB7 Escape cancels.',
            }),
            (0, jsxRuntime.jsxs)('p', {
              className: 'session-note',
              children: [
                he.deviceOnly
                  ? 'Your island is saved on this device every few seconds and whenever you leave the game.'
                  : 'Your island is saved on this device every few seconds and to the cloud every 15 seconds.',
                ' More \u2192 Saved progress can download a backup file or load one on another device.',
              ],
            }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: z,
        onOpenChange: U,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'save-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: 'Your island, kept safe' }),
            (0, jsxRuntime.jsxs)(DialogDescription, {
              children: [
                he.deviceOnly
                  ? 'Your island is saved on this device every few seconds and whenever you leave.'
                  : 'Saved on this device every few seconds and to the cloud every 15 seconds.',
                ' Time stops while you are away.',
              ],
            }),
            (0, jsxRuntime.jsx)('p', { className: 'save-message', role: 'status', children: he.status }),
            he.error &&
              (0, jsxRuntime.jsx)('p', { className: 'save-error', role: 'alert', children: he.error }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'save-actions',
              children: [
                (0, jsxRuntime.jsx)('button', {
                  onClick: () => {
                    he.save(!0);
                  },
                  disabled: he.phase !== 'ready' && he.phase !== 'unsaved',
                  children: 'Save now',
                }),
                (0, jsxRuntime.jsx)('button', {
                  onClick: () => {
                    he.download();
                  },
                  children: he.deviceOnly ? 'Export backup' : 'Download backup',
                }),
                (0, jsxRuntime.jsxs)('label', {
                  className: 'file-button',
                  children: [
                    'Load a backup file',
                    (0, jsxRuntime.jsx)('input', {
                      type: 'file',
                      accept: '.json,.txt,application/json,text/plain',
                      onChange: (S) => {
                        let B = S.target.files?.[0];
                        ((S.target.value = ''),
                          B &&
                            he.importFile(B).then((ae) => {
                              ae && U(!1);
                            }));
                      },
                    }),
                  ],
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('p', {
              className: 'save-hint',
              children:
                'Loading a file replaces the open island. The open island stays on this device under the copies below.',
            }),
            he.backups.map((S) =>
              (0, jsxRuntime.jsxs)(
                'div',
                {
                  className: 'device-backup',
                  children: [
                    (0, jsxRuntime.jsx)('b', {
                      children:
                        S.islandId === t.current.islandId
                          ? 'This island, on this device'
                          : 'Another island on this device',
                    }),
                    (0, jsxRuntime.jsx)('span', { children: describeBackup(S) }),
                    (0, jsxRuntime.jsx)('button', {
                      onClick: () => {
                        (U(!1), he.restoreLocal(S));
                      },
                      children: 'Restore this copy \xB7 replaces the open island',
                    }),
                  ],
                },
                S.savedAt,
              ),
            ),
            he.error &&
              (0, jsxRuntime.jsx)('button', {
                className: 'freebuild-link',
                onClick: () => {
                  (U(!1), he.load());
                },
                children: 'Reload the saved island \xB7 replaces this open session',
              }),
            (0, jsxRuntime.jsxs)('p', {
              children: [
                he.deviceOnly
                  ? 'To move your island to another device, download a backup here and load it there.'
                  : 'Open this game on another signed-in device to continue. A copy is also kept on this device every few seconds and whenever you leave.',
                ' Returning games start paused.',
              ],
            }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: he.phase === 'loading' || he.phase === 'error',
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'save-dialog',
          showCloseButton: !1,
          onEscapeKeyDown: (S) => S.preventDefault(),
          onPointerDownOutside: (S) => S.preventDefault(),
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, {
              children: he.phase === 'loading' ? 'Opening your island\u2026' : 'Your save is unavailable',
            }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              children: he.phase === 'loading' ? 'Loading your last expedition before you begin.' : he.error,
            }),
            he.phase === 'error' &&
              (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
                children: [
                  (0, jsxRuntime.jsxs)('div', {
                    className: 'save-actions',
                    children: [
                      (0, jsxRuntime.jsx)('button', {
                        onClick: () => {
                          he.load();
                        },
                        children: 'Retry loading',
                      }),
                      (0, jsxRuntime.jsx)('button', {
                        onClick: he.continueUnsaved,
                        children: 'Continue without saving',
                      }),
                    ],
                  }),
                  he.backup &&
                    (0, jsxRuntime.jsxs)('button', {
                      className: 'freebuild-link',
                      onClick: () => {
                        he.restoreLocal(he.backup);
                      },
                      children: ['Restore this device\u2019s copy \xB7 ', describeBackup(he.backup)],
                    }),
                  (0, jsxRuntime.jsx)('p', {
                    children:
                      'Continuing leaves your cloud island untouched. Progress is still kept on this device every few seconds.',
                  }),
                ],
              }),
          ],
        }),
      }),
      Ue &&
        (0, jsxRuntime.jsxs)('button', {
          className: 'exit-scenic',
          onClick: () => Be(!1),
          children: [(0, jsxRuntime.jsx)(Zn, { size: 18 }), 'Back to settlement'],
        }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: ih,
        onOpenChange: Wc,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'settings-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: 'Look & settings' }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              children: 'Stored on this device only. Nothing here changes your island or save.',
            }),
            (0, jsxRuntime.jsx)('div', {
              className: 'art-choices',
              role: 'radiogroup',
              'aria-label': 'Art style',
              children: [
                [
                  'carta',
                  'Carta',
                  'A hand-colored sea chart: engraved coasts, inked buildings, compass rose and night lanterns.',
                ],
                ['classic', 'Painted', 'The original painted look.'],
              ].map(([S, B, ae]) =>
                (0, jsxRuntime.jsxs)(
                  'button',
                  {
                    role: 'radio',
                    'aria-checked': Pc === S,
                    className: Pc === S ? 'chosen' : '',
                    onClick: () => setArtStyle(S),
                    children: [
                      (0, jsxRuntime.jsx)('span', {
                        className: `art-swatch art-${S}`,
                        'aria-hidden': 'true',
                      }),
                      (0, jsxRuntime.jsx)('b', { children: B }),
                      (0, jsxRuntime.jsx)('small', { children: ae }),
                    ],
                  },
                  S,
                ),
              ),
            }),
            (0, jsxRuntime.jsx)('div', {
              className: 'settings-list',
              children: [
                [
                  'batterySaver',
                  'Battery saver',
                  'Caps animation at 30 frames per second, draws at standard pixel density and does less background work. Good for long sessions on a phone.',
                ],
                [
                  'reducedMotion',
                  'Reduce motion',
                  'Stops water, weather and figure animation. Your device setting is also respected.',
                ],
                [
                  'statusIcons',
                  'Building signs',
                  'Small signs over buildings that are idle or have full storage, so problems show on the map.',
                ],
                [
                  'accessibleMarkers',
                  'Clear army markers',
                  'Adds a shape above every soldier: a round shield for yours, a pennant for raiders. Helpful for color-blind players.',
                ],
                ['largeText', 'Larger text', 'Enlarges interface text.'],
                [
                  'soundEffects',
                  'Sound effects',
                  'Soft sounds for building, harvests, finished work, raids and chapters. Music has its own controls.',
                ],
              ].map(([S, B, ae]) =>
                (0, jsxRuntime.jsxs)(
                  'label',
                  {
                    className: 'setting-row',
                    children: [
                      (0, jsxRuntime.jsx)('input', {
                        type: 'checkbox',
                        checked: hi[S],
                        onChange: (se) => updateSettings({ [S]: se.target.checked }),
                      }),
                      (0, jsxRuntime.jsxs)('span', {
                        children: [
                          (0, jsxRuntime.jsx)('b', { children: B }),
                          (0, jsxRuntime.jsx)('small', { children: ae }),
                        ],
                      }),
                    ],
                  },
                  S,
                ),
              ),
            }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'diary-row',
              children: [
                (0, jsxRuntime.jsxs)('label', {
                  className: 'setting-row',
                  children: [
                    (0, jsxRuntime.jsx)('input', {
                      type: 'checkbox',
                      checked: Uc,
                      onChange: (S) => {
                        (setDiaryEnabled(S.target.checked),
                          S.target.checked &&
                            t.current.cells.length &&
                            diarySession(t.current, nativePlatform()));
                      },
                    }),
                    (0, jsxRuntime.jsxs)('span', {
                      children: [
                        (0, jsxRuntime.jsx)('b', { children: 'Playtest diary' }),
                        (0, jsxRuntime.jsx)('small', {
                          children:
                            'For beta testers. Keeps a private log of your sessions, chapters and choices on this device, with your notes. Nothing is sent: you export one file and pass it on yourself.',
                        }),
                      ],
                    }),
                  ],
                }),
                Uc &&
                  (0, jsxRuntime.jsx)('button', {
                    className: 'diary-open',
                    onClick: () => {
                      (Wc(!1), Ls(''), gg(!0));
                    },
                    children: 'Open diary \xB7 write feedback',
                  }),
              ],
            }),
            (0, jsxRuntime.jsxs)('details', {
              className: 'credits',
              children: [
                (0, jsxRuntime.jsx)('summary', { children: 'Acknowledgements' }),
                (0, jsxRuntime.jsx)('p', {
                  children:
                    'Music: Renaissance pieces in the public domain; editions and licences are listed under Music. Heading type: IM Fell English by Igino Marini (SIL Open Font License 1.1). Icons: Lucide (ISC licence). Interface components: shadcn/ui and Radix (MIT licence). Story portraits: pen drawings by Howard Pyle from The Story of the Champions of the Round Table (1905, public domain), hand-coloured in code. All other art is painted in code: the buildings, bridges and construction stages after the forms recorded in public-domain architectural surveys; the trees, plants, mountains, people and animals after public-domain floras, natural histories and costume sources; and the terrain, roads, sea-chart ornaments and app icon. The northern houses, shore and meadow plants, island breeds, coastal birds, fish, veteran trees, maelstrom and kraken are also painted in code, after Bewick, Lindman, Flora Danica, Low, the von Wright brothers, Bloch, Couch, Thorburn, Strutt and the Carta Marina of Olaus Magnus; no scans are copied.',
                }),
              ],
            }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: pg,
        onOpenChange: gg,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'diary-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: 'Playtest diary' }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              children: 'Kept on this device only. Export it and send the file to the developer.',
            }),
            (() => {
              let S = diarySummary();
              return (0, jsxRuntime.jsxs)('div', {
                className: 'more-stats',
                children: [
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      (0, jsxRuntime.jsx)('b', { children: S.sessions }),
                      (0, jsxRuntime.jsx)('small', { children: 'sessions' }),
                    ],
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      (0, jsxRuntime.jsx)('b', { children: S.days }),
                      (0, jsxRuntime.jsx)('small', { children: 'days played' }),
                    ],
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      (0, jsxRuntime.jsx)('b', { children: S.minutes }),
                      (0, jsxRuntime.jsx)('small', { children: 'minutes' }),
                    ],
                  }),
                  (0, jsxRuntime.jsxs)('span', {
                    children: [
                      (0, jsxRuntime.jsx)('b', { children: S.best || '\u2013' }),
                      (0, jsxRuntime.jsx)('small', { children: 'best chapter' }),
                    ],
                  }),
                ],
              });
            })(),
            (0, jsxRuntime.jsxs)('label', {
              className: 'diary-label',
              children: [
                (0, jsxRuntime.jsx)('span', {
                  children: 'What happened? What confused you, what did you enjoy?',
                }),
                (0, jsxRuntime.jsx)('textarea', {
                  value: yg,
                  onChange: (S) => bg(S.target.value),
                  rows: 4,
                  maxLength: 2e3,
                  placeholder: 'I couldn\u2019t find\u2026 / I liked\u2026',
                }),
              ],
            }),
            [
              ['Fun', vg, xg, 'How much fun was this session?'],
              ['Clear', kg, wg, 'How clear was what to do next?'],
            ].map(([S, B, ae, se]) =>
              (0, jsxRuntime.jsxs)(
                'div',
                {
                  className: 'diary-scale',
                  role: 'group',
                  'aria-label': se,
                  children: [
                    (0, jsxRuntime.jsx)('span', { children: S }),
                    [1, 2, 3, 4, 5].map((ke) =>
                      (0, jsxRuntime.jsx)(
                        'button',
                        { 'aria-pressed': B === ke, onClick: () => ae(B === ke ? 0 : ke), children: ke },
                        ke,
                      ),
                    ),
                    (0, jsxRuntime.jsx)('small', {
                      children: S === 'Fun' ? '1 dull \xB7 5 great' : '1 lost \xB7 5 obvious',
                    }),
                  ],
                },
                S,
              ),
            ),
            (0, jsxRuntime.jsxs)('div', {
              className: 'save-actions',
              children: [
                (0, jsxRuntime.jsx)('button', {
                  onClick: () => {
                    diaryNote(yg, vg || void 0, kg || void 0)
                      ? (diaryLog('note', t.current), bg(''), xg(0), wg(0), Ls('Note saved in the diary.'))
                      : Ls('Write a note or pick a rating first.');
                  },
                  children: 'Save note',
                }),
                (0, jsxRuntime.jsx)('button', {
                  onClick: () => {
                    let S = diaryExport(),
                      B = `tideweald-diary-${new Date().toISOString().slice(0, 10)}.json`;
                    ((async () => {
                      if (isNativeApp() && (await shareFile(B, S, 'Tideweald playtest diary'))) return;
                      let ae = URL.createObjectURL(new Blob([S], { type: 'application/json' })),
                        se = document.createElement('a');
                      ((se.href = ae),
                        (se.download = B),
                        se.click(),
                        setTimeout(() => URL.revokeObjectURL(ae), 1e3));
                    })(),
                      Ls('Diary exported. Send the file to the developer.'));
                  },
                  children: 'Export diary',
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('p', { className: 'save-hint', role: 'status', children: O9 }),
            (0, jsxRuntime.jsxs)('details', {
              className: 'credits',
              children: [
                (0, jsxRuntime.jsx)('summary', { children: 'Clear the diary' }),
                (0, jsxRuntime.jsx)('button', {
                  className: 'freebuild-link',
                  onClick: () => {
                    (diaryClear(), Ls('Diary cleared.'));
                  },
                  children: 'Delete all diary entries on this device',
                }),
              ],
            }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(AlertDialog, {
        open: !!he.newerLocal && he.phase === 'ready',
        children: (0, jsxRuntime.jsxs)(AlertDialogContent, {
          children: [
            (0, jsxRuntime.jsx)(AlertDialogTitle, { children: 'A newer copy is on this device' }),
            (0, jsxRuntime.jsx)(AlertDialogDescription, {
              children: he.newerLocal
                ? `This device kept your island at Day ${he.newerLocal.day}, more recent than the cloud copy (Day ${n.day}). Probably played offline or the last upload was lost.`
                : '',
            }),
            (0, jsxRuntime.jsxs)(AlertDialogFooter, {
              children: [
                (0, jsxRuntime.jsx)(AlertDialogCancel, {
                  onClick: he.dismissNewerLocal,
                  children: 'Keep the cloud copy',
                }),
                (0, jsxRuntime.jsx)(AlertDialogAction, {
                  onClick: () => {
                    he.newerLocal && he.restoreLocal(he.newerLocal);
                  },
                  children: 'Use this device\u2019s copy',
                }),
              ],
            }),
          ],
        }),
      }),
      (0, jsxRuntime.jsx)(AlertDialog, {
        open: he.conflict,
        children: (0, jsxRuntime.jsxs)(AlertDialogContent, {
          children: [
            (0, jsxRuntime.jsx)(AlertDialogTitle, { children: 'Saved from another device' }),
            (0, jsxRuntime.jsx)(AlertDialogDescription, {
              children:
                'This island was saved from another tab or device since you opened it. Choose which island to keep. The other one stays on this device under Saved progress.',
            }),
            (0, jsxRuntime.jsxs)(AlertDialogFooter, {
              children: [
                (0, jsxRuntime.jsx)(AlertDialogCancel, {
                  onClick: () => {
                    he.resolveConflict('cloud');
                  },
                  children: 'Load the other copy',
                }),
                (0, jsxRuntime.jsx)(AlertDialogAction, {
                  onClick: () => {
                    he.resolveConflict('mine');
                  },
                  children: 'Keep this island',
                }),
              ],
            }),
          ],
        }),
      }),
      (() => {
        if (!rl) return null;
        let S = CHAPTERS[rl.from],
          B = currentChapter(t.current),
          ae = campaignObjectives(t.current)
            .filter((Mt) => !Mt.done)
            .slice(0, 3),
          se = rl.from === 3 ? 350 : (S?.reward ?? 0),
          ke = B.voice.startsWith('Ivo') ? 1 : B.voice.startsWith('Skipper') ? 2 : 0;
        return (0, jsxRuntime.jsx)(Dialog, {
          open: !0,
          onOpenChange: (Mt) => {
            Mt || nh(null);
          },
          children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
            className: 'chapter-card-dialog',
            children: [
              (0, jsxRuntime.jsxs)('div', {
                className: 'chapter-card-head',
                children: [
                  (0, jsxRuntime.jsxs)('span', {
                    className: 'eyebrow',
                    children: ['CHAPTER ', rl.from + 1, ' COMPLETE'],
                  }),
                  (0, jsxRuntime.jsx)(DialogTitle, { children: S?.title ?? 'Chapter complete' }),
                  (0, jsxRuntime.jsxs)(DialogDescription, {
                    className: 'chapter-card-reward',
                    children: ['+', se.toLocaleString(), ' gold'],
                  }),
                ],
              }),
              (0, jsxRuntime.jsxs)('div', {
                className: 'chapter-card-next',
                children: [
                  (0, jsxRuntime.jsx)(Character, { person: ke, className: 'chapter-card-portrait' }),
                  (0, jsxRuntime.jsxs)('div', {
                    children: [
                      (0, jsxRuntime.jsx)('small', { children: B.voice }),
                      (0, jsxRuntime.jsxs)('b', { children: ['Chapter ', rl.to + 1, ' \xB7 ', B.title] }),
                      (0, jsxRuntime.jsx)('p', {
                        children: B.text
                          .split(/(?<=[.!?])\s+/)
                          .slice(0, 2)
                          .join(' '),
                      }),
                    ],
                  }),
                ],
              }),
              ae.length > 0 &&
                (0, jsxRuntime.jsx)('ul', {
                  className: 'chapter-card-goals',
                  children: ae.map((Mt) =>
                    (0, jsxRuntime.jsxs)(
                      'li',
                      {
                        children: [
                          (0, jsxRuntime.jsx)('span', { className: 'objective-mark' }),
                          Mt.label,
                          (0, jsxRuntime.jsxs)('b', { children: [Mt.value, '/', Mt.target] }),
                        ],
                      },
                      Mt.label,
                    ),
                  ),
                }),
              (0, jsxRuntime.jsx)('button', {
                className: 'chapter-card-go',
                onClick: () => nh(null),
                children: 'Continue',
              }),
            ],
          }),
        });
      })(),
      (0, jsxRuntime.jsx)(LaunchScreen, { ready: he.phase !== 'loading' }),
      (0, jsxRuntime.jsx)(AlertDialog, {
        open: be,
        onOpenChange: je,
        children: (0, jsxRuntime.jsxs)(AlertDialogContent, {
          children: [
            (0, jsxRuntime.jsx)(AlertDialogTitle, { children: 'A fresh beginning?' }),
            (0, jsxRuntime.jsx)(AlertDialogDescription, {
              children:
                'This clears your island, buildings, and resources. You\u2019ll start again with woodland, a river, hills, and 900 gold.',
            }),
            (0, jsxRuntime.jsxs)(AlertDialogFooter, {
              children: [
                (0, jsxRuntime.jsx)(AlertDialogCancel, { children: 'Keep my island' }),
                (0, jsxRuntime.jsx)(AlertDialogAction, { onClick: H9, children: 'Start a new island' }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}

export { Home };

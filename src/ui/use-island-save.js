// Recovered from the Tideweald v16.11 build. Module: ui/use-island-save
import * as React from 'react';
import { decodeStoredSave, encodeStoredSave, encodeStoredSaveOffThread } from '../persistence/compression.js';
import {
  backupFor,
  changeKey,
  clock,
  currentIsland,
  deviceSavesOnly,
  isNativeApp,
  mergeBackups,
  parseSavedWorld,
  readIslandFiles,
  readIslandText,
  readLocalBackups,
  readSave,
  reply,
  restoreLocalBackup,
  serializeWorld,
  serializeWorldAsync,
  setCurrentIsland,
  shareFile,
  tag,
  writeIslandFile,
  writeLocalBackup,
} from '../persistence/save.js';
import { createWorld } from '../world/world.js';

function useIslandSave(e, t) {
  let [a, n] = (0, React.useState)('loading'),
    [r, o] = (0, React.useState)('Loading island\u2026'),
    [l, s] = (0, React.useState)(''),
    [c, u] = (0, React.useState)([]),
    [d, m] = (0, React.useState)(!1),
    [h, p] = (0, React.useState)(!1),
    [g, v] = (0, React.useState)(null),
    [M, w] = (0, React.useState)(!1),
    [y, k] = (0, React.useState)(!1),
    x = (0, React.useRef)(0),
    T = (0, React.useRef)(!1),
    C = (0, React.useRef)(!1),
    R = (0, React.useRef)(''),
    b = (0, React.useRef)(''),
    A = (0, React.useRef)(!1),
    E = (0, React.useRef)(!1),
    V = (0, React.useCallback)(async () => {
      let le = isNativeApp()
        ? (await readIslandFiles())
            .map((de) => {
              try {
                return JSON.parse(de);
              } catch {
                return null;
              }
            })
            .filter((de) => !!de)
        : [];
      return mergeBackups(readLocalBackups(), le);
    }, []);
  (0, React.useEffect)(() => {
    V().then(u);
  }, [V]);
  let Z = () => {
      ((e.current = createWorld('campaign')), setCurrentIsland(e.current.islandId));
    },
    L = async (le) =>
      le.packed
        ? ((e.current = readSave(await decodeStoredSave(le.packed))), !0)
        : le.save || le.world
          ? ((e.current = le.save ? readSave(JSON.stringify(le.save)) : parseSavedWorld(le.world)), !0)
          : !1,
    N = (0, React.useCallback)(
      async (le) => {
        ((E.current = !0), k(!0), (T.current = !1));
        let de = await V();
        u(de);
        let re = currentIsland(),
          Ue = re ? de.find((Je) => Je.islandId === re) : de[0],
          Be = !1;
        if (Ue)
          try {
            ((e.current = await restoreLocalBackup(Ue)), (Be = !0));
          } catch {}
        (Be || Z(),
          t(),
          w(!1),
          (b.current = ''),
          s(''),
          m(!1),
          n('ready'),
          o(le ?? (Be ? `Saved on this device \xB7 ${clock(Ue.savedAt)}` : 'Saving on this device')));
      },
      [V, t, e],
    ),
    O = (0, React.useCallback)(async () => {
      if ((n('loading'), (T.current = !1), p(!1), deviceSavesOnly())) {
        await N();
        return;
      }
      try {
        let le = await fetch('/api/island', { cache: 'no-store' });
        if ([401, 403, 404, 405].includes(le.status)) {
          await N(le.status === 401 ? 'Not signed in \xB7 saved on this device' : void 0);
          return;
        }
        let de = await reply(le);
        if (!le.ok) throw Error(de.error ?? 'Could not load your island.');
        let re = await L(de);
        if (
          (re || Z(),
          t(),
          w(re),
          (E.current = !1),
          k(!1),
          (x.current = de.revision),
          (R.current = re ? changeKey(e.current) : ''),
          (T.current = !0),
          o(re ? 'Island restored' : 'Auto-save ready'),
          s(''),
          m(!1),
          n('ready'),
          re)
        ) {
          let Ue = backupFor(e.current.islandId),
            Be = Date.parse(de.savedAt) || 0;
          Ue && Ue.savedAt > Be + 5e3 && Ue.day >= Math.floor(e.current.time) + 1 && v(Ue);
        }
      } catch (le) {
        (e.current.cells.length || Z(),
          t(),
          s(
            le instanceof Error && !/fetch|network|load failed/i.test(le.message)
              ? le.message
              : 'No connection to the save service.',
          ),
          o('Save unavailable'),
          n('error'));
      }
    }, [t, e, N]);
  (0, React.useEffect)(() => {
    O();
  }, [O]);
  let z = (0, React.useCallback)(
      async (le, de) => {
        let re = e.current;
        if (!re.cells.length || !re.story.started || A.current) return de;
        let Ue = changeKey(re);
        if (Ue === b.current && !de) return de;
        A.current = !0;
        try {
          let Be = de ?? (await encodeStoredSaveOffThread(le ?? (await serializeWorldAsync(re)))),
            Je = writeLocalBackup(re, Be);
          return (
            setCurrentIsland(re.islandId),
            isNativeApp() &&
              re.islandId &&
              (await writeIslandFile(
                re.islandId,
                JSON.stringify(
                  Je ?? {
                    savedAt: Date.now(),
                    day: Math.floor(re.time) + 1,
                    chapter: re.story.chapter + 1,
                    mode: re.story.mode,
                    packed: Be,
                    islandId: re.islandId,
                  },
                ),
              )),
            Je || isNativeApp()
              ? ((b.current = Ue),
                V().then(u),
                E.current && o(`Saved on this device \xB7 ${clock(Date.now())}`))
              : E.current &&
                (m(!0),
                o('Not saved \xB7 this device\u2019s storage is full'),
                s(
                  'This device has no room left for saves. Download a backup from Saved progress to keep your island safe.',
                )),
            Be
          );
        } finally {
          A.current = !1;
        }
      },
      [e, V],
    ),
    U = (0, React.useRef)([]),
    Y = (le) =>
      fetch('/api/island', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revision: x.current, packed: le }),
      }),
    W = (0, React.useCallback)(
      async (le = !1) => {
        let de = e.current;
        if (C.current || !de.cells.length || (!de.story.started && !le)) return;
        if (E.current || !T.current) {
          (le && (b.current = ''), await z());
          return;
        }
        let re = changeKey(de);
        if (!le && re === R.current) return;
        ((C.current = !0), o('Saving\u2026'));
        let Ue = tag();
        de.saveTag = Ue;
        try {
          let Be = await serializeWorldAsync(de),
            Je = await encodeStoredSaveOffThread(Be);
          (await z(Be, Je), (U.current = [...U.current, Ue].slice(-8)));
          let Ft = await Y(Je),
            P = await reply(Ft);
          if (Ft.status === 409) {
            let Re = await fetch('/api/island', { cache: 'no-store' }),
              J = await reply(Re),
              X = J.saveTag ?? J.save?.world?.saveTag;
            if (
              (Re.ok &&
                X &&
                U.current.includes(X) &&
                ((x.current = J.revision), (Ft = await Y(Je)), (P = await reply(Ft))),
              Ft.status === 409)
            )
              throw ((T.current = !1), p(!0), Error('This island was saved from another tab or device.'));
          }
          if (!Ft.ok) throw Error(P.error ?? 'Could not save your island.');
          ((x.current = P.revision),
            (R.current = re),
            (U.current = []),
            m(!1),
            o(`Saved ${clock(P.savedAt)}`),
            s(''));
        } catch (Be) {
          (m(!0),
            o('Not saved to the cloud \xB7 kept on this device'),
            s(
              Be instanceof Error && !/fetch|network|load failed/i.test(Be.message)
                ? Be.message
                : 'No connection. Your island is kept on this device and saves again when you are back online.',
            ));
        } finally {
          C.current = !1;
        }
      },
      [e, z],
    );
  (0, React.useEffect)(() => {
    let le = setInterval(() => {
        z();
      }, 5e3),
      de = setInterval(() => {
        W();
      }, 15e3),
      re = () => {
        document.visibilityState === 'hidden' && (z(), W());
      },
      Ue = () => {
        (z(), W());
      };
    return (
      document.addEventListener('visibilitychange', re),
      window.addEventListener('pagehide', Ue),
      window.addEventListener('beforeunload', Ue),
      () => {
        (clearInterval(le),
          clearInterval(de),
          document.removeEventListener('visibilitychange', re),
          window.removeEventListener('pagehide', Ue),
          window.removeEventListener('beforeunload', Ue));
      }
    );
  }, [W, z]);
  let j = (0, React.useCallback)(
      async (le, de) => {
        ((b.current = ''),
          await z(),
          (e.current = le),
          setCurrentIsland(le.islandId),
          t(),
          v(null),
          a === 'error' && ((T.current = !1), n('unsaved')),
          o(
            E.current
              ? `${de} \xB7 saved on this device`
              : T.current
                ? `${de} \xB7 saving`
                : `${de} \xB7 cloud save off`,
          ),
          s(''),
          (b.current = ''),
          E.current || !T.current ? await z() : W(!0));
      },
      [z, t, a, W, e],
    ),
    Ae = (0, React.useCallback)(
      async (le) => {
        let de = le ?? c[0] ?? readLocalBackups()[0];
        if (!de) return !1;
        try {
          return (await j(await restoreLocalBackup(de), 'Device copy restored'), !0);
        } catch {
          return (s('The copy on this device could not be read.'), !1);
        }
      },
      [c, j],
    ),
    Xe = (0, React.useCallback)(
      async (le) => {
        if (le.size > 4e7) return (s('That file is too large to be a Tideweald island.'), !1);
        try {
          return (await j(await readIslandText(await le.text()), 'Backup file loaded'), !0);
        } catch {
          return (s('That file is not a Tideweald island backup, or it is damaged.'), !1);
        }
      },
      [j],
    ),
    Fe = (0, React.useCallback)(
      async (le) => {
        if ((p(!1), le === 'cloud')) {
          await O();
          return;
        }
        try {
          let de = await fetch('/api/island', { cache: 'no-store' }),
            re = await reply(de);
          if (!de.ok) throw Error(re.error ?? 'Could not reach the save service.');
          ((x.current = re.revision), (T.current = !0), await W(!0));
        } catch (de) {
          (m(!0), s(de instanceof Error ? de.message : 'Could not reach the save service.'));
        }
      },
      [O, W],
    ),
    ct = () => {
      ((T.current = !1), n('unsaved'), o('Cloud off \xB7 kept on this device'), s(''));
    },
    at = async () => {
      let le = e.current,
        de = serializeWorld(le),
        re = `tideweald-day${Math.floor(le.time) + 1}.json`;
      if (isNativeApp() && (await shareFile(re, de, 'Tideweald island backup'))) return;
      let Ue = new Blob([de], { type: 'application/json' }),
        Be = URL.createObjectURL(Ue),
        Je = document.createElement('a');
      ((Je.href = Be), (Je.download = re), Je.click(), setTimeout(() => URL.revokeObjectURL(Be), 1e3));
    },
    qe = (0, React.useCallback)(() => {
      (setCurrentIsland(e.current.islandId), (b.current = ''));
    }, [e]);
  return {
    phase: a,
    status: r,
    error: l,
    load: O,
    save: W,
    continueUnsaved: ct,
    download: at,
    importFile: Xe,
    backups: c,
    backup: c[0] ?? null,
    restoreLocal: Ae,
    failing: d,
    conflict: h,
    resolveConflict: Fe,
    newerLocal: g,
    dismissNewerLocal: () => v(null),
    hasCloudSave: M,
    deviceOnly: y,
    startedNew: qe,
  };
}

export { useIslandSave };

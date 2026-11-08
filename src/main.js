// Recovered from the Tideweald v16.11 build. Module: main
import * as ReactDOMClient from 'react-dom/client';
import * as jsxRuntime from 'react/jsx-runtime';
import { decodeStoredSave } from './persistence/compression.js';
import { backupFor, readSave, setCurrentIsland, writeLocalBackup } from './persistence/save.js';
import { Home } from './ui/home.js';

document.documentElement.dataset.saves = 'device';
if (/[?&]diagnostics\b/.test(location.search)) {
  globalThis.__twDebug = true;
  import('./core/diagnostics.js').then((m) => m.installDiagnosticsOverlay(() => globalThis.__tw?.w));
}
if (globalThis.__twDebug) {
  import('./core/debug.js').then((m) => m.installDebugApi());
}
async function migrate() {
  try {
    let e = localStorage.getItem('tideweald-preview-cloud');
    if (!e) return;
    let t = JSON.parse(e);
    if (!t?.packed) return;
    let a = readSave(await decodeStoredSave(t.packed));
    ((!a.islandId || !backupFor(a.islandId)) &&
      (writeLocalBackup(a, t.packed, void 0, Date.parse(t.savedAt) || Date.now()),
      setCurrentIsland(a.islandId)),
      localStorage.removeItem('tideweald-preview-cloud'));
  } catch {}
}
migrate().finally(() =>
  (0, ReactDOMClient.createRoot)(document.getElementById('root')).render((0, jsxRuntime.jsx)(Home, {})),
);

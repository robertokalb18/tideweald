// Small hand edits applied after recovery (anchors must match exactly once).
const fs = require('fs');
const root = process.argv[2];
const edit = (file, from, to) => {
  const p = `${root}/${file}`, s = fs.readFileSync(p, 'utf8');
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`${file}: anchor found ${n} times: ${from.slice(0, 60)}`);
  fs.writeFileSync(p, s.replace(from, to));
};
const exportAlso = (file, names) => {
  const p = `${root}/${file}`, s = fs.readFileSync(p, 'utf8');
  const m = s.match(/\nexport \{([^}]*)\};\n?$/);
  if (!m) throw new Error(`${file}: no export block`);
  const have = m[1].split(',').map((x) => x.trim()).filter(Boolean);
  const all = [...new Set([...have, ...names])].sort();
  fs.writeFileSync(p, s.slice(0, m.index) + `\nexport { ${all.join(', ')} };\n`);
};
// 1. developer hook: expose the live world and camera when globalThis.__twDebug is set
edit('ui/island-canvas.js', '            let X = w.current,\n              be = v.current,',
  '            if (globalThis.__twDebug) globalThis.__tw = { w: r.current, cam: v.current };\n            let X = w.current,\n              be = v.current,');
// 2. exports needed by tests and the debug API
exportAlso('progression/campaign.js', ['CHAPTERS']);
// 3. debug API on the entry module
edit('main.js', "document.documentElement.dataset.saves = 'device';",
  `document.documentElement.dataset.saves = 'device';
if (globalThis.__twDebug) {
  import('./core/debug.js').then((m) => m.installDebugApi());
}`);
fs.writeFileSync(`${root}/core/debug.js`, `// Developer API, loaded only when globalThis.__twDebug is set before the game starts.
import { serializeWorld, readIslandText } from '../persistence/save.js';
import { encodeStoredSave } from '../persistence/compression.js';
import { advanceWorld } from './simulation.js';
import { staticsFor } from '../render/world-draw.js';
import { CHAPTERS } from '../progression/campaign.js';
import { COUNCIL_DECISIONS } from '../progression/council.js';
import { CATALOG } from '../world/catalog.js';

export function installDebugApi() {
  globalThis.__twx = {
    ps: advanceWorld,
    IM: staticsFor,
    ser: serializeWorld,
    pack: encodeStoredSave,
    read: readIslandText,
    chapters: CHAPTERS,
    council: COUNCIL_DECISIONS,
    catalog: CATALOG,
  };
}
`);

// 4. fixed-timestep simulation: whole 0.025-day steps; the remainder carries to the next call
fs.writeFileSync(`${root}/core/simulation.js`, `// Simulation clock. The world always advances in whole fixed steps, so results do not
// depend on frame timing or on the chosen game speed (1x, 3x, 10x, skip ahead).
import { step } from '../world/ecosystem.js';
import { diagnostics } from './diagnostics.js';

export const STEP_DAYS = 0.025;
const STEP_MICRO = 25000; // STEP_DAYS in millionths of a day
const MAX_DAYS_PER_CALL = 3;
const carry = new WeakMap(); // world -> pending millionths of a day

function advanceWorld(world, days) {
  if (!world.story.started) return;
  world.revision++;
  let pending = (carry.get(world) ?? 0) + Math.round(Math.max(0, Math.min(days, MAX_DAYS_PER_CALL)) * 1e6);
  const t0 = performance.now();
  let steps = 0;
  for (; pending >= STEP_MICRO; pending -= STEP_MICRO, steps++) step(world, STEP_DAYS);
  carry.set(world, pending);
  steps && diagnostics.sim(performance.now() - t0, steps);
}

export { advanceWorld };
`);
// 5. diagnostics store (no DOM) and overlay
fs.writeFileSync(`${root}/core/diagnostics.js`, `// Lightweight timing counters. Recording is always on and costs two clock reads per call;
// the overlay that shows them is opt-in (?diagnostics in the URL).
export const diagnostics = {
  simMs: 0, simSteps: 0, lastSimMs: 0, saveMs: 0, saves: 0,
  sim(ms, steps) { this.simMs += ms; this.simSteps += steps; this.lastSimMs = ms; },
  save(ms) { this.saveMs = ms; this.saves++; },
};

export function installDiagnosticsOverlay(getWorld) {
  const el = document.createElement('pre');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = 'position:fixed;left:calc(var(--safe-left, 0px) + 8px);top:calc(var(--safe-top, 0px) + 8px);z-index:99;margin:0;padding:6px 8px;border-radius:6px;background:rgba(21,58,56,.82);color:#efe4c8;font:11px/1.35 ui-monospace,monospace;pointer-events:none;white-space:pre';
  document.body.appendChild(el);
  let frames = [], last = performance.now(), simMs0 = 0, steps0 = 0, t0 = last;
  const tick = (now) => { frames.push(now - last); last = now; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  setInterval(() => {
    const now = performance.now(), secs = (now - t0) / 1000, f = frames.slice().sort((a, b) => a - b), w = getWorld();
    const st = globalThis.__twStats, mem = performance.memory;
    el.textContent = [
      \`fps \${(f.length / secs).toFixed(0)}  frame p50 \${(f[f.length >> 1] ?? 0).toFixed(1)} p95 \${(f[Math.floor(f.length * 0.95)] ?? 0).toFixed(1)} ms\`,
      \`sim \${((diagnostics.simMs - simMs0) / secs).toFixed(1)} ms/s  steps \${((diagnostics.simSteps - steps0) / secs).toFixed(1)}/s  last \${diagnostics.lastSimMs.toFixed(1)} ms\`,
      \`render build \${st?.entities?.buildMs?.toFixed?.(1) ?? '-'} ms  sprite cache \${st ? (st.cache.bytes / 1048576).toFixed(1) : '-'} MB\${mem ? \`  heap \${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB\` : ''}\`,
      w ? \`buildings \${w.buildings.length}  plants \${w.plants.length}  animals \${w.animals?.length ?? 0}\` : '',
      \`last save \${diagnostics.saves ? diagnostics.saveMs.toFixed(1) + ' ms on main thread' : '-'}\`,
    ].join('\\n');
    frames = []; t0 = now; simMs0 = diagnostics.simMs; steps0 = diagnostics.simSteps;
  }, 1000);
}
`);
edit('main.js', `if (globalThis.__twDebug) {
  import('./core/debug.js').then((m) => m.installDebugApi());
}`, `if (/[?&]diagnostics\\b/.test(location.search)) {
  globalThis.__twDebug = true;
  import('./core/diagnostics.js').then((m) => m.installDiagnosticsOverlay(() => globalThis.__tw?.w));
}
if (globalThis.__twDebug) {
  import('./core/debug.js').then((m) => m.installDebugApi());
}`);
// 6. save serialisation in small slices so autosave does not stall a frame
{
  const p = `${root}/persistence/save.js`;
  let s = fs.readFileSync(p, 'utf8');
  const a = s.indexOf('      cells: e.cells.map((t) => {'), b = s.indexOf('        return n;\n      }),\n', a);
  if (a < 0 || b < 0) throw new Error('serializeWorld anchors');
  const cb = s.slice(a + '      cells: e.cells.map('.length, b + '        return n;\n      }'.length);
  s = s.slice(0, a) + '      cells: e.cells.map(encodeCell),\n' + s.slice(b + '        return n;\n      }),\n'.length);
  s = s.replace('function serializeWorld(e) {', `// One cell as a compact number array (trailing zeros dropped).
const encodeCell = ${cb};

function serializeWorld(e) {`);
  s = s.replace('function readSave(e) {', `// Same output as serializeWorld, built in slices of about 6 ms so a save never blocks a frame.
async function serializeWorldAsync(e, sliceMs = 6) {
  const t0 = performance.now();
  const cells = e.cells, parts = [];
  let i = 0, mainMs = 0;
  while (i < cells.length) {
    const s0 = performance.now(), chunk = [];
    for (; i < cells.length && performance.now() - s0 < sliceMs; ) {
      const end = Math.min(cells.length, i + 1024);
      for (; i < end; i++) chunk.push(encodeCell(cells[i]));
    }
    parts.push(JSON.stringify(chunk).slice(1, -1));
    mainMs += performance.now() - s0;
    if (i < cells.length) await new Promise((r) => setTimeout(r, 0));
  }
  const s1 = performance.now();
  const shell = JSON.stringify({ format: 3, cols: GRID_W, rows: GRID_H, world: { ...e, arrival: void 0, cells: '__TW_CELLS__' } });
  const out = shell.replace('"__TW_CELLS__"', '[' + parts.filter(Boolean).join(',') + ']');
  mainMs += performance.now() - s1;
  diagnostics.save(mainMs);
  return out;
}

function readSave(e) {`);
  s = s.replace("import { decodeStoredSave } from './compression.js';", "import { decodeStoredSave } from './compression.js';\nimport { diagnostics } from '../core/diagnostics.js';");
  fs.writeFileSync(p, s);
  exportAlso('persistence/save.js', ['serializeWorldAsync', 'encodeCell']);
}
edit('ui/use-island-save.js', 'let Be = de ?? (await encodeStoredSave(le ?? serializeWorld(re))),', 'let Be = de ?? (await encodeStoredSave(le ?? (await serializeWorldAsync(re)))),');
edit('ui/use-island-save.js', 'let Be = serializeWorld(de),\n            Je = await encodeStoredSave(Be);', 'let Be = await serializeWorldAsync(de),\n            Je = await encodeStoredSave(Be);');
edit('ui/use-island-save.js', '  serializeWorld,\n  setCurrentIsland,', '  serializeWorld,\n  serializeWorldAsync,\n  setCurrentIsland,');
edit('core/debug.js', "import { serializeWorld, readIslandText } from '../persistence/save.js';", "import { serializeWorld, serializeWorldAsync, readIslandText } from '../persistence/save.js';");
edit('core/debug.js', '    ser: serializeWorld,', '    ser: serializeWorld,\n    serAsync: serializeWorldAsync,');

// 7. compress saves in a worker (falls back to the main thread if workers are unavailable)
{
  const p = `${root}/persistence/compression.js`;
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace('async function decodeStoredSave(e) {', `// The same encoding run in a Web Worker, so gzip and base64 never block a frame.
const WORKER_SOURCE = \`self.onmessage = async (ev) => {
  const { id, text } = ev.data;
  try {
    const bytes = new Uint8Array(await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
    let bin = '';
    for (let n = 0; n < bytes.length; n += 8192) bin += String.fromCharCode(...bytes.subarray(n, n + 8192));
    self.postMessage({ id, packed: 'gzip:' + btoa(bin) });
  } catch (err) { self.postMessage({ id, error: String(err) }); }
};\`;
let saveWorker = null, workerFailed = false, nextJob = 1;
const jobs = new Map();
function getSaveWorker() {
  if (saveWorker || workerFailed) return saveWorker;
  try {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
    saveWorker = new Worker(url);
    saveWorker.onmessage = ({ data }) => {
      const job = jobs.get(data.id);
      if (!job) return;
      jobs.delete(data.id);
      data.error ? job.reject(new Error(data.error)) : job.resolve(data.packed);
    };
    saveWorker.onerror = () => {
      workerFailed = true;
      saveWorker = null;
      for (const job of jobs.values()) job.fallback();
      jobs.clear();
    };
  } catch {
    workerFailed = true;
  }
  return saveWorker;
}
async function encodeStoredSaveOffThread(text) {
  const worker = typeof Worker === 'function' ? getSaveWorker() : null;
  if (!worker) return encodeStoredSave(text);
  return new Promise((resolve, reject) => {
    const id = nextJob++;
    jobs.set(id, { resolve, reject, fallback: () => encodeStoredSave(text).then(resolve, reject) });
    worker.postMessage({ id, text });
  });
}

async function decodeStoredSave(e) {`);
  fs.writeFileSync(p, s);
  exportAlso('persistence/compression.js', ['encodeStoredSaveOffThread']);
}
edit('ui/use-island-save.js', 'let Be = de ?? (await encodeStoredSave(le ?? (await serializeWorldAsync(re)))),', 'let Be = de ?? (await encodeStoredSaveOffThread(le ?? (await serializeWorldAsync(re)))),');
edit('ui/use-island-save.js', 'let Be = await serializeWorldAsync(de),\n            Je = await encodeStoredSave(Be);', 'let Be = await serializeWorldAsync(de),\n            Je = await encodeStoredSaveOffThread(Be);');
edit('ui/use-island-save.js', "import { decodeStoredSave, encodeStoredSave } from '../persistence/compression.js';", "import { decodeStoredSave, encodeStoredSave, encodeStoredSaveOffThread } from '../persistence/compression.js';");
edit('core/debug.js', "import { encodeStoredSave } from '../persistence/compression.js';", "import { encodeStoredSave, encodeStoredSaveOffThread } from '../persistence/compression.js';");
edit('core/debug.js', '    pack: encodeStoredSave,', '    pack: encodeStoredSave,\n    packOffThread: encodeStoredSaveOffThread,');
console.log('postgen ok');

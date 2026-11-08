// Lightweight timing counters. Recording is always on and costs two clock reads per call;
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
      `fps ${(f.length / secs).toFixed(0)}  frame p50 ${(f[f.length >> 1] ?? 0).toFixed(1)} p95 ${(f[Math.floor(f.length * 0.95)] ?? 0).toFixed(1)} ms`,
      `sim ${((diagnostics.simMs - simMs0) / secs).toFixed(1)} ms/s  steps ${((diagnostics.simSteps - steps0) / secs).toFixed(1)}/s  last ${diagnostics.lastSimMs.toFixed(1)} ms`,
      `render build ${st?.entities?.buildMs?.toFixed?.(1) ?? '-'} ms  sprite cache ${st ? (st.cache.bytes / 1048576).toFixed(1) : '-'} MB${mem ? `  heap ${(mem.usedJSHeapSize / 1048576).toFixed(0)} MB` : ''}`,
      w ? `buildings ${w.buildings.length}  plants ${w.plants.length}  animals ${w.animals?.length ?? 0}` : '',
      `last save ${diagnostics.saves ? diagnostics.saveMs.toFixed(1) + ' ms on main thread' : '-'}`,
    ].join('\n');
    frames = []; t0 = now; simMs0 = diagnostics.simMs; steps0 = diagnostics.simSteps;
  }, 1000);
}

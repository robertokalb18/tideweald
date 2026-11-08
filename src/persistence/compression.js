// Recovered from the Tideweald v16.11 build. Module: persistence/compression

async function encodeStoredSave(e) {
  let t = new Uint8Array(
      await new Response(new Blob([e]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer(),
    ),
    a = '';
  for (let n = 0; n < t.length; n += 8192) a += String.fromCharCode(...t.subarray(n, n + 8192));
  return 'gzip:' + btoa(a);
}
// The same encoding run in a Web Worker, so gzip and base64 never block a frame.
const WORKER_SOURCE = `self.onmessage = async (ev) => {
  const { id, text } = ev.data;
  try {
    const bytes = new Uint8Array(await new Response(new Blob([text]).stream().pipeThrough(new CompressionStream('gzip'))).arrayBuffer());
    let bin = '';
    for (let n = 0; n < bytes.length; n += 8192) bin += String.fromCharCode(...bytes.subarray(n, n + 8192));
    self.postMessage({ id, packed: 'gzip:' + btoa(bin) });
  } catch (err) { self.postMessage({ id, error: String(err) }); }
};`;
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

async function decodeStoredSave(e) {
  if (!e.startsWith('gzip:')) return e;
  let t = Uint8Array.from(atob(e.slice(5)), (s) => s.charCodeAt(0)),
    a = new Blob([t]).stream().pipeThrough(new DecompressionStream('gzip')).getReader(),
    n = [],
    r = 0;
  try {
    for (;;) {
      let { done: s, value: c } = await a.read();
      if (s) break;
      if (((r += c.byteLength), r > 32e6)) throw Error('Expanded save too large');
      n.push(c);
    }
  } finally {
    await a.cancel();
  }
  let o = new Uint8Array(r),
    l = 0;
  for (let s of n) (o.set(s, l), (l += s.length));
  return new TextDecoder().decode(o);
}

export { decodeStoredSave, encodeStoredSave, encodeStoredSaveOffThread };

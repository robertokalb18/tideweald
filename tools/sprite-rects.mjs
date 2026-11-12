// Prints every sprite rectangle the renderer knows, for tools/measure-sprites.py.
import { spriteRect } from '../src/render/sprites.js';

const out = {};
for (const atlas of ['flora', 'botanical', 'woodland', 'animals', 'fauna', 'folio', 'settlement', 'cottages', 'landmarks', 'workshops', 'norse', 'units', 'villagers', 'characters']) {
  out[atlas] = [];
  for (let i = 0; i < 48; i++) {
    try {
      const r = spriteRect(atlas, i);
      if (!r || !(r.w > 0)) break;
      out[atlas].push(r);
    } catch {
      break;
    }
  }
}
console.log(JSON.stringify(out));

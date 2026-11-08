import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { readIslandText, serializeWorld } from '../src/persistence/save.js';

export const fixture = (name) => readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
export const sha256 = (s) => createHash('sha256').update(s).digest('hex');
export const loadFixtureWorld = () => readIslandText(fixture('v16.11-island.save.txt'));
export const clone = (w) => readIslandText(serializeWorld(w));
export function seededRandom(seed = 1) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

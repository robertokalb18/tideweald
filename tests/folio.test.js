import { test } from 'node:test';
import assert from 'node:assert/strict';
import { staticsFor } from '../src/render/world-draw.js';
import { loadFixtureWorld } from './helpers.js';

test('v16.11 decor is deterministic and keeps clear of buildings', async () => {
  const w = await loadFixtureWorld();
  const a = staticsFor(w, 1).filter((s) => s.kind === 'decor');
  const b = staticsFor(w, 1).filter((s) => s.kind === 'decor');
  assert.ok(a.length > 300, `expected plenty of decor, got ${a.length}`);
  assert.deepEqual(a.map((s) => s.vk), b.map((s) => s.vk));
  for (const d of a) for (const bd of w.buildings) {
    if (d.value.spr <= 4 || d.value.spr === 1) continue; // working props sit beside their building on purpose
    assert.ok(Math.hypot(d.value.x - bd.x, d.value.y - bd.y) > 1.2, `decor ${d.value.spr} sits on building ${bd.id}`);
  }
});

test('flowers are hidden in winter', async () => {
  const w = await loadFixtureWorld();
  const flowers = (season) => staticsFor(w, season).filter((s) => s.kind === 'decor' && [6, 7, 8, 9, 10].includes(s.value.spr)).length;
  assert.ok(flowers(1) > 0);
  assert.equal(flowers(3), 0);
});

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { serializeWorld, serializeWorldAsync, readIslandText } from '../src/persistence/save.js';
import { encodeStoredSave, decodeStoredSave } from '../src/persistence/compression.js';
import { createWorld } from '../src/world/world.js';
import { fixture, sha256, loadFixtureWorld } from './helpers.js';

test('a save written by the live v16.11 game loads unchanged', async () => {
  const world = await loadFixtureWorld();
  assert.equal(sha256(serializeWorld(world)), fixture('v16.11-island.expected.sha256').trim());
  assert.equal(world.cells.length, 384 * 320);
});

test('a new island survives save, compress, load, and stays stable', async () => {
  const text = serializeWorld(createWorld('sandbox'));
  const packed = await encodeStoredSave(text);
  assert.match(packed, /^gzip:/);
  assert.equal(await decodeStoredSave(packed), text);
  // The first load fills in defaults; after that, saving and loading changes nothing.
  const once = serializeWorld(await readIslandText(packed));
  const twice = serializeWorld(await readIslandText(await encodeStoredSave(once)));
  assert.equal(twice, once);
});

test('sliced serialisation produces exactly the same save text', async () => {
  const world = await loadFixtureWorld();
  assert.equal(await serializeWorldAsync(world, 1), serializeWorld(world));
});

test('unknown save formats are refused', async () => {
  await assert.rejects(readIslandText('{"format":99}'), /Unsupported/);
});

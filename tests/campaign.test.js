import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS } from '../src/progression/campaign.js';
import { COUNCIL_DECISIONS } from '../src/progression/council.js';
import { CATALOG } from '../src/world/catalog.js';
import { fixture } from './helpers.js';

const golden = JSON.parse(fixture('v16.11-campaign.json'));

test('all 48 chapters match v16.11 word for word', () => {
  assert.equal(CHAPTERS.length, 48);
  assert.deepEqual(JSON.parse(JSON.stringify(CHAPTERS)), golden.chapters);
});

test('the 8 council decisions match v16.11', () => {
  assert.equal(COUNCIL_DECISIONS.length, 8);
  assert.deepEqual(JSON.parse(JSON.stringify(COUNCIL_DECISIONS)), golden.council);
});

test('the build catalog matches v16.11 (36 building types)', () => {
  assert.deepEqual(JSON.parse(JSON.stringify(CATALOG)), golden.catalog);
  const buildings = Object.values(CATALOG).filter((c) => c.category === 'buildings' || c.category === 'landmarks');
  assert.equal(buildings.length, 36);
});

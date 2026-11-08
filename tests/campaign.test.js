import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS } from '../src/progression/campaign.js';
import { COMMISSIONS } from '../src/progression/chapters.js';
import { COUNCIL_DECISIONS } from '../src/progression/council.js';
import { CATALOG } from '../src/world/catalog.js';
import { fixture } from './helpers.js';

const golden = JSON.parse(fixture('v16.11-campaign.json'));
// Milestone 1b rewrote the words (Norse setting, 985). Everything that drives play must still match v16.11.
const WORDS = new Set(['title', 'text', 'hint', 'voice', 'name', 'description', 'prompt', 'effect', 'period', 'label', 'subtitle']);
const mechanics = (v) => JSON.parse(JSON.stringify(v), (k, x) => (WORDS.has(k) && typeof x === 'string' ? undefined : x));

// Milestone 5 removed one rule on purpose: v16.11 also required up to 3 days in every chapter (a 'days' goal).
const withoutDayFloor = (chapters) =>
  chapters.map((c) => (c.goals ? { ...c, goals: c.goals.filter((g) => g.metric !== 'days') } : c));

test('all 48 chapters keep the v16.11 goals, rewards and deliveries, apart from the day floor', () => {
  assert.equal(CHAPTERS.length, 48);
  assert.deepEqual(mechanics(CHAPTERS), mechanics(withoutDayFloor(golden.chapters)));
  const floors = (list) => list.filter((c) => c.goals?.some((g) => g.metric === 'days')).length;
  assert.equal(floors(golden.chapters), 44, 'v16.11 had the floor in 44 chapters');
  assert.equal(floors(CHAPTERS), 0, 'no chapter waits for days now');
});

test('the 8 council decisions keep their v16.11 effects', () => {
  assert.equal(COUNCIL_DECISIONS.length, 8);
  assert.deepEqual(mechanics(COUNCIL_DECISIONS), mechanics(golden.council));
});

test('the build catalog keeps its v16.11 costs and stats (36 building types)', () => {
  assert.deepEqual(mechanics(CATALOG), mechanics(golden.catalog));
  const buildings = Object.values(CATALOG).filter((c) => c.category === 'buildings' || c.category === 'landmarks');
  assert.equal(buildings.length, 36);
});

test('no 13th-century North Sea wording is left in the story or catalog (Landfall 985)', () => {
  const texts = [];
  JSON.parse(JSON.stringify([CHAPTERS, COMMISSIONS, COUNCIL_DECISIONS, CATALOG]), (k, x) => (WORDS.has(k) && typeof x === 'string' && texts.push(x), x));
  const words = texts.join(' | ');
  for (const old of ['year 1250', 'Weser', 'Frisian', 'Martinmas', 'scriptorium', 'cloister', 'chapel', 'bishop', ' cog', 'cottage ']) {
    assert.ok(!words.includes(old), `found "${old}"`);
  }
  assert.match(CHAPTERS[0].text, /985/);
});

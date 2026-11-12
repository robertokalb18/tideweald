// v17.1: proportions. Every map object's drawn height (its size in src/render/scale.js × the share of its sprite
// box the drawing fills, from art-source/sprite-extents.json) is held to the rules in docs/SCALE.md, measured in
// settler heights. A new sprite or a changed size that breaks a rule fails here.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ANIMAL_SIZES, DECOR_SIZE, LIFE_SIZE, PLANT_SIZE, SETTLER, TREE_SIZE } from '../src/render/scale.js';
import { plantLook } from '../src/render/sprites.js';
import { BUILDING_SIZES, CATALOG } from '../src/world/catalog.js';

const EXT = JSON.parse(readFileSync(new URL('../art-source/sprite-extents.json', import.meta.url), 'utf8'));
/** Drawn height and width in settlers. */
const tall = (atlas, index, size) => (size * EXT[atlas][index].h) / SETTLER;
const wide = (atlas, index, size) => (size * EXT[atlas][index].w) / SETTLER;
/** A full-grown plant of this kind, at the middle of its natural variation. */
const grown = (kind, variant = 0.5) => {
  const look = plantLook({ kind, growth: 1, variant, id: 1 });
  return { h: tall(look.atlas, look.index, look.size), w: wide(look.atlas, look.index, look.size), look };
};
const between = (v, lo, hi, what) => assert.ok(v >= lo && v <= hi, `${what}: ${v.toFixed(2)} settlers, wanted ${lo}–${hi}`);
const kinds = (pred) => Object.keys(CATALOG).filter((k) => CATALOG[k].category === 'plants' && pred(CATALOG[k]));

test('the settler is the measure: 22 px, and guards and raiders stand within a fifth of it', () => {
  between(tall('villagers', 0, 24), 0.95, 1.05, 'settler');
  between(tall('units', 0, 26), 1, 1.2, 'guard');
  between(tall('units', 8, 26), 1, 1.2, 'raider');
});

test('every plant in the catalog has a size in the scale table', () => {
  for (const k of kinds((c) => c.tree)) assert.ok(TREE_SIZE[k], `tree ${k}`);
  for (const k of kinds((c) => !c.tree)) assert.ok(PLANT_SIZE[k], `plant ${k}`);
});

test('ground flora stays below a settler’s chest, and mushrooms below the knee to waist', () => {
  for (const k of ['grass', 'clover', 'flowers', 'heather', 'bluebells', 'sedge', 'mushroom'])
    for (const v of [0, 0.5, 1]) between(grown(k, v).h, 0.25, 0.8, `${k} (variant ${v})`);
  between(grown('mushroom', 1).h, 0.25, 0.5, 'the largest mushroom');
});

test('tall herbs reach a settler at most; shrubs a settler and a half', () => {
  for (const k of ['fern', 'bracken', 'lupine']) between(grown(k, 1).h, 0.5, 1, k);
  between(grown('reeds', 1).h, 0.9, 1.4, 'reeds');
  between(grown('berry', 1).h, 0.55, 1, 'berry bush');
  between(grown('juniper', 1).h, 0.4, 1, 'juniper');
  between(grown('hazel', 0.5).h, 1.1, 1.6, 'hazel');
});

test('full-grown trees stand 2.6–5.6 settlers, and no other plant reaches the smallest tree', () => {
  const trees = kinds((c) => c.tree);
  let smallest = Infinity;
  for (const k of trees) {
    between(grown(k).h, 2.6, 5.6, k);
    smallest = Math.min(smallest, grown(k, 0).h);
  }
  for (const k of kinds((c) => !c.tree))
    assert.ok(grown(k, 1).h < smallest * 0.75, `${k} at its largest (${grown(k, 1).h.toFixed(2)}) against the smallest tree (${smallest.toFixed(2)})`);
  // Orchard trees and thorns are the short ones; forest trees the tall ones.
  for (const short of ['apple', 'pear', 'plum', 'hawthorn'])
    for (const high of ['oak', 'beech', 'spruce', 'pine'])
      assert.ok(grown(short).h < grown(high).h * 0.78, `${short} against ${high}`);
});

test('a seedling is smaller than the grown plant, and a mushroom never outgrows a sapling tree', () => {
  for (const k of [...kinds(() => true)]) {
    const young = plantLook({ kind: k, growth: 0.2, variant: 0.5, id: 1 }).size,
      old = plantLook({ kind: k, growth: 1, variant: 0.5, id: 1 }).size;
    assert.ok(young < old * 0.6, `${k}: young ${young.toFixed(0)} against grown ${old.toFixed(0)}`);
  }
  const sapling = plantLook({ kind: 'oak', growth: 0.3, variant: 0.5, id: 1 });
  assert.ok(grown('mushroom', 1).h < tall(sapling.atlas, sapling.index, sapling.size));
});

test('animals: small ones under half a settler, grazers about a settler, nothing above a stag', () => {
  const sim = (k) => tall(CATALOG[k].atlas === 'fauna' ? 'fauna' : 'animals', CATALOG[k].sprite, ANIMAL_SIZES[k]);
  for (const k of ['rabbit', 'duck', 'squirrel', 'hedgehog', 'butterfly', 'bee', 'otter']) between(sim(k), 0.05, 0.5, k);
  for (const k of ['fox', 'sheep', 'boar', 'goose']) between(sim(k), 0.35, 0.66, k);
  for (const k of ['stork', 'heron']) between(sim(k), 0.5, 0.8, k);
  between(sim('cow'), 0.75, 1.05, 'cow');
  between(sim('deer'), 0.9, 1.2, 'deer');
  const folio = { eider: 21, gull: 22, crane: 24, seal: 26, hare: 27, stag: 28, sheep: 20, highland: 18, moorit: 19, pony: 17 };
  const life = (k) => tall('folio', folio[k], LIFE_SIZE[k]);
  for (const k of ['eider', 'hare', 'seal']) between(life(k), 0.2, 0.55, k);
  between(life('gull'), 0.3, 0.65, 'gull, wings spread');
  for (const k of ['sheep', 'moorit']) between(life(k), 0.5, 0.7, k);
  between(life('crane'), 0.7, 1, 'crane');
  between(life('pony'), 0.8, 1, 'pony');
  between(life('highland'), 0.85, 1.1, 'highland cow');
  between(life('stag'), 1.1, 1.4, 'stag with antlers');
  for (const k of Object.keys(ANIMAL_SIZES)) assert.ok(sim(k) <= life('stag'), `${k} is not taller than the stag`);
});

test('map decor: a rune stone a settler can stand beside, flowers at the ankle, the great trees great', () => {
  const d = (i) => tall('folio', i, DECOR_SIZE[i]);
  between(d(5), 1, 1.5, 'rune stone');
  between(d(1), 1.3, 1.8, 'haystack');
  between(d(2), 1.6, 2.1, 'fish rack');
  between(d(3), 0.8, 1.15, 'seated angler with his rod');
  between(wide('folio', 0, DECOR_SIZE[0]), 2.2, 3, 'four-oared boat, length');
  for (const i of [6, 7, 8, 9, 11, 13]) between(d(i), 0.3, 0.85, `ground flower ${i}`);
  between(d(10), 0.9, 1.2, 'fireweed');
  between(d(14), 0.5, 0.9, 'boulders');
  // The Old Oak and the Old Yew are landmarks: half as tall again as any forest tree, not twice.
  const forest = Math.max(...['oak', 'beech', 'spruce'].map((k) => grown(k).h));
  for (const i of [15, 16]) between(d(i) / forest, 1.2, 1.6, i === 15 ? 'the Old Oak' : 'the Old Yew');
});

test('buildings: a longhouse is longer than any workshop hut is tall, and towers are the tallest', () => {
  const b = (k, atlas = CATALOG[k].atlas ?? 'settlement', index = CATALOG[k].sprite ?? 0) => ({
    h: tall(atlas, index, BUILDING_SIZES[k].size),
    w: wide(atlas, index, BUILDING_SIZES[k].size),
  });
  const longhouse = b('cottage', 'folio', 34);
  between(longhouse.w, 4, 5, 'longhouse length');
  between(longhouse.h, 2.5, 3.2, 'longhouse height');
  assert.ok(b('watchtower').h > longhouse.h * 1.8, 'a watchtower stands well above the houses');
  // No ordinary building is taller than the tallest forest tree and a half.
  const forest = Math.max(...['oak', 'beech', 'spruce'].map((k) => grown(k).h));
  for (const k of ['farm', 'sawmill', 'quarry', 'fishery', 'bakery', 'storehouse', 'smithy', 'stables'])
    assert.ok(b(k).h < forest * 1.5, k);
});

// v17.1: one scale for everything drawn on the map. A leaf: imports nothing.
//
// Every sprite is drawn so that the longer side of its box on the sheet is `size` px at 100% zoom, so these
// numbers are comparable across sheets. What the eye sees is smaller: `size` × the part of the box the drawing
// fills (art-source/sprite-extents.json, written by tools/measure-sprites.py). tests/scale.test.js multiplies
// the two and holds every object to the rules below, in settler heights.
//
// The rules (docs/SCALE.md):
//   - A settler is 22 px tall and is the measure of everything else.
//   - Ground flora (grass, flowers, heather, mushrooms) stays under a settler's waist to chest: it is drawn as a
//     clump, larger than life so it reads on a phone, but never as tall as a person.
//   - Tall herbs and reeds reach a settler's height at most; shrubs up to a settler and a half.
//   - Full-grown trees stand three to five and a half settlers; orchard trees and thorns are the short ones.
//   - Small animals are under half a settler; sheep, foxes and boar under two thirds; deer, cattle and ponies
//     about a settler; nothing with four legs is taller than a stag with its antlers (1.4).
//   - Standing stones and haystacks are things a settler can stand beside: one to one and three quarters.

/** Height of a settler on the map at 100% zoom, in px (villager sprite size 24 × 0.91 filled). */
export const SETTLER = 22;

/** Full-grown size of each tree. Young trees grow towards it from 19. */
export const TREE_SIZE = {
  oak: 115,
  pine: 115,
  birch: 105,
  maple: 96,
  willow: 107,
  beech: 119,
  alder: 103,
  hornbeam: 101,
  rowan: 89,
  spruce: 119,
  yew: 99,
  hawthorn: 71,
  apple: 73,
  pear: 69,
  plum: 71,
  cherry_tree: 103,
};
export const TREE_DEFAULT = 107;

/** Full-grown size of everything else that grows. Seedlings start at 30% of it. */
export const PLANT_SIZE = {
  grass: 18,
  clover: 18,
  flowers: 20,
  fern: 20,
  bracken: 20,
  berry: 30,
  mushroom: 16,
  hazel: 44,
  juniper: 32,
  heather: 19,
  lupine: 19,
  reeds: 27,
  sedge: 17,
  bluebells: 16,
};
export const PLANT_DEFAULT = 18;

/** Wildlife placed by the simulation (the animals and fauna sheets). */
export const ANIMAL_SIZES = {
  deer: 27,
  fox: 20,
  sheep: 26,
  rabbit: 13,
  duck: 15,
  fish: 14,
  butterfly: 10,
  bee: 8,
  boar: 28,
  squirrel: 13,
  hedgehog: 13,
  stork: 23,
  heron: 22,
  otter: 21,
  cow: 38,
  goose: 18,
};

/** Map decor from the folio sheet, by sprite number (boat, haystack, fish rack, angler, creels, rune stone,
 *  cloudberry, cottongrass, thrift, harebell, fireweed, lingonberry, wrack, sea kale, boulders, Old Oak, Old Yew). */
export const DECOR_SIZE = [60, 36, 50, 26, 38, 28, 18, 18, 16, 17, 25, 20, 34, 19, 38, 176, 150];

/** Ambient life from the folio sheet. */
export const LIFE_SIZE = {
  eider: 17,
  gull: 20,
  crane: 21,
  eagle: 34,
  seal: 26,
  hare: 11,
  stag: 30,
  sheep: 18,
  highland: 32,
  moorit: 19,
  pony: 25,
};

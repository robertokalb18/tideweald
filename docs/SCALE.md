# Scale (v17.1, 12 November 2026)

The owner's report: "Those tombstones are enormous. The mushrooms are as large as trees." Both were true, and
they were symptoms: plants, map decor and animals each had their own size table, written at different times,
and nothing compared them. This file is the one scale they now share. The numbers live in
`src/render/scale.js`; `tests/scale.test.js` enforces the rules.

## How size works

Every sprite is drawn so that the longer side of its box on the sheet is `size` px at 100% zoom. The drawing
fills only part of that box, so the height the eye sees is `size` × the filled share, which
`tools/measure-sprites.py` measures from the sheets into `art-source/sprite-extents.json`. All heights below
are those drawn heights, in px at 100% zoom and (in brackets) in settler heights.

## The rules

A settler is 22 px tall and is the measure of everything.

| Class | Height in settlers |
| --- | --- |
| Ground flora: grass, flowers, heather, bluebells, sedge, mushrooms | 0.25–0.8 (mushrooms at most 0.5) |
| Tall herbs: ferns, bracken, loosestrife, fireweed | up to 1.2 |
| Reeds | 0.9–1.4 |
| Shrubs: berry bush, juniper up to 1; hazel 1.1–1.6 | |
| Full-grown trees | 2.6–5.6; orchard trees and thorns under 78% of oak, beech, spruce and pine |
| Small animals: rabbit, hare, duck, squirrel, hedgehog, otter, eider, seal | under 0.55 |
| Fox, sheep, boar, goose | 0.35–0.7 |
| Storks, herons, cranes | 0.5–1 |
| Cattle, ponies, deer | 0.75–1.2 |
| Stag with antlers (the tallest animal) | 1.1–1.4 |
| Rune stone | 1–1.5 |
| Haystack 1.3–1.8, fish rack 1.6–2.1 | |
| The Old Oak, the Old Yew | 1.2–1.6 times the tallest forest tree |

Small things are still drawn larger than life (a 9 px mushroom would be 70 cm tall) so that they read on a
phone. The rule is about order: nothing may look bigger than the thing it is smaller than.

## What changed

Plants (full grown, middle of their natural variation):

| Object | Before | After |
| --- | --- | --- |
| Mushrooms | 23 px (1.1) | 9 px (0.4) |
| Meadow grass, clover | 22 px (1.0) | 10 px (0.4) |
| Wildflowers | 25 px (1.1) | 13 px (0.6) |
| Ferns, bracken | 32 px (1.4) | 16 px (0.7) |
| Berry bush | 29 px (1.3) | 17 px (0.8) |
| Hazel | 37 px (1.7) | 31 px (1.4) |
| Juniper | 17 px (0.8) | 14 px (0.6) |
| Heather | 22 px (1.0) | 10 px (0.5) |
| Loosestrife | 42 px (1.9) | 18 px (0.8) |
| Reeds | 47 px (2.1) | 26 px (1.2) |
| Sedge | 35 px (1.6) | 15 px (0.7) |
| Bluebells | 27 px (1.2) | 11 px (0.5) |

Trees:

| Object | Before | After |
| --- | --- | --- |
| Oak | 91 px (4.1) | 98 px (4.4) |
| Pine | 106 px (4.8) | 114 px (5.2) |
| Birch | 98 px (4.5) | 96 px (4.4) |
| Maple | 105 px (4.8) | 94 px (4.3) |
| Willow | 91 px (4.2) | 91 px (4.2) |
| Beech | 113 px (5.1) | 115 px (5.2) |
| Alder | 102 px (4.6) | 98 px (4.4) |
| Hornbeam | 101 px (4.6) | 95 px (4.3) |
| Rowan | 87 px (4.0) | 72 px (3.3) |
| Spruce | 106 px (4.8) | 118 px (5.4) |
| Yew | 101 px (4.6) | 94 px (4.3) |
| Hawthorn | 86 px (3.9) | 66 px (3.0) |
| Apple | 80 px (3.6) | 63 px (2.9) |
| Pear | 91 px (4.1) | 67 px (3.1) |
| Plum | 83 px (3.8) | 63 px (2.9) |
| Cherry | 102 px (4.6) | 98 px (4.5) |

Map decor:

| Object | Before | After |
| --- | --- | --- |
| Boat | 37 px (1.7) | 34 px (1.6) |
| Haystack | 49 px (2.2) | 35 px (1.6) |
| Fish rack | 53 px (2.4) | 41 px (1.9) |
| Angler | 40 px (1.8) | 24 px (1.1) |
| Creels | 22 px (1.0) | 14 px (0.7) |
| Rune stone | 49 px (2.2) | 27 px (1.2) |
| Cloudberry | 19 px (0.9) | 10 px (0.5) |
| Cottongrass | 37 px (1.7) | 17 px (0.8) |
| Thrift | 28 px (1.3) | 12 px (0.6) |
| Harebell | 26 px (1.2) | 11 px (0.5) |
| Fireweed | 50 px (2.3) | 24 px (1.1) |
| Lingonberry | 16 px (0.7) | 8 px (0.4) |
| Wrack | 12 px (0.5) | 9 px (0.4) |
| Sea kale | 37 px (1.7) | 18 px (0.8) |
| Boulders | 18 px (0.8) | 17 px (0.8) |
| The Old Oak | 211 px (9.6) | 174 px (7.9) |
| The Old Yew | 188 px (8.6) | 147 px (6.7) |

Animals:

| Object | Before | After |
| --- | --- | --- |
| Rabbit | 15 px (0.7) | 9 px (0.4) |
| Deer | 35 px (1.6) | 25 px (1.1) |
| Fox | 15 px (0.7) | 10 px (0.5) |
| Sheep | 13 px (0.6) | 12 px (0.5) |
| Duck | 11 px (0.5) | 7 px (0.3) |
| Butterfly | 8 px (0.3) | 5 px (0.2) |
| Bee | 8 px (0.4) | 5 px (0.2) |
| Boar | 14 px (0.6) | 12 px (0.5) |
| Squirrel | 9 px (0.4) | 7 px (0.3) |
| Hedgehog | 5 px (0.2) | 4 px (0.2) |
| Stork | 24 px (1.1) | 16 px (0.7) |
| Heron | 23 px (1.0) | 15 px (0.7) |
| Otter | 6 px (0.3) | 5 px (0.2) |
| Cow | 23 px (1.1) | 20 px (0.9) |
| Goose | 16 px (0.7) | 10 px (0.5) |
| Pony (ambient) | 26 px (1.2) | 21 px (1.0) |
| Highland (ambient) | 29 px (1.3) | 23 px (1.1) |
| Moorit (ambient) | 19 px (0.9) | 14 px (0.6) |
| Sheep (ambient) | 18 px (0.8) | 13 px (0.6) |
| Eider (ambient) | 11 px (0.5) | 8 px (0.4) |
| Gull (ambient) | 15 px (0.7) | 12 px (0.6) |
| Crane (ambient) | 35 px (1.6) | 21 px (0.9) |
| Eagle (ambient) | 18 px (0.8) | 14 px (0.6) |
| Seal (ambient) | 9 px (0.4) | 8 px (0.4) |
| Hare (ambient) | 20 px (0.9) | 11 px (0.5) |
| Stag (ambient) | 44 px (2.0) | 30 px (1.4) |

Houses:

| Object | Before | After |
| --- | --- | --- |
| Longhouse | 52 px (2.4) | 61 px (2.8) |

The longhouse's yard fence, woodpile, gable pole and cloth frame moved out with it.

## What resizing cannot fix

- **The longhouse is drawn at a smaller scale than every other building.** Its door is about 10 px against a
  22 px settler, where workshop doors are 20–25 px. At 96 it fills its 0.8-tile footprint; making it match
  the workshops (about 120) needs a footprint of 1.0 tile, which changes how closely houses can be placed and
  would make houses in existing saves overlap. That is a rule change for the owner to decide.
- **Mountains are 205 px, about twice a tree.** They read as crags. Larger ones would hide the map behind
  them; this is a symbol, as on a chart, and is left alone.
- **Buildings are at person scale, trees are not.** A real oak is ten settlers tall; here it is four and a
  half, the usual convention for this kind of map. Trees were kept at that height so forests do not bury the
  settlement.
- **Not looked at:** bridges, the hazard markers (vats, refuse), and the Classic art style's sheets (the
  measurements were taken from the Carta sheets; the Classic sheets share the same boxes).

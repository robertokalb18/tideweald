# Tideweald art bible (Milestone 3)

One look: a hand-coloured northern sea chart. Every new picture in the game should look as if the same
engraver drew it on the same sheet of laid paper, around the year 985.

## Setting

- **Who:** Norse settlers who left Iceland with Erik the Red in 985 and were driven south to a wooded island.
- **Buildings:** longhouses of turf and timber (bowed walls, turf or shingle roofs, one door in the long side),
  turf-roof log houses, a stabbur (storehouse on posts), hofs, boat sheds (naust). Wattle fences, drying racks,
  hay stacks. No chapels, belfries, cogs, half-timbered town houses, glass windows, brick or chimneys with pots.
  Smoke leaves through a roof hole (draw it rising from the ridge, never from a chimney stack).
- **Boats:** faerings, knarrs and longships with a single square sail. The raiders' sail is red.
- **People:** tunics, cloaks, hoods; guards with round shields and spears; raiders in red.
- **Allowed anachronisms**, kept from the original design and marked as fantasy: the hilltop windmill, the
  lighthouse and the named wonders. Do not add new ones.

## Palette

The Carta style (default) and the Classic style each have one palette in `src/render/chart.js` (`PALETTES`).
New art takes its colours from there, not from new hex values.

| Role | Carta | Classic |
|---|---|---|
| Ink (lines, text) | `#2b2118` | `#18343d` |
| Paper | `#efe4c8` | `#f5e5aa` |
| Meadow / dry ground | 170,190,112 / 228,212,164 | 113,183,73 / 220,194,118 |
| Shallows → open water → deep water | 196,216,196 → 157,189,176 → 116,152,146 | 52,160,160 → 35,127,140 → 22,92,110 |
| Friendly / enemy | `#2f5d91` / `#b8452f` | `#39c5e3` / `#e07c5c` |
| Wood (fences, posts) | `#5a4028` | `#6b4a2a` |

Colour means something in the interface: blue is ours, red is the enemy or a warning, gold is something ready
to collect. Do not use red for decoration.

## Line and light

- Outlines in ink, about 1 px at 100% zoom, slightly uneven. No pure black.
- Light from the upper left. Shadows are soft ink ellipses under objects, never cast shapes.
- Texture comes from hatching and the paper grain, not gradients. The only smooth gradients are water depth
  and atmospheric haze.

## Scale

- One map tile is 58 × 29 px at 100% zoom. A settler is 22 px tall and is the measure of everything else;
  a longhouse sprite is 96 px wide.
- Every plant, animal and piece of decor takes its size from `src/render/scale.js` and must fit the rules in
  `docs/SCALE.md` (`tests/scale.test.js`). Small things are drawn larger than life so they read on a phone,
  but never larger than the thing they are smaller than. Buildings keep their relative sizes
  (`BUILDING_SIZES` in `src/world/catalog.js`).

## Seasons

Seasons change more than the palette:
- **Spring:** meadow flowers appear; rivers run full.
- **Summer:** dry spells yellow the grass; haystacks by farms.
- **Autumn:** leaves turn; hearth smoke begins.
- **Winter:** snow on the ground, yards and fence posts; flowers hidden; cranes and eiders leave; hearth smoke
  is thicker.

## Rules for adding art

1. A new **static** map visual (anything that does not move) must be part of a tile fingerprint
   (`render/world-draw.js`): draw it inside a building, plant, feature or decor entry whose `vk` changes when it
   changes, or in the terrain tile with its inputs mixed into `terrainFingerprint`.
2. Moving things (people, animals, smoke, arrows) are movers drawn each frame and need no fingerprint.
3. Painted sprite sheets live in `public/art/{carta,classic}`; code-painted sources live in `art-source/`.
   Record the subject reference for every new sprite in that folder's notes, and do not trace or copy a plate.
4. Check every new visual at 35%, 72% and 140% zoom, in both styles, in summer and winter, on a phone held
   sideways (`tests/browser/layout.mjs`).

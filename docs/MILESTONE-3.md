# Milestone 3: "One look" — results (8 November 2026)

Released as v16.14.

## What changed

1. **Art bible** (`docs/ART-BIBLE.md`): setting, palette, line, scale, seasons and the rules for adding art.
2. **Norse longhouses everywhere.** v16.11 drew 4 in 10 longhouses in a northern form and the rest as thatched
   cottages. Every longhouse now uses one of two folio forms: the long turf-and-shingle longhouse (55%) or the
   turf-roof log house (45%). The stabbur and the fisher's house are no longer used as dwellings.
3. **Yards and fences.** A longhouse with room around it (no other building within two tiles) gets a yard of
   trodden earth inside a wattle fence with a gate at the front. Dense rows stay unfenced so they do not tangle.
   In winter the yard is snowy and the fence posts carry snow.
4. **Three water depths.** Each sea cell's distance to land is worked out once per terrain change and painted
   under the sea texture: pale shallows along the shore, open water, then deep water from about ten tiles out.
   The depth is mixed into the terrain tile fingerprint, so tiles redraw when the coast changes.
5. **Seasons beyond palette.** Hearth smoke rises from about half the longhouses in autumn and winter (thicker in
   winter), from the roof ridge, not a chimney. Snow on yards and fences in winter.
6. **Compact landscape layout** (`public/compact.css`, phones held sideways and short windows): the stores, the
   chapter goal and the clock share one slim top row; the threat banner shrinks to a single line under it;
   notices sit to its right; the tab bar and camera tools share the bottom row. On an 844 × 390 screen the map
   visible behind the interface went from **72% to 78%** of the screen in a campaign with a raid on the way
   (`tests/browser/layout.mjs`, which fails below 75%).

| Screen | Before | After |
|---|---|---|
| Phone sideways, 844 × 390 | 72% | 78% |
| Small phone sideways, 667 × 375 | 64% | 74% (with a notice showing) |
| Phone upright, 390 × 844 | 68% | 68% (unchanged) |
| Tablet, 1024 × 768 | 67% | 67% (unchanged) |
| Desktop, 1280 × 800 | 73% | 73% (unchanged) |

## Added in v16.19

- **Footpaths:** a trodden path from each longhouse door to the nearest road within four tiles (snowy in winter).
- **Snow on roofs:** in winter a white wash, cut to the house's own shape, lies over the upper part of each
  longhouse.
- **Soldier poses:** in melee, soldiers and raiders lunge toward their foe and lean into the blow; the fallen
  lie on their side until the fight ends.
- **Phones held upright:** the stores move to a slim top row and the threat banner shrinks to one line; the
  visible map went from 68% to 71%.

## Still not done

- Painted (rather than code-drawn) longhouses, a knarr sprite, and spring blossom need a painter.

## Review notes

- **Art:** the folio longhouse forms are code-painted. They read as Norse at 72% zoom and above; at 35% they are
  small brown blocks, as the thatched cottages were. A painted longhouse set following the art bible would lift
  the whole map.
- **Engineering:** the depth image is one 384 × 320 canvas per art style, rebuilt only on terrain change. Yards
  are decided once per statics rebuild with a 2-tile bucket grid. Smoke is limited to 160 houses.
- **Gameplay:** none; this milestone changes only how things look.

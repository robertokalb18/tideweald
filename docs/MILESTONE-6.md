# Milestone 6 (part): fog and discoveries — results (9 November 2026)

Released as v16.17. Milestone 6 in the audit has two halves: technologies, and fog with discoveries. This
release builds the second half. Technologies are not built (see the end).

## What changed

1. **Uncharted land.** A new campaign island starts charted within 34 tiles of the haven. The rest lies under
   blank chart paper, faint enough that mountains, rivers and coasts still show. Land is charted around every
   finished building (9 tiles), road tile (5), guard hall and harbor (12), lighthouse (16), watchtower (18) and
   beacon (22). Nothing can be built on uncharted land; the build preview says how to chart it.
2. **Twelve discoveries** are set on dry land beyond the first ring, at least 24 tiles apart, fixed by the island:
   silver hoards (+150 gold), old shielings (+40 stone, +20 timber), seal coves (+80 food), bog-iron seams
   (+60 stone), rune stones (+10 morale) and driftwood beaches (+70 timber). Charting one pays it out once,
   writes it in the journal, and leaves an ink cross and its name on the map.
3. **Only new campaigns.** Saves from before v16.17 and every free build have no fog, so nothing an existing
   player has built is hidden.

## Saves

`world.sight` (charted circles: x, y, radius; at most 4,000) and `world.sites` are optional. Revealing runs
inside `step()` when buildings change and is idempotent, so reloading and continuing gives the same island.

## Tests

`tests/fog.test.js`: only new campaigns start under fog; sites are on uncharted dry land and fixed by the
island; a building on uncharted land is refused; a watchtower charts land, pays a discovery once, writes the
journal, and both the chart and the sites survive a save.

## Not built: technologies, and Milestone 7

The audit lists about twelve technologies with visible changes as the other half of Milestone 6, and boats,
trade routes and a rival island as Milestone 7. Both are marked optional and come after the playtest gates of
Milestones 2 to 5, which have not run. Building them now would mean balancing new systems on top of numbers no
player has tried. They are the next work once playtest notes are in.

## Review notes

- **Gameplay:** charting by building makes the first chapters lead outward. Playtesters should say whether a
  chapter ever asks for something (a quarry by the mountains, a harbor) that is still uncharted and slow to
  reach; if so, a "send scouts" action is the fix.
- **Art:** the fog is flat paper. A hand-drawn chart edge (hatching, a compass rose, "here be" lettering) would
  suit the art bible.
- **Engineering:** the fog image is one 384 × 320 canvas, rebuilt only when the charted land grows, and drawn
  once per frame.

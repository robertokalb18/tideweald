# Milestone 5: pacing, finale and free build — results (8 November 2026)

Released as v16.16.

## What changed

1. **No day floor.** v16 made 44 of the 48 chapters (and the commissions) also wait up to 3 days, even when every
   goal was met. A chapter now ends as soon as its goals are met. Chapters that start with scripted weather
   (dry spells, storm days) keep it; you no longer have to sit through all of it once the goals are done.
   `tests/campaign.test.js` still checks every other goal, reward and delivery against v16.11, and checks that
   the only removed rule is the day floor.
2. **The covenant finale.** Completing chapter 48 records the saga in the save (`story.finale`: days, settlers,
   buildings, raids driven off, winters, kinds of wildlife, council decisions), writes the epilogue in the
   journal, and shows a finale card instead of the usual chapter card. It offers two ways on:
   **Keep taking commissions** (as before) or **Carry Haven into free build**.
3. **Free build has its own rules** (`story.rules`, per island): *Raids and weather threats* and *Daily upkeep*,
   in Settings under "Free build rules (this island)". Both are off for a new free build, as before. Carrying the
   campaign island into free build turns both on, so nothing changes until the player chooses. Switching threats
   on gives at least six days before the first one.

## Saves

`story.rules` and `story.finale` are optional, so older saves load with free-build rules off and no finale.
A campaign island already past chapter 48 gets no finale retroactively (it has no record to show).

## Tests

`tests/pacing.test.js`: the finale record and journal entry, the switch to free build with rules on, both
surviving a save; a free build with no rules sees no threats and no upkeep over 14 days, threats only with
threats on, upkeep only with upkeep on; older saves have no rules or finale.

## Review notes

- **Gameplay:** without the day floor, an experienced player can finish several chapters in one sitting, and
  the threat rhythm (every 8–10 days) matters less per chapter. Playtesters should say whether chapters now feel
  rushed. If so, the fix is goals that take time (deliveries, steady harvests), not a timer.
- **Story:** the epilogue is short and in Mara's register. A longer, illustrated saga page would suit the
  Milestone 3 art direction.
- **Engineering:** threats and upkeep are now two switches (`threatsOn`, `upkeepOn` in `military/frontier.js`);
  the campaign keeps both on once settled, exactly as before.

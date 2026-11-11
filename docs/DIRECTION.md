# Direction (v17, 11 November 2026)

Written while answering the "elevate the existing game" brief. It says what Tideweald is, what it is not, and
how its signature system works. New work should strengthen one of the three pillars or be left out.

## The game in three sentences

- **Fantasy.** You lead a handful of Norse settlers of 985 who must turn a river bank on an unknown island into
  a home that can feed, house and defend the fleet that follows them.
- **Recurring decision.** Where you put each building, and when: the river that makes the ground rich also
  floods it, carries the raiders in, and freezes shut in winter.
- **What is distinctive.** The map has a calendar. The same river gives silt, fish, raiders and a winter truce
  on days you can read ahead, so placement is a bet on timing and not only on space.

## Pillars

1. **The river gives and takes.** Geography and the seasons shape every placement.
2. **A settlement whose life you can see on the chart.** State is shown on the map first, in panels second.
3. **Dangers you can read and answer.** Every threat is forecast with the same rules that resolve it.

## Left out on purpose

Multiplayer; heroes; crafting or inventories; more technology (lore stays at twelve crafts); diplomacy beyond
the one jarl; procedural quests; new resources; a second map; sea tides (the sea is 120 tiles from the haven
and under fog; revisit only if the coast comes into play).

## The signature system: the river's year

Code: `src/world/river.js` (rules), `src/render/scene.js` (`drawRiver`), tests: `tests/river.test.js`.

Why the river and not the tide: on the one authored island the settlement stands five tiles from a river and
120 from the sea, raiders already row up that river, and farms already depend on its water. A tide would have
been a new system on a coast the player rarely sees.

### States (48-day year, the same every year)

| State | Days | Low bank (within 2.3 tiles of the river) | River fishing | Longships |
| --- | --- | --- | --- | --- |
| Steady | the rest | farms +30% (silt) | ×1 | land 9–16 tiles from the stores |
| Thaw flood | spring 5–7 | under water: buildings stop and lose what they hold | ×1.25 | land 5–9 tiles away |
| Low water | summer 10 – autumn 1 (Days 22–25) | as steady | ×0.75 | ground downstream: 18–26 tiles away |
| Ice | winter 3–12 (Days 39–48) | as steady | ×0.5 | cannot row: no raid is scheduled |

A "River flood" threat adds two days of high water out of season (`frontier.surge`, the only saved field).
Fishing docks, piers, harbors, shipyards and watermills are built for the water and never flood.

### What the player sees

- Opening message, Day 1: the low bank is the richest ground and floods on Day 5.
- While a building is selected for placing, the low bank is tinted blue; the placement bar says
  "River silt +30% · under water at high water (next: Day N)".
- Two days ahead: "The river is rising" in the log and "Flood in 2d" under the clock.
- During a state: water over the bank, sand bars, or ice on the map; "Flood · 3d", "Low · 4d", "Ice · 9d"
  under the clock; the clock panel lists the next four changes with their days.
- On a wide screen the clock bar always carries a line ("River steady · flood on Day 5"); hovering it lists
  the coming changes.
- The Army panel says when a sighted raid comes on the flood or at low water.

### Choices it creates

- Farms on the bank bear more but stop for the flood; anything else on the bank only loses.
- Collect before the flood or lose what the building holds (the first flood arrives in chapter 1, while
  collection is still by hand).
- River docks swing from +25% to −50% over the year; pond and sea docks do not.
- High water is when to have guards near the river; low water gives the towers a long march to shoot at;
  the ice is ten safe days for building and voyages.

### After a mistake

A flooded building is unharmed and works again when the water falls (Day 8). It can be demolished and
rebuilt higher. The warning repeats every year on the same day.

### Edge cases decided

- The flood changes output, not terrain: walking, routes, placement validity and battles are untouched, so
  nothing can be stranded and no route becomes invalid.
- The level is a pure function of island time (plus the surge), so pause, 1×, skip-ahead and a reload agree;
  messages are worked out at each dawn from yesterday, today and two days ahead.
- Raids already sighted keep the landing chosen when they were sighted (`pending.tide`), also across a save.
- Free build has the river's year only when threats are switched on. Older campaign saves gain it on load;
  buildings already on the bank will flood on spring Day 5 after the usual two-day warning.
- Previews show the steady rate, with the note, so a flood day does not make a site look worthless.

### Known weakness

Once auto-collect is on (after chapter 1) a flooded farm loses three days in 48 for a 30% gain, so farms on the
bank are simply right. The system still decides what else goes there and when raids are dangerous, but the
farm choice is not a lasting dilemma. Flood damage that needs repair would fix this; it is the first thing to
try after playtests.

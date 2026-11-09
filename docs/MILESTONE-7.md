# Lore (Milestone 6, second half) and Milestone 7: trade and a rival — results (9 November 2026)

Released as v16.18. Built before the playtest gates of Milestones 2–5 at the owner's request; every number here
is a first guess to tune from playtest notes.

## Lore: twelve crafts (`src/progression/lore.js`, Market → Lore)

Learned once per island, saved as `story.lore`. Tier II needs two tier I crafts; tier III needs two tier II.

| Tier | Craft | Cost | Needs | Effect | Shows on the map |
|---|---|---|---|---|---|
| I | Iron-shod ard | 150 gold, 20 stone | farm | farms +15% | furrows in front of farms |
| I | Clinker boats | 150 gold, 20 timber | fishing dock | docks and piers +15% | |
| I | Turf walls | 150 gold, 20 timber | longhouse | winter firewood −40% | |
| I | Yew bows | 150 gold, 20 timber | watchtower | towers and beacons +30% harm, +1 tile range | in raids |
| II | Smoke-curing | 300 gold, 40 timber | smokehouse | food spoils half as fast | |
| II | Shield-wall drill | 300 gold, 40 timber | guard hall | guards take 15% less harm | in raids |
| II | Ditch and bank | 300 gold, 40 stone | palisade | gate zone +1.5 tiles, gate holds 50% longer | a ditch before each gate |
| II | Millstones | 300 gold, 40 stone | bakery | mill bonus 30% → 50% | |
| III | Homespun cloth | 600 gold, 80 food | longhouse | rent +0.3 gold/day | cloth on frames in yards |
| III | Rune staves | 600 gold, 80 timber | — | chapter and commission rewards +10% | |
| III | Sunstone sailing | 600 gold, 80 stone | — | one more day of warning; voyages 25% faster | |
| III | Knarr building | 600 gold, 80 timber | boatbuilders' yard | trade voyages and longships | knarrs and longships at sea |

Raid effects reach the battle through its options, so `battle.js` still imports only `world/grid.js`, and the
Army forecast includes them.

## Trade voyages (`src/economy/voyages.js`, Market → Voyages)

With Knarr building, each finished merchant harbor can send one knarr at a time. The cargo leaves at once; the
returns arrive when the knarr comes home, inside `step()`. Saved as `story.voyages`.

| Route | Days | Cargo (market value) | Returns |
|---|---|---|---|
| Eyrar, Iceland | 12 | 100 timber (150 gold) | 260 gold |
| Brattahlíð, Greenland | 14 | 120 food (60 gold) | 90 gold, 30 stone, +3 morale |
| Hlaðir, Trondheim fjord | 20 | 200 food (100 gold) | 230 gold |
| Dyflin, Ireland | 26 | 150 food + 80 timber (195 gold) | 420 gold |

A knarr is drawn sailing out from its harbor for the first half day of a voyage and back in for the last.

## The Red Sail jarl (`src/military/rival.js`, Army panel)

A rival island run by a small scheduled AI, saved as `frontier.rival`:
- He appears after the island's second threat, at strength 20, and every 10 days gathers more ships
  (+4, plus 1 for every 60 days played).
- His strength scales every raid from 0.85× (strength 0) to 1.3× (strength 90 and more).
- **Tribute** (120 gold + 4 per point of strength) buys 20 days of peace: no raids, and he does not grow.
  Storms still come.
- **Longships** (Knarr building, a boatbuilders' yard, at least 6 guards) take half the guards away for 6 days.
  If their power (3 per guard, +15% with shield-wall drill, +10% in marching column) reaches 60% of his
  strength, they cut his strength to 55% and bring home 100 gold + 2 per point; a quarter of them do not
  return. Otherwise half are lost and he gains 5. While they are away the island has fewer guards.

## Tests

`tests/lore-trade.test.js`: tiers, building needs and costs are enforced and a craft is learned once; the ard
raises farms by exactly 15% and lore survives a save; a knarr takes its cargo, stays at sea 12 days and comes
home with silver inside the simulation; the jarl appears, grows, accepts tribute, and a strong longship strike
breaks his strength, with his state surviving a save.

## Review notes

- **Gameplay:** voyages roughly double the market value of their cargo but tie it up for weeks. The jarl adds
  a reason to keep gold aside. All numbers are untested by players.
- **Art:** knarrs and longships reuse the raiders' longship sprite with a colour shift; a knarr sprite with a
  broad hull and striped sail would read better.
- **Engineering:** the new modules (`lore.js`, `voyages.js`, `rival.js`) import nothing that imports them back.

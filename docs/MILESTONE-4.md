# Milestone 4: chains and needs — results (8 November 2026)

Released as v16.15. The audit found that resources rarely fed into each other and that a longhouse never changed
once built. This milestone adds supply chains you can see on the map and three needs tiers that show on the houses.
Nothing new is saved: chains and tiers are worked out from the buildings, so every old save loads unchanged.

## Production chains (`src/economy/chains.js`)

| Workshop | Needs a supplier within 8 tiles | Without one | Extra |
|---|---|---|---|
| Village bakery | Barley farm | half rate | a hilltop windmill or river watermill within 12 tiles: +30% (flour) |
| Smokehouse | Fishing dock or riverside pier | half rate | |
| Boatbuilders' yard | Sawpit or carpenter workshop | half rate, no boats | supplied: **boats**, fishing docks and piers +20% |
| Blacksmith forge | Stone quarry or stonemason yard | half rate, no tools | supplied: **tools**, farms, sawpits and quarries +15% |

- The workshops' daily inputs from the stores (timber for the oven, and so on) are unchanged.
- **Seeing it:** select a chain workshop and dotted blue lines run to its suppliers (and its mill). A workshop
  at half rate shows an amber warning sign above it; the building's status line says what it lacks
  ("Half rate · no barley supplier within 8 tiles"). Supplied buildings say what feeds them
  ("Working · flour from the mill +30%", "Working · tools from the forge +15%").

## Needs tiers (`src/economy/needs.js`)

| Tier | Needs within 8 tiles | Residents | Rent | Shows as |
|---|---|---|---|---|
| 1 Shelter | a finished longhouse | 4 | 0.8 gold/day | the house |
| 2 Varied food | two kinds of food producer (farm, fishing dock, pier, bakery, smokehouse, kitchen garden, apiary, forester lodge, herbalist) | 5 | 1.6 | a woodpile by the door |
| 3 Hof and market | tier 2, a hof and a trading place | 6 | 2.6 | a carved gable pole with a red pennant; the house is drawn 8% larger |

A well within 6 tiles adds 0.2 gold/day at any tier. Rent was 0.8 + 0.6 for each of a well, a trading place and a
hof within 6 tiles (2.6 at most), so the top rent is unchanged; reaching it now also needs varied food. The beds
count in the outpost panel adds up residents by tier. Chapter goals that count "homes with a well, market and hof
close by" keep their v16 meaning.

## Also

- A later-medieval phrase left from v16 ("the cathedral school sends a purse" for folio rewards) now reads "the
  lawspeaker at the Althing sends a purse".

## Tests

`tests/economy.test.js` (5 tests): the bakery at half, full and milled rates, and a farm too far to count; tools
raise farms by exactly 15% and only from a supplied forge; boats raise fishing by 20%; longhouses reach tiers
1, 2 and 3 with 4, 5 and 6 residents and 0.8, 1.6 and 2.6 rent; working all of this out changes nothing in the save.

## Review notes

- **Gameplay:** an existing island with a lone bakery, smokehouse, forge or boatyard will see that workshop drop
  to half rate until a supplier is built nearby. Playtesters should say whether 8 tiles is too tight. Chains give
  layout a reason: farms near bakeries, docks near smokehouses, quarries near the forge.
- **Art:** the woodpile and the pennant pole are code-drawn and small. Painted tier variants of the longhouse
  sprites would show prosperity better.
- **Engineering:** chain supply, island goods and tiers are cached per island and recomputed only when a building
  is placed, removed or finished.

# Milestone 1b: "Landfall 985" — results (8 November 2026)

The story now begins around 985, when twenty-five ships followed Erik the Red west from Iceland and only fourteen
are believed to have arrived (Britannica, "Erik the Red"). Our fleet is the one a gale drives south to a wooded island.

Only words changed. Every goal, reward, delivery, cost, building id and save field is unchanged, and
`tests/campaign.test.js` proves the mechanics still match v16.11.

| Was (v16.11) | Now (v16.12) |
|---|---|
| Around 1250, from the Weser marshes to the Frisian coast | Around 985, from Iceland with Erik the Red's fleet |
| Cottage | Longhouse |
| Wheat farm | Barley farm |
| Market square | Trading place |
| Harbor chapel, chapel | Harbor hof, hof |
| Cloister garden | Walled garden |
| Starfall scriptorium, copied books | Starfall observatory, sky-lore carved on rune staves |
| Herbalist cottage | Herbalist hut |
| A lay brother; Brother Anselm; the bishop's forester | An Irish hermit; Thorgerd of the hof; the godi's forester |
| Cog | Knarr |
| Martinmas fair and feast | Winter Nights fair and feast |
| North Sea gale | Atlantic gale |
| Guild charter | Guild law |
| History note: Wadden Sea marsh settlers (UNESCO 1314) | Norse Greenland farming (UNESCO 1536, Kujataa) |

Kept on purpose: the characters Mara, Ivo and Skipper Elin (and their portraits), the Red Sail raiders, the wonder
names from the original design (Great granary, Hilltop windmill, River watermill, Merchant harbor, Wayfarer
lighthouse, Starfall observatory, Guildhall of Haven, Sanctuary of the tides), and the Renaissance soundtrack.
A hilltop windmill and a lighthouse are anachronisms for 985; the game is historical fantasy, not a re-enactment.

Not yet changed: the building art still shows the v16 thatched cottages for most longhouses. Redrawing them as
Norse turf-and-timber forms belongs to Milestone 3 (art bible).

The text edits were made by `tools/retheme-985.mjs`, which only touches string literals, plus four hand edits listed in it.

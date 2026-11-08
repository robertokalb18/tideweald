# Tideweald v16.11: the folio sheet

v16.11 adds one new sprite sheet, `art/{classic,carta}/folio.webp` (37 sprites). Every sprite is painted in code (`paint.js`). Each one follows the subject and manner of a public-domain catalogue. No scan or plate is copied, traced or sampled.

| Sprites | In the manner of | Where they appear |
|---|---|---|
| Faering boat, haystack, fish-drying rack, angler, creels and nets, rune stone | Bewick, *History of British Birds* tail-pieces (1797–1804) | Shore and meadow props. Haystacks appear by farms in summer and autumn; racks, creels and boats appear by fishing docks and harbours. |
| Cloudberry, cotton grass, harebell and buttercup, fireweed, lingonberry | Lindman, *Bilder ur Nordens Flora* (1901–05) | Meadows and marsh edges. Flowers are hidden in winter. |
| Thrift, bladderwrack, sea kale, lichen boulder | *Flora Danica* (1761–1883) | Coast cells |
| Shetland pony, Highland cattle, moorit and black-faced sheep | Low, *Breeds of the Domestic Animals* (1842) | Grazing near farms, cottages and hills |
| Eider, gulls, crane, sea eagle | von Wright, *Svenska fåglar* (1828–38) | Rafts at sea, gulls over the coast, cranes on marshes |
| Grey seal, hare, red deer stag | Thorburn, *British Mammals* (1920–21) | Shore haul-outs, meadows, forest edges |
| Herring, cod, salmon, pike | Bloch (1782–95) and Couch (1862–65) | The fish swimming in rivers and ponds |
| The Old Oak, The Old Yew | Strutt, *Sylva Britannica* (1822/1830) | Two named landmark trees per island |
| Turf-roof log house, Frisian longhouse, stabbur, fisher cottage | *Das Bauernhaus* (1906); Dietrichson & Munthe | 4 in 10 cottages are drawn in one of these four forms |
| Maelstrom, kraken (vector) | Olaus Magnus, *Carta Marina* (1539) | Sea ornaments in Carta style |

**Saves.** Nothing new is saved. Props and wildlife are worked out from the island's terrain each time it loads, so old saves load unchanged. The only difference is that some existing cottages now show a northern house form.

**Fix.** The Carta coast's water-lining rings were cut with `destination-out` on the terrain tile. That punched holes in the sea, and the holes showed as a dark band along every coast when zoomed in. The rings are now cut on a scratch layer, so the sea underneath is kept.

**Swapping in real plates later.** Download the plate from the catalogue in the art catalogue doc. Cut out the subject on a transparent background and drop it into the matching 256 px cell of `folio-raw.png`. Then re-run `post.py`, which writes both styles plus the rects and bands, and publish the two `folio.webp` files.

**Rights.** The sprites are new code-painted work. The copyright status of AI-made art is uncertain, and they are not claimed as public domain. The catalogues named above are cited as subject references, not as sources.

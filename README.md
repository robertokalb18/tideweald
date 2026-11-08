# Tideweald

A hand-coloured northern sea chart you can build on: a phone-first settlement game.
The story follows Norse settlers around 985, scattered from Erik the Red's fleet (see `docs/MILESTONE-1B.md`).

This tree was **recovered from the published v16.11 build** on 8 November 2026, after the v15–v16.10 source was lost.
It plays exactly like v16.11 apart from the Milestone 1 changes listed below, and it is now the source of truth.

## Quick start

```sh
npm install
npm test             # 30 Node tests: saves, campaign data, simulation, decor, raids, economy, pacing
npm run build        # writes dist/
npm run serve        # http://localhost:8080
npm run test:browser # with the server running: browser smoke test
node tests/browser/raid.mjs   # with the server running: stages a raid and screenshots it
node tools/balance-raids.mjs  # raid balance tables (about a minute)
node tests/browser/layout.mjs # with the server running: how much of the map the interface leaves visible
```

Open `http://localhost:8080/?diagnostics` to see the performance overlay. It shows frame rate, frame times, simulation cost, sprite cache, heap, entity counts and the last save's main-thread time.

## Layout

| Folder | What lives there |
|---|---|
| `src/core` | Simulation clock (fixed steps), diagnostics, developer API |
| `src/world` | Map grid, catalog of everything buildable, world creation, seasons, ecosystem, wildlife, villagers and soldiers |
| `src/economy` | Workshops and production; supply chains (`chains.js`) and needs tiers (`needs.js`) |
| `src/settlement` | Bridges and the placement tools |
| `src/military` | Threats, guards and upkeep (`frontier.js`); raids fought on the map (`battle.js`) |
| `src/progression` | 48 chapters, council decisions, campaign flow, orders and the folio collection |
| `src/render` | Canvas renderer: terrain tiles, sprite atlases, chart ornaments, roads, the v16.11 folio sprites |
| `src/ui` | React UI: the `Home` screen, panels, island canvas, dialogs, settings |
| `src/persistence` | Save format, compression (in a worker), backups, native-app file helpers |
| `src/audio` | Soundtrack player and sound effects |
| `src/vendor` | Recovered third-party code (see `src/vendor/LICENSES.md`) |
| `public` | `index.html`, compiled `app.css`, art atlases, music, fonts, icons |
| `art-source/folio` | The code that paints the v16.11 folio sprite sheet |
| `tests` | Node tests with golden fixtures captured from the live v16.11 game |
| `tools/recovery` | How this tree was recovered, kept for the record |

## What recovery could and could not bring back

- **Recovered:** every module of game code, split into 52 files by domain, with 547 module-level names restored from the names the build kept (for example `advanceWorld`, `renderIsland`, `CHAPTERS`).
- **Still terse:** variables *inside* functions keep their one-letter build names, and React components call `jsx()` instead of JSX syntax. Rename and convert each module as it is next edited.
- **Not recovered:** TypeScript types, comments, and the Tailwind source of `app.css` (the compiled stylesheet is used as-is).
- **Equivalence evidence** (see `docs/MILESTONE-1.md`): 48 chapters, 8 council decisions and the full catalog are identical. A busy v16.11 save loads byte-for-byte, and 20 simulated days produced identical worlds before the fixed-step change.

## Milestone 1 changes beyond v16.11

1. **Fixed-step simulation** (`src/core/simulation.js`): the world always advances in whole 0.025-day steps, so 1x, 3x, 10x and skip-ahead give identical results (`tests/simulation.test.js`). At 1x the world now updates every 2.25 s of real time instead of every 0.25 s; movement and animation are unaffected.
2. **Saving no longer stalls the game:** the island is serialised in 6 ms slices (`serializeWorldAsync`) and compressed in a Web Worker. In the headless measurement the longest frame during a save fell from 150 ms to 17 ms.
3. **Diagnostics overlay** (`?diagnostics`).

## Milestone 2 changes (v16.13): raids you can fight

Raids now land on a beach or river bank, march along a route shown on the map, and are fought there by guards in
the chosen formation, with towers and palisade gates that count only where they stand. The Army panel forecasts
the result with the same rules. Details, balance tables and review notes: `docs/MILESTONE-2.md`.

## Milestone 3 changes (v16.14): one look

An art bible (`docs/ART-BIBLE.md`), Norse longhouses throughout, fenced yards, three water depths, hearth smoke
in the cold seasons, and a compact layout for phones held sideways (78% of the map visible, up from 72%).
Details: `docs/MILESTONE-3.md`.

## Milestone 4 changes (v16.15): chains and needs

Bakeries, smokehouses, boatbuilders and forges need a supplier within 8 tiles (or work at half rate); a supplied
boatyard and forge give the island boats and tools. Longhouses rise through three needs tiers that add residents
and rent and show on the house. Details: `docs/MILESTONE-4.md`.

## Milestone 5 changes (v16.16): pacing, finale and free build

Chapters end as soon as their goals are met (no 3-day floor). Chapter 48 ends with the covenant finale and a
choice to keep taking commissions or carry the island into free build, which now has its own rules for threats
and upkeep. Details: `docs/MILESTONE-5.md`.

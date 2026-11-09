# Engineering items from the audit — results (9 November 2026, v16.19)

## The nine v14 test suites (`tests/v14`)

The v14 suites (TypeScript, 58 tests, written against `lib/*.ts`) are transpiled by `tools/port-v14-tests.mjs`
and run against the rebuilt modules through `tests/v14/shim.js`, which maps the v14 names (`ITEMS`, `START`,
`BUILDING_SCALE`, `armyUnits`, …) onto today's modules. They run with `npm test`: **56 pass, 2 skipped.**

Where the game has changed on purpose since v14, the ported test says so next to the changed line:

| Test | Change since v14 | Adapted to |
|---|---|---|
| raid losses are bounded… | raids are fought on the map (v16.13) | the raid is stepped to its end; losses match the forecast within 1 |
| completed defenses repel raids… | towers count where the raiders go (v16.13) | two towers and a gate beside the target |
| 36 building types… | a bakery without a barley farm bakes at half rate (v16.15) | collects 1 food instead of 2 |
| formations move continuously… | raiders wait at sea until they land (v16.13) | no raiders on shore during the warning |
| all 48 chapters achievable… | council decisions, steady harvests, calm days, served homes and workshop kinds were added in v15–v16; the day floor went in v16.16 | the test world gains the buildings and records those goals need |
| new island… / placements… | 110 catalogue items since v15 (was 99); removal tools are free | updated counts |
| scenario weather… / construction withholds… | new campaigns start under fog (v16.17) | fog removed for these two checks |
| two demo-gold tests | the demo pack was removed before v16.11 | skipped, with the reason in the file |

The ports also caught a real bug: a free-build island carried an empty `sight` key that a save did not
round-trip. It is fixed.

## Type checking (`npm run typecheck`)

`tsconfig.json` type-checks the modules written since the rebuild (battle, rival, chains, needs, voyages, lore,
fog, grid, step clock) as JavaScript with `checkJs`. It passes with TypeScript 7. The recovered v16.11 modules are
not checked; converting them to TypeScript (and to JSX) remains a larger job than its value before playtesting.

## Stylesheet source (`src/styles`)

The compiled `public/app.css` has been split by `tools/split-css.mjs` into:
- `src/styles/tailwind.css`: Tailwind v4.2.1's output (its layers and `@property` rules), kept verbatim;
- `src/styles/game.css`: the game's own CSS, formatted for editing (about 13,000 lines).

`scripts/build.mjs` bundles and minifies them into `dist/app.css`. Computed styles of every element on the HUD and
the market dialog are identical to the old stylesheet at phone and desktop sizes. New Tailwind utility classes
need the Tailwind CLI and the animation and shimmer plugins, which cannot be installed in this environment (the
npm registry is unreachable); until then, new styles go in `game.css`, `public/compact.css` or `public/extras.css`.

## Not done

- TypeScript or JSX for the recovered modules (see above).
- Regenerating Tailwind's utilities from source (needs the CLI and plugins).
- Offline hosting (deferred by the owner).

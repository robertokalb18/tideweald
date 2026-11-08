# Claude handoff

Read README.md and docs/MILESTONE-1.md first. The audit and roadmap live in the "Tideweald project audit" doc.

Rules carried over from earlier versions:
- Preserve the mobile-first design, the 25 public-domain music pieces with their provenance (`public/music/credits.txt`), and save compatibility. No real purchases.
- Any new static map visual must be part of a tile fingerprint (see `render/world-draw.js`).
- Use the `--safe-*` CSS variables, not `env(safe-area-inset-*)`.
- Browser tests are not physical-device tests. Do not claim device frame rates without a device.

New rules from Milestone 1:
- `npm test` must pass before publishing. The golden fixtures in `tests/fixtures` came from the live v16.11 game; do not regenerate them to make a failing test pass.
- Keep the simulation fixed-step: change the world only inside `step()` calls made by `advanceWorld`.
- Data modules (catalogs, chapter text) must not import from modules that import them back. A cycle once made `CATALOG` undefined when the game was entered from another module.
- The setting is Norse settlers of 985 (Milestone 1b, done in v16.12). Keep new text in that world: no chapels, cogs, guild charters or later-medieval terms. Offline hosting is deferred.
- Milestone 2, "Raids you can fight", is in v16.13 (`docs/MILESTONE-2.md`); its playtest gate is still open.
- Raids are fought in `military/battle.js`. Keep it deterministic (no Math.random, no wall-clock), inside `step()`,
  and keep its only import the `world/grid.js` leaf. The Army forecast must keep using the same code as the fight.
- Milestone 3, "One look", is in v16.14 (`docs/MILESTONE-3.md`). New art follows `docs/ART-BIBLE.md`.
  `tests/browser/layout.mjs` must keep at least 75% of the map visible on a phone held sideways.
- Milestone 4, chains and needs, is in v16.15 (`docs/MILESTONE-4.md`). Chains and tiers are derived from the
  buildings and never saved; keep it that way unless a save format change is planned with a migration.
- Milestone 5 (pacing, finale, free-build rules) is in v16.16 (`docs/MILESTONE-5.md`). The campaign test compares
  chapters with v16.11 minus the removed day floor; any other change to chapter mechanics must be deliberate
  and named in that test the same way, never by regenerating the fixture.
- Next: the optional Milestones 6 (technologies, fog and discoveries) and 7 (boats, trade, a rival island).

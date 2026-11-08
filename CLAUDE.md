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
- Next milestone: 3, "One look" (art bible, Norse longhouses, compact landscape UI). See the audit doc.

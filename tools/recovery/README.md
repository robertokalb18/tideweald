# How the source was recovered

`bundle-v16.11.js` is the exact `app.js` published as v16.11 (785,384 bytes).

1. `gen.cjs` parses the bundle (espree + eslint-scope), drops the bundler runtime and the npm copies of React,
   restores module-level names from the bundle's `__name` registrations plus `names.cjs`, and splits the top-level
   statements into modules using the ranges in `plan.cjs`. Imports and exports are computed from scope analysis.
2. Prettier formats the output; `postgen.cjs` then applies the hand edits (debug hooks and the Milestone 1 changes).
3. `build.sh` reproduces the whole run.

After recovery, `src/` is edited by hand. These tools are kept only as a record.

# Milestone 1: "Solid ground" — results (8 November 2026)

All measurements were taken in headless Chromium in a cloud container (844 x 390), not on a phone.

| Check | Result |
|---|---|
| Campaign intact | 48 chapters, 8 council decisions and the 36-building catalog identical to live v16.11 (`tests/campaign.test.js`) |
| Save compatibility | A busy save written by live v16.11 loads byte-for-byte (`tests/save.test.js`); new saves round-trip and stay stable |
| Code equivalence (before the fixed-step change) | The same v16.11 save simulated for 20 days in both builds produced identical worlds and identical map objects |
| Looks | Frozen-clock screenshots at 6 views in both art styles: 0.0–1.3% of pixels differed from v16.11, all in animated lamp glow, toasts and moving figures. After the fixed-step change, up to 6% differ for the same timing reasons |
| Determinism | Same save, 2 game days: 1x, 10x and skip-ahead give identical worlds. The old variable step failed the same test |
| Saving | Longest frame during serialise + compress: 150 ms in v16.11, 17 ms now. Writing the backup to browser storage still takes about 13 ms in one go |
| Frame pacing, 420 buildings | 58–60 fps, p95 16.8 ms (v16.11: 57–58 fps, p95 16.8 ms) |
| Heap after GC | 26.0 MB (v16.11: 25.6 MB) |
| Tests | 11 Node tests pass; browser smoke test included |

Not done in this milestone: TypeScript types, JSX syntax, the Tailwind source of `app.css`, restoring the 9 v14 test suites
(they target v14 function signatures and need rewriting against the recovered modules), and offline hosting (deferred).

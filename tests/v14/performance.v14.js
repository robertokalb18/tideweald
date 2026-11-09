// Ported from the v14 suite lib/performance.test.ts by tools/port-v14-tests.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { SpatialIndex } from "./shim.js";
import { createWorld, cellAt, addItem, advanceWorld } from "./shim.js";
import { villageWalkers } from "./shim.js";
test("spatial lookup agrees with ordered full scans across bucket boundaries", () => {
  const points = Array.from({ length: 650 }, (_, i) => ({ x: i * 13.3 % 68, y: i * 7.7 % 56, id: i }));
  const index = new SpatialIndex(points);
  for (let i = 0; i < 100; i++) {
    const x = i * 3.1 % 68, y = i * 9.3 % 56, r = 0.45 + i % 7, predicate = (p) => p.id % 3 === 0;
    const matches = points.filter((p) => (p.x - x) ** 2 + (p.y - y) ** 2 < r * r && predicate(p));
    assert.equal(index.some(x, y, r, predicate), !!matches.length);
    assert.equal(index.first(x, y, r, predicate), matches[0]);
    assert.equal(index.count(x, y, r, predicate), matches.length);
  }
});
test("villagers move continuously, stay on dry routes and stop while paused", () => {
  const w = createWorld();
  w.plants = [];
  w.buildings = [{ id: 100, kind: "cottage", x: 34.5 + 124, y: 31.5 + 104, buildProgress: 1, progress: 0, stored: 0 }];
  for (let x = 154; x < 163; x++) cellAt(w, x, 33 + 104).road = "paved";
  let last = villageWalkers(w, 0)[0];
  assert.ok(last);
  let prior = { x: last.x, y: last.y }, moved = 0;
  for (let t = 16; t < 2e4; t += 16) {
    last = villageWalkers(w, t)[0];
    const distance = Math.hypot(last.x - prior.x, last.y - prior.y);
    assert.ok(distance < 0.011);
    moved += distance;
    assert.ok(cellAt(w, last.x, last.y)?.land);
    assert.ok(!cellAt(w, last.x, last.y)?.pond);
    prior = { x: last.x, y: last.y };
  }
  assert.ok(moved > 2);
  const position = { x: last.x, y: last.y };
  for (let t = 2e4; t < 21e3; t += 16) villageWalkers(w, t, true);
  assert.deepEqual({ x: last.x, y: last.y }, position);
  w.buildings = [];
  w.placements++;
  assert.equal(villageWalkers(w, 21100).length, 0);
});
test("irrigation cache refreshes after pond creation and terrain removal", () => {
  const w = createWorld();
  w.plants = [];
  w.animals = [];
  w.wallet.gold = 1e4;
  const target = cellAt(w, 50.5 + 124, 53.5 + 104);
  target.moisture = 0.05;
  advanceWorld(w, 0.1);
  assert.ok(target.moisture < 0.2);
  assert.ok(addItem(w, "pond", 52.5 + 124, 53.5 + 104).ok);
  advanceWorld(w, 0.1);
  assert.ok(target.moisture >= 0.58);
  assert.ok(addItem(w, "erase", 52.5 + 124, 53.5 + 104).ok);
  target.moisture = 0.05;
  advanceWorld(w, 0.1);
  assert.ok(target.moisture < 0.2);
});

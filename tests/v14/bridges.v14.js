// Ported from the v14 suite lib/bridges.test.ts by tools/port-v14-tests.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { createWorld, cellAt, addItem, advanceWorld, placementPreview } from "./shim.js";
import { bridgePlan, bridgeDays, bridgeAt, bridgeTiles, removeBridge } from "./shim.js";
import { militaryActors } from "./shim.js";
import { readSave, serializeWorld } from "./shim.js";
function river() {
  const w = createWorld("sandbox");
  w.story.started = true;
  w.plants = [];
  w.buildings = [];
  w.autoWeather = false;
  w.wallet = { gold: 1e4, food: 1e3, timber: 1e3, stone: 1e3 };
  for (let y = 150; y < 180; y++) for (let x = 180; x < 210; x++) {
    const c = cellAt(w, x, y);
    c.land = true;
    c.pond = x >= 192 && x <= 195;
    c.waterType = c.pond ? "river" : null;
    c.rock = false;
    c.elevation = 0;
    c.road = false;
  }
  w.terrainRevision = 99;
  return w;
}
test("a river bridge prices the complete span, constructs over time and preserves water", () => {
  const w = river(), q = bridgePlan(w, "timber_bridge", 194.5, 165.5, 0);
  assert.ok(q.ok);
  assert.equal(q.bridge.length, 6);
  assert.equal(q.cost, 120);
  assert.deepEqual(q.materials, { timber: 48, stone: 0 });
  const before = { ...w.wallet };
  assert.ok(addItem(w, "timber_bridge", 194.5, 165.5, 0).ok);
  assert.equal(w.wallet.gold, before.gold - 120);
  assert.equal(w.wallet.timber, before.timber - 48);
  assert.equal(cellAt(w, 194, 165).road, false);
  advanceWorld(w, 0.1);
  assert.ok(w.bridges[0].buildProgress > 0 && w.bridges[0].buildProgress < 1);
  advanceWorld(w, bridgeDays(w.bridges[0]));
  assert.equal(w.bridges[0].buildProgress, 1);
  assert.equal(cellAt(w, 194, 165).pond, true);
  assert.equal(cellAt(w, 194, 165).road, "path");
  assert.deepEqual(readSave(serializeWorld(w)).bridges, w.bridges);
});
test("rotate changes river alignment; failed, over-wide, occupied and unaffordable spans never charge", () => {
  const w = river(), before = { ...w.wallet };
  assert.ok(!placementPreview(w, "timber_bridge", 194.5, 165.5, 1).ok);
  assert.ok(!addItem(w, "timber_bridge", 194.5, 165.5, 1).ok);
  assert.deepEqual(w.wallet, before);
  w.wallet.timber = 2;
  assert.ok(!addItem(w, "timber_bridge", 194.5, 165.5).ok);
  assert.equal(w.wallet.gold, before.gold);
  w.wallet.timber = 1e3;
  w.plants.push({ id: 8e3, kind: "oak", x: 191.5, y: 165.5, health: 1, growth: 1, age: 4, variant: 0.4 });
  assert.match(bridgePlan(w, "timber_bridge", 194.5, 165.5).reason, /Clear plants/);
  w.plants = [];
  assert.ok(addItem(w, "stone_bridge", 194.5, 165.5).ok);
  const balance = { ...w.wallet };
  assert.ok(!addItem(w, "timber_bridge", 194.5, 165.5).ok);
  assert.deepEqual(w.wallet, balance);
});
test("approaches resist building and terraforming, cancellation refunds only half, removal clears crossings", () => {
  const w = river();
  assert.ok(addItem(w, "stone_bridge", 194.5, 165.5).ok);
  const b = w.bridges[0], balance = { ...w.wallet };
  assert.ok(!addItem(w, "ocean", 192.5, 165.5).ok);
  assert.ok(!addItem(w, "farm", 191.5, 165.5).ok);
  assert.ok(!addItem(w, "remove_road", 192.5, 165.5).ok);
  assert.deepEqual(w.wallet, balance);
  assert.ok(removeBridge(w, b.id));
  assert.equal(w.wallet.gold, balance.gold + 90);
  assert.equal(w.wallet.timber, balance.timber + 12);
  assert.equal(w.wallet.stone, balance.stone + 24);
  assert.equal(bridgeAt(w, 194, 165), void 0);
  assert.ok(addItem(w, "timber_bridge", 194.5, 165.5).ok);
  advanceWorld(w, 3);
  const built = w.bridges[0], paid = { ...w.wallet };
  assert.ok(addItem(w, "remove_bridge", 194.5, 165.5).ok);
  assert.deepEqual(w.wallet, paid);
  for (const p of bridgeTiles(built).slice(1, -1)) assert.equal(cellAt(w, p.x, p.y).road, false);
});
test("guards cross completed bridges and buildings cannot block their approaches", () => {
  const w = river();
  assert.ok(addItem(w, "timber_bridge", 194.5, 165.5).ok);
  assert.ok(!placementPreview(w, "cottage", 191.5, 164.5).ok);
  advanceWorld(w, 3);
  w.buildings = [{ id: 9e3, kind: "guardhall", x: 188.5, y: 161.5, progress: 0, buildProgress: 1, stored: 0 }];
  w.frontier.garrison = 6;
  w.frontier.formation = "column";
  w.placements++;
  let crossed = 0;
  for (let t = 1; t < 9e4; t += 100) for (const a of militaryActors(w, t)) {
    const c = cellAt(w, a.x, a.y);
    if (c.pond) {
      assert.ok(c.road);
      crossed++;
    }
  }
  assert.ok(crossed > 0, "at least one guard uses the bridge deck");
});

// Ported from the v14 suite lib/v13.test.ts by tools/port-v14-tests.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { createWorld, START, COLS, ITEMS, isBuildingItem, cellAt, advanceWorld, buildingResource, collectGoods, rotateBuilding, addItem } from "./shim.js";
import { militaryActors, raidLocation } from "./shim.js";
import { settlementLedger } from "./shim.js";
import { serializeWorld, readSave } from "./shim.js";
function clearField() {
  const w = createWorld();
  w.plants = [];
  w.animals = [];
  w.autoWeather = false;
  w.weather = "sun";
  w.wallet = { gold: 1e4, food: 1e3, timber: 1e3, stone: 1e3 };
  for (let y = 140; y < 190; y++) for (let x = 170; x < 220; x++) {
    const c = cellAt(w, x, y);
    c.land = true;
    c.pond = false;
    c.rock = false;
    c.elevation = 0;
  }
  w.placements++;
  return w;
}
test("36 building types, correct workshop resources, input costs, and no fuel charge at full storage", () => {
  const w = clearField();
  assert.equal(ITEMS.filter(isBuildingItem).length, 36);
  for (const [kind, resource] of [["bakery", "food"], ["carpenter", "timber"], ["stonemason", "stone"], ["smithy", "gold"]]) assert.equal(buildingResource(kind), resource);
  w.buildings = [{ id: 9001, kind: "bakery", x: START.x, y: START.y, buildProgress: 1, progress: 0, stored: 0 }];
  const ledger = settlementLedger(w);
  assert.equal(ledger.rows.find((r) => r.resource === "timber").inputs, 2);
  const timber = w.wallet.timber;
  advanceWorld(w, 0.1);
  assert.ok(Math.abs(w.wallet.timber - (timber - 0.2)) < 1e-4);
  const collected = collectGoods(w);
  // v16.15 (Milestone 4): a bakery with no barley farm within 8 tiles bakes at half rate (v14: 2).
  assert.equal(collected.food, 1);
  assert.equal(collected.gold, 0);
  w.buildings[0].stored = 300;
  const before = w.wallet.timber;
  advanceWorld(w, 0.1);
  assert.equal(w.wallet.timber, before);
  assert.equal(settlementLedger(w).rows.find((r) => r.resource === "timber").inputs, 0);
});
test("formations move continuously, pause, route around water, recover from terraforming, and enemies retire", () => {
  const w = clearField();
  w.buildings = [{ id: 8001, kind: "guardhall", x: START.x, y: START.y, buildProgress: 1, progress: 0, stored: 0 }];
  w.frontier.garrison = 6;
  for (let y = 164; y < 174; y++) cellAt(w, 198, y).pond = true;
  w.placements++;
  let prior = militaryActors(w, 1).map((a) => ({ ...a })), total = 0;
  for (let t = 17; t < 9e3; t += 16) {
    const actors = militaryActors(w, t);
    assert.equal(actors.length, 6);
    for (let i = 0; i < 6; i++) {
      const a = actors[i], c = cellAt(w, a.x, a.y);
      assert.ok(c.land && !c.pond);
      const d = Math.hypot(a.x - prior[i].x, a.y - prior[i].y);
      assert.ok(d < 0.022);
      total += d;
    }
    prior = actors.map((a) => ({ ...a }));
  }
  assert.ok(total > 5);
  const frozen = militaryActors(w, 9016, true).map((a) => [a.x, a.y]);
  assert.deepEqual(militaryActors(w, 10016, true).map((a) => [a.x, a.y]), frozen);
  w.frontier.formation = "column";
  for (let t = 10032; t < 14e3; t += 16) militaryActors(w, t);
  assert.notDeepEqual(militaryActors(w, 14016, true).map((a) => [a.x, a.y]), frozen);
  const actor = militaryActors(w, 14032, true)[0];
  cellAt(w, actor.x, actor.y).pond = true;
  w.placements++;
  const moved = militaryActors(w, 14048, true)[0];
  assert.ok(!cellAt(w, moved.x, moved.y).pond);
  w.frontier.pending = { id: 1, kind: "raid", title: "Test raid", dueDay: 10, strength: 25 };
  assert.ok(raidLocation(w));
  // v16.13 (Milestone 2): raiders stay at sea until they land; during the warning only the ship shows (v14: 5 on shore).
  assert.equal(militaryActors(w, 14100).filter((a) => a.enemy).length, 0);
  w.frontier.pending = void 0;
  for (let t = 14116; t < 23e3; t += 16) militaryActors(w, t);
  assert.equal(militaryActors(w, 23e3).filter((a) => a.enemy).length, 0);
});
test("rotation and formation persist, and the starter river has small fish", () => {
  const w = createWorld();
  assert.ok(w.animals.filter((a) => a.kind === "fish" && Math.hypot(a.x - START.x, a.y - START.y) < 25).length >= 6);
  w.buildings = [{ id: 9e3, kind: "palisade", x: START.x, y: START.y, progress: 0, buildProgress: 1, stored: 0 }];
  const wallet = { ...w.wallet };
  rotateBuilding(w, 9e3);
  assert.equal(w.buildings[0].orientation, 1);
  assert.deepEqual(w.wallet, wallet);
  w.frontier.formation = "line";
  const restored = readSave(serializeWorld(w));
  assert.equal(restored.buildings[0].orientation, 1);
  assert.equal(restored.frontier.formation, "line");
});
test("v12 compact saves retain every tile, currency, chapter, building, orientation and animal target", () => {
  const full = createWorld();
  full.story.chapter = 31;
  full.story.chapterCollected = { ...full.story.collected };
  full.wallet.gold = 678;
  const raw = JSON.parse(serializeWorld(full));
  raw.format = 2;
  delete raw.cols;
  delete raw.rows;
  raw.world.cells = [];
  const current = JSON.parse(serializeWorld(full));
  for (let y = 0; y < 112; y++) for (let x = 0; x < 136; x++) raw.world.cells.push(current.world.cells[(y + 104) * COLS + x + 124]);
  raw.world.plants = [];
  raw.world.features = [];
  raw.world.objects = [];
  raw.world.buildings = [{ id: 8e3, kind: "palisade", x: 68.5, y: 59.5, progress: 0, buildProgress: 1, stored: 0, orientation: 1 }];
  raw.world.animals = [{ id: 8001, kind: "fish", x: 75.5, y: 57.5, tx: 77.5, ty: 58.5, age: 3, health: 0.75, direction: 1, cooldown: 0.3 }];
  const w = readSave(JSON.stringify(raw));
  assert.equal(w.story.chapter, 31);
  assert.equal(w.wallet.gold, 678);
  assert.equal(w.buildings[0].x, 192.5);
  assert.equal(w.buildings[0].orientation, 1);
  assert.equal(w.animals[0].tx, 201.5);
  for (let y = 0; y < 112; y++) for (let x = 0; x < 136; x++) assert.deepEqual(cellAt(w, x + 124, y + 104), cellAt(full, x + 124, y + 104));
});
test("single trees plant on the selected valid tile without random shoreline failure", () => {
  const w = clearField();
  for (let x = 190; x < 195; x++) for (let y = 160; y < 165; y++) cellAt(w, x, y).pond = true;
  const c = cellAt(w, 192, 162);
  c.pond = false;
  for (let i = 0; i < 8; i++) {
    assert.ok(addItem(w, "apple", 192.01, 162.01).ok);
    assert.equal(w.plants.at(-1).x, 192.01);
    assert.equal(w.plants.at(-1).y, 162.01);
  }
});
test("raising terrain out of a river invalidates the water contour cache", () => {
  const w = clearField();
  assert.ok(addItem(w, "river", START.x + 15, START.y + 5).ok);
  const revision = w.terrainRevision ?? 0;
  assert.ok(cellAt(w, START.x + 15, START.y + 5).pond);
  assert.ok(addItem(w, "mountain", START.x + 15, START.y + 5).ok);
  assert.equal(w.terrainRevision, revision + 1);
  assert.equal(cellAt(w, START.x + 15, START.y + 5).pond, false);
});

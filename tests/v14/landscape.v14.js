// Ported from the v14 suite lib/landscape.test.ts by tools/port-v14-tests.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { contourRings } from "./shim.js";
import { createWorld, addItem, advanceWorld, collectGoods, production } from "./shim.js";
import { settlementLedger } from "./shim.js";
import { serializeWorld, readSave } from "./shim.js";
const area = (ring) => ring.reduce((n, a, i) => {
  const b = ring[(i + 1) % ring.length];
  return n + a.x * b.y - b.x * a.y;
}, 0) / 2;
test("shore topology closes isolated tiles, diagonal islands, holes and map-edge rivers", () => {
  for (const [name, w, h, mask, expected, rings] of [
    ["single", 3, 3, (x, y) => x === 1 && y === 1, 1, 1],
    ["diagonal", 2, 2, (x, y) => x === y, 2, 2],
    ["hole", 5, 5, (x, y) => x !== 2 || y !== 2, 24, 2],
    ["channel", 7, 7, (x, y) => x === 3 || y === 3, 13, 1]
  ]) {
    const result = contourRings(w, h, mask);
    assert.equal(result.length, rings, name);
    assert.equal(result.reduce((n, r) => n + area(r), 0), expected, name);
    for (const ring of result) for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      assert.equal(Math.abs(a.x - b.x) + Math.abs(a.y - b.y), 1);
    }
  }
});
test("reeds and sedge survive freshwater, regular shrubs reject ponds, and saltwater rejects seeds", () => {
  const w = createWorld();
  w.plants = [];
  w.animals = [];
  w.wallet.gold = 1e4;
  assert.ok(addItem(w, "pond", 50.5 + 124, 53.5 + 104).ok);
  assert.ok(addItem(w, "reeds", 50.5 + 124, 53.5 + 104).ok);
  assert.ok(addItem(w, "sedge", 50.5 + 124, 53.5 + 104).ok);
  const gold = w.wallet.gold;
  assert.equal(addItem(w, "hazel", 50.5 + 124, 53.5 + 104).ok, false);
  assert.equal(addItem(w, "reeds", 0, 0).ok, false);
  assert.equal(w.wallet.gold, gold);
  w.weather = "rain";
  advanceWorld(w, 2);
  assert.ok(w.plants.length > 0);
  assert.ok(w.plants.every((p) => p.health > 0.9 && p.growth > 0.7));
  assert.deepEqual(readSave(serializeWorld(w)), w);
});
test("new flowers support pollinators and hazards still damage wetland plants", () => {
  const w = createWorld();
  w.plants = [];
  w.wallet.gold = 1e4;
  addItem(w, "soil", 50.5 + 124, 53.5 + 104);
  addItem(w, "water", 50.5 + 124, 53.5 + 104);
  addItem(w, "bluebells", 50.5 + 124, 53.5 + 104);
  w.weather = "rain";
  advanceWorld(w, 2);
  addItem(w, "bee", 50.5 + 124, 53.5 + 104);
  advanceWorld(w, 1);
  assert.ok(w.animals[0].health > 0.8);
  addItem(w, "pond", 50.5 + 124, 53.5 + 104);
  addItem(w, "reeds", 50.5 + 124, 53.5 + 104);
  const reeds = w.plants.filter((p) => p.kind === "reeds");
  addItem(w, "nuclear", 50.5 + 124, 53.5 + 104);
  advanceWorld(w, 2);
  assert.ok(reeds.some((p) => p.health < 0.7));
});
test("ledger respects winter upkeep, full storage, charter and harvesting without duplicating goods", () => {
  const w = createWorld("campaign");
  w.story.started = true;
  w.story.settled = true;
  w.story.population = 12;
  w.frontier.garrison = 2;
  w.time = 36;
  w.plants = [];
  w.buildings = [{ id: 100, kind: "farm", x: 34.5 + 124, y: 31.5 + 104, progress: 0, buildProgress: 1, stored: 300 }];
  w.wallet = { gold: 0, food: 0, timber: 0, stone: 0 };
  const l = settlementLedger(w), food = l.rows.find((r) => r.resource === "food");
  assert.equal(food.gross, 0);
  assert.equal(food.upkeep, 7);
  assert.equal(food.net, -7);
  assert.equal(food.dawnShort, true);
  assert.equal(l.full, 1);
  assert.equal(l.rows.find((r) => r.resource === "timber").upkeep, 2);
  assert.equal(l.rows.find((r) => r.resource === "gold").gross, 8);
  collectGoods(w);
  const after = settlementLedger(w);
  assert.ok(after.rows.find((r) => r.resource === "food").gross > 0);
  assert.equal(after.full, 0);
  assert.equal(w.wallet.food, 300);
  collectGoods(w);
  assert.equal(w.wallet.food, 300);
});
test("production neighborhoods reflect road edits and changed water immediately", () => {
  const w = createWorld();
  w.plants = [];
  w.wallet.gold = 1e4;
  addItem(w, "farm", 34.5 + 124, 31.5 + 104);
  advanceWorld(w, 1);
  const b = w.buildings[0], base = production(w, b).rate;
  addItem(w, "paved", 32.5 + 124, 31.5 + 104);
  assert.ok(production(w, b).rate > base);
  addItem(w, "remove_road", 32.5 + 124, 31.5 + 104);
  assert.equal(production(w, b).rate, base);
  const fish = { id: 200, kind: "fishery", x: 50.5 + 124, y: 53.5 + 104, progress: 0, buildProgress: 1, stored: 0 };
  w.buildings.push(fish);
  assert.equal(production(w, fish).rate, 0);
  addItem(w, "pond", 53.5 + 124, 53.5 + 104);
  assert.ok(production(w, fish).rate > 0);
});
test("legacy exotic plantings become regional equivalents without losing resources, growth or progress", () => {
  const w = createWorld("campaign");
  w.story.chapter = 14;
  w.time = 78;
  w.wallet = { gold: 1200, food: 50, timber: 66, stone: 99 };
  const kinds = ["redwood", "cedar", "cypress", "palm", "baobab", "jacaranda", "olive", "orange", "banana", "bamboo", "acacia"];
  w.plants = kinds.map((kind, i) => ({ id: 700 + i, kind, x: 20 + i * 0.2 + 124, y: 20 + 104, growth: 0.87, health: 0.68, age: 12, variant: 0.2 }));
  const migrated = readSave(serializeWorld(w));
  assert.deepEqual(migrated.wallet, w.wallet);
  assert.deepEqual(migrated.story, w.story);
  assert.deepEqual(migrated.cells, w.cells);
  assert.equal(migrated.time, w.time);
  assert.equal(migrated.plants.length, kinds.length);
  assert.deepEqual(migrated.plants.map((p) => p.kind), ["beech", "spruce", "yew", "alder", "hornbeam", "hawthorn", "pear", "plum", "apple", "birch", "rowan"]);
  for (let i = 0; i < w.plants.length; i++) assert.deepEqual({ ...migrated.plants[i], kind: w.plants[i].kind }, w.plants[i]);
  assert.deepEqual(readSave(serializeWorld(migrated)), migrated);
});
test("regional fruit trees produce harvest and the ledger agrees with the simulation", () => {
  const w = createWorld();
  w.plants = [];
  w.wallet.gold = 1e4;
  w.weather = "rain";
  for (const [i, kind] of ["apple", "pear", "plum", "cherry_tree"].entries()) {
    const x = 178 + i * 2.5, y = 160;
    addItem(w, "soil", x, y);
    addItem(w, "water", x, y);
    assert.ok(addItem(w, kind, x, y).ok);
  }
  advanceWorld(w, 3);
  const before = w.orchardFood;
  advanceWorld(w, 0.1);
  assert.ok(w.orchardFood > before);
  assert.ok(settlementLedger(w).rows.find((r) => r.resource === "food").gross > 0);
});

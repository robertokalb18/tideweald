// Ported from the v14 suite lib/expansion.test.ts by tools/port-v14-tests.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { createWorld, COLS, ROWS, START, cellAt, beginCampaign, advanceWorld, claimDemoPack, tradeGoods, CHAPTERS, enterChapter, campaignObjectives } from "./shim.js";
import { parseSavedWorld, serializeWorld, readSave } from "./shim.js";
import { encodeStoredSave, decodeStoredSave } from "./shim.js";
import { armyUnits } from "./shim.js";
import { trainGuards, stepFrontier, foodCapacity, foodSpoilage } from "./shim.js";
test("expanded map has eight times the previous grid with room for broad outer districts", () => {
  const w = createWorld();
  assert.equal(COLS * ROWS, 384 * 320);
  assert.ok(w.cells.filter((c) => c.land && !c.pond && !c.rock && c.elevation <= 12).length > 6e4);
  assert.ok(cellAt(w, START.x, START.y)?.land);
});
test("legacy expansion keeps every cell and entity, shifts targets and starts the new voyage once", () => {
  const full = createWorld("campaign");
  const raw = JSON.parse(JSON.stringify(full));
  raw.cells = [];
  for (let y = 0; y < 56; y++) for (let x = 0; x < 68; x++) raw.cells.push({ ...cellAt(full, x + 158, y + 132), x, y });
  raw.plants = [{ id: 20, kind: "oak", x: 30, y: 24, health: 0.68, growth: 0.9, age: 40, variant: 0.6 }];
  raw.animals = [{ id: 21, kind: "rabbit", x: 30, y: 25, tx: 31, ty: 25, age: 8, health: 0.8, direction: 1, cooldown: 0.3 }];
  raw.buildings = [{ id: 22, kind: "farm", x: 34, y: 31, stored: 55, buildProgress: 0.8, progress: 0.2 }];
  raw.features = [];
  raw.objects = [];
  raw.story.chapter = 28;
  raw.story.completed = Array.from({ length: 28 }, (_, i) => i);
  raw.story.incident = { x: 18, y: 20 };
  raw.story.reserves.food = 57;
  raw.wallet.gold = 4321;
  delete raw.story.chapterCollected;
  const w = parseSavedWorld(raw);
  for (const c of raw.cells) assert.deepEqual(cellAt(w, c.x + 158, c.y + 132), { ...c, x: c.x + 158, y: c.y + 132 });
  assert.deepEqual(w.buildings[0], { ...raw.buildings[0], x: 192, y: 163 });
  assert.equal(w.animals[0].tx, 189);
  assert.equal(w.plants[0].health, 0.68);
  assert.equal(w.wallet.gold, 4321);
  assert.equal(w.story.reserves.food, 57);
  assert.equal(w.story.chapter, 24);
  assert.deepEqual(w.story.incident, { x: 176, y: 152 });
  assert.deepEqual(readSave(serializeWorld(w)), w);
});
test("busy contaminated expanded saves compress and restore without precision loss", async () => {
  const w = createWorld();
  for (const c of w.cells) {
    c.oil = 0.841123456789;
    c.toxicity = 0.53423145145;
    c.radiation = 0.1;
    c.snow = 0.7;
    c.fire = 0.13;
    c.fuel = 0.732546789;
  }
  const text = serializeWorld(w), stored = await encodeStoredSave(text);
  assert.ok(stored.length < 18e5);
  assert.equal(await decodeStoredSave(stored), text);
  assert.deepEqual(readSave(text), w);
  assert.equal(await decodeStoredSave(text), text);
});
test("trained soldiers have distinct visible positions; count changes only after training finishes", () => {
  const w = createWorld();
  w.plants = [];
  w.wallet = { gold: 1e4, food: 1e3, timber: 1e3, stone: 1e3 };
  w.buildings = [{ id: 999, kind: "guardhall", x: START.x, y: START.y, progress: 0, buildProgress: 1, stored: 0 }];
  assert.equal(armyUnits(w).length, 0);
  assert.ok(trainGuards(w));
  advanceWorld(w, 0.9);
  assert.equal(armyUnits(w).length, 0);
  advanceWorld(w, 0.1);
  assert.equal(armyUnits(w).length, 2);
  assert.equal(new Set(armyUnits(w).map((u) => `${u.x},${u.y}`)).size, 2);
  for (const u of armyUnits(w)) {
    assert.ok(cellAt(w, u.x, u.y)?.land);
    assert.ok(!cellAt(w, u.x, u.y)?.pond);
  }
  w.frontier.garrison = 0;
  assert.equal(armyUnits(w).length, 0);
});
// The demo gold pack was removed before v16.11 (no purchases, real or pretend).
test.skip("campaign blocks free demo gold; late chapters demand new production instead of old stockpiles", () => {
  const w = createWorld("campaign");
  beginCampaign(w);
  const gold = w.wallet.gold;
  assert.equal(claimDemoPack(w, "treasury"), false);
  assert.equal(w.wallet.gold, gold);
  assert.equal(CHAPTERS.length, 48);
  w.story.chapter = 24;
  w.story.collected.timber = 99999;
  enterChapter(w);
  const target = campaignObjectives(w).find((g) => g.label === "Timber collected this chapter");
  assert.equal(target.value, 0);
  assert.equal(target.done, false);
});
test("food spoilage is charged once per dawn, respects granaries and never touches delivered cargo", () => {
  const w = createWorld("campaign");
  beginCampaign(w);
  w.story.settled = true;
  w.story.population = 0;
  w.wallet.food = 2e3;
  w.story.reserves.food = 700;
  stepFrontier(w);
  assert.equal(foodCapacity(w), 1e3);
  assert.equal(foodSpoilage(w), 200);
  w.time = 1;
  stepFrontier(w);
  assert.equal(w.wallet.food, 1800);
  assert.equal(w.frontier.spoiledFood, 200);
  stepFrontier(w);
  assert.equal(w.wallet.food, 1800);
  assert.equal(w.story.reserves.food, 700);
  w.buildings.push({ id: 999, kind: "granary", x: START.x, y: START.y, buildProgress: 1, stored: 0, progress: 0 });
  assert.equal(foodCapacity(w), 2500);
  assert.equal(foodSpoilage(w), 0);
  w.time = 2;
  stepFrontier(w);
  assert.equal(w.wallet.food, 1800);
});
test("tiny trades never consume goods for zero gold", () => {
  const w = createWorld();
  w.wallet.food = 1;
  const gold = w.wallet.gold;
  assert.equal(tradeGoods(w, "food", 1).ok, false);
  assert.equal(w.wallet.food, 1);
  assert.equal(w.wallet.gold, gold);
});

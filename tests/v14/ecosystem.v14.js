// Ported from the v14 suite lib/ecosystem.test.ts by tools/port-v14-tests.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createWorld as livingWorld, addItem, advanceWorld, cellAt, setWeather, worldStats, ITEMS, collectGoods, tradeGoods, production, claimDemoPack, COLS, ROWS, BUILDING_SCALE, beginCampaign, completeChapter, campaignObjectives, stockHarbor, continueFreebuild, isBuilt, BUILD_DAYS, placementPreview, cancelConstruction } from "./shim.js";
const createWorld = (mode = "sandbox") => {
  const w = livingWorld(mode);
  w.plants = [];
  w.animals = [];
  w.features = [];
  for (const c of w.cells) {
    c.pond = false;
    c.waterType = null;
    c.rock = false;
    c.elevation = 0;
    c.soil = 0.12;
    c.moisture = 0.09;
    c.snow = 0;
  }
  return w;
};
const center = [51.5 + 124, 42.5 + 104];
test("new island has woodland, freshwater, hills and a buildable landing; invalid drops do not charge", () => {
  const w = livingWorld();
  assert.ok(w.plants.length >= 30);
  assert.ok(w.cells.some((c) => c.pond));
  assert.ok(w.features.some((f) => f.kind === "hill"));
  assert.equal(w.buildings.length, 0);
  assert.equal(placementPreview(w, "farm", 68.5 + 124, 59.5 + 104).ok, true);
  assert.equal(addItem(w, "oak", 0, 0).ok, false);
  assert.equal(addItem(w, "oak", NaN, 0).ok, false);
  assert.equal(w.placements, 0);
  // v15–v16 added workshops, bridges and tools: 110 items in v16.11 (v14: 99).
  assert.equal(ITEMS.length, 110);
});
test("soil and rain grow a seed into a tree while dry sand stalls it", () => {
  const wet = createWorld(), dry = createWorld();
  for (const w of [wet, dry]) addItem(w, "oak", ...center);
  addItem(wet, "soil", ...center);
  setWeather(wet, "rain");
  setWeather(dry, "drought");
  advanceWorld(wet, 2);
  advanceWorld(dry, 2);
  assert.ok(wet.plants[0].growth > 0.95);
  assert.ok(dry.plants[0].growth < 0.1);
  assert.ok(wet.plants[0].health > dry.plants[0].health);
});
test("radiation damages mature plants; removing the source allows decay", () => {
  const w = createWorld();
  for (const id of ["soil", "water", "oak"]) addItem(w, id, ...center);
  setWeather(w, "rain");
  advanceWorld(w, 2);
  const healthy = w.plants[0].health;
  addItem(w, "nuclear", ...center);
  advanceWorld(w, 1);
  assert.ok(w.plants[0].health < healthy);
  const contaminated = cellAt(w, ...center).radiation;
  addItem(w, "cleanup", ...center);
  assert.equal(w.objects.length, 0);
  advanceWorld(w, 1);
  assert.ok(cellAt(w, ...center).radiation < contaminated);
});
test("fish require a pond; remain on water while moving", () => {
  const w = createWorld();
  assert.equal(addItem(w, "fish", ...center).ok, false);
  addItem(w, "pond", ...center);
  assert.equal(addItem(w, "fish", ...center).ok, true);
  for (let n = 0; n < 40; n++) {
    advanceWorld(w, 0.05);
    const a = w.animals[0];
    assert.ok(a && cellAt(w, a.x, a.y).pond);
  }
});
test("rain, snow, drought and spills have different physical effects", () => {
  const w = createWorld();
  setWeather(w, "rain");
  advanceWorld(w, 1);
  assert.ok(cellAt(w, ...center).moisture > 0.9);
  setWeather(w, "snow");
  advanceWorld(w, 1);
  assert.ok(cellAt(w, ...center).snow > 0.7);
  setWeather(w, "drought");
  advanceWorld(w, 2);
  assert.equal(cellAt(w, ...center).snow, 0);
  addItem(w, "gasoline", ...center);
  addItem(w, "fire", ...center);
  assert.ok(cellAt(w, ...center).fire > 0.5);
  addItem(w, "water", ...center);
  assert.equal(cellAt(w, ...center).fire, 0);
  addItem(w, "oil", ...center);
  assert.ok(worldStats(w).pollution > 0);
  addItem(w, "cleanup", ...center);
  assert.equal(cellAt(w, ...center).oil, 0);
});
test("one day skip agrees with many small steps and keeps conditions bounded", () => {
  const a = createWorld(), b = createWorld();
  for (const w of [a, b]) {
    for (const id of ["soil", "compost", "water", "oak"]) addItem(w, id, ...center);
    setWeather(w, "rain");
  }
  advanceWorld(a, 1);
  for (let n = 0; n < 40; n++) advanceWorld(b, 0.025);
  assert.ok(Math.abs(a.plants[0].growth - b.plants[0].growth) < 1e-8);
  for (const c of a.cells) for (const key of ["moisture", "soil", "toxicity", "radiation", "snow"]) assert.ok(c[key] >= 0 && c[key] <= 1);
});
test("placements spend their exact price; failed drops and insufficient funds never charge", () => {
  const w = createWorld();
  const before = w.wallet.gold;
  assert.equal(addItem(w, "farm", ...center).ok, true);
  assert.equal(w.wallet.gold, before - 90);
  assert.equal(addItem(w, "farm", ...center).ok, false);
  assert.equal(w.wallet.gold, before - 90);
  w.wallet.gold = 4;
  assert.equal(addItem(w, "water", ...center).ok, false);
  assert.equal(w.wallet.gold, 4);
  // Removal tools (v15 bridges) are free.
  assert.ok(ITEMS.every((i) => i.cost > 0 || i.id.startsWith("remove")));
});
test("farming produces goods, collection cannot duplicate them, trading earns exact gold", () => {
  const w = createWorld();
  addItem(w, "farm", ...center);
  setWeather(w, "rain");
  advanceWorld(w, 2);
  assert.ok(w.buildings[0].stored > 20);
  const first = collectGoods(w);
  assert.ok(first.food > 20);
  assert.equal(collectGoods(w).food, 0);
  const balance = w.wallet.gold;
  assert.equal(tradeGoods(w, "food", 10).ok, true);
  assert.equal(w.wallet.gold, balance + 5);
  assert.equal(tradeGoods(w, "food", -10).ok, false);
  assert.equal(tradeGoods(w, "food", 1e5).ok, false);
  assert.ok(w.wallet.food >= 0);
});
test("river irrigates, ocean removes land, land reclaims it, terrain respects buildings", () => {
  const w = createWorld();
  addItem(w, "river", ...center);
  assert.equal(cellAt(w, ...center).waterType, "river");
  advanceWorld(w, 0.1);
  assert.ok(cellAt(w, 53 + 124, 42 + 104).moisture > 0.5);
  addItem(w, "ocean", ...center);
  assert.equal(cellAt(w, ...center).land, false);
  addItem(w, "land", ...center);
  assert.equal(cellAt(w, ...center).land, true);
  addItem(w, "farm", ...center);
  const gold = w.wallet.gold;
  assert.equal(addItem(w, "ocean", ...center).ok, false);
  assert.equal(w.wallet.gold, gold);
});
test("quarry needs rock; pollution stops production without converting stored goods into gold", () => {
  const w = createWorld();
  addItem(w, "quarry", ...center);
  assert.equal(production(w, w.buildings[0]).rate, 0);
  addItem(w, "mountain", 55.5 + 124, 42.5 + 104);
  advanceWorld(w, 1.2);
  assert.ok(production(w, w.buildings[0]).rate > 0);
  advanceWorld(w, 1);
  const stone = w.buildings[0].stored;
  cellAt(w, ...center).toxicity = 1;
  assert.equal(production(w, w.buildings[0]).rate, 0);
  const result = collectGoods(w);
  assert.equal(result.stone, Math.floor(stone));
  assert.equal(result.gold, 0);
});
// The demo gold pack was removed before v16.11 (no purchases, real or pretend).
test.skip("demo packs add the selected amount and are tracked separately from earned gold", () => {
  const w = createWorld();
  const before = w.wallet.gold;
  assert.equal(claimDemoPack(w, "pouch"), true);
  assert.equal(w.wallet.gold, before + 500);
  assert.equal(w.demoGold, 500);
  assert.equal(w.earned, 0);
  assert.equal(claimDemoPack(w, "unknown"), false);
});
test("larger world and distinct building footprints allow compact housing without civic overlaps", () => {
  const w = createWorld();
  assert.equal(w.cells.length, 384 * 320);
  assert.equal(COLS * ROWS, 384 * 320);
  assert.ok(BUILDING_SCALE.cottage.size < BUILDING_SCALE.market.size * 0.5);
  assert.equal(addItem(w, "cottage", 34.5 + 124, 31.5 + 104).ok, true);
  assert.equal(addItem(w, "cottage", 36.5 + 124, 31.5 + 104).ok, true);
  const gold = w.wallet.gold;
  assert.equal(addItem(w, "market", 34.5 + 124, 33.5 + 104).ok, false);
  assert.equal(w.wallet.gold, gold);
});
test("a complete expedition can be earned through play; chapters and reserves cannot be claimed twice", () => {
  const w = livingWorld("campaign");
  advanceWorld(w, 2);
  assert.equal(w.time, 0);
  beginCampaign(w);
  const put = (id, x, y) => {
    const r = addItem(w, id, x + 34 + 124, y + 28 + 104);
    assert.equal(r.ok, true, `${id}: ${r.message}`);
  };
  put("farm", 34.5, 31.5);
  put("pond", 38, 31.5);
  advanceWorld(w, 2);
  collectGoods(w);
  assert.equal(completeChapter(w), true);
  assert.equal(completeChapter(w), false);
  const forest = [[26.5, 31.5], [26.5, 34.5], [29.5, 35.5]];
  for (const [x, y] of forest) {
    put("soil", x, y);
    put("water", x, y);
    put("oak", x, y);
  }
  put("sawmill", 30.5, 32.5);
  advanceWorld(w, 3);
  advanceWorld(w, 2);
  collectGoods(w);
  assert.equal(campaignObjectives(w).every((o) => o.done), true, JSON.stringify(campaignObjectives(w)));
  assert.equal(completeChapter(w), true);
  put("quarry", 38.5, 38.5);
  put("mountain", 42.5, 38.5);
  put("cottage", 33.5, 40.5);
  put("cottage", 35.5, 40.5);
  put("cottage", 34.5, 42.5);
  put("market", 31.5, 43.5);
  advanceWorld(w, 2);
  collectGoods(w);
  assert.equal(completeChapter(w), true);
  const before = { ...w.wallet };
  assert.ok(stockHarbor(w) > 0);
  for (const key of ["food", "timber", "stone"]) assert.equal(before[key] - w.wallet[key], w.story.reserves[key]);
  assert.equal(stockHarbor(w), 0);
  for (let i = 0; i < 22; i++) {
    const day = Math.floor(w.time + 1e-8) + 1;
    if (day >= 9 && day <= 16) for (const [x, y] of forest) put("water", x, y);
    advanceWorld(w, 1);
    collectGoods(w);
    stockHarbor(w);
  }
  assert.equal(w.demoGold, 0);
  assert.equal(w.story.settled, true, JSON.stringify(campaignObjectives(w)));
  assert.equal(w.story.chapter, 4);
  assert.equal(worldStats(w).population, 12);
  assert.equal(worldStats(w).charter, 8);
  const earned = w.earned;
  assert.equal(completeChapter(w), false);
  assert.equal(w.earned, earned);
});
test("scenario weather, delayed passage, and free build preserve a recoverable world", () => {
  const w = createWorld("campaign");
  delete w.sight; // v16.17: new campaigns start under fog; these checks are about the campaign, not the fog
  beginCampaign(w);
  addItem(w, "farm", 34.5 + 124, 31.5 + 104);
  w.time = 14.99;
  advanceWorld(w, 0.025);
  assert.equal(w.weather, "drought");
  setWeather(w, "rain");
  assert.equal(w.weather, "drought");
  w.time = 28.99;
  advanceWorld(w, 0.025);
  assert.equal(w.weather, "sun");
  assert.equal(w.story.missed, 1);
  assert.equal(w.story.convoyDay, 33);
  assert.equal(w.buildings.length, 1);
  advanceWorld(w, 1);
  assert.equal(w.story.missed, 1);
  w.time = 31.99;
  advanceWorld(w, 0.025);
  assert.equal(w.story.missed, 2);
  assert.equal(w.story.convoyDay, 36);
  continueFreebuild(w);
  setWeather(w, "snow");
  assert.equal(w.weather, "snow");
  assert.equal(w.buildings.length, 1);
});
test("construction withholds production, beds and objectives until completion; cancellation refunds once", () => {
  const w = createWorld("campaign");
  delete w.sight; // v16.17: new campaigns start under fog; these checks are about the campaign, not the fog
  beginCampaign(w);
  addItem(w, "farm", 34.5 + 124, 31.5 + 104);
  assert.equal(campaignObjectives(w)[0].done, false);
  assert.equal(production(w, w.buildings[0]).rate, 0);
  advanceWorld(w, BUILD_DAYS.farm - 0.1);
  assert.equal(w.buildings[0].stored, 0);
  assert.equal(isBuilt(w.buildings[0]), false);
  advanceWorld(w, 0.1);
  assert.equal(isBuilt(w.buildings[0]), true);
  assert.equal(campaignObjectives(w)[0].done, true);
  assert.ok(w.buildings[0].stored < 0.01);
  addItem(w, "cottage", 40.5 + 124, 32.5 + 104);
  assert.equal(worldStats(w).capacity, 0);
  advanceWorld(w, 0.5);
  assert.equal(worldStats(w).capacity, 4);
  addItem(w, "market", 46.5 + 124, 32.5 + 104);
  const b = w.buildings.at(-1);
  const gold = w.wallet.gold;
  assert.equal(cancelConstruction(w, b.id), 75);
  assert.equal(w.wallet.gold, gold + 75);
  assert.equal(cancelConstruction(w, b.id), 0);
  assert.equal(cancelConstruction(w, w.buildings[0].id), 0);
});
test("road tiers charge only upgrades, connect economically, and removal preserves buildings", () => {
  const w = createWorld();
  addItem(w, "cottage", 34.5 + 124, 31.5 + 104);
  advanceWorld(w, 0.5);
  const base = production(w, w.buildings[0]).rate, gold = w.wallet.gold;
  assert.equal(addItem(w, "path", 36.5 + 124, 31.5 + 104).ok, true);
  assert.equal(w.wallet.gold, gold - 1);
  assert.ok(Math.abs(production(w, w.buildings[0]).rate - base * 1.05) < 1e-8);
  assert.equal(placementPreview(w, "road", 36.5 + 124, 31.5 + 104).cost, 2);
  assert.equal(addItem(w, "road", 36.5 + 124, 31.5 + 104).ok, true);
  assert.equal(w.wallet.gold, gold - 3);
  assert.equal(addItem(w, "paved", 36.5 + 124, 31.5 + 104).ok, true);
  assert.equal(w.wallet.gold, gold - 6);
  assert.ok(Math.abs(production(w, w.buildings[0]).rate - base * 1.25) < 1e-8);
  assert.equal(addItem(w, "path", 36.5 + 124, 31.5 + 104).ok, false);
  assert.equal(w.wallet.gold, gold - 6);
  assert.equal(addItem(w, "road", 34.5 + 124, 31.5 + 104).ok, false);
  assert.equal(w.wallet.gold, gold - 6);
  assert.equal(addItem(w, "remove_road", 36.5 + 124, 31.5 + 104).ok, true);
  assert.equal(w.buildings.length, 1);
  assert.equal(production(w, w.buildings[0]).rate, base);
});
test("automatic collection moves earned goods into storage without duplicating manual harvests", () => {
  const a = createWorld(), b = createWorld();
  for (const w of [a, b]) {
    addItem(w, "farm", 34.5 + 124, 31.5 + 104);
    setWeather(w, "rain");
  }
  a.autoCollect = true;
  advanceWorld(a, 3);
  advanceWorld(b, 3);
  collectGoods(b);
  assert.equal(a.wallet.food, b.wallet.food);
  assert.equal(a.story.collected.food, b.story.collected.food);
  assert.equal(collectGoods(a).food, 0);
});
test("wonders require all resources atomically, obey unlocks, and refund materials once", () => {
  const w = createWorld("campaign");
  beginCampaign(w);
  w.wallet = { gold: 2e3, food: 500, timber: 500, stone: 500 };
  const original = { ...w.wallet };
  assert.equal(addItem(w, "granary", ...center).ok, false);
  assert.deepEqual(w.wallet, original);
  w.story.chapter = 4;
  w.wallet.stone = 29;
  const short = { ...w.wallet };
  assert.equal(addItem(w, "granary", ...center).ok, false);
  assert.deepEqual(w.wallet, short);
  w.wallet.stone = 500;
  assert.equal(addItem(w, "granary", ...center).ok, true);
  assert.deepEqual(w.wallet, { gold: 1720, food: 450, timber: 460, stone: 470 });
  const after = { ...w.wallet };
  assert.equal(addItem(w, "granary", ...center).ok, false);
  assert.deepEqual(w.wallet, after);
  const id = w.buildings[0].id;
  assert.equal(cancelConstruction(w, id), 140);
  assert.deepEqual(w.wallet, { gold: 1860, food: 475, timber: 480, stone: 485 });
  assert.equal(cancelConstruction(w, id), 0);
});
test("landmark benefits activate on completion without stacking duplicates", () => {
  const w = createWorld();
  w.wallet = { gold: 1e4, food: 2e3, timber: 2e3, stone: 2e3 };
  setWeather(w, "rain");
  addItem(w, "farm", ...center);
  advanceWorld(w, 1);
  const farm = w.buildings[0], before = production(w, farm).rate;
  addItem(w, "windmill", 55.5 + 124, 42.5 + 104);
  assert.equal(production(w, farm).rate, before);
  advanceWorld(w, 2.5);
  assert.ok(production(w, farm).rate > before * 1.24);
  addItem(w, "granary", 59.5 + 124, 42.5 + 104);
  advanceWorld(w, 2);
  assert.equal(production(w, farm).capacity, 600);
  addItem(w, "pond", 63.5 + 124, 46.5 + 104);
  assert.equal(addItem(w, "watermill", 63.5 + 124, 42.5 + 104).ok, true);
  advanceWorld(w, 2.5);
  assert.equal(production(w, w.buildings.find((b) => b.kind === "watermill")).resource, "timber");
  assert.equal(addItem(w, "harbor", 67.5 + 124, 46.5 + 104).ok, true);
  advanceWorld(w, 3);
  w.wallet.food = 100;
  const gold = w.wallet.gold;
  tradeGoods(w, "food", 10);
  assert.equal(w.wallet.gold, gold + 6);
});

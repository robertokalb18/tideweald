// Ported from the v14 suite lib/frontier.test.ts by tools/port-v14-tests.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createWorld, beginCampaign, advanceWorld, addItem, cellAt } from "./shim.js";
import { seasonAt, stepFrontier, dailyNeeds, defenseStrength, trainGuards, requestRelief, projectedLoss } from "./shim.js";
import { parseSavedWorld, serializeWorld, readSave } from "./shim.js";
const settled = () => {
  const w = createWorld("campaign");
  beginCampaign(w);
  w.time = 30;
  w.story.chapter = 4;
  w.story.settled = true;
  w.story.population = 12;
  w.wallet = { gold: 1e3, food: 300, timber: 200, stone: 100 };
  stepFrontier(w);
  return w;
};
const building = (w, kind) => w.buildings.push({ id: w.nextId++, kind, x: 34.5 + 124, y: 31.5 + 104, progress: 0, buildProgress: 1, stored: 0 });
test("four seasons repeat at precise boundaries; winter snow persists and thaws in spring", () => {
  assert.deepEqual([0, 12, 24, 36, 48].map((t) => seasonAt(t).name), ["Spring", "Summer", "Autumn", "Winter", "Spring"]);
  assert.equal(seasonAt(47).remaining, 1);
  assert.equal(seasonAt(48).year, 2);
  const w = createWorld("campaign");
  beginCampaign(w);
  w.time = 36;
  advanceWorld(w, 1);
  const c = cellAt(w, 34.5 + 124, 31.5 + 104);
  assert.ok(c.snow > 0.7);
  w.time = 39;
  advanceWorld(w, 1);
  assert.ok(c.snow > 0.65);
  w.time = 48;
  advanceWorld(w, 2);
  assert.equal(c.snow, 0);
});
test("new or migrated settlements get warning time without retrospective upkeep or loss", () => {
  const w = settled();
  const before = { ...w.wallet };
  assert.equal(w.frontier.nextEventDay, 37);
  stepFrontier(w);
  assert.deepEqual(w.wallet, before);
  assert.equal(w.frontier.pending, void 0);
  w.time = 33;
  stepFrontier(w);
  assert.equal(w.frontier.pending?.dueDay, 37);
  assert.equal(w.frontier.losses.gold, 0);
  const old = JSON.parse(JSON.stringify(w));
  delete old.frontier;
  old.time = 700;
  const migrated = parseSavedWorld(old);
  const resources = { ...migrated.wallet };
  stepFrontier(migrated);
  assert.deepEqual(migrated.wallet, resources);
  assert.equal(migrated.frontier.nextEventDay, 707);
  assert.equal(migrated.story.chapter, 4);
});
test("daily food, winter fuel and guard pay debit once; shortage and replenishment alter morale", () => {
  const w = settled();
  w.time = 36;
  w.frontier.lastDay = 36;
  w.frontier.nextEventDay = 100;
  w.frontier.garrison = 2;
  const cost = dailyNeeds(w), before = { ...w.wallet };
  stepFrontier(w);
  assert.deepEqual(cost, { gold: 2, food: 7, timber: 2, stone: 0 });
  for (const k of ["gold", "food", "timber", "stone"]) assert.equal(w.wallet[k], before[k] - cost[k]);
  stepFrontier(w);
  assert.equal(w.wallet.food, before.food - cost.food);
  w.wallet = { gold: 0, food: 0, timber: 0, stone: 0 };
  w.time++;
  stepFrontier(w);
  assert.equal(w.frontier.morale, 92);
  assert.ok(Object.values(w.wallet).every((n) => n >= 0));
  w.wallet = { gold: 100, food: 100, timber: 100, stone: 0 };
  w.time++;
  stepFrontier(w);
  assert.equal(w.frontier.morale, 96);
});
// Adapted in v16.13 (Milestone 2): raids are fought on the map over several steps instead of being settled in one
// stepFrontier call, and the forecast replaces the defense ratio. The v14 promises still hold and are checked:
// losses are bounded by the forecast, all four resources can be taken, delivered cargo is never touched,
// the raid is settled once, and the frontier survives a save.
test("raid losses are bounded, reduce all four resources and never touch delivered cargo", () => {
  const w = settled();
  w.story.reserves = { gold: 0, food: 60, timber: 20, stone: 15 };
  const reserves = { ...w.story.reserves };
  const t = { id: 1, kind: "raid", strength: 12, dueDay: 31, title: "Red Sail raiders" };
  w.frontier.pending = t;
  const expected = projectedLoss(w, t), before = { ...w.wallet };
  for (let i = 0; i < 200 && w.frontier.pending; i++) stepFrontier(w);
  for (const k of ["gold", "food", "timber", "stone"]) {
    assert.ok(expected[k] > 0);
    assert.ok(Math.abs(before[k] - w.wallet[k] - expected[k]) <= 1, `${k}: lost ${before[k] - w.wallet[k]}, forecast ${expected[k]}`);
  }
  assert.deepEqual(w.story.reserves, reserves);
  assert.equal(w.frontier.resolved, 1);
  stepFrontier(w);
  assert.equal(w.frontier.resolved, 1);
  assert.deepEqual(readSave(serializeWorld(w)).frontier, JSON.parse(JSON.stringify(w.frontier)));
});
test("completed defenses repel raids; construction gives no premature protection", () => {
  const w = settled();
  const near = (kind, dx, dy) => w.buildings.push({ id: w.nextId++, kind, x: 192.5 + dx, y: 163.5 + dy, progress: 0, buildProgress: 1, stored: 0 });
  near("watchtower", 2, 2);
  near("watchtower", -2, 2);
  w.buildings[1].buildProgress = 0.9;
  assert.equal(defenseStrength(w), 6);
  w.buildings[1].buildProgress = 1;
  near("palisade", 1, -2);
  w.placements++;
  w.frontier.pending = { id: 1, kind: "raid", strength: 12, dueDay: 31, title: "Red Sail raiders" };
  for (let i = 0; i < 200 && w.frontier.pending; i++) stepFrontier(w);
  assert.equal(w.frontier.raidsRepelled, 1);
});
test("guard training charges once, needs capacity, completes after time, refunds if hall is removed", () => {
  const w = settled();
  assert.equal(trainGuards(w), false);
  building(w, "guardhall");
  const before = { ...w.wallet };
  assert.equal(trainGuards(w), true);
  assert.equal(trainGuards(w), false);
  assert.equal(w.wallet.gold, before.gold - 80);
  w.time += 0.99;
  stepFrontier(w);
  assert.equal(w.frontier.garrison, 0);
  w.time += 0.01;
  stepFrontier(w);
  assert.equal(w.frontier.garrison, 2);
  assert.equal(defenseStrength(w), 6);
  assert.equal(trainGuards(w), true);
  const gold = w.wallet.gold;
  w.buildings = [];
  w.time++;
  stepFrontier(w);
  assert.equal(w.frontier.training, 0);
  assert.equal(w.frontier.garrison, 2);
  assert.equal(w.wallet.gold, gold + 80 - 2);
});
test("natural-event preparations reduce loss and relief can recover an empty economy", () => {
  const w = settled();
  const flood = { id: 1, kind: "flood", strength: 10, dueDay: 40, title: "Flood" };
  const before = projectedLoss(w, flood);
  building(w, "granary");
  const after = projectedLoss(w, flood);
  assert.ok(after.food < before.food);
  w.wallet = { gold: 0, food: 0, timber: 0, stone: 0 };
  assert.equal(requestRelief(w), true);
  assert.deepEqual(w.wallet, { gold: 200, food: 60, timber: 25, stone: 10 });
  w.wallet = { gold: 0, food: 0, timber: 0, stone: 0 };
  assert.equal(requestRelief(w), false);
  w.time += 12;
  assert.equal(requestRelief(w), true);
});
test("fast-forward and normal stepping produce the same events, debits and training", () => {
  const a = settled();
  building(a, "guardhall");
  trainGuards(a);
  const b = readSave(serializeWorld(a));
  for (let i = 0; i < 18; i++) advanceWorld(a, 1);
  for (let i = 0; i < 720; i++) advanceWorld(b, 0.025);
  assert.equal(a.frontier.resolved, b.frontier.resolved);
  assert.deepEqual(a.frontier.losses, b.frontier.losses);
  assert.deepEqual(a.frontier.upkeep, b.frontier.upkeep);
  assert.equal(a.frontier.garrison, b.frontier.garrison);
  for (const k of ["gold", "food", "timber", "stone"]) assert.ok(Math.abs(a.wallet[k] - b.wallet[k]) < 1e-6);
});
test("old saves preserve all terrain and buildings; invalid defense state is rejected", () => {
  const w = createWorld();
  addItem(w, "farm", 34.5 + 124, 31.5 + 104);
  const raw = JSON.parse(JSON.stringify(w));
  delete raw.frontier;
  const saved = parseSavedWorld(raw);
  assert.deepEqual(saved.cells, w.cells);
  assert.deepEqual(saved.buildings, w.buildings);
  assert.equal(saved.frontier.morale, 100);
  raw.frontier = { garrison: 999 };
  assert.throws(() => parseSavedWorld(raw));
});

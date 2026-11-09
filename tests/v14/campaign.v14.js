// Ported from the v14 suite lib/campaign.test.ts by tools/port-v14-tests.mjs.
import { test } from "node:test";
import assert from "node:assert/strict";
import { createWorld, beginCampaign, completeChapter, campaignObjectives, currentChapter, enterChapter, stockHarbor, CHAPTERS, LANDMARKS, addItem, advanceWorld, worldStats } from "./shim.js";
import * as council from "../../src/progression/council.js";
import { decide, decisionForChapter } from '../../src/progression/council.js';
import { serializeWorld, readSave } from "./shim.js";
test("all 48 authored chapters have achievable goals; deliveries and commission timers reset", () => {
  const w = createWorld("campaign");
  beginCampaign(w);
  w.story.chapter = 4;
  w.story.settled = true;
  w.story.population = 12;
  for (const c of w.cells) {
    c.land = true;
    c.rock = false;
    c.elevation = 0;
    c.pond = false;
    c.waterType = null;
    c.toxicity = 0;
    c.radiation = 0;
  }
  for (let i = 0; i < 40; i++) w.buildings.push({ id: w.nextId++, kind: "cottage", x: 18 + i % 10 * 9 + 124, y: 31 + Math.floor(i / 10) * 10 + 104, progress: 0, buildProgress: 1, stored: 0 });
  for (const kind of [...Array(20).fill("watchtower"), "guardhall", "palisade", "palisade", "farm", "farm", "farm", "sawmill", "sawmill", "quarry", "quarry", "fishery", "fishery", "market", "market", "market", ...LANDMARKS.flatMap((l) => Array(4).fill(l.id)), ...Array(4).fill("farm"), "sawmill", "quarry", "fishery", "market", "market", "guardhall", "guardhall"]) w.buildings.push({ id: w.nextId++, kind, x: 35 + 124, y: 30 + 104, progress: 0, buildProgress: 1, stored: 0 });
  const plants = ["oak", "pine", "birch", "maple", "willow", "beech", "spruce", "yew", "alder", "hornbeam", "rowan", "hawthorn", "pear", "plum", "cherry_tree", ...Array(60).fill("apple"), ...Array(8).fill("flowers")];
  for (const kind of plants) w.plants.push({ id: w.nextId++, kind, x: 30 + 124, y: 24 + 104, growth: 1, health: 1, age: 5, variant: 0.3 });
  for (const kind of ["rabbit", "deer", "sheep", "duck", "fish", "bee", "butterfly", "bee", "butterfly"]) w.animals.push({ id: w.nextId++, kind, x: 30 + 124, y: 24 + 104, tx: 30 + 124, ty: 24 + 104, health: 1, age: 3, direction: 1, cooldown: 0.4 });
  for (const c of w.cells.filter((c2) => c2.land).slice(0, 220)) c.road = "paved";
  for (const c of w.cells.filter((c2) => c2.land).slice(300, 460)) {
    c.pond = true;
    c.waterType = "pond";
  }
  // Since v15, chapter 38 asks for homes with a well, market and hof close by; the v14 world had none.
  for (const h of w.buildings.filter((b) => b.kind === "cottage").slice(0, 24))
    for (const [kind, dx] of [["well", 2], ["market", 3], ["chapel", 4]]) w.buildings.push({ id: w.nextId++, kind, x: h.x + dx, y: h.y, progress: 0, buildProgress: 1, stored: 0 });
  // Since v15, chapter 39 asks for five kinds of workshop at work.
  for (const [i, kind] of ["bakery", "carpenter", "stonemason", "smithy", "smokehouse", "apiary", "herbalist", "hunterlodge", "garden", "stables", "tradingpost", "herbalist", "bathhouse"].entries())
    w.buildings.push({ id: w.nextId++, kind, x: 60 + i * 4 + 124, y: 20 + 104, progress: 0, buildProgress: 1, stored: 0 });
  w.story.tradeGold = 1e4;
  w.frontier.garrison = 18;
  for (let chapter = 4; chapter < 52; chapter++) {
    assert.equal(w.story.chapter, chapter);
    enterChapter(w);
    assert.equal(completeChapter(w), false);
    w.wallet = { gold: 1e5, food: 1e5, timber: 1e5, stone: 1e5 };
    const before = { ...w.wallet };
    stockHarbor(w);
    assert.equal(stockHarbor(w), 0);
    for (const r of ["gold", "food", "timber", "stone"]) assert.equal(before[r] - w.wallet[r], w.story.reserves[r]);
    if (w.story.incident) {
      const p = w.story.incident;
      assert.ok(campaignObjectives(w).some((o) => o.label === "Restored spill tiles" && !o.done));
      for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) addItem(w, "cleanup", p.x + dx, p.y + dy);
    }
    // v16.16 removed the day floor ("days"); chapters that ask for calm days still need time to pass.
    const stay = Math.max(...["days", "calmDays"].map((m) => currentChapter(w).goals?.find((g) => g.metric === m)?.target ?? 0));
    w.time += stay;
    w.story.tradeGold += 6e3;
    w.story.collected.food += 3e3;
    w.story.collected.timber += 1500;
    w.story.collected.stone += 1500;
    w.frontier.resolved += 2;
    // Since v15, "steady harvest" goals read the dawn tallies of the last four days.
    w.story.dawn = [0, 1, 2, 3].map((d) => ({ ...w.story.collected, food: w.story.collected.food - (3 - d) * 1e3, timber: w.story.collected.timber - (3 - d) * 1e3, stone: w.story.collected.stone - (3 - d) * 1e3 }));
    // Since v15 some chapters also ask for a council decision; the v14 suite predates the council.
    const pending = council.decisionForChapter(w.story.chapter);
    pending && council.decide(w, pending.id, "a");
    assert.ok(campaignObjectives(w).every((o) => o.done), `Chapter ${chapter + 1}: ${JSON.stringify(campaignObjectives(w))}`);
    const gold = w.wallet.gold, reward = currentChapter(w).reward;
    assert.equal(completeChapter(w), true);
    assert.equal(w.wallet.gold, gold + reward);
    assert.equal(completeChapter(w), false);
    assert.equal(w.story.reserves.food, 0);
  }
  assert.equal(CHAPTERS.length, 48);
  assert.equal(worldStats(w).population, 160);
  assert.equal(w.story.chapter, 52);
});
test("save roundtrip preserves a running island and rejects corrupt or oversized entity arrays", () => {
  const w = createWorld("campaign");
  beginCampaign(w);
  addItem(w, "farm", 34.5 + 124, 31.5 + 104);
  addItem(w, "pond", 38 + 124, 31.5 + 104);
  advanceWorld(w, 2);
  const encoded = serializeWorld(w), copy = readSave(encoded);
  assert.deepEqual(copy, w);
  assert.ok(encoded.length < 16e6);
  const bad = JSON.parse(encoded);
  bad.world.cells[0][0] = -1;
  assert.throws(() => readSave(JSON.stringify(bad)));
  bad.world = w;
  bad.world.wallet.gold = -1;
  assert.throws(() => readSave(JSON.stringify(bad)));
});

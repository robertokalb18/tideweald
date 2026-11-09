// Ported from the v14 suite lib/animal-motion.test.ts by tools/port-v14-tests.mjs.
import test from "node:test";
import assert from "node:assert/strict";
import { animalPose } from "./shim.js";
test("animal interpolation bridges ticks without mutating simulation or overshooting and pauses immediately", () => {
  const a = { id: 1, kind: "deer", x: 10, y: 10, tx: 11, ty: 10, age: 1, health: 1, direction: 1, cooldown: 0.2 };
  animalPose(a, 100);
  a.x = 11;
  const truth = JSON.stringify(a);
  assert.equal(animalPose(a, 350).x, 10);
  assert.equal(animalPose(a, 475).x, 10.5);
  assert.equal(animalPose(a, 600).x, 11);
  assert.equal(animalPose(a, 1e3).x, 11);
  assert.equal(JSON.stringify(a), truth);
  a.x = 12;
  animalPose(a, 1100);
  assert.equal(animalPose(a, 1120, true).x, 12);
  a.x = 25;
  assert.equal(animalPose(a, 1130).x, 25);
  const other = { ...a, x: 4 };
  assert.equal(animalPose(other, 1150).x, 4);
});

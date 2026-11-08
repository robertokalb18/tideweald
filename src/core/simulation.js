// Simulation clock. The world always advances in whole fixed steps, so results do not
// depend on frame timing or on the chosen game speed (1x, 3x, 10x, skip ahead).
import { step } from '../world/ecosystem.js';
import { diagnostics } from './diagnostics.js';

export const STEP_DAYS = 0.025;
const STEP_MICRO = 25000; // STEP_DAYS in millionths of a day
const MAX_DAYS_PER_CALL = 3;
const carry = new WeakMap(); // world -> pending millionths of a day

function advanceWorld(world, days) {
  if (!world.story.started) return;
  world.revision++;
  let pending = (carry.get(world) ?? 0) + Math.round(Math.max(0, Math.min(days, MAX_DAYS_PER_CALL)) * 1e6);
  const t0 = performance.now();
  let steps = 0;
  for (; pending >= STEP_MICRO; pending -= STEP_MICRO, steps++) step(world, STEP_DAYS);
  carry.set(world, pending);
  steps && diagnostics.sim(performance.now() - t0, steps);
}

export { advanceWorld };

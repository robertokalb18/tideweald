// Simulation clock. The world always advances in whole fixed steps, so results do not
// depend on frame timing or on the chosen game speed (1x, 3x, 10x, skip ahead).
import { step } from '../world/ecosystem.js';
import { diagnostics } from './diagnostics.js';
import { STEP_DAYS, STEP_MICRO, carry } from './step-clock.js';

export { STEP_DAYS };
const MAX_DAYS_PER_CALL = 3;

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

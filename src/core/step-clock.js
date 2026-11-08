// The fixed-step remainder for each world, shared by the simulation clock and the renderer.
// The renderer uses it to draw moving units part of the way between two steps.
export const STEP_DAYS = 0.025;
export const STEP_MICRO = 25000; // STEP_DAYS in millionths of a day
export const carry = new WeakMap(); // world -> pending millionths of a day

/** How far the clock is into the next fixed step, from 0 to just under 1. */
export const stepProgress = (world) => (carry.get(world) ?? 0) / STEP_MICRO;

// v17, the signature system: the river's year.
//
// The settlement stands on a river (the sea is 120 tiles away). The river has a yearly rhythm the player can
// read and plan around:
//   thaw flood  (spring days 5–7)   the low bank is under water: buildings there stop and lose what they hold;
//                                   fishing is at its best; longships row far upstream, so raids land close.
//   low water   (summer day 10 – autumn day 1)   fishing slows; longships ground downstream, so raids land far.
//   ice         (winter days 3–12)  no longship can row: no raids; fishing is half (through the ice).
// The bank that floods is the bank the river waters: farms there bear 30% more (silt), at the price of the flood.
// A "River flood" threat brings two more days of high water out of season (frontier.surge).
//
// Nothing here is saved except that surge: the level is a function of island time, so a reload, a skip ahead
// and 1× all agree. Imports only leaf modules (grid, seasons).
import { GRID_H, GRID_W } from './grid.js';
import { seasonAt } from './seasons.js';

export const YEAR_DAYS = 48;
/** Day-of-year windows, zero-based, [from, to). Spring 0–11, summer 12–23, autumn 24–35, winter 36–47. */
export const RIVER_YEAR = [
  { level: 'high', from: 4, to: 7 },
  { level: 'low', from: 21, to: 25 },
  { level: 'ice', from: 38, to: 48 },
];
export const RIVER = {
  plain: 2.3, // tiles from the river that flood (and that its silt enriches)
  reach: 4.2, // tiles within which a fishing dock or pier fishes the river
  silt: 1.3, // farms on the floodplain
  fishing: { high: 1.25, normal: 1, low: 0.75, ice: 0.5 },
  landing: { high: { min: 5, ideal: 9 }, normal: { min: 9, ideal: 16 }, low: { min: 18, ideal: 26 } },
  warnDays: 2,
  surgeDays: 2,
};
/** Buildings made for the water: they do not flood. */
export const WATERSIDE = new Set(['fishery', 'pier', 'harbor', 'shipyard', 'watermill']);
export const LEVEL_NAMES = { high: 'High water', normal: 'Steady', low: 'Low water', ice: 'Frozen' };

/** Whether the river's year applies: always in the campaign; in free build with threats switched on. */
export const riverActive = (w) =>
  !!w.story?.started && (w.story.mode === 'campaign' || !!w.story.rules?.threats);

const surgeOn = (w, dayIndex) => {
  const s = w.frontier?.surge;
  return !!s && dayIndex >= s.from - 1 && dayIndex < s.until - 1; // surge days are 1-based day numbers
};
/** The level on a whole day (dayIndex = floor(island time)). */
export function levelOnDay(w, dayIndex) {
  if (!riverActive(w)) return 'normal';
  if (surgeOn(w, dayIndex)) return 'high';
  const d = ((dayIndex % YEAR_DAYS) + YEAR_DAYS) % YEAR_DAYS;
  for (const p of RIVER_YEAR) if (d >= p.from && d < p.to) return p.level;
  return 'normal';
}
export const riverLevel = (w, time = w.time) => levelOnDay(w, Math.floor(time + 1e-8));

/**
 * What the river is doing and what it will do next:
 * { level, until (day number the level ends, exclusive), next: { level, day, inDays } }.
 */
export function riverForecast(w) {
  const today = Math.floor(w.time + 1e-8),
    level = levelOnDay(w, today);
  let d = today + 1;
  while (d < today + YEAR_DAYS + 2 && levelOnDay(w, d) === level) d++;
  const next = { level: levelOnDay(w, d), day: d + 1, inDays: d - today };
  // The next level that is not "steady", for the HUD ("flood in 3 days").
  let e = d;
  while (e < today + YEAR_DAYS + 2 && levelOnDay(w, e) === 'normal') e++;
  const event = { level: levelOnDay(w, e), day: e + 1, inDays: e - today };
  return { level, until: d + 1, next, event };
}

/** How strongly to draw each state, 0–1, easing in and out over a quarter of a day. */
export function riverAmounts(w) {
  const out = { high: 0, low: 0, ice: 0 };
  if (!riverActive(w)) return out;
  const t = w.time,
    today = Math.floor(t + 1e-8),
    level = levelOnDay(w, today);
  if (level === 'normal') return out;
  let a = today,
    b = today + 1;
  while (a > today - YEAR_DAYS && levelOnDay(w, a - 1) === level) a--;
  while (b < today + YEAR_DAYS && levelOnDay(w, b) === level) b++;
  out[level] = Math.max(0, Math.min(1, (t - a) / 0.25, (b - t) / 0.25));
  return out;
}

const masks = new WeakMap();
/**
 * One byte per cell, worked out once per terrain change:
 *   bit 1  river water          bit 2  floodplain (dry land within RIVER.plain of the river)
 *   bit 4  within fishing reach of the river     bit 8  river water that touches a bank
 */
export function riverMask(w) {
  const key = `${w.terrainRevision ?? 0}|${w.cells.length}`;
  let c = masks.get(w);
  if (c && c.key === key && c.cells === w.cells) return c.mask;
  const mask = new Uint8Array(GRID_W * GRID_H),
    R = Math.ceil(RIVER.reach);
  for (const cell of w.cells) {
    if (!(cell.land && cell.pond && cell.waterType === 'river')) continue;
    mask[cell.y * GRID_W + cell.x] |= 1;
    for (let dy = -R; dy <= R; dy++)
      for (let dx = -R; dx <= R; dx++) {
        const x = cell.x + dx,
          y = cell.y + dy;
        if (x < 0 || y < 0 || x >= GRID_W || y >= GRID_H) continue;
        const d = Math.hypot(dx, dy);
        if (d > RIVER.reach) continue;
        const n = w.cells[y * GRID_W + x];
        mask[y * GRID_W + x] |= 4;
        if (d <= RIVER.plain && n.land && !n.pond && !n.rock && n.elevation <= 3) mask[y * GRID_W + x] |= 2;
        if (d === 1 && !(n.land && n.pond)) mask[cell.y * GRID_W + cell.x] |= 8;
      }
  }
  masks.set(w, (c = { key, cells: w.cells, mask }));
  return mask;
}
const bit = (w, x, y, b) => {
  const cx = Math.floor(x),
    cy = Math.floor(y);
  return cx >= 0 && cy >= 0 && cx < GRID_W && cy < GRID_H && (riverMask(w)[cy * GRID_W + cx] & b) !== 0;
};
export const onFloodplain = (w, x, y) => bit(w, x, y, 2);
export const fishesRiver = (w, x, y) => bit(w, x, y, 4);

/** A building standing in the flood right now. */
export const isFlooded = (w, b) =>
  !WATERSIDE.has(b.kind) && riverLevel(w) === 'high' && onFloodplain(w, b.x, b.y);

/** The river's multiplier on a building's output, with the words for its status line. */
export function riverEffect(w, kind, x, y, preview = false) {
  if (!riverActive(w)) return { factor: 1, note: '' };
  const level = riverLevel(w),
    plain = onFloodplain(w, x, y);
  if (plain && !WATERSIDE.has(kind)) {
    const f = riverForecast(w);
    if (level === 'high' && !preview)
      return { factor: 0, note: `Flooded \xB7 the river falls on Day ${f.until}`, flooded: true };
    const flood = `under water at high water (next: Day ${nextHigh(w)})`;
    return kind === 'farm'
      ? { factor: RIVER.silt, note: `River silt +${Math.round((RIVER.silt - 1) * 100)}% \xB7 ${flood}`, plain: true }
      : { factor: 1, note: `On the floodplain \xB7 ${flood}`, plain: true };
  }
  if ((kind === 'fishery' || kind === 'pier') && fishesRiver(w, x, y)) {
    const k = preview ? 1 : RIVER.fishing[level];
    return {
      factor: k,
      note:
        k === 1
          ? ''
          : { high: 'The fish run with the flood +25%', low: 'Low water −25%', ice: 'Fishing through the ice −50%' }[level],
    };
  }
  return { factor: 1, note: '' };
}
function nextHigh(w) {
  const today = Math.floor(w.time + 1e-8);
  for (let d = today; d < today + YEAR_DAYS + 2; d++) if (levelOnDay(w, d) === 'high') return d + 1;
  return today + 1;
}

/** How far up the river the longships get for a raid due on `dueDay` (1-based): the landing distances. */
export const raidWater = (w, dueDay) => {
  const l = levelOnDay(w, dueDay - 1);
  return l === 'ice' ? 'normal' : l;
};
/** No longship can row a frozen river. */
export const raidPossible = (w, dueDay) => levelOnDay(w, dueDay - 1) !== 'ice';

const MESSAGES = {
  warn: (day) => [
    'The river is rising',
    `The thaw is coming down from the hills. On Day ${day} the river will cover its low bank for three days. Whatever stands there will stop work and lose what it holds, so collect it first. The longships ride high water: a raid then lands close.`,
  ],
  high: (until) => [
    'The river is over its banks',
    `The low bank is under water until Day ${until}. Fishing docks and piers are built for it, and the fish are running. When it falls it leaves silt: farms on that bank bear a third more.`,
  ],
  fallen: () => ['The river has fallen', 'The water is back in its bed, and the low bank is dark with silt.'],
  low: (until) => [
    'Low water',
    `The river runs thin until Day ${until}. Fishing slows, and longships ground far downstream: raiders must march further to reach us.`,
  ],
  ice: (until) => [
    'The river has frozen',
    `No longship can row until the thaw on Day ${until}: there will be no raids. Fishing through the ice gives half. Use the quiet to fill the stores.`,
  ],
  thaw: () => ['The ice is breaking', 'The river runs again. The Red Sails will be back with it, and the thaw flood follows.'],
};

/**
 * Inside step(): at each dawn, tell the settlement what the river is about to do or has just done.
 * Stateless: it compares yesterday, today and the day the warning looks ahead to. `say(title, text)` logs it.
 */
export function stepRiver(w, dt, say) {
  if (!riverActive(w)) return;
  const today = Math.floor(w.time + 1e-8),
    before = Math.floor(w.time - dt + 1e-8);
  if (today === before) return; // not a new dawn
  const now = levelOnDay(w, today),
    was = levelOnDay(w, today - 1),
    ahead = levelOnDay(w, today + RIVER.warnDays),
    f = riverForecast(w);
  if (now !== was) {
    if (now === 'high') say(...MESSAGES.high(f.until));
    else if (now === 'low') say(...MESSAGES.low(f.until));
    else if (now === 'ice') say(...MESSAGES.ice(f.until));
    else if (was === 'high') say(...MESSAGES.fallen());
    else if (was === 'ice') say(...MESSAGES.thaw());
  } else if (ahead === 'high' && now !== 'high' && levelOnDay(w, today + RIVER.warnDays - 1) !== 'high')
    say(...MESSAGES.warn(today + RIVER.warnDays + 1));
}

/** Words for the HUD clock, or '' when the river is steady and nothing is near. */
export function riverHeadline(w) {
  if (!riverActive(w)) return '';
  const f = riverForecast(w),
    days = (n) => `${n}d`;
  // Short enough for the clock chip on a phone: "Flood · 3d" is now, "Flood in 2d" is coming.
  if (f.level === 'high') return `Flood \xB7 ${days(f.next.inDays)}`;
  if (f.level === 'ice') return `Ice \xB7 ${days(f.next.inDays)}`;
  if (f.level === 'low') return `Low \xB7 ${days(f.next.inDays)}`;
  if (f.event.inDays <= 3) return `${{ high: 'Flood', low: 'Low', ice: 'Ice' }[f.event.level]} in ${days(f.event.inDays)}`;
  return '';
}

/** A full line for the wide-screen clock bar, which has room for it. Always says what comes next. */
export function riverLine(w) {
  if (!riverActive(w)) return '';
  const f = riverForecast(w);
  if (f.level === 'high') return `River in flood until Day ${f.until}`;
  if (f.level === 'ice') return `River frozen until Day ${f.until}`;
  if (f.level === 'low') return `Low water until Day ${f.until}`;
  return `River steady \xB7 ${{ high: 'flood', low: 'low water', ice: 'ice' }[f.event.level]} on Day ${f.event.day}`;
}

/** The next four changes, for the time panel: [{ level, day, inDays }]. */
export function riverCalendar(w, count = 4) {
  const out = [],
    today = Math.floor(w.time + 1e-8);
  let level = levelOnDay(w, today);
  for (let d = today + 1; d < today + YEAR_DAYS * 2 && out.length < count; d++) {
    const l = levelOnDay(w, d);
    if (l !== level) out.push({ level: l, day: d + 1, inDays: d - today, season: seasonAt(d).name }), (level = l);
  }
  return out;
}

// Milestone 6 (second half): lore, twelve crafts the settlers learn, each with a stated, visible effect.
// Learned lore is saved as `story.lore` (a list of ids); an island without it has learned nothing.
// A data-and-rules leaf module: it imports nothing, so any module may import it (see CLAUDE.md).

export const LORE = [
  // Tier I — 150 gold and 20 of a material, no prerequisites.
  { id: 'ard', tier: 1, name: 'Iron-shod ard', cost: { gold: 150, stone: 20 }, needs: 'farm',
    text: 'An iron tip on the ard cuts deeper furrows. Barley farms +15%; their fields show furrows.' },
  { id: 'clinker', tier: 1, name: 'Clinker boats', cost: { gold: 150, timber: 20 }, needs: 'fishery',
    text: 'Overlapping planks make light, strong boats. Fishing docks and piers +15%.' },
  { id: 'turf', tier: 1, name: 'Turf walls', cost: { gold: 150, timber: 20 }, needs: 'cottage',
    text: 'Thick turf walls hold the hearth’s heat. Winter firewood −40%.' },
  { id: 'bows', tier: 1, name: 'Yew bows', cost: { gold: 150, timber: 20 }, needs: 'watchtower',
    text: 'Longer bows for the watch. Towers and beacons shoot 30% harder and 1 tile further.' },
  // Tier II — 300 gold and 40 of a material, two tier I crafts first.
  { id: 'smoke', tier: 2, name: 'Smoke-curing', cost: { gold: 300, timber: 40 }, needs: 'smokehouse',
    text: 'Cured fish and mutton keep through the dark months. Food spoils half as fast.' },
  { id: 'shieldwall', tier: 2, name: 'Shield-wall drill', cost: { gold: 300, timber: 40 }, needs: 'guardhall',
    text: 'Guards drill to lock shields. Guards take 15% less harm in every formation.' },
  { id: 'ditch', tier: 2, name: 'Ditch and bank', cost: { gold: 300, stone: 40 }, needs: 'palisade',
    text: 'A ditch before the gate. Palisade gates slow raiders 1.5 tiles further out and hold 50% longer; the ditch shows on the map.' },
  { id: 'millstone', tier: 2, name: 'Millstones', cost: { gold: 300, stone: 40 }, needs: 'bakery',
    text: 'Dressed millstones grind finer flour. The mill bonus for bakeries rises from 30% to 50%.' },
  // Tier III — 600 gold and 80 of a material, two tier II crafts first.
  { id: 'wool', tier: 3, name: 'Homespun cloth', cost: { gold: 600, food: 80 }, needs: 'cottage',
    text: 'Households weave homespun to sell. Longhouse rent +0.3 gold a day; cloth dries on frames in their yards.' },
  { id: 'runes', tier: 3, name: 'Rune staves', cost: { gold: 600, timber: 80 }, needs: null,
    text: 'Accounts carved on staves keep the council honest. Chapter and commission rewards +10%.' },
  { id: 'sunstone', tier: 3, name: 'Sunstone sailing', cost: { gold: 600, stone: 80 }, needs: null,
    text: 'A sunstone finds the sun through cloud. One more day of warning before every threat; voyages 25% faster.' },
  { id: 'knarr', tier: 3, name: 'Knarr building', cost: { gold: 600, timber: 80 }, needs: 'shipyard',
    text: 'Deep-bellied trading ships. Each harbor can send a knarr on trade voyages, and longships can sail against the Red Sail jarl.' },
];
export const LORE_BY_ID = Object.fromEntries(LORE.map((l) => [l.id, l]));
export const TIER_NEEDS = { 1: 0, 2: 2, 3: 2 }; // crafts of the tier below needed first

export const knows = (world, id) => !!world.story.lore?.includes(id);
export const loreSignature = (world) => {
  let s = 0;
  for (const id of world.story.lore ?? []) s |= 1 << LORE.findIndex((l) => l.id === id);
  return s;
};

/** Whether a craft can be learned now, and if not, why. */
export function loreStatus(world, id) {
  const l = LORE_BY_ID[id];
  if (!l) return { ok: false, reason: 'Unknown craft' };
  if (knows(world, id)) return { ok: false, learned: true, reason: 'Learned' };
  const below = (world.story.lore ?? []).filter((x) => LORE_BY_ID[x]?.tier === l.tier - 1).length;
  if (below < TIER_NEEDS[l.tier]) return { ok: false, reason: `Learn ${TIER_NEEDS[l.tier]} tier ${l.tier - 1} crafts first` };
  if (l.needs && !world.buildings.some((b) => b.kind === l.needs && b.buildProgress >= 1 - 1e-8))
    return { ok: false, reason: `Needs a finished ${l.needs === 'cottage' ? 'longhouse' : l.needs}`, needsKind: l.needs };
  for (const [k, v] of Object.entries(l.cost))
    if (world.wallet[k] < v) return { ok: false, reason: `Needs ${v} ${k}` };
  return { ok: true, reason: Object.entries(l.cost).map(([k, v]) => `${v} ${k}`).join(' + ') };
}

/** A player command (like placing a building): pays and records the craft. */
export function learnLore(world, id) {
  const s = loreStatus(world, id);
  if (!s.ok) return s;
  for (const [k, v] of Object.entries(LORE_BY_ID[id].cost)) world.wallet[k] -= v;
  world.story.lore = [...(world.story.lore ?? []), id];
  world.placements++; // redraw tiles: some crafts change how buildings look
  world.revision++;
  world.story.events.push({
    day: Math.floor(world.time + 1e-8) + 1,
    title: `Learned: ${LORE_BY_ID[id].name}`,
    text: LORE_BY_ID[id].text,
  });
  world.story.events.length > 60 && world.story.events.shift();
  return { ok: true, reason: 'Learned' };
}

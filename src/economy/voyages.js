// Milestone 7: trade voyages. With Knarr building learned, each finished merchant harbor can send one knarr
// at a time on a trade route. The cargo leaves at once; the return comes home after the voyage, inside step().
// Voyages are saved as `story.voyages`. Imports only the lore leaf module.
import { knows } from '../progression/lore.js';

export const ROUTES = [
  { id: 'iceland', name: 'Eyrar, Iceland', days: 12, cargo: { timber: 100 }, returns: { gold: 260 },
    text: 'Iceland has few trees. Timber for silver at the Eyrar landing.' },
  { id: 'greenland', name: 'Brattahlíð, Greenland', days: 14, cargo: { food: 120 }, returns: { gold: 90, stone: 30, morale: 3 },
    text: 'Erik the Red’s settlement pays in walrus ivory and soapstone, and sends news of kin.' },
  { id: 'norway', name: 'Hlaðir, Trondheim fjord', days: 20, cargo: { food: 200 }, returns: { gold: 230 },
    text: 'Dried fish and barley for the jarl’s hall in the north.' },
  { id: 'dublin', name: 'Dyflin, Ireland', days: 26, cargo: { food: 150, timber: 80 }, returns: { gold: 420 },
    text: 'The longest voyage and the richest market: Dyflin pays in silver.' },
];
export const ROUTE_BY_ID = Object.fromEntries(ROUTES.map((r) => [r.id, r]));
const built = (b) => b.buildProgress >= 1 - 1e-8;
const day = (w) => Math.floor(w.time + 1e-8) + 1;

export const fleetSize = (w) => (knows(w, 'knarr') ? w.buildings.filter((b) => b.kind === 'harbor' && built(b)).length : 0);
export const voyageDays = (w, route) => Math.ceil(route.days * (knows(w, 'sunstone') ? 0.75 : 1));

export function voyageStatus(w, id) {
  const r = ROUTE_BY_ID[id];
  if (!r) return { ok: false, reason: 'Unknown route' };
  if (!knows(w, 'knarr')) return { ok: false, reason: 'Learn Knarr building first' };
  const fleet = fleetSize(w),
    out = (w.story.voyages ?? []).length;
  if (!fleet) return { ok: false, reason: 'Needs a finished merchant harbor' };
  if (out >= fleet) return { ok: false, reason: `All ${fleet} knarr${fleet > 1 ? 's are' : ' is'} at sea` };
  for (const [k, v] of Object.entries(r.cargo)) if (w.wallet[k] < v) return { ok: false, reason: `Needs ${v} ${k}` };
  return { ok: true, reason: `${voyageDays(w, r)} days` };
}

/** A player command: loads the cargo and sails. */
export function sendVoyage(w, id) {
  const s = voyageStatus(w, id);
  if (!s.ok) return s;
  const r = ROUTE_BY_ID[id];
  for (const [k, v] of Object.entries(r.cargo)) w.wallet[k] -= v;
  w.story.voyages = [...(w.story.voyages ?? []), { route: id, depart: day(w), back: day(w) + voyageDays(w, r) }];
  w.revision++;
  return { ok: true, reason: 'Sailed' };
}

/** Inside step(): knarrs that are due come home with their returns. `log(title, text)` writes the journal. */
export function stepVoyages(w, log) {
  const v = w.story.voyages;
  if (!v?.length) return;
  const d = day(w);
  const home = v.filter((x) => d >= x.back);
  if (!home.length) return;
  w.story.voyages = v.filter((x) => d < x.back);
  for (const x of home) {
    const r = ROUTE_BY_ID[x.route];
    for (const k of ['gold', 'food', 'timber', 'stone']) r.returns[k] && (w.wallet[k] += r.returns[k]);
    r.returns.gold && (w.earned += r.returns.gold);
    r.returns.morale && w.frontier && (w.frontier.morale = Math.min(100, w.frontier.morale + r.returns.morale));
    log?.(`The knarr is home from ${r.name}`, `It brings ${returnText(r)}.`);
  }
}
export const returnText = (r) =>
  Object.entries(r.returns)
    .map(([k, v]) => (k === 'morale' ? `news that lifts morale (+${v})` : `${v} ${k}`))
    .join(', ');
export const cargoText = (r) => Object.entries(r.cargo).map(([k, v]) => `${v} ${k}`).join(' + ');

// Milestone 7: the Red Sail jarl, a rival island run by a small scheduled AI. Every ten days he gathers ships;
// his strength scales the raids. The player can pay tribute for peace or, with Knarr building and a shipyard,
// send longships against him. State: `frontier.rival` (saved). Deterministic, inside step(); imports nothing.

export const RIVAL = { start: 20, growth: 4, every: 10, peaceDays: 20, voyage: 6 };
const day = (w) => Math.floor(w.time + 1e-8) + 1;

export const createRival = (w) => ({ strength: RIVAL.start, peaceUntil: 0, lastMove: day(w) });
/** How much harder (or softer) raids are, from the jarl's strength: 0.85× to 1.3×. */
export const rivalFactor = (w) =>
  w.frontier.rival ? Math.max(0.85, Math.min(1.3, 0.85 + w.frontier.rival.strength / 200)) : 1;
export const atPeace = (w) => !!w.frontier.rival && w.frontier.rival.peaceUntil > day(w);
export const tributeCost = (w) => Math.round(120 + (w.frontier.rival?.strength ?? 0) * 4);

/** Inside step(), once threats are on: the jarl wakes after the second threat and moves every ten days. */
export function stepRival(w, log) {
  const f = w.frontier,
    d = day(w);
  if (!f.rival) {
    if (f.resolved >= 2) {
      f.rival = createRival(w);
      log?.('The Red Sail jarl', 'The raiders answer to a jarl on an island to the west. Every ten days he gathers more ships. Pay him tribute for peace, or learn Knarr building and send longships against him.');
    }
    return;
  }
  const r = f.rival;
  if (r.expedition && d >= r.expedition.back) {
    const x = r.expedition,
      win = x.power >= r.strength * 0.6,
      lost = win ? Math.floor(x.sent / 4) : Math.ceil(x.sent / 2),
      plunder = win ? Math.round(100 + r.strength * 2) : 0;
    f.garrison += x.sent - lost;
    if (win) (r.strength = Math.max(8, Math.round(r.strength * 0.55))), (w.wallet.gold += plunder), (w.earned += plunder);
    else r.strength += 5;
    delete r.expedition;
    log?.(
      win ? 'The longships return in triumph' : 'The longships come back beaten',
      win
        ? `They burned the jarl’s boat sheds and bring ${plunder} gold. His strength falls to ${r.strength}.${lost ? ` ${lost} guards did not come home.` : ''}`
        : `The jarl was ready for them. ${lost} guards were lost, and his strength rises to ${r.strength}.`,
    );
  }
  if (d - r.lastMove >= RIVAL.every) {
    r.lastMove = d;
    if (r.peaceUntil > d) return;
    r.strength += RIVAL.growth + Math.floor(d / 60);
    log?.('The jarl gathers ships', `Word from the fishing grounds: the Red Sail jarl’s strength is now ${r.strength}. His raids grow harder.`);
  }
}

/** Player commands. */
export function payTribute(w) {
  const r = w.frontier.rival,
    cost = tributeCost(w);
  if (!r) return { ok: false, reason: 'No jarl yet' };
  if (atPeace(w)) return { ok: false, reason: 'Already at peace' };
  if (w.wallet.gold < cost) return { ok: false, reason: `Needs ${cost} gold` };
  w.wallet.gold -= cost;
  w.spent += cost;
  r.peaceUntil = day(w) + RIVAL.peaceDays;
  w.revision++;
  return { ok: true, reason: `Peace until Day ${r.peaceUntil}` };
}
export function expeditionStatus(w, knowsKnarr, hasShipyard, shieldwall) {
  const r = w.frontier.rival,
    f = w.frontier;
  if (!r) return { ok: false, reason: 'No jarl yet' };
  if (r.expedition) return { ok: false, reason: `Longships at sea until Day ${r.expedition.back}` };
  if (!knowsKnarr) return { ok: false, reason: 'Learn Knarr building first' };
  if (!hasShipyard) return { ok: false, reason: 'Needs a finished boatbuilders’ yard' };
  if (f.battle || f.pending?.kind === 'raid') return { ok: false, reason: 'Not with raiders on the way' };
  if (f.garrison < 6) return { ok: false, reason: 'Needs at least 6 guards' };
  const sent = Math.ceil(f.garrison / 2),
    power = Math.round(sent * 3 * (shieldwall ? 1.15 : 1) * (f.formation === 'column' ? 1.1 : 1));
  return { ok: true, sent, power, odds: power >= r.strength * 0.6 ? 'likely to win' : 'likely to lose', reason: `${sent} guards, ${RIVAL.voyage} days` };
}
export function sendLongships(w, knowsKnarr, hasShipyard, shieldwall) {
  const s = expeditionStatus(w, knowsKnarr, hasShipyard, shieldwall);
  if (!s.ok) return s;
  w.frontier.garrison -= s.sent;
  w.frontier.rival.expedition = { back: day(w) + RIVAL.voyage, sent: s.sent, power: s.power };
  w.revision++;
  return { ok: true, reason: 'Sailed' };
}

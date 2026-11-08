# Milestone 2: "Raids you can fight" — results (8 November 2026)

Released as v16.13. The audit's goal for this milestone was that raids stop being a number compared with a
number and become something the player watches, plans for and can change while it happens.

## What changed for the player

1. **Visible landings.** When a raid is sighted, the raiders choose a target (the stores first: storehouse, then
   granary, trading place, harbor, traders' hall) and a beach or river bank near it. The route from the beach to
   the target is fixed at that moment and drawn on the map as a red dotted line, with a ring on the target and the
   longship offshore. A completed **watchtower or beacon spots the sails at once**; without one, nobody knows where
   they will land until the last day before they arrive. The Army panel says where they will land and what they
   want, or that it is unknown.
2. **The band lands and marches.** On the due day the raiders wade ashore one by one, form up on the beach, and march
   three abreast along the route. Raid strength sets the size of the band (3 to 14 raiders) and how hard each one is.
3. **Guards leave their halls and fight by formation**, and the formation can be changed during the fight:
   - *Patrol*: a ring around the target that closes up in front of it when the horn sounds; chases raiders who run.
   - *Shield line*: a wall five wide across the route, between the beach and the target (later ranks behind). Guards
     take 30% less harm but never chase. Fewest losses, fewest kills.
   - *Marching column*: marches 50% faster to meet the band on the beach, charges for extra harm on first contact,
     chases far, and takes 15% more harm.
   Melee is one against one or two: no more than two men can strike at one man. The wounded strike weaker.
4. **Towers and palisades matter where they stand.** A watchtower shoots the nearest raider within 7 tiles (a beacon
   within 9, harder). A palisade gate slows raiders within 5 tiles to half speed, makes guards fighting there take
   30% less harm, and must be broken before raiders can loot stores within 5 tiles of it; it also keeps those
   stores from being set alight.
5. **Outcomes come from the fight.** Raiders who reach the stores carry goods off a little at a time. A raider cut
   down drops what he carried. The band runs when it is down to 35% of its strength, or when it has stripped the
   stores, or at last light. If half the band reaches unguarded stores with no palisade, they set them alight.
   Guards who fall are wounded; half of them (rounded down if the raid was held, up if not) do not come back.
   A raid counts as **repelled** when nothing burned and they carried off less than a fifth of what they came for.
6. **A forecast you can trust.** Once the sails are spotted, the Army panel plays the coming raid to its end on a
   copy of the island and reports the likely result ("they are driven off; about 4 of 8 fall", "they reach the
   storehouse unopposed and set it alight"). It uses the same rules as the real fight, so if nothing changes the
   forecast is what happens (`tests/raid.test.js`). During the fight it shows the live tally and an updated forecast.
7. **Watching it.** Skip ahead stops when raiders come ashore; at 3× or faster the game drops to 1×. The horn
   sounds. Soldiers and raiders are drawn from the simulation, smoothly between fixed steps, with health bars;
   the fallen lie where they fell until the fight ends; arrows fly from the towers.

The defense number (guards 3, watchtower 6, palisade 4, beacon 8) stays as a rough guide and for chapter goals.

## Rules kept

- The fight runs only inside `step()`, in five fixed sub-steps per step, with no randomness. 1×, 10× and skip ahead
  give the same result, and a game saved mid-fight continues exactly as if it had not been saved (both tested).
- Saves: the plan and the battle live in `frontier.pending` and `frontier.battle`, both optional in the schema. A
  v16.12 save with a raid on the way gets its landing decided on the next step. The v16.11 fixtures load unchanged.
- No import cycles: `src/military/battle.js` imports only the new leaf module `src/world/grid.js` (map size and
  haven), which the catalog now re-exports.
- Weather threats (flood, gale, wildfire, frost) are unchanged.

## Balance runs

Scripted raids on the fixture island (`node tools/balance-raids.mjs`). The stores stand about 16 tiles from the
beach; the guard hall is beside the stores. "Holds" means the raid counts as repelled.

## Guards needed to hold the stores (no towers, no palisade)

| Raid strength | v16.12 formula (patrol / line / column) | Patrol | Shield line | Marching column |
|---|---|---|---|---|
| 12 | 4 / 4 / 4 | 4 | 3 | 4 |
| 20 | 7 / 6 / 7 | 6 | 5 | 6 |
| 32 | 11 / 10 / 11 | 9 | 8 | 9 |
| 45 | 15 / 14 / 15 | 14 | 10 | 12 |
| 60 | 19 / 18 / 19 | >18 | 15 | >18 |

## Where the defenses stand (strength 20, patrol)

| Setup | Result |
|---|---|
| Nothing | **Raiders take supplies.** 0 of 7 raiders fell; 7 rowed away. They carried off 97 gold, 80 food, 36 timber, 8 stone. They set fire to the storehouse; builders are repairing it. |
| 1 tower beside the stores | **Raiders take supplies.** 4 of 7 raiders fell; 3 rowed away. The towers loosed 30 volleys. They carried off 57 gold, 47 food, 22 timber, 5 stone. They set fire to the storehouse; builders are repairing it. |
| 1 tower 15 tiles away | **Raiders take supplies.** 0 of 7 raiders fell; 7 rowed away. They carried off 97 gold, 80 food, 36 timber, 8 stone. They set fire to the storehouse; builders are repairing it. |
| 2 towers beside the stores | **Raiders take supplies.** 6 of 7 raiders fell; 1 rowed away. The towers loosed 36 volleys. They carried off 6 gold, 5 food, 3 timber, 1 stone. They set fire to the storehouse; builders are repairing it. |
| Palisade gate beside the stores | **Raiders take supplies.** 0 of 7 raiders fell; 7 rowed away. They carried off 31 gold, 26 food, 12 timber, 3 stone. |
| Palisade gate 15 tiles away | **Raiders take supplies.** 0 of 7 raiders fell; 7 rowed away. They carried off 97 gold, 80 food, 36 timber, 8 stone. They set fire to the storehouse; builders are repairing it. |
| Tower + palisade beside the stores | **The harbor holds.** 5 of 7 raiders fell; 2 rowed away. The towers loosed 34 volleys. They carried off 4 gold, 4 food, 2 timber, 1 stone. |
| 4 guards | **Raiders take supplies.** 2 of 7 raiders fell; 5 rowed away. 2 guards fell; 2 wounded will recover. They carried off 84 gold, 69 food, 31 timber, 7 stone. They set fire to the storehouse; builders are repairing it. |
| 4 guards + tower + palisade beside the stores | **The harbor holds.** 5 of 7 raiders fell; 2 rowed away. The towers loosed 13 volleys. 2 guards fell; 2 wounded will recover. No stores were taken. |

## Formation profiles (strength 32, 12 guards)

| Formation | Result |
|---|---|
| patrol | **The harbor holds.** 9 of 11 raiders fell; 2 rowed away. 1 guard was wounded and will recover. No stores were taken. |
| line | **The harbor holds.** 5 of 11 raiders fell; 6 rowed away. Every guard came home. No stores were taken. |
| column | **The harbor holds.** 6 of 11 raiders fell; 5 rowed away. 1 guard fell; 2 wounded will recover. No stores were taken. |

What the runs show:

- With guards alone, the fight needs about as many guards as the old formula, a little fewer with a good
  formation. At strength 45 and above, the patrol falls behind: a band of 14 hardened raiders breaks a patrol that
  closes up piecemeal, while a shield line holds. Late raids need towers and gates near the stores, as before.
- Placement now decides what a tower or gate is worth: the same tower 15 tiles away does nothing.
- A palisade gate alone does not stop a raid but saves about two thirds of the stores and stops the fire. A tower
  and a gate together beside the stores hold a strength-20 raid with no guards at all.

## Tests

`tests/raid.test.js` (10 tests): the landing is on a shore and fixed by the island; an undefended island loses its
stores and the storehouse burns; enough guards repel and the raid counts; the column meets raiders nearer the beach
than the line, and the line stands forward of the patrol; the line loses fewer guards than the column; a tower
helps only where the raiders go; a gate keeps the stores from the fire; the forecast matches the result; 1×, 10×
and skip ahead agree during a fight; a save made mid-fight continues identically.
`tests/browser/raid.mjs` stages a raid in the browser, screenshots the warning, landing, fight and the Army panel,
and switches formation mid-fight.

## Review notes

- **Gameplay:** the gate for this milestone is human playtesting, which has not happened. Open questions for
  playtesters: is the patrol too weak late, is a lone palisade too strong early, is losing half the fallen guards
  too harsh, and is the 1× drop when raiders land welcome or annoying.
- **Art:** soldiers and raiders reuse the v16 unit sprites. The fallen are the same sprite turned on its side and
  faded. Proper fighting and fallen poses, a beached longship and fire on the burned building belong with the
  Milestone 3 art bible.
- **Engineering:** the forecast costs about 25 ms on a large island (Node, not a device) and is cached until
  something relevant changes; during a fight it refreshes every 0.1 island days while the Army panel is open.
  The landing scan and route search run once per raid.

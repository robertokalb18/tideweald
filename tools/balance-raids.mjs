// Milestone 2 balance runs: plays scripted raids on the fixture island and prints how many guards
// each formation needs, compared with the v16.12 formula (defense × formation ≥ strength).
// Usage: node tools/balance-raids.mjs
import { fight, raidWorld } from '../tests/raid-helpers.js';

const OLD = { patrol: 1.05, line: 1.15, column: 1 };
const won = (r) => r.title === 'The harbor holds';
const run = async (o) => fight(await raidWorld(o)).report;

console.log('## Guards needed to hold the stores (no towers, no palisade)\n');
console.log('| Raid strength | v16.12 formula (patrol / line / column) | Patrol | Shield line | Marching column |');
console.log('|---|---|---|---|---|');
for (const strength of [12, 20, 32, 45, 60]) {
  const need = {};
  for (const formation of ['patrol', 'line', 'column']) {
    need[formation] = '>18';
    for (let guards = 0; guards <= 18; guards += 1) {
      if (won(await run({ guards, strength, formation }))) {
        need[formation] = guards;
        break;
      }
    }
  }
  const old = Object.entries(OLD).map(([f, k]) => Math.min(19, Math.ceil(strength / (3 * k)))).join(' / ');
  console.log(`| ${strength} | ${old} | ${need.patrol} | ${need.line} | ${need.column} |`);
}

console.log('\n## Where the defenses stand (strength 20, patrol)\n');
console.log('| Setup | Result |');
console.log('|---|---|');
const cases = [
  ['Nothing', {}],
  ['1 tower beside the stores', { towers: [[2, 2]] }],
  ['1 tower 15 tiles away', { towers: [[15, 0]] }],
  ['2 towers beside the stores', { towers: [[2, 2], [-2, 2]] }],
  ['Palisade gate beside the stores', { palisades: [[1, -2]] }],
  ['Palisade gate 15 tiles away', { palisades: [[15, 0]] }],
  ['Tower + palisade beside the stores', { towers: [[2, 2]], palisades: [[1, -2]] }],
  ['4 guards', { guards: 4 }],
  ['4 guards + tower + palisade beside the stores', { guards: 4, towers: [[2, 2]], palisades: [[1, -2]] }],
];
for (const [name, o] of cases) {
  const r = await run({ strength: 20, ...o });
  console.log(`| ${name} | **${r.title}.** ${r.text} |`);
}

console.log('\n## Formation profiles (strength 32, 12 guards)\n');
console.log('| Formation | Result |');
console.log('|---|---|');
for (const formation of ['patrol', 'line', 'column']) {
  const r = await run({ strength: 32, guards: 12, formation });
  console.log(`| ${formation} | **${r.title}.** ${r.text} |`);
}

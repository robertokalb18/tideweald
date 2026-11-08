// Milestone 1b, "Landfall 985": moves the player-facing text from 13th-century North Sea settlers
// to Norse settlers of 985. Only string literals are edited; ids, save data and mechanics are untouched.
// Run once from the repository root: node tools/retheme-985.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const acorn = require(process.env.ACORN ?? 'acorn');

// Exact phrases first (each must be found at least once).
const PHRASES = [
  ['Around the year 1250, our ships leave the Weser marshes for a rumored island off the Frisian coast. A gale separates the ships.',
    'Around 985, twenty-five ships follow Erik the Red west from Iceland. A gale scatters the fleet, and ours is driven south to a wooded island no saga names.'],
  ['Inspired by the 13th-century settlers who diked the North Sea marshes, your fictional fleet must build a new home.',
    'Inspired by the Norse crossing of 985, when twenty-five ships sailed west with Erik the Red and only fourteen arrived, your fictional fleet must build a new home.'],
  ['From the 12th century, Frisian, Dutch and Saxon settlers took charters to dike and farm the North Sea marshes and islands. Their villages combined farming, grazing, and resources from the sea.',
    'Around 985, Erik the Red led twenty-five ships from Iceland to settle Greenland; only fourteen are believed to have arrived. Norse settlers farmed barley and hay, kept sheep and cattle, fished and hunted seals, and traded wool and walrus ivory across the North Atlantic.'],
  ['https://whc.unesco.org/en/list/1314', 'https://whc.unesco.org/en/list/1536'],
  ['Explore the Wadden Sea with UNESCO', 'Explore Norse Greenland (Kujataa) with UNESCO'],
  ['a fictional 13th-century North Sea world', 'a fictional Norse world of the 980s'],
  ['A Frisian trader from Stavoren', 'A Hebridean trader from Lewis'],
  ['Brother Anselm of the chapel', 'Thorgerd of the hof'],
  ['The bishop’s forester', 'The godi’s forester'],
  ['Stone for the chapel tower', 'Stone for the hof walls'],
  ['Bees for the cloister hives', 'Bees for the walled-garden hives'],
  ['Geese for the Martinmas feast', 'Geese for the Winter Nights feast'],
  ['Oak for a cog’s keel', 'Oak for a knarr’s keel'],
  ['A damaged cog drifts', 'A damaged knarr drifts'],
  ['and a lay brother who knows', 'and an Irish hermit who knows'],
  ['Build a scriptorium to copy the star tables', 'Build an observatory and carve the star tables on rune staves'],
  ['A scriptorium earns income from copied books', 'The observatory earns income from teaching sky-lore'],
  ['Starfall scriptorium', 'Starfall observatory'],
  ['plus 5 gold/day from copied books', 'plus 5 gold/day from teaching sky-lore'],
  ['A Martinmas fair', 'A Winter Nights fair'],
  ['want a fair at Martinmas', 'want a fair at Winter Nights'],
  ['North Sea gale', 'Atlantic gale'],
  ['Wheat farm', 'Barley farm'],
  // also applied by hand: 'Build a wheat farm' -> 'Build a barley farm' (campaign.js, world.js), 'Complete a scriptorium' -> 'Complete the observatory', 'council stone' -> 'Thing stone'
  ['Market square', 'Trading place'],
  ['Herbalist cottage', 'Herbalist hut'],
  ['Harbor chapel', 'Harbor hof'],
  ['The guilds want a charter; the boat crews want open scales.', 'The craftsmen want a guild law; the boat crews want open scales.'],
  ['A guild charter', 'A guild law'],
];
// Then whole words inside sentences (strings with a space), plus capitalised one-word display names.
const WORDS = [
  [/\bcottages\b/g, 'longhouses'], [/\bCottages\b/g, 'Longhouses'], [/\bcottage\b/g, 'longhouse'], [/\bCottage\b/g, 'Longhouse'],
  [/\bcloister gardens\b/g, 'walled gardens'], [/\bcloister garden\b/g, 'walled garden'], [/\bCloister gardens\b/g, 'Walled gardens'], [/\bCloister garden\b/g, 'Walled garden'],
  [/\bchapels\b/g, 'hofs'], [/\bchapel\b/g, 'hof'], [/\bChapel\b/g, 'Hof'],
];

const files = process.argv.slice(2);
const used = new Set();
const counts = {};
for (const file of files) {
  const src = readFileSync(file, 'utf8');
  const edits = [];
  for (const tok of acorn.tokenizer(src, { ecmaVersion: 'latest', sourceType: 'module' })) {
    const isStr = tok.type.label === 'string', isTpl = tok.type.label === 'template';
    if (!isStr && !isTpl) continue;
    const raw = src.slice(tok.start, tok.end);
    let text = raw;
    for (const [from, to] of PHRASES) {
      const variants = [from, from.replace(/’/g, '\\u2019')];
      for (const v of variants) if (text.includes(v)) { text = text.split(v).join(to.replace(/’/g, v === from ? '’' : '\\u2019')); used.add(from); }
    }
    const value = isStr ? tok.value : raw;
    const sentence = /\s/.test(value);
    const displayWord = /^[A-Z][a-z]+$/.test(value ?? '');
    if (sentence || displayWord) for (const [re, to] of WORDS) text = text.replace(re, (m) => ((counts[to] = (counts[to] ?? 0) + 1), to));
    if (text !== raw) edits.push([tok.start, tok.end, text]);
  }
  let out = '', pos = 0;
  for (const [s, e, t] of edits) { out += src.slice(pos, s) + t; pos = e; }
  out += src.slice(pos);
  if (out !== src) writeFileSync(file, out);
  console.log(`${file}: ${edits.length} strings changed`);
}
const missing = PHRASES.filter(([p]) => !used.has(p)).map(([p]) => p);
console.log('word replacements', counts);
if (missing.length) { console.error('PHRASES NOT FOUND:\n' + missing.join('\n')); process.exit(1); }

// Recovers a modular source tree from the Tideweald v16.11 bundle.
// Usage: node gen.cjs <bundle.js> <outDir>
const fs = require('fs');
const path = require('path');
const espree = require('/opt/node-tools/node_modules/espree');
const eslintScope = require('/opt/node-tools/node_modules/eslint-scope');
const estraverse = require('/opt/node-tools/node_modules/estraverse');

const [bundlePath, outDir] = process.argv.slice(2);
const src = fs.readFileSync(bundlePath, 'utf8');
const ast = espree.parse(src, { ecmaVersion: 'latest', sourceType: 'module', range: true });
const sm = eslintScope.analyze(ast, { ecmaVersion: 2024, sourceType: 'module' });
const modScope = sm.globalScope.childScopes[0];
const body = ast.body;
const manual = require('./names.cjs');
const plan = require('./plan.cjs');

// ---------- statement -> module ----------
const stmtModule = new Array(body.length);
for (let k = 0; k < body.length; k++) {
  let m = null;
  for (const [start, mod] of plan.ranges) if (k >= start) m = mod;
  stmtModule[k] = m;
}
const stmtIndexAt = (pos) => {
  let lo = 0, hi = body.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1, s = body[mid];
    if (pos < s.range[0]) hi = mid - 1;
    else if (pos >= s.range[1]) lo = mid + 1;
    else return mid;
  }
  return -1;
};

// ---------- parent map ----------
const parent = new Map();
estraverse.traverse(ast, {
  enter(node, p) { parent.set(node, p); },
  fallback: 'iteration',
});

// ---------- classify top-level variables ----------
const vars = new Map(modScope.variables.map((v) => [v.name, v]));
const EXTERNAL = { Da: 'react', Ve: 'react/jsx-runtime', Dh: 'react-dom', x4: 'react-dom/client' };
const EXT_NAME = { react: 'React', 'react/jsx-runtime': 'jsxRuntime', 'react-dom': 'ReactDOM', 'react-dom/client': 'ReactDOMClient' };
const aliasOf = new Map(); // var name -> external module
const aliasDeclarators = new Set();
for (const st of body) {
  if (st.type !== 'VariableDeclaration') continue;
  for (const d of st.declarations) {
    const init = d.init;
    if (init && init.type === 'CallExpression' && init.callee.name === 'Me' && init.arguments[0]?.type === 'CallExpression') {
      const lib = EXTERNAL[init.arguments[0].callee.name];
      if (lib) { aliasOf.set(d.id.name, lib); aliasDeclarators.add(d); }
    }
  }
}

// registered names
const reg = new Map();
const isI = (node) => node && node.type === 'Identifier' && node.name === 'i';
for (const st of body) {
  if (st.type === 'ExpressionStatement' && st.expression.type === 'CallExpression' && isI(st.expression.callee)) {
    const [a, b] = st.expression.arguments;
    if (a?.type === 'Identifier' && b?.type === 'Literal') reg.set(a.name, b.value);
  }
  if (st.type === 'VariableDeclaration') for (const d of st.declarations) {
    const init = d.init;
    if (init?.type === 'CallExpression' && isI(init.callee) && init.arguments[1]?.type === 'Literal') reg.set(d.id.name, init.arguments[1].value);
    if (init?.type === 'ClassExpression' && init.id) reg.set(d.id.name, init.id.name);
  }
  if (st.type === 'FunctionDeclaration' || st.type === 'ClassDeclaration') { /* names come from i() */ }
}

// ---------- choose new names ----------
const RESERVED = new Set('break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield let static implements interface package private protected public await arguments eval undefined NaN Infinity'.split(' '));
const globalsUsed = new Set(sm.globalScope.through.map((r) => r.identifier.name));
for (const g of ['window', 'document', 'globalThis', 'Math', 'JSON', 'Object', 'Array', 'Map', 'Set', 'WeakMap', 'Promise', 'Image', 'Path2D', 'Error', 'Symbol', 'Number', 'String', 'Boolean', 'Date', 'Response', 'Blob', 'React', 'ReactDOM', 'jsxRuntime', 'ReactDOMClient']) globalsUsed.add(g);
const taken = new Set();
const newName = new Map();
const valid = (n) => /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(n) && !RESERVED.has(n);
const capturedBy = (v, N) => {
  for (const r of v.references) {
    let s = r.from;
    while (s && s !== modScope) {
      if (s.set.has(N)) return true;
      s = s.upper;
    }
  }
  return false;
};
// keep names of variables that are not renamed reserved first
const order = [...vars.values()].sort((a, b) => a.defs[0]?.name.range[0] - b.defs[0]?.name.range[0]);
for (const v of order) {
  if (aliasOf.has(v.name)) continue;
  let want = manual[v.name] ?? reg.get(v.name);
  if (want && !valid(want)) want = want.replace(/[^A-Za-z0-9_$]/g, '_');
  if (!want || want.length < 3 && !manual[v.name] || !valid(want)) want = null;
  let cand = want ?? v.name;
  let n = 1;
  const base = cand;
  while (taken.has(cand) || globalsUsed.has(cand) || capturedBy(v, cand) || (cand !== v.name && vars.has(cand) && !newName.has(cand) && cand !== v.name)) {
    n++;
    cand = want ? `${base}${n}` : `${v.name}_${n}`;
  }
  taken.add(cand);
  newName.set(v.name, cand);
}
for (const [alias, lib] of aliasOf) {
  const N = EXT_NAME[lib];
  if (capturedBy(vars.get(alias), N)) throw new Error(`external name ${N} captured for ${alias}`);
  newName.set(alias, N);
}

// ---------- edits ----------
const edits = []; // [start, end, text]
const removeStmt = new Set();
for (let k = 0; k < body.length; k++) if (stmtModule[k] === null) removeStmt.add(k);
const iVar = vars.get('i');
for (const r of iVar.references) {
  if (r.init || removeStmt.has(stmtIndexAt(r.identifier.range[0]))) continue;
  const call = parent.get(r.identifier);
  if (call?.type !== 'CallExpression' || call.callee !== r.identifier) throw new Error('odd use of i');
  const p = parent.get(call);
  if (p.type === 'ExpressionStatement' && parent.get(p) === ast) { removeStmt.add(body.indexOf(p)); continue; }
  const a0 = call.arguments[0];
  edits.push([call.range[0], a0.range[0], '(']);
  edits.push([a0.range[1], call.range[1], ')']);
}
// alias declarators
for (const st of body) {
  if (st.type !== 'VariableDeclaration') continue;
  const ds = st.declarations, al = ds.filter((d) => aliasDeclarators.has(d));
  if (!al.length) continue;
  if (al.length === ds.length) { removeStmt.add(body.indexOf(st)); continue; }
  ds.forEach((d, j) => {
    if (!aliasDeclarators.has(d)) return;
    if (j < ds.length - 1) edits.push([d.range[0], ds[j + 1].range[0], '']);
    else edits.push([ds[j - 1].range[1], d.range[1], '']);
  });
}
// identifier renames
const crossWrites = [];
const uses = new Map(); // module -> Set(var)
const RUNTIME = { Vc: '__publicField' };
for (const v of vars.values()) {
  if (v.name === 'i') continue;
  const N = RUNTIME[v.name] ?? newName.get(v.name);
  const ids = [...v.defs.map((d) => d.name), ...v.references.map((r) => r.identifier)];
  const seen = new Set();
  const defMod = stmtModule[stmtIndexAt(v.defs[0].name.range[0])];
  for (const r of v.references) {
    const k = stmtIndexAt(r.identifier.range[0]);
    if (removeStmt.has(k)) continue;
    const m = stmtModule[k];
    if (!uses.has(m)) uses.set(m, new Set());
    uses.get(m).add(v.name);
    if (r.isWrite() && m !== defMod && !r.init) crossWrites.push(`${v.name}(${N}) written in ${m}, declared in ${defMod}`);
  }
  if (N === v.name) continue;
  for (const id of ids) {
    if (seen.has(id)) continue;
    seen.add(id);
    const p = parent.get(id);
    if (p && p.type === 'Property' && p.shorthand && p.value === id) edits.push([id.range[0], id.range[1], `${v.name}: ${N}`]);
    else edits.push([id.range[0], id.range[1], N]);
  }
}

// ---------- module texts ----------
edits.sort((a, b) => a[0] - b[0] || b[1] - a[1]);
const applyEdits = (start, end) => {
  let out = '', pos = start;
  for (const [s, e, t] of edits) {
    if (s < start || e > end) continue;
    if (s < pos) continue; // nested (shouldn't happen)
    out += src.slice(pos, s) + t;
    pos = e;
  }
  return out + src.slice(pos, end);
};
const modules = new Map();
for (let k = 0; k < body.length; k++) {
  if (removeStmt.has(k)) continue;
  const m = stmtModule[k];
  if (!modules.has(m)) modules.set(m, []);
  let text = applyEdits(body[k].range[0], body[k].range[1]);
  if (!/[;}]\s*$/.test(text)) text += ';';
  modules.get(m).push(text);
}
const declModule = new Map();
for (const v of vars.values()) {
  const k = stmtIndexAt(v.defs[0].name.range[0]);
  if (!removeStmt.has(k) || v.name === 'Vc') declModule.set(v.name, stmtModule[k]);
}
declModule.set('Vc', 'lib/runtime');
const rel = (from, to) => { let r = path.relative(path.dirname(from), to); if (!r.startsWith('.')) r = './' + r; return r + '.js'; };
const exportsOf = new Map();
for (const [m, set] of uses) for (const name of set) {
  const dm = declModule.get(name);
  if (!dm || dm === m || aliasOf.has(name)) continue;
  if (!exportsOf.has(dm)) exportsOf.set(dm, new Set());
  exportsOf.get(dm).add(name);
}
fs.mkdirSync(outDir, { recursive: true });
const report = { modules: {}, crossWrites };
for (const [m, parts] of modules) {
  const file = path.join(outDir, m + '.js');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const imports = new Map(), ext = new Map();
  for (const name of uses.get(m) ?? []) {
    if (aliasOf.has(name)) { ext.set(EXT_NAME[aliasOf.get(name)], aliasOf.get(name)); continue; }
    const dm = declModule.get(name);
    if (!dm || dm === m) continue;
    if (!imports.has(dm)) imports.set(dm, new Set());
    imports.get(dm).add(RUNTIME[name] ?? newName.get(name));
  }
  let head = `// Recovered from the Tideweald v16.11 build. Module: ${m}\n`;
  for (const [N, lib] of [...ext].sort()) head += `import * as ${N} from '${lib}';\n`;
  for (const [dm, names] of [...imports].sort()) head += `import { ${[...names].sort().join(', ')} } from '${rel(m, dm)}';\n`;
  const ex = [...(exportsOf.get(m) ?? [])].map((n) => newName.get(n)).sort();
  const tail = ex.length ? `\nexport { ${ex.join(', ')} };\n` : '\n';
  fs.writeFileSync(file, head + '\n' + parts.join('\n') + '\n' + tail);
  report.modules[m] = { statements: parts.length, imports: [...imports.keys()], exports: ex.length };
}
fs.writeFileSync(path.join(outDir, '..', 'names-map.json'), JSON.stringify(Object.fromEntries([...newName].filter(([a, b]) => a !== b)), null, 1));
fs.writeFileSync(path.join(outDir, '..', 'gen-report.json'), JSON.stringify(report, null, 1));
console.log('modules', modules.size, 'renamed', [...newName].filter(([a, b]) => a !== b).length, 'of', vars.size, 'crossWrites', crossWrites.length);

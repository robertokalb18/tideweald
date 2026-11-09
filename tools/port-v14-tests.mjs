// Transpiles the v14 TypeScript test suites to JavaScript under tests/v14, pointing their imports at the shim.
// Usage: node tools/port-v14-tests.mjs <v14 lib folder>
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { transformSync } from 'esbuild';
const dir = process.argv[2];
for (const f of readdirSync(dir).filter((f) => f.endsWith('.test.ts'))) {
  let src = readFileSync(`${dir}/${f}`, 'utf8');
  src = src.replace(/from '\.\/[a-z0-9-]+(\.ts)?'/g, "from './shim.js'");
  const { code } = transformSync(src, { loader: 'ts', format: 'esm', target: 'es2022' });
  writeFileSync(`tests/v14/${f.replace('.test.ts', '.v14.js')}`, `// Ported from the v14 suite lib/${f} by tools/port-v14-tests.mjs.\n` + code);
}

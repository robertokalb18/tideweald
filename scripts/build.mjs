// Builds dist/ from src/ and public/: one minified ES module (app.js) plus the static files.
import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync, statSync } from 'node:fs';

const out = 'dist';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync('public', out, { recursive: true });
await esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  format: 'esm',
  minify: true,
  target: ['es2022', 'safari16'],
  define: { 'process.env.NODE_ENV': '"production"' },
  outfile: `${out}/app.js`,
  logLevel: 'warning',
});
console.log(`dist/app.js ${(statSync(`${out}/app.js`).size / 1024).toFixed(0)} KB`);

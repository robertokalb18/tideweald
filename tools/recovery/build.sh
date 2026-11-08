set -e
R=/tmp/claude-0/-home-claude/75015996-11f3-5e56-a818-49bb90590b7d/scratchpad/rebuild
cd $R && rm -rf out/src && mkdir -p out/src/lib
node gen.cjs bundle-v16.11.js out/src
cat > out/src/lib/runtime.js <<'JS'
// Class public-field helper kept from the original build output.
export const __publicField = (obj, key, value) =>
  Object.defineProperty(obj, typeof key !== 'symbol' ? key + '' : key, { enumerable: true, configurable: true, writable: true, value });
JS
prettier --print-width 110 --single-quote --write "out/src/**/*.js" > /dev/null
node postgen.cjs out/src
cd out && NODE_PATH=/home/claude/.npm-global/lib/node_modules /opt/npm-tools/node_modules/@esbuild/linux-x64/bin/esbuild src/main.js --bundle --format=esm --minify --splitting=false --define:process.env.NODE_ENV=\"production\" --outfile=app.js --log-limit=0 2>&1 | grep -E 'ERROR|WARN' -A4 || true
ls -la app.js

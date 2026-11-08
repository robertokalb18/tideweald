const { chromium } = require('playwright');
const fs = require('fs');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.setContent('<canvas id=c></canvas>');
  await p.addScriptTag({ content: fs.readFileSync(__dirname + '/paint.js', 'utf8') });
  const url = await p.evaluate(() => { const c = document.getElementById('c'); window.paintFolio(c); return c.toDataURL('image/png'); });
  fs.writeFileSync(__dirname + '/folio-raw.png', Buffer.from(url.split(',')[1], 'base64'));
  console.log('errors', errs);
  await b.close();
})();

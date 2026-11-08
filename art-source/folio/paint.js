// Tideweald v16.11 "folio" sheet: code-painted sprites in the manner of the
// public-domain catalogues (Bewick, Lindman, Low, von Wright, Bloch & Couch,
// Strutt, Flora Danica, Thorburn, northern house forms). Nothing is traced or
// copied from a scan; every mark below is drawn from code.
// Grid: 8 columns x 5 rows of 256px cells (2048 x 1280).

const CELL = 256, COLS = 8, ROWS = 5;
const INK = '#2b2118';

function rng(seed) {
  let t = seed >>> 0;
  return () => {
    t = Math.imul(t ^ (t >>> 15), 2246822507) ^ Math.imul(t ^ (t >>> 13), 3266489909);
    t ^= t >>> 16;
    return (t >>> 0) / 4294967296;
  };
}

function paintAll(cv) {
  cv.width = CELL * COLS;
  cv.height = CELL * ROWS;
  const g = cv.getContext('2d');
  g.lineJoin = 'round';
  g.lineCap = 'round';
  SPRITES.forEach((fn, i) => {
    g.save();
    g.translate((i % COLS) * CELL, Math.floor(i / COLS) * CELL);
    g.beginPath();
    g.rect(0, 0, CELL, CELL);
    g.clip();
    fn(g, rng(1000 + i * 7919));
    g.restore();
  });
}

// ---------- helpers ----------
const P = (d) => new Path2D(d);
function inked(g, path, fill, lw = 3) {
  if (fill) { g.fillStyle = fill; g.fill(path); }
  g.strokeStyle = INK; g.lineWidth = lw; g.stroke(path);
}
function ell(cx, cy, rx, ry, rot = 0) { const p = new Path2D(); p.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2); return p; }
function within(g, path, fn) { g.save(); g.clip(path); fn(); g.restore(); }
function strokes(g, n, r, color, lw, gen) {
  g.strokeStyle = color; g.lineWidth = lw; g.beginPath();
  for (let i = 0; i < n; i++) gen(g, r, i);
  g.stroke();
}
function shade(g, path, x0, y0, x1, y1, a, b) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, a); gr.addColorStop(1, b);
  g.fillStyle = gr; g.fill(path);
}
function tuft(g, r, x, y, h, color = '#5d7f3a') {
  g.strokeStyle = color; g.lineWidth = 2;
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = -1.1 + i * 0.44 + (r() - 0.5) * 0.3; g.moveTo(x + (i - 2.5) * 2, y); g.quadraticCurveTo(x + Math.sin(a) * h * 0.4, y - h * 0.6, x + Math.sin(a) * h * 0.9, y - h * (0.7 + r() * 0.3)); }
  g.stroke();
}
function groundShadow(g, cx, cy, rx, ry, a = 0.18) {
  g.fillStyle = `rgba(42,50,40,${a})`; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2); g.fill();
}

// iso helpers for houses: (x along ridge, y depth, z up) -> screen
function iso(ox, oy, u) {
  const pt = (x, y, z) => [ox + (x - y) * u, oy + (x + y) * u * 0.5 - z * u];
  const poly = (pts) => { const p = new Path2D(); pts.forEach((q, i) => { const s = pt(...q); i ? p.lineTo(...s) : p.moveTo(...s); }); p.closePath(); return p; };
  // face helper: draw in local (s,t) coords where s runs along e1 and t along e2 (unit = 1 iso unit)
  const face = (g, o, e1, e2, fn) => {
    const a = pt(...o), b = pt(o[0] + e1[0], o[1] + e1[1], o[2] + e1[2]), c = pt(o[0] + e2[0], o[1] + e2[1], o[2] + e2[2]);
    g.save(); g.transform(b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1], a[0], a[1]); fn(); g.restore();
  };
  return { pt, poly, face, u };
}
function grassBase(g, r, I, L, W, pad = 0.7) {
  const base = I.poly([[-pad, -pad, 0], [L + pad, -pad, 0], [L + pad, W + pad, 0], [-pad, W + pad, 0]]);
  g.fillStyle = '#a9bf72'; g.fill(base);
  within(g, base, () => {
    for (let i = 0; i < 70; i++) {
      const [x, y] = I.pt(-pad + r() * (L + 2 * pad), -pad + r() * (W + 2 * pad), 0);
      g.fillStyle = r() < 0.5 ? 'rgba(92,128,56,.55)' : 'rgba(196,206,130,.6)';
      g.fillRect(x, y, 3, 2);
    }
  });
  g.strokeStyle = 'rgba(43,33,24,.55)'; g.lineWidth = 2; g.stroke(base);
  return base;
}

// ---------- 0 boat (faering) ----------
function boat(g, r) {
  groundShadow(g, 128, 190, 92, 14);
  const hull = P('M30 150 Q36 132 48 128 L208 128 Q222 130 228 112 Q236 150 196 176 L64 178 Q34 170 30 150 Z');
  shade(g, hull, 0, 128, 0, 178, '#7a5434', '#4c3220');
  within(g, hull, () => {
    strokes(g, 4, r, 'rgba(30,20,12,.55)', 1.6, (c, _, i) => { const y = 136 + i * 11; c.moveTo(28, y + 6); c.quadraticCurveTo(128, y + 14, 232, y - 6 + i * 2); });
    g.fillStyle = '#a3402c'; g.fillRect(20, 126, 220, 7);
  });
  inked(g, hull, null, 3);
  // stems
  inked(g, P('M30 150 Q22 128 30 104 L36 106 Q32 128 40 146 Z'), '#5e3f26', 2.5);
  inked(g, P('M222 116 Q234 96 230 80 L236 82 Q242 104 228 124 Z'), '#5e3f26', 2.5);
  // thwarts and oars
  g.strokeStyle = INK; g.lineWidth = 2.5;
  g.beginPath(); g.moveTo(92, 128); g.lineTo(98, 120); g.moveTo(150, 128); g.lineTo(156, 120); g.stroke();
  inked(g, P('M60 122 L196 102 L198 107 L62 127 Z'), '#c8a46a', 2);
  inked(g, P('M190 98 Q206 92 218 98 Q206 106 192 106 Z'), '#c8a46a', 2);
  inked(g, P('M76 116 L210 124 L209 129 L75 121 Z'), '#b8935c', 2);
}
// ---------- 1 haystack (stook on pole) ----------
function haystack(g, r) {
  groundShadow(g, 128, 214, 70, 14);
  const stack = P('M58 212 Q50 150 84 108 Q110 80 128 78 Q146 80 172 108 Q206 150 198 212 Z');
  shade(g, stack, 80, 80, 180, 212, '#e5c46e', '#b88c3c');
  within(g, stack, () => {
    strokes(g, 110, r, 'rgba(120,86,30,.55)', 1.6, (c, rr) => { const x = 60 + rr() * 136, y = 90 + rr() * 120; c.moveTo(x, y); c.lineTo(x + (rr() - 0.5) * 10, y + 10 + rr() * 8); });
    strokes(g, 40, r, 'rgba(255,240,190,.6)', 1.4, (c, rr) => { const x = 70 + rr() * 90, y = 96 + rr() * 90; c.moveTo(x, y); c.lineTo(x - 4, y + 12); });
    g.fillStyle = 'rgba(80,56,20,.2)'; g.beginPath(); g.ellipse(170, 170, 40, 60, 0, 0, 7); g.fill();
  });
  inked(g, stack, null, 3);
  // binding rope
  g.strokeStyle = '#6b4a24'; g.lineWidth = 3; g.beginPath(); g.moveTo(66, 160); g.quadraticCurveTo(128, 176, 192, 160); g.stroke();
  inked(g, P('M124 78 L126 44 L132 44 L132 80 Z'), '#7a5a34', 2.5);
  tuft(g, r, 60, 214, 16); tuft(g, r, 196, 214, 14);
}
// ---------- 2 fish-drying rack (hjell) ----------
function hjell(g, r) {
  groundShadow(g, 128, 220, 96, 12);
  g.strokeStyle = INK; g.lineWidth = 3;
  const pole = (x0, y0, x1, y1) => inked(g, P(`M${x0 - 3} ${y0} L${x1 - 3} ${y1} L${x1 + 3} ${y1} L${x0 + 3} ${y0} Z`), '#8a6a42', 2.5);
  pole(40, 218, 64, 70); pole(88, 218, 64, 70); pole(170, 218, 196, 62); pole(222, 218, 196, 62);
  inked(g, P('M50 70 L214 60 L214 67 L50 77 Z'), '#9a774a', 2.5);
  // stockfish pairs
  for (let i = 0; i < 9; i++) {
    const x = 70 + i * 16, y = 70 - i * 0.6;
    for (const s of [-1, 1]) {
      const fx = x + s * 4;
      const fish = P(`M${fx} ${y + 4} Q${fx + s * 6} ${y + 30} ${fx + s * 2} ${y + 62} L${fx + s * 7} ${y + 74} L${fx - s * 3} ${y + 66} Q${fx - s * 4} ${y + 30} ${fx} ${y + 4} Z`);
      shade(g, fish, fx - 6, 0, fx + 6, 0, '#cbbf9c', '#8d7a58');
      g.strokeStyle = INK; g.lineWidth = 1.6; g.stroke(fish);
    }
  }
  tuft(g, r, 40, 220, 14); tuft(g, r, 222, 220, 14);
}
// ---------- 3 angler ----------
function angler(g, r) {
  groundShadow(g, 110, 214, 50, 10);
  // rod & line
  g.strokeStyle = '#5a3d22'; g.lineWidth = 3; g.beginPath(); g.moveTo(118, 150); g.quadraticCurveTo(170, 80, 236, 52); g.stroke();
  g.strokeStyle = 'rgba(43,33,24,.7)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(236, 52); g.quadraticCurveTo(242, 120, 238, 200); g.stroke();
  inked(g, ell(238, 202, 4, 3), '#d8d0b6', 1.5);
  // creel
  inked(g, P('M58 176 L96 176 L92 214 L62 214 Z'), '#b48a52', 2.5);
  within(g, P('M58 176 L96 176 L92 214 L62 214 Z'), () => strokes(g, 6, r, 'rgba(60,40,18,.6)', 1.4, (c, _, i) => { c.moveTo(56, 182 + i * 6); c.lineTo(98, 182 + i * 6); }));
  // body seated on creel side: coat
  const coat = P('M96 120 Q84 150 92 190 L140 190 Q144 150 132 122 Q116 112 96 120 Z');
  shade(g, coat, 90, 120, 140, 190, '#3f6a8a', '#28465e');
  inked(g, coat, null, 3);
  // legs to the bank
  inked(g, P('M100 186 L150 192 L176 214 L164 218 L144 202 L100 200 Z'), '#6a5844', 2.5);
  inked(g, P('M162 212 L184 210 L186 220 L162 220 Z'), '#2b2118', 2);
  // arm and hands
  inked(g, P('M126 132 Q140 140 120 154 L114 148 Q126 140 118 136 Z'), '#33587a', 2.5);
  inked(g, ell(118, 151, 6, 5), '#e2b48c', 2);
  // head + hat
  inked(g, ell(112, 104, 15, 16), '#e2b48c', 2.5);
  inked(g, P('M90 98 Q112 92 136 96 L134 102 Q112 98 92 104 Z'), '#3b2c1e', 2.5);
  inked(g, P('M98 98 Q100 74 114 72 Q128 74 128 96 Z'), '#4b3a28', 2.5);
  g.fillStyle = INK; g.beginPath(); g.arc(119, 106, 1.8, 0, 7); g.fill();
  inked(g, P('M100 112 Q112 128 124 112 Q114 118 100 112 Z'), '#a78c6a', 1.5); // beard
}
// ---------- 4 lobster pots & nets ----------
function pots(g, r) {
  groundShadow(g, 128, 214, 100, 14);
  // net heap
  const net = P('M118 214 Q110 160 160 150 Q214 146 232 214 Z');
  shade(g, net, 120, 150, 230, 214, '#7c6a4c', '#4e412c');
  within(g, net, () => {
    g.strokeStyle = 'rgba(230,214,170,.45)'; g.lineWidth = 1.2; g.beginPath();
    for (let x = 100; x < 240; x += 9) { g.moveTo(x, 140); g.lineTo(x + 40, 220); g.moveTo(x + 40, 140); g.lineTo(x, 220); }
    g.stroke();
  });
  inked(g, net, null, 3);
  for (const [x, y] of [[150, 160], [180, 154], [206, 170], [168, 190]]) inked(g, ell(x, y, 7, 5), '#d9772e', 2);
  // creels
  for (const [x, y, s] of [[36, 214, 1], [80, 210, 0.9]]) {
    const w = 64 * s, h = 52 * s;
    const pot = P(`M${x} ${y} L${x} ${y - h * 0.55} Q${x + w / 2} ${y - h * 1.25} ${x + w} ${y - h * 0.55} L${x + w} ${y} Z`);
    g.fillStyle = 'rgba(140,104,58,.25)'; g.fill(pot);
    g.strokeStyle = '#7a5630'; g.lineWidth = 2.2; g.beginPath();
    for (let i = 1; i < 6; i++) { const xx = x + (w * i) / 6; g.moveTo(xx, y); g.lineTo(xx, y - h * 0.5); }
    for (let i = 1; i < 4; i++) { g.moveTo(x, y - h * 0.55); g.quadraticCurveTo(x + w / 2, y - h * (0.55 + i * 0.22), x + w, y - h * 0.55); }
    g.stroke();
    g.strokeStyle = INK; g.lineWidth = 2.6; g.stroke(pot);
    inked(g, P(`M${x - 2} ${y - 4} L${x + w + 2} ${y - 4} L${x + w + 2} ${y + 2} L${x - 2} ${y + 2} Z`), '#6a4a28', 2);
  }
}
// ---------- 5 rune stone ----------
function runestone(g, r) {
  groundShadow(g, 128, 220, 56, 12);
  const st = P('M84 220 Q76 120 98 68 Q124 34 150 52 Q176 84 172 220 Z');
  shade(g, st, 84, 50, 172, 220, '#c2bfae', '#86847a');
  within(g, st, () => {
    for (let i = 0; i < 26; i++) { g.fillStyle = r() < 0.5 ? 'rgba(232,170,60,.55)' : 'rgba(170,190,90,.5)'; g.beginPath(); g.ellipse(88 + r() * 80, 90 + r() * 120, 3 + r() * 5, 2 + r() * 4, r() * 3, 0, 7); g.fill(); }
    // serpent band
    g.strokeStyle = '#a3402c'; g.lineWidth = 9; g.beginPath(); g.moveTo(96, 210); g.bezierCurveTo(90, 120, 110, 70, 132, 70); g.bezierCurveTo(156, 72, 164, 120, 160, 210); g.stroke();
    g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(91, 210); g.bezierCurveTo(85, 118, 108, 64, 132, 64); g.bezierCurveTo(160, 66, 170, 118, 165, 210); g.moveTo(101, 210); g.bezierCurveTo(96, 124, 113, 76, 132, 76); g.bezierCurveTo(152, 78, 159, 124, 155, 210); g.stroke();
    g.strokeStyle = 'rgba(43,33,24,.75)'; g.lineWidth = 1.3; g.beginPath();
    for (let i = 0; i < 9; i++) { const y = 196 - i * 14; g.moveTo(96 - (i > 5 ? i - 5 : 0), y); g.lineTo(100, y - 6); g.moveTo(158, y); g.lineTo(155 + (i % 2) * 3, y - 6); }
    g.moveTo(124, 120); g.lineTo(132, 100); g.lineTo(140, 120); g.moveTo(128, 112); g.lineTo(136, 112); g.moveTo(132, 128); g.lineTo(132, 168); g.moveTo(124, 140); g.lineTo(140, 140);
    g.stroke();
  });
  inked(g, st, null, 3.2);
  tuft(g, r, 82, 220, 18); tuft(g, r, 172, 220, 16);
}
// ---------- 6 cloudberry ----------
function cloudberry(g, r) {
  for (let i = 0; i < 7; i++) {
    const x = 64 + i * 20 + (r() - 0.5) * 10, y = 196 + (r() - 0.5) * 14;
    g.strokeStyle = '#4d6a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 220); g.lineTo(x, y); g.stroke();
    const leaf = P(`M${x} ${y} q-22 -4 -20 -18 q8 -10 20 -2 q12 -8 20 2 q2 14 -20 18 z`);
    inked(g, leaf, i % 2 ? '#6f9a3a' : '#5d8a32', 2);
    g.strokeStyle = 'rgba(43,60,20,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x, y); g.lineTo(x - 12, y - 12); g.moveTo(x, y); g.lineTo(x + 12, y - 12); g.moveTo(x, y); g.lineTo(x, y - 14); g.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const x = 80 + i * 32, y = 150 - (i % 2) * 14;
    g.strokeStyle = '#4d6a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 200); g.lineTo(x, y + 10); g.stroke();
    if (i % 2) { for (let k = 0; k < 5; k++) { const a = k * 1.256; inked(g, ell(x + Math.cos(a) * 7, y + Math.sin(a) * 7, 6, 4, a), '#fbf6e8', 1.4); } inked(g, ell(x, y, 3, 3), '#e3c040', 1); }
    else { inked(g, ell(x, y + 4, 10, 11), '#e8962e', 2); g.fillStyle = 'rgba(255,230,160,.8)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x - 5 + (k % 3) * 5, y - 1 + Math.floor(k / 3) * 7, 1.6, 0, 7); g.fill(); } }
  }
}
// ---------- 7 cotton grass ----------
function cottongrass(g, r) {
  for (let i = 0; i < 18; i++) {
    const x = 58 + r() * 140, top = 70 + r() * 70;
    g.strokeStyle = i % 3 ? '#6b7f3a' : '#8a8e48'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(x, 222); g.quadraticCurveTo(x + (r() - 0.5) * 18, (222 + top) / 2, x + (r() - 0.5) * 10, top); g.stroke();
  }
  for (let i = 0; i < 9; i++) {
    const x = 66 + i * 15 + (r() - 0.5) * 8, top = 74 + r() * 60;
    g.strokeStyle = '#5b6a30'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 222); g.quadraticCurveTo(x + 4, 160, x + (r() - 0.5) * 6, top + 12); g.stroke();
    const head = P(`M${x - 2} ${top + 14} q-16 -6 -12 -22 q2 -12 14 -12 q12 0 14 12 q4 16 -12 22 z`);
    g.fillStyle = '#fbf8ee'; g.fill(head);
    g.strokeStyle = 'rgba(120,110,90,.6)'; g.lineWidth = 1.2; g.beginPath(); for (let k = 0; k < 7; k++) { g.moveTo(x, top + 12); g.lineTo(x - 12 + k * 4, top - 6 + (k % 2) * 4); } g.stroke();
    g.strokeStyle = INK; g.lineWidth = 1.8; g.stroke(head);
  }
  for (let i = 0; i < 6; i++) tuft(g, r, 60 + i * 26, 222, 26, '#7a8a3a');
}
// ---------- 8 thrift / sea pink ----------
function thrift(g, r) {
  const cushion = P('M44 220 Q40 186 80 178 Q128 168 176 178 Q216 186 212 220 Z');
  inked(g, cushion, '#6f8a46', 2.5);
  within(g, cushion, () => strokes(g, 90, r, 'rgba(40,64,24,.6)', 1.4, (c, rr) => { const x = 44 + rr() * 170, y = 176 + rr() * 46; c.moveTo(x, y + 8); c.lineTo(x + (rr() - 0.5) * 6, y - 6); }));
  for (let i = 0; i < 11; i++) {
    const x = 62 + i * 13 + (r() - 0.5) * 6, y = 92 + r() * 70;
    g.strokeStyle = '#6a7a3a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x, 182); g.quadraticCurveTo(x + 3, (182 + y) / 2, x + (r() - 0.5) * 4, y); g.stroke();
    inked(g, ell(x, y, 10, 9), i % 3 ? '#e58fb0' : '#d6729a', 1.8);
    g.fillStyle = 'rgba(255,220,235,.85)'; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x - 5 + r() * 10, y - 5 + r() * 8, 1.6, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(140,40,80,.5)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x - 5 + r() * 10, y - 2 + r() * 8, 1.3, 0, 7); g.fill(); }
  }
}
// ---------- 9 harebell & buttercup meadow ----------
function harebell(g, r) {
  for (let i = 0; i < 5; i++) tuft(g, r, 60 + i * 34, 222, 30, '#5d8a32');
  for (let i = 0; i < 7; i++) {
    const x = 64 + i * 21 + (r() - 0.5) * 8, y = 96 + r() * 50;
    g.strokeStyle = '#4a6a2a'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x, 222); g.quadraticCurveTo(x - 6, 150, x + 4, y); g.quadraticCurveTo(x + 12, y - 4, x + 14, y + 8); g.stroke();
    const bell = P(`M${x + 8} ${y + 8} q6 -2 12 0 l4 18 q-10 4 -20 0 z`);
    inked(g, bell, '#6f86d6', 1.8);
    g.strokeStyle = 'rgba(40,40,110,.6)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 14, y + 8); g.lineTo(x + 14, y + 24); g.stroke();
  }
  for (let i = 0; i < 6; i++) {
    const x = 74 + i * 22 + (r() - 0.5) * 10, y = 130 + r() * 50;
    g.strokeStyle = '#4a6a2a'; g.lineWidth = 1.8; g.beginPath(); g.moveTo(x, 222); g.lineTo(x + (r() - 0.5) * 8, y); g.stroke();
    for (let k = 0; k < 5; k++) { const a = k * 1.256 - 1.57; inked(g, ell(x + Math.cos(a) * 6, y + Math.sin(a) * 6, 5.5, 4.5, a), '#f2c832', 1.3); }
    inked(g, ell(x, y, 3, 3), '#c8901e', 1);
  }
}
// ---------- 10 fireweed ----------
function fireweed(g, r) {
  for (let i = 0; i < 6; i++) {
    const x = 70 + i * 24 + (r() - 0.5) * 10, top = 34 + r() * 40;
    g.strokeStyle = '#7a4a42'; g.lineWidth = 2.6; g.beginPath(); g.moveTo(x, 224); g.quadraticCurveTo(x + (r() - 0.5) * 10, 140, x, top); g.stroke();
    for (let k = 0; k < 6; k++) { const y = 210 - k * 18; const s = k % 2 ? 1 : -1; inked(g, P(`M${x} ${y} q${s * 14} -10 ${s * 26} -2 q${-s * 12} 8 ${-s * 26} 2 z`), '#5d8034', 1.4); }
    for (let k = 0; k < 9; k++) { const y = top + 6 + k * 9, w = 4 + k * 0.6; inked(g, ell(x + (k % 2 ? w : -w), y, 5 + k * 0.2, 4), k < 3 ? '#c96a9e' : '#e07ab6', 1.3); }
  }
  for (let i = 0; i < 4; i++) tuft(g, r, 64 + i * 42, 224, 24);
}
// ---------- 11 lingonberry ----------
function lingonberry(g, r) {
  const mound = P('M40 222 Q40 170 84 160 Q130 140 176 160 Q218 172 216 222 Z');
  inked(g, mound, '#3f6a34', 2.5);
  within(g, mound, () => {
    for (let i = 0; i < 160; i++) { const x = 40 + r() * 178, y = 150 + r() * 74; g.fillStyle = r() < 0.5 ? '#5e9440' : '#2e5428'; g.beginPath(); g.ellipse(x, y, 5, 3, r() * 3, 0, 7); g.fill(); }
    g.strokeStyle = 'rgba(240,250,210,.35)'; g.lineWidth = 1; g.beginPath(); for (let i = 0; i < 40; i++) { const x = 50 + r() * 160, y = 160 + r() * 50; g.moveTo(x, y); g.lineTo(x + 3, y - 1); } g.stroke();
  });
  inked(g, mound, null, 2.5);
  for (let i = 0; i < 16; i++) { const x = 60 + r() * 140, y = 164 + r() * 44; inked(g, ell(x, y, 5, 5), '#c8282c', 1.3); g.fillStyle = 'rgba(255,220,220,.8)'; g.beginPath(); g.arc(x - 1.5, y - 1.5, 1.4, 0, 7); g.fill(); }
}
// ---------- 12 bladderwrack ----------
function wrack(g, r) {
  const sand = P('M18 214 Q60 188 128 190 Q200 188 238 212 Q200 226 128 226 Q56 228 18 214 Z');
  g.fillStyle = 'rgba(120,104,70,.35)'; g.fill(sand);
  const strand = (x0, y0, dir, len, depth) => {
    const pts = [];
    let x = x0, y = y0, a = dir;
    for (let i = 0; i < 4; i++) { const nx = x + Math.cos(a) * len, ny = y + Math.sin(a) * len * 0.45; pts.push([x, y, nx, ny]); x = nx; y = ny; a += (r() - 0.5) * 0.9; }
    for (const [ax, ay, bx, by] of pts) { g.strokeStyle = INK; g.lineWidth = 13; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); }
    for (const [ax, ay, bx, by] of pts) { g.strokeStyle = depth ? '#6f5e26' : '#8a7834'; g.lineWidth = 9; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); }
    for (const [ax, ay, bx, by] of pts) { g.strokeStyle = 'rgba(50,40,10,.75)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(ax, ay); g.lineTo(bx, by); g.stroke(); if (r() < 0.45) { inked(g, ell((ax + bx) / 2 + 5, (ay + by) / 2 - 4, 3.6, 2.8), '#a89848', 1.1); inked(g, ell((ax + bx) / 2 - 5, (ay + by) / 2 + 4, 3.6, 2.8), '#a89848', 1.1); } }
    return [x, y];
  };
  for (let i = 0; i < 7; i++) {
    const x0 = 60 + i * 22, y0 = 208 - (i % 3) * 6;
    const [x, y] = strand(x0, y0, -0.25 + (r() - 0.5) * 0.8 + (i % 2 ? 0 : Math.PI), 11 + r() * 5, i % 2);
    if (i % 2) strand(x, y, -1.2 + r(), 10, 0);
  }
  g.strokeStyle = 'rgba(214,226,204,.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(16, 222); g.quadraticCurveTo(128, 232, 240, 220); g.stroke();
}
// ---------- 13 sea kale ----------
function seakale(g, r) {
  for (let i = 0; i < 7; i++) {
    const a = -2.7 + i * 0.4, x = 128 + Math.cos(a) * 70, y = 200 + Math.sin(a) * 60;
    const leaf = P(`M128 214 Q${(128 + x) / 2 - 16} ${(214 + y) / 2 - 10} ${x} ${y} q12 4 16 16 q-6 8 -2 16 q-12 4 -16 14 Q${(128 + x) / 2 + 10} ${(214 + y) / 2 + 12} 128 214 Z`);
    shade(g, leaf, 128, 214, x, y, '#86aab0', '#a9c8c6');
    g.strokeStyle = INK; g.lineWidth = 2; g.stroke(leaf);
    g.strokeStyle = 'rgba(40,70,74,.6)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(128, 214); g.lineTo(x + 4, y + 8); g.stroke();
  }
  for (let i = 0; i < 4; i++) {
    const x = 100 + i * 18, y = 96 + (i % 2) * 14;
    g.strokeStyle = '#5a7a6a'; g.lineWidth = 2; g.beginPath(); g.moveTo(128, 180); g.lineTo(x, y + 10); g.stroke();
    for (let k = 0; k < 7; k++) inked(g, ell(x - 10 + r() * 20, y - 6 + r() * 16, 4.5, 4), '#fbf7ea', 1.1);
  }
}
// ---------- 14 lichen boulder ----------
function lichenRock(g, r) {
  groundShadow(g, 128, 214, 96, 14);
  const rocks = [P('M40 214 Q36 160 80 140 Q120 128 150 150 Q170 170 166 214 Z'), P('M140 214 Q138 176 170 166 Q206 160 220 186 Q226 204 218 214 Z')];
  for (const rk of rocks) {
    shade(g, rk, 60, 130, 200, 214, '#cfcbbb', '#8e8b80');
    within(g, rk, () => {
      for (let i = 0; i < 18; i++) {
        const x = 46 + r() * 172, y = 140 + r() * 70, rr = 4 + r() * 9;
        g.fillStyle = i % 3 === 0 ? '#e0a032' : i % 3 === 1 ? '#c7cf6a' : '#e9e4d4';
        g.beginPath(); for (let k = 0; k < 9; k++) { const a = k * 0.7, d = rr * (0.6 + r() * 0.5); k ? g.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.7) : g.moveTo(x + d, y); } g.closePath(); g.fill();
      }
      g.strokeStyle = 'rgba(43,33,24,.35)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(70, 160); g.lineTo(96, 176); g.lineTo(92, 196); g.moveTo(180, 180); g.lineTo(196, 196); g.stroke();
    });
    inked(g, rk, null, 3);
  }
  tuft(g, r, 36, 216, 16); tuft(g, r, 128, 216, 12); tuft(g, r, 222, 216, 14);
}
// ---------- 15 ancient oak (Strutt) ----------
function greatOak(g, r) {
  groundShadow(g, 128, 236, 110, 16, 0.22);
  const trunk = P('M98 236 Q104 200 102 170 Q90 150 70 140 L78 132 Q100 140 110 150 Q112 120 104 100 L120 98 Q126 128 128 146 Q140 124 162 112 L168 120 Q148 136 146 160 Q144 200 160 236 Z');
  shade(g, trunk, 96, 0, 166, 0, '#6e5236', '#3e2c1c');
  within(g, trunk, () => {
    strokes(g, 30, r, 'rgba(24,14,6,.55)', 1.6, (c, rr) => { const x = 98 + rr() * 64, y = 150 + rr() * 86; c.moveTo(x, y); c.quadraticCurveTo(x + 3, y + 10, x - 2, y + 24); });
    inked(g, ell(132, 196, 8, 12), '#2b1c10', 1.5);
  });
  inked(g, trunk, null, 3);
  // roots
  inked(g, P('M98 236 Q84 228 70 236 Z'), '#4e3824', 2); inked(g, P('M160 236 Q176 226 192 236 Z'), '#4e3824', 2);
  // crown: many lobes
  const lobes = [[128, 66, 44], [80, 84, 38], [176, 80, 40], [52, 116, 30], [206, 112, 32], [104, 104, 36], [152, 104, 38], [128, 40, 30], [92, 50, 28], [166, 48, 28]];
  for (const [x, y, rr] of lobes) { const p = ell(x, y, rr, rr * 0.82); g.fillStyle = '#3f6a2c'; g.fill(p); g.strokeStyle = INK; g.lineWidth = 3; g.stroke(p); }
  for (const [x, y, rr] of lobes) {
    const p = ell(x, y, rr - 2, rr * 0.82 - 2); g.fillStyle = '#4f7c34'; g.fill(p);
    within(g, p, () => { for (let i = 0; i < 40; i++) { g.fillStyle = r() < 0.55 ? 'rgba(130,170,70,.75)' : 'rgba(34,60,24,.55)'; g.beginPath(); g.ellipse(x - rr + r() * rr * 2, y - rr + r() * rr * 1.4, 5, 3.5, r() * 3, 0, 7); g.fill(); } });
  }
}
// ---------- 16 ancient yew ----------
function greatYew(g, r) {
  groundShadow(g, 128, 236, 100, 15, 0.22);
  const trunk = P('M96 236 Q104 190 100 150 L120 146 Q118 190 124 196 Q130 170 136 146 L156 150 Q150 196 162 236 Z');
  shade(g, trunk, 96, 0, 162, 0, '#a05a3a', '#5e301e');
  within(g, trunk, () => strokes(g, 12, r, 'rgba(40,16,8,.6)', 2, (c, rr, i) => { const x = 98 + i * 5.5; c.moveTo(x, 236); c.quadraticCurveTo(x + (rr() - 0.5) * 8, 190, x + 3, 146); }));
  inked(g, trunk, null, 3);
  const crown = P('M28 160 Q20 108 60 84 Q70 40 120 30 Q176 26 196 70 Q238 92 230 150 Q220 176 170 170 Q128 182 86 172 Q36 182 28 160 Z');
  inked(g, crown, '#24402a', 3.2);
  within(g, crown, () => {
    for (let i = 0; i < 260; i++) { const x = 24 + r() * 210, y = 26 + r() * 156; g.fillStyle = r() < 0.4 ? 'rgba(72,110,64,.8)' : 'rgba(14,30,18,.55)'; g.beginPath(); g.ellipse(x, y, 6, 2.6, -0.5 + r(), 0, 7); g.fill(); }
    for (let i = 0; i < 14; i++) { g.fillStyle = '#d63a3a'; g.beginPath(); g.arc(40 + r() * 180, 60 + r() * 100, 2.4, 0, 7); g.fill(); }
  });
  inked(g, crown, null, 3.2);
}
// ---------- quadruped helper (facing right) ----------
function legs(g, xs, top, bottom, color, w = 7) {
  for (const x of xs) inked(g, P(`M${x - w / 2} ${top} L${x - w / 2 + 1} ${bottom} L${x + w / 2 + 1} ${bottom} L${x + w / 2} ${top} Z`), color, 2.2);
}
// ---------- 17 Shetland pony ----------
function pony(g, r) {
  legs(g, [78, 96, 152, 168], 150, 210, '#5a3a22', 11);
  for (const x of [78, 96, 152, 168]) inked(g, P(`M${x - 6} 204 L${x + 7} 204 L${x + 7} 212 L${x - 6} 212 Z`), '#2b2118', 1.6);
  const body = P('M60 132 Q58 104 92 100 L156 98 Q180 98 184 118 Q186 150 166 158 L84 160 Q60 156 60 132 Z');
  shade(g, body, 60, 98, 60, 160, '#8a5634', '#5c361e');
  within(g, body, () => strokes(g, 70, r, 'rgba(40,20,8,.45)', 1.5, (c, rr) => { const x = 60 + rr() * 126, y = 100 + rr() * 58; c.moveTo(x, y); c.lineTo(x + 4, y + 7); }));
  inked(g, body, null, 3);
  const neck = P('M160 110 Q170 76 192 64 L210 74 Q214 96 186 124 Z');
  inked(g, neck, '#7a4a2c', 3);
  const head = P('M190 62 Q206 56 224 76 Q236 92 228 100 Q218 104 206 94 Q194 86 186 74 Z');
  inked(g, head, '#7a4a2c', 3);
  g.fillStyle = INK; g.beginPath(); g.arc(205, 75, 2.2, 0, 7); g.fill(); g.beginPath(); g.arc(226, 96, 1.6, 0, 7); g.fill();
  inked(g, P('M192 62 L194 48 L202 60 Z'), '#7a4a2c', 2);
  // shaggy mane, forelock and tail
  inked(g, P('M156 104 Q160 74 184 56 Q200 52 206 62 Q190 64 182 80 Q174 100 170 120 Q162 116 156 104 Z'), '#2e1e12', 2.2);
  inked(g, P('M200 60 Q214 58 214 72 Q206 68 200 70 Z'), '#2e1e12', 1.8);
  inked(g, P('M60 116 Q38 126 42 176 Q48 186 56 176 Q54 140 66 124 Z'), '#2e1e12', 2.2);
}
// ---------- 18 Highland cow ----------
function highland(g, r) {
  legs(g, [62, 84, 158, 178], 156, 212, '#7a3e1c', 14);
  for (const x of [62, 84, 158, 178]) inked(g, P(`M${x - 7} 206 L${x + 8} 206 L${x + 8} 214 L${x - 7} 214 Z`), '#2b2118', 1.6);
  const body = P('M42 140 Q36 100 76 92 L166 90 Q198 92 200 124 Q202 160 176 168 L70 170 Q44 166 42 140 Z');
  shade(g, body, 40, 90, 40, 170, '#d0783a', '#9a4c22');
  within(g, body, () => {
    strokes(g, 140, r, 'rgba(90,36,10,.55)', 2, (c, rr) => { const x = 40 + rr() * 160, y = 92 + rr() * 78; c.moveTo(x, y); c.bezierCurveTo(x + 4, y + 6, x - 3, y + 12, x + 2, y + 18); });
    strokes(g, 50, r, 'rgba(250,200,140,.5)', 1.5, (c, rr) => { const x = 50 + rr() * 140, y = 96 + rr() * 50; c.moveTo(x, y); c.lineTo(x + 2, y + 12); });
  });
  inked(g, body, null, 3);
  // shaggy skirt
  inked(g, P('M46 160 L54 176 L60 164 L68 178 L76 164 L150 166 L158 180 L166 166 L176 180 L184 164 L190 156 Q120 176 46 160 Z'), '#b35e2c', 2);
  const head = P('M186 104 Q208 92 226 108 Q238 128 232 146 Q224 154 210 150 Q194 140 186 124 Z');
  inked(g, head, '#c06a32', 3);
  // fringe over eyes
  inked(g, P('M188 104 Q200 88 222 98 Q228 112 216 120 Q212 110 204 116 Q200 106 194 118 Q190 112 188 104 Z'), '#e08a46', 2);
  inked(g, ell(230, 144, 7, 6), '#d89a7a', 2);
  // horns
  inked(g, P('M196 96 Q172 84 168 60 Q176 58 178 66 Q182 84 202 92 Z'), '#e9dcc0', 2.2);
  inked(g, P('M218 98 Q240 84 244 60 Q236 58 234 66 Q228 84 212 92 Z'), '#e9dcc0', 2.2);
  inked(g, P('M42 124 Q28 140 34 170 L40 168 Q38 146 48 132 Z'), '#9a4c22', 2);
}
// ---------- sheep body helper ----------
function sheepBody(g, r, fleece, face, curl) {
  legs(g, [74, 92, 150, 166], 150, 210, face, 8);
  const body = P('M48 128 Q44 92 90 88 Q120 76 150 88 Q194 90 192 126 Q194 160 160 162 Q120 170 84 162 Q48 160 48 128 Z');
  g.fillStyle = fleece; g.fill(body);
  within(g, body, () => {
    for (let i = 0; i < 90; i++) { const x = 46 + r() * 150, y = 84 + r() * 80; g.strokeStyle = curl; g.lineWidth = 1.6; g.beginPath(); g.arc(x, y, 3 + r() * 3, r() * 3, r() * 3 + 4); g.stroke(); }
  });
  g.strokeStyle = INK; g.lineWidth = 3; g.stroke(body);
}
// ---------- 19 Shetland sheep (moorit) ----------
function shetlandSheep(g, r) {
  sheepBody(g, r, '#9a6a42', '#4a3020', 'rgba(60,36,18,.6)');
  const head = P('M182 104 Q200 88 222 100 Q232 116 224 128 Q214 134 200 126 Q188 118 182 104 Z');
  inked(g, head, '#7a5234', 3);
  inked(g, P('M190 96 Q178 82 190 76 Q204 80 200 96 Z'), '#7a5234', 2);
  inked(g, P('M196 94 Q212 74 228 84 Q234 100 222 104 Q222 92 210 92 Q204 98 196 94 Z'), '#e2d2b0', 2); // curled horn
  g.fillStyle = INK; g.beginPath(); g.arc(210, 108, 2, 0, 7); g.fill();
}
// ---------- 20 black-faced sheep ----------
function blackfaceSheep(g, r) {
  sheepBody(g, r, '#ece4d0', '#2b2118', 'rgba(120,108,84,.5)');
  const head = P('M182 104 Q200 88 222 100 Q234 118 226 130 Q214 136 200 126 Q188 118 182 104 Z');
  inked(g, head, '#2e2620', 3);
  g.fillStyle = '#eee'; g.beginPath(); g.arc(210, 108, 2.2, 0, 7); g.fill();
  inked(g, P('M186 96 Q170 92 168 104 Q178 104 186 104 Z'), '#2e2620', 2);
  inked(g, P('M196 92 Q214 70 232 82 Q236 100 224 104 Q224 90 212 90 Q206 98 196 92 Z'), '#d6c6a4', 2);
}
// ---------- 21 eider drake swimming ----------
function eider(g, r) {
  g.fillStyle = 'rgba(214,230,214,.55)'; g.beginPath(); g.ellipse(124, 176, 92, 12, 0, 0, 7); g.fill();
  const body = P('M40 160 Q44 128 96 122 L160 120 Q196 120 200 150 Q196 172 160 176 L66 176 Q40 172 40 160 Z');
  g.fillStyle = '#f4f0e4'; g.fill(body);
  within(g, body, () => {
    g.fillStyle = '#26221e'; g.beginPath(); g.moveTo(30, 152); g.quadraticCurveTo(120, 164, 210, 148); g.lineTo(210, 190); g.lineTo(30, 190); g.closePath(); g.fill();
    g.fillStyle = '#26221e'; g.beginPath(); g.ellipse(58, 150, 22, 18, 0, 0, 7); g.fill();
    g.fillStyle = 'rgba(240,220,190,.7)'; g.beginPath(); g.ellipse(170, 132, 20, 10, 0, 0, 7); g.fill();
  });
  inked(g, body, null, 3);
  const head = P('M168 126 Q170 96 190 88 Q210 86 214 104 L240 118 Q236 124 218 124 Q206 132 188 132 Z');
  g.fillStyle = '#f4f0e4'; g.fill(head);
  within(g, head, () => {
    g.fillStyle = '#26221e'; g.beginPath(); g.ellipse(196, 94, 18, 7, 0.1, 0, 7); g.fill();
    g.fillStyle = '#9cc79a'; g.beginPath(); g.ellipse(184, 116, 14, 7, 0.4, 0, 7); g.fill();
  });
  inked(g, head, null, 3);
  inked(g, P('M212 104 L242 118 Q236 126 214 120 Z'), '#a8b46a', 2);
  g.fillStyle = INK; g.beginPath(); g.arc(206, 104, 2, 0, 7); g.fill();
  g.strokeStyle = 'rgba(43,60,58,.6)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(34, 182); g.quadraticCurveTo(60, 176, 86, 182); g.moveTo(170, 182); g.quadraticCurveTo(196, 176, 220, 182); g.stroke();
}
// ---------- gull ----------
function gull(g, r, up) {
  const body = P('M72 132 Q100 118 150 120 Q180 122 196 128 Q180 140 150 142 Q100 144 72 132 Z');
  const m = (y) => up ? y : 256 - y;
  const wingL = P(`M108 ${m(128)} C100 ${m(100)} 82 ${m(70)} 58 ${m(40)} C92 ${m(56)} 130 ${m(86)} 146 ${m(126)} Z`);
  const wingR = P(`M134 ${m(126)} C152 ${m(96)} 178 ${m(64)} 214 ${m(34)} C202 ${m(70)} 180 ${m(102)} 162 ${m(130)} Z`);
  for (const [w, tx, ty] of [[wingL, 62, m(44)], [wingR, 208, m(38)]]) {
    shade(g, w, 0, m(40), 0, m(128), '#a6b2b8', '#e2e7e8');
    within(g, w, () => { g.fillStyle = '#26221e'; g.beginPath(); g.ellipse(tx, ty, 16, 12, 0, 0, 7); g.fill(); g.fillStyle = '#f6f3ec'; g.beginPath(); g.arc(tx + 2, ty + (up ? 4 : -4), 2.5, 0, 7); g.fill(); });
    inked(g, w, null, 2.6);
  }
  inked(g, body, '#f6f3ec', 2.8);
  inked(g, P('M190 126 Q206 118 214 124 Q206 132 192 134 Z'), '#f6f3ec', 2.4);
  inked(g, P('M212 122 L228 126 L212 130 Z'), '#e8c040', 1.6);
  g.fillStyle = INK; g.beginPath(); g.arc(204, 124, 1.8, 0, 7); g.fill();
  inked(g, P('M74 132 L54 126 L58 138 Z'), '#f6f3ec', 2.2);
}
function gullUp(g, r) { gull(g, r, true); }
function gullDown(g, r) { gull(g, r, false); }
// ---------- 24 crane ----------
function crane(g, r) {
  g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(112, 158); g.lineTo(108, 226); g.moveTo(128, 158); g.lineTo(134, 226); g.stroke();
  g.strokeStyle = '#3b3a36'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(100, 226); g.lineTo(116, 226); g.moveTo(126, 226); g.lineTo(142, 226); g.stroke();
  const body = P('M70 120 Q76 96 120 94 Q156 96 160 120 Q156 150 120 160 Q84 158 70 120 Z');
  shade(g, body, 70, 94, 160, 160, '#c3c7c4', '#8f9590');
  inked(g, body, null, 3);
  // bustle of tail feathers
  inked(g, P('M74 112 Q42 118 30 150 Q50 140 56 156 Q66 136 80 140 Z'), '#4a4844', 2.4);
  const neck = P('M146 104 Q160 70 156 46 Q158 30 172 28 L180 34 Q170 44 172 60 Q174 90 158 116 Z');
  inked(g, neck, '#2e2c2a', 2.8);
  inked(g, P('M160 56 Q156 74 160 92 Q166 74 168 56 Z'), '#f2f0e8', 1.6);
  inked(g, P('M168 28 Q182 22 190 30 L224 44 L188 40 Q178 42 170 38 Z'), '#2e2c2a', 2.4);
  inked(g, P('M188 34 L226 44 L188 42 Z'), '#5a5248', 1.6);
  inked(g, ell(176, 26, 6, 3.5), '#c8322a', 1.4);
  g.fillStyle = '#e8d070'; g.beginPath(); g.arc(182, 33, 1.8, 0, 7); g.fill();
}
// ---------- 25 sea eagle soaring ----------
function seaEagle(g, r) {
  const wing = P('M20 120 Q60 92 108 104 L128 112 L148 104 Q196 92 236 120 Q226 126 220 122 Q216 132 206 128 Q200 136 190 130 Q160 132 140 132 L116 132 Q96 132 66 130 Q56 136 50 128 Q40 132 36 122 Q30 126 20 120 Z');
  shade(g, wing, 0, 92, 0, 136, '#7a5a3a', '#4a3424');
  within(g, wing, () => strokes(g, 30, r, 'rgba(240,220,180,.35)', 1.4, (c, rr) => { const x = 24 + rr() * 210, y = 104 + rr() * 22; c.moveTo(x, y); c.lineTo(x + (x < 128 ? -6 : 6), y + 10); }));
  inked(g, wing, null, 2.8);
  inked(g, P('M110 112 Q128 98 146 112 Q150 136 128 144 Q106 136 110 112 Z'), '#5a3e28', 2.6);
  inked(g, P('M114 140 L142 140 L148 166 L108 166 Z'), '#f4f0e4', 2.4);
  inked(g, P('M118 100 Q128 82 138 100 Z'), '#d8c49a', 2.2);
  inked(g, P('M124 86 L132 86 L128 78 Z'), '#e8c040', 1.4);
}
// ---------- 26 grey seal ----------
function seal(g, r) {
  const body = P('M30 186 Q34 160 76 150 Q132 136 176 128 Q206 120 220 134 Q228 150 214 162 Q190 176 150 186 Q90 200 30 186 Z');
  shade(g, body, 0, 120, 0, 200, '#8f9796', '#5c6463');
  within(g, body, () => { for (let i = 0; i < 30; i++) { g.fillStyle = r() < 0.5 ? 'rgba(40,46,46,.55)' : 'rgba(210,214,206,.5)'; g.beginPath(); g.ellipse(40 + r() * 180, 140 + r() * 50, 5, 3, r() * 3, 0, 7); g.fill(); } g.fillStyle = 'rgba(230,230,220,.45)'; g.beginPath(); g.ellipse(120, 186, 70, 10, -0.1, 0, 7); g.fill(); });
  inked(g, body, null, 3);
  inked(g, P('M30 186 Q14 170 10 156 Q22 160 30 170 Q30 156 22 146 Q38 152 40 172 Z'), '#6a7271', 2.2);
  inked(g, P('M150 176 Q160 198 182 196 Q172 184 166 172 Z'), '#6a7271', 2.2);
  g.fillStyle = INK; g.beginPath(); g.arc(206, 136, 3, 0, 7); g.fill(); g.beginPath(); g.arc(222, 146, 2, 0, 7); g.fill();
  g.strokeStyle = 'rgba(43,33,24,.7)'; g.lineWidth = 1; g.beginPath(); for (let k = 0; k < 3; k++) { g.moveTo(222, 148); g.lineTo(240, 144 + k * 5); } g.stroke();
}
// ---------- 27 hare sitting ----------
function hare(g, r) {
  const body = P('M74 210 Q60 170 86 144 Q112 124 142 134 Q170 146 168 186 Q166 206 150 212 Z');
  shade(g, body, 70, 124, 170, 212, '#b88a5a', '#82603c');
  within(g, body, () => strokes(g, 60, r, 'rgba(60,40,20,.5)', 1.4, (c, rr) => { const x = 66 + rr() * 104, y = 130 + rr() * 80; c.moveTo(x, y); c.lineTo(x + 3, y + 6); }));
  inked(g, body, null, 3);
  inked(g, P('M136 210 Q140 196 168 200 Q176 208 170 214 L138 214 Z'), '#9a7048', 2.4);
  const head = P('M146 120 Q150 96 172 94 Q192 96 196 116 Q194 132 176 136 Q154 136 146 120 Z');
  inked(g, head, '#a87c4e', 3);
  for (const [x, a] of [[160, -0.25], [172, 0.05]]) { const ear = P(`M${x} 100 Q${x - 16 + a * 40} 50 ${x - 6 + a * 60} 30 Q${x + 4 + a * 60} 44 ${x + 10} 98 Z`); inked(g, ear, '#a87c4e', 2.4); within(g, ear, () => { g.fillStyle = '#2b2118'; g.beginPath(); g.ellipse(x - 6 + a * 60, 34, 7, 8, 0, 0, 7); g.fill(); }); g.strokeStyle = INK; g.lineWidth = 2.4; g.stroke(ear); }
  inked(g, ell(178, 112, 4, 4), '#e8c060', 1.4);
  g.fillStyle = INK; g.beginPath(); g.arc(179, 112, 2, 0, 7); g.fill();
  inked(g, ell(72, 184, 10, 9), '#f2ece0', 2);
}
// ---------- 28 red deer stag ----------
function stag(g, r) {
  legs(g, [76, 92, 156, 170], 140, 214, '#6a3e22', 8);
  const body = P('M56 128 Q54 100 90 96 L156 94 Q182 96 186 118 Q186 146 166 150 L82 152 Q56 150 56 128 Z');
  shade(g, body, 56, 94, 56, 152, '#9a5a32', '#6a3a1e');
  within(g, body, () => { g.fillStyle = 'rgba(232,206,160,.8)'; g.beginPath(); g.ellipse(58, 118, 12, 18, 0, 0, 7); g.fill(); });
  inked(g, body, null, 3);
  inked(g, P('M162 104 Q172 70 186 58 L204 66 Q198 92 184 118 Z'), '#7a4626', 3);
  inked(g, P('M162 104 Q170 116 168 130 Q178 114 186 100 Z'), '#5a3018', 2);
  const head = P('M184 58 Q198 48 218 64 Q232 76 228 84 Q218 88 206 80 Q194 76 184 68 Z');
  inked(g, head, '#8a5030', 3);
  g.fillStyle = INK; g.beginPath(); g.arc(204, 64, 2.2, 0, 7); g.fill(); g.beginPath(); g.arc(226, 82, 1.8, 0, 7); g.fill();
  inked(g, P('M186 56 L178 44 L194 52 Z'), '#8a5030', 2);
  g.strokeStyle = '#d8c49a'; g.lineWidth = 4.5;
  const ant = (s) => { g.beginPath(); g.moveTo(194, 52); g.bezierCurveTo(186, 30, 170 + s * 6, 14, 176 + s * 10, 2); g.moveTo(188, 40); g.lineTo(208 + s * 4, 34); g.moveTo(182, 28); g.lineTo(200 + s * 4, 18); g.moveTo(178, 16); g.lineTo(166, 6); g.stroke(); };
  g.save(); g.strokeStyle = INK; g.lineWidth = 7.5; ant(0); g.restore(); ant(0);
  g.save(); g.translate(10, 2); g.strokeStyle = INK; g.lineWidth = 7.5; ant(1); g.restore(); g.save(); g.translate(10, 2); ant(1); g.restore();
}
// ---------- fish (top-down, head up) ----------
function fishTop(g, r, o) {
  const { len, wid, back, belly, mark } = o;
  const cx = 128, top = 128 - len / 2, bot = 128 + len / 2;
  const body = P(`M${cx} ${top} Q${cx + wid} ${top + len * 0.22} ${cx + wid * 0.8} ${top + len * 0.5} Q${cx + wid * 0.5} ${top + len * 0.78} ${cx + 4} ${bot - 18} L${cx - 4} ${bot - 18} Q${cx - wid * 0.5} ${top + len * 0.78} ${cx - wid * 0.8} ${top + len * 0.5} Q${cx - wid} ${top + len * 0.22} ${cx} ${top} Z`);
  inked(g, P(`M${cx - 4} ${bot - 24} L${cx - 24} ${bot + 4} Q${cx} ${bot - 8} ${cx + 24} ${bot + 4} L${cx + 4} ${bot - 24} Z`), back, 2.4);
  inked(g, P(`M${cx - wid * 0.7} ${top + len * 0.3} L${cx - wid * 1.6} ${top + len * 0.42} L${cx - wid * 0.7} ${top + len * 0.44} Z`), belly, 2);
  inked(g, P(`M${cx + wid * 0.7} ${top + len * 0.3} L${cx + wid * 1.6} ${top + len * 0.42} L${cx + wid * 0.7} ${top + len * 0.44} Z`), belly, 2);
  shade(g, body, cx - wid, 0, cx + wid, 0, belly, belly);
  within(g, body, () => {
    g.fillStyle = back; g.beginPath(); g.ellipse(cx, 128, wid * 0.42, len * 0.46, 0, 0, 7); g.fill();
    mark(g, r, cx, top, len, wid);
  });
  inked(g, body, null, 2.8);
  g.fillStyle = INK; g.beginPath(); g.arc(cx - wid * 0.42, top + len * 0.12, 2.4, 0, 7); g.arc(cx + wid * 0.42, top + len * 0.12, 2.4, 0, 7); g.fill();
}
function herring(g, r) { fishTop(g, r, { len: 170, wid: 22, back: '#4e7a8a', belly: '#d8e2e0', mark: (c) => { c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(128, 60); c.lineTo(128, 190); c.stroke(); } }); }
function cod(g, r) { fishTop(g, r, { len: 190, wid: 32, back: '#7a7a4a', belly: '#c8c098', mark: (c, rr) => { for (let i = 0; i < 40; i++) { c.fillStyle = 'rgba(70,58,30,.6)'; c.beginPath(); c.arc(100 + rr() * 56, 50 + rr() * 150, 2 + rr() * 2, 0, 7); c.fill(); } c.strokeStyle = 'rgba(240,236,210,.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(110, 60); c.lineTo(108, 190); c.moveTo(146, 60); c.lineTo(148, 190); c.stroke(); } }); }
function salmon(g, r) { fishTop(g, r, { len: 196, wid: 28, back: '#5a6e7a', belly: '#e4c8b8', mark: (c, rr) => { for (let i = 0; i < 26; i++) { c.fillStyle = 'rgba(30,30,40,.7)'; c.beginPath(); c.arc(112 + rr() * 32, 50 + rr() * 110, 2.2, 0, 7); c.fill(); } c.fillStyle = 'rgba(220,120,110,.35)'; c.fillRect(100, 100, 56, 70); } }); }
function pike(g, r) { fishTop(g, r, { len: 206, wid: 24, back: '#4e6a34', belly: '#c4c47a', mark: (c, rr) => { for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(214,214,120,.7)'; c.beginPath(); c.ellipse(108 + (i % 2) * 40, 64 + i * 15, 6, 3, 0.3, 0, 7); c.fill(); } } }); }

// ---------- houses ----------
// footprint L x W iso units; ridge along x.
function house(g, r, o) {
  const I = iso(o.ox ?? 118, o.oy ?? 150, o.u ?? 22), L = o.L, W = o.W, H = o.H, R = o.R;
  grassBase(g, r, I, L, W, o.pad ?? 0.7);
  const lift = o.lift ?? 0;
  if (lift) { // posts (stabbur)
    for (const [x, y] of [[0.2, W - 0.2], [L - 0.2, W - 0.2], [L - 0.2, 0.2], [L / 2, W - 0.2]]) {
      const a = I.pt(x, y, 0), b = I.pt(x, y, lift);
      inked(g, P(`M${a[0] - 4} ${a[1]} L${b[0] - 4} ${b[1]} L${b[0] + 4} ${b[1]} L${a[0] + 4} ${a[1]} Z`), '#6a4a2a', 2);
      inked(g, ell(b[0], b[1] + 2, 9, 5), '#b4ad98', 1.8);
    }
  }
  const z0 = lift;
  // walls
  const left = I.poly([[0, W, z0], [L, W, z0], [L, W, z0 + H], [0, W, z0 + H]]);
  const right = I.poly([[L, W, z0], [L, 0, z0], [L, 0, z0 + H], [L, W / 2, z0 + H + R], [L, W, z0 + H]]);
  g.fillStyle = o.wallL; g.fill(left);
  g.fillStyle = o.wallR; g.fill(right);
  I.face(g, [0, W, z0], [1, 0, 0], [0, 0, 1], () => within(g, P(`M0 0 L${L} 0 L${L} ${H} L0 ${H} Z`), () => o.wallTex(g, r, L, H, 'L')));
  I.face(g, [L, W, z0], [0, -1, 0], [0, 0, 1], () => within(g, P(`M0 0 L${W} 0 L${W} ${H} L${W / 2} ${H + R} L0 ${H} Z`), () => o.wallTex(g, r, W, H + R, 'R')));
  g.strokeStyle = INK; g.lineWidth = 2.6; g.stroke(left); g.stroke(right);
  // details: door & windows
  o.details && o.details(g, r, I, L, W, H, z0);
  // roof: front slope from eave (y=W) to ridge (y=W/2), plus overhang
  const oh = o.overhang ?? 0.2;
  const roof = I.poly([[-oh, W + oh, z0 + H - oh * 0.6], [L + oh, W + oh, z0 + H - oh * 0.6], [L + oh, W / 2, z0 + H + R], [-oh, W / 2, z0 + H + R]]);
  // gable edge band (roof thickness at the visible gable end)
  const edge = I.poly([[L + oh, W + oh, z0 + H - oh * 0.6], [L + oh, W / 2, z0 + H + R], [L + oh, -oh, z0 + H - oh * 0.6], [L + oh, -oh, z0 + H - oh * 0.6 - 0.25], [L + oh, W / 2, z0 + H + R - 0.25], [L + oh, W + oh, z0 + H - oh * 0.6 - 0.25]]);
  const back = I.poly([[-oh, W / 2, z0 + H + R], [L + oh, W / 2, z0 + H + R], [L + oh, -oh, z0 + H - oh * 0.6], [-oh, -oh, z0 + H - oh * 0.6]]);
  g.fillStyle = o.roof; g.fill(back); g.fillStyle = 'rgba(20,14,8,.35)'; g.fill(back); g.strokeStyle = INK; g.lineWidth = 2.6; g.stroke(back);
  g.fillStyle = o.roofEdge; g.fill(edge); g.strokeStyle = INK; g.lineWidth = 2.4; g.stroke(edge);
  g.fillStyle = o.roof; g.fill(roof);
  I.face(g, [-oh, W + oh, z0 + H - oh * 0.6], [1, 0, 0], [0, -1, R / (W / 2 + oh)], () => within(g, P(`M0 0 L${L + 2 * oh} 0 L${L + 2 * oh} ${W / 2 + oh} L0 ${W / 2 + oh} Z`), () => o.roofTex(g, r, L + 2 * oh, W / 2 + oh)));
  g.strokeStyle = INK; g.lineWidth = 3; g.stroke(roof);
  o.top && o.top(g, r, I, L, W, H, R, z0, oh);
}
const logWall = (base, dark) => (g, r, w, h) => {
  g.fillStyle = base; g.fillRect(-1, -1, w + 2, h + 2);
  for (let t = 0; t < h + 1; t += 0.32) {
    g.fillStyle = dark; g.fillRect(-1, t, w + 2, 0.05);
    g.fillStyle = 'rgba(255,230,180,.18)'; g.fillRect(-1, t + 0.06, w + 2, 0.06);
  }
  for (let i = 0; i < 30; i++) { g.fillStyle = 'rgba(30,18,8,.35)'; g.fillRect(r() * w, r() * h, 0.25, 0.03); }
};
const plankWall = (base, line) => (g, r, w, h) => {
  g.fillStyle = base; g.fillRect(-1, -1, w + 2, h + 2);
  for (let s = 0; s < w; s += 0.28) { g.fillStyle = line; g.fillRect(s, -1, 0.045, h + 2); }
  g.fillStyle = 'rgba(255,255,255,.08)'; for (let s = 0.1; s < w; s += 0.56) g.fillRect(s, -1, 0.1, h + 2);
};
const brickWall = (g, r, w, h) => {
  g.fillStyle = '#9a4a32'; g.fillRect(-1, -1, w + 2, h + 2);
  for (let t = 0, k = 0; t < h + 1; t += 0.16, k++) {
    g.fillStyle = 'rgba(232,214,180,.55)'; g.fillRect(-1, t, w + 2, 0.025);
    for (let s = (k % 2) * 0.2; s < w; s += 0.4) g.fillRect(s, t, 0.025, 0.16);
  }
  for (let i = 0; i < 40; i++) { g.fillStyle = r() < 0.5 ? 'rgba(60,20,10,.25)' : 'rgba(220,140,100,.2)'; g.fillRect(r() * w, r() * h, 0.35, 0.13); }
};
const limeWall = (g, r, w, h) => {
  g.fillStyle = '#ece6d4'; g.fillRect(-1, -1, w + 2, h + 2);
  for (let i = 0; i < 50; i++) { g.fillStyle = 'rgba(150,140,110,.18)'; g.beginPath(); g.ellipse(r() * w, r() * h, 0.2, 0.08, 0, 0, 7); g.fill(); }
  g.fillStyle = 'rgba(120,110,90,.3)'; g.fillRect(-1, -0.02, w + 2, 0.22);
};
const turfRoof = (g, r, w, h) => {
  g.fillStyle = '#6f8f3e'; g.fillRect(-1, -1, w + 2, h + 2);
  for (let i = 0; i < 220; i++) { const s = r() * w, t = r() * h; g.fillStyle = r() < 0.5 ? 'rgba(150,180,80,.8)' : 'rgba(40,70,24,.6)'; g.fillRect(s, t, 0.12, 0.05); }
  for (let i = 0; i < 26; i++) { g.fillStyle = ['#f2c832', '#fbf6e8', '#e58fb0', '#6f86d6'][i % 4]; g.beginPath(); g.ellipse(r() * w, 0.2 + r() * (h - 0.3), 0.07, 0.05, 0, 0, 7); g.fill(); }
  g.fillStyle = '#4a3624'; g.fillRect(-1, -0.02, w + 2, 0.16); // birch-bark/timber eave board
};
const thatchRoof = (g, r, w, h) => {
  g.fillStyle = '#c9a050'; g.fillRect(-1, -1, w + 2, h + 2);
  for (let i = 0; i < 360; i++) { const s = r() * w, t = r() * h; g.strokeStyle = r() < 0.6 ? 'rgba(110,76,26,.6)' : 'rgba(250,226,150,.6)'; g.lineWidth = 0.035; g.beginPath(); g.moveTo(s, t); g.lineTo(s + (r() - 0.5) * 0.06, t + 0.22); g.stroke(); }
  for (let t = 0.3; t < h; t += 0.5) { g.fillStyle = 'rgba(90,60,20,.35)'; g.fillRect(-1, t, w + 2, 0.04); }
};
const slateRoof = (g, r, w, h) => {
  g.fillStyle = '#5e6a70'; g.fillRect(-1, -1, w + 2, h + 2);
  for (let t = 0, k = 0; t < h + 1; t += 0.2, k++) { g.fillStyle = 'rgba(20,26,30,.55)'; g.fillRect(-1, t, w + 2, 0.03); for (let s = (k % 2) * 0.15; s < w; s += 0.3) g.fillRect(s, t, 0.025, 0.2); }
  for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(200,214,220,.18)'; g.fillRect(r() * w, r() * h, 0.25, 0.1); }
};
const shingleRoof = (g, r, w, h) => {
  g.fillStyle = '#6a4a30'; g.fillRect(-1, -1, w + 2, h + 2);
  for (let t = 0, k = 0; t < h + 1; t += 0.16, k++) for (let s = (k % 2) * 0.09; s < w; s += 0.18) { g.fillStyle = k % 3 ? 'rgba(40,24,12,.55)' : 'rgba(150,110,70,.4)'; g.beginPath(); g.ellipse(s, t + 0.14, 0.085, 0.06, 0, 0, Math.PI); g.fill(); }
};
function door(g, I, x, y, z, w, h, color, axis = 'L') {
  const p = axis === 'L' ? I.poly([[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]]) : I.poly([[x, y, z], [x, y - w, z], [x, y - w, z + h], [x, y, z + h]]);
  inked(g, p, color, 2);
  return p;
}
function windowAt(g, I, x, y, z, w, h, axis = 'L', frame = '#efe4c8') {
  const p = door(g, I, x, y, z, w, h, '#2e3a40', axis);
  g.strokeStyle = frame; g.lineWidth = 1.6;
  const a = axis === 'L' ? I.pt(x + w / 2, y, z) : I.pt(x, y - w / 2, z), b = axis === 'L' ? I.pt(x + w / 2, y, z + h) : I.pt(x, y - w / 2, z + h);
  g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke();
  g.strokeStyle = INK; g.lineWidth = 2; g.stroke(p);
}
function chimney(g, I, x, y, zb, h, color) {
  const pts = [[x, y + 0.3, zb], [x + 0.4, y + 0.3, zb], [x + 0.4, y + 0.3, zb + h], [x, y + 0.3, zb + h]];
  inked(g, I.poly(pts), color, 2);
  inked(g, I.poly([[x + 0.4, y + 0.3, zb], [x + 0.4, y - 0.1, zb], [x + 0.4, y - 0.1, zb + h], [x + 0.4, y + 0.3, zb + h]]), '#6a5a4a', 2);
  inked(g, I.poly([[x, y - 0.1, zb + h], [x + 0.4, y - 0.1, zb + h], [x + 0.4, y + 0.3, zb + h], [x, y + 0.3, zb + h]]), '#3a2e24', 1.8);
}
function turfHouse(g, r) {
  house(g, r, { L: 4.2, W: 2.6, H: 1.5, R: 1.0, u: 22, ox: 104, oy: 128, wallL: '#7a5634', wallR: '#5e4026', roof: '#6f8f3e', roofEdge: '#4a3624',
    wallTex: logWall('#7a5634', 'rgba(30,16,6,.75)'), roofTex: turfRoof,
    details: (g, r, I, L, W, H, z) => { door(g, I, 1.4, W, z, 0.6, 1.1, '#4a2e1a'); windowAt(g, I, 2.6, W, z + 0.55, 0.5, 0.45); windowAt(g, I, L, W / 2 + 0.3, z + 0.55, 0.5, 0.45, 'R'); },
    top: (g, r, I, L, W, H, R, z, oh) => { chimney(g, I, 1.0, W / 2 - 0.2, z + H + R - 0.4, 0.75, '#8a7a66'); for (let i = 0; i < 5; i++) { const p = I.pt(0.3 + i * 0.9, W / 2 + 0.05, z + H + R + 0.05); tuft(g, r, p[0], p[1], 10, '#5a7a30'); } } });
  // woodpile
  for (let i = 0; i < 6; i++) inked(g, ell(196 + (i % 3) * 9, 196 - Math.floor(i / 3) * 8, 5, 4), '#c8a46a', 1.4);
}
function frisianHouse(g, r) {
  house(g, r, { L: 5.0, W: 2.6, H: 1.25, R: 1.45, u: 20, ox: 98, oy: 132, wallL: '#9a4a32', wallR: '#8a4030', roof: '#c9a050', roofEdge: '#8a6a30',
    wallTex: brickWall, roofTex: thatchRoof,
    details: (g, r, I, L, W, H, z) => { for (const x of [0.5, 1.4, 3.4, 4.2]) windowAt(g, I, x, W, z + 0.4, 0.45, 0.55, 'L', '#f4f0e4'); door(g, I, 2.3, W, z, 0.8, 1.05, '#2f5a4a'); door(g, I, L, W / 2 + 0.6, z, 1.2, 1.25, '#3f6a5a', 'R'); } });
  // the barn door arch and an eave lamp: little stone path
  g.fillStyle = 'rgba(200,190,160,.8)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(150 + i * 8, 196 + i * 5, 5, 3, 0, 0, 7); g.fill(); }
}
function stabbur(g, r) {
  house(g, r, { L: 2.6, W: 2.2, H: 1.3, R: 0.9, u: 26, ox: 112, oy: 136, lift: 0.8, pad: 0.6, wallL: '#a3402c', wallR: '#8a3424', roof: '#6a4a30', roofEdge: '#3a2a1a',
    wallTex: plankWall('#a3402c', 'rgba(50,14,8,.6)'), roofTex: shingleRoof,
    details: (g, r, I, L, W, H, z) => { door(g, I, 0.9, W, z, 0.65, 1.0, '#5a2a1a'); const s = I.pt(1.2, W + 0.6, 0), t = I.pt(1.2, W, z); g.strokeStyle = INK; g.lineWidth = 2.4; g.beginPath(); g.moveTo(s[0] - 10, s[1]); g.lineTo(t[0] - 10, t[1]); g.moveTo(s[0] + 4, s[1]); g.lineTo(t[0] + 4, t[1]); for (let k = 1; k < 4; k++) { g.moveTo(s[0] - 10 + (t[0] - s[0]) * k / 4, s[1] + (t[1] - s[1]) * k / 4); g.lineTo(s[0] + 4 + (t[0] - s[0]) * k / 4, s[1] + (t[1] - s[1]) * k / 4); } g.stroke(); },
    top: (g, r, I, L, W, H, R, z) => { const a = I.pt(L + 0.35, W / 2, z + H + R), b = I.pt(-0.35, W / 2, z + H + R); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(...a); g.lineTo(a[0] + 10, a[1] - 12); g.moveTo(...b); g.lineTo(b[0] - 10, b[1] - 12); g.stroke(); } });
}
function fisherCottage(g, r) {
  house(g, r, { L: 3.6, W: 2.4, H: 1.35, R: 1.15, u: 24, ox: 108, oy: 132, wallL: '#ece6d4', wallR: '#d8d0bc', roof: '#5e6a70', roofEdge: '#2e363a',
    wallTex: limeWall, roofTex: slateRoof,
    details: (g, r, I, L, W, H, z) => { door(g, I, 1.5, W, z, 0.6, 1.05, '#2f5d91'); windowAt(g, I, 0.5, W, z + 0.45, 0.55, 0.5, 'L', '#efe4c8'); windowAt(g, I, 2.5, W, z + 0.45, 0.55, 0.5, 'L', '#efe4c8'); windowAt(g, I, L, W / 2 + 0.25, z + 0.5, 0.5, 0.45, 'R'); },
    top: (g, r, I, L, W, H, R, z) => { chimney(g, I, -0.1, W / 2 - 0.2, z + H + R - 0.5, 0.8, '#d8d0bc'); chimney(g, I, L - 0.3, W / 2 - 0.2, z + H + R - 0.5, 0.8, '#d8d0bc'); } });
  // an upturned keel on trestles by the door and a buoy
  inked(g, P('M176 204 Q200 190 228 200 L226 206 Q200 198 178 210 Z'), '#4c3220', 2);
  inked(g, ell(70, 206, 6, 6), '#d9772e', 1.6);
}

const SPRITES = [
  boat, haystack, hjell, angler, pots, runestone, cloudberry, cottongrass,
  thrift, harebell, fireweed, lingonberry, wrack, seakale, lichenRock, greatOak,
  greatYew, pony, highland, shetlandSheep, blackfaceSheep, eider, gullUp, gullDown,
  crane, seaEagle, seal, hare, stag, herring, cod, salmon,
  pike, turfHouse, frisianHouse, stabbur, fisherCottage,
];
if (typeof window !== 'undefined') window.paintFolio = paintAll;

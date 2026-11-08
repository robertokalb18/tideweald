// Recovered from the Tideweald v16.11 build. Module: render/chart

var PALETTES = {
  carta: {
    sea: '#9dbdb0',
    seaDeep: '#86aca3',
    seaInk: 'rgba(46,70,74,.42)',
    coastInk: '#3b3128',
    paper: '#efe4c8',
    ink: '#2b2118',
    inkSoft: 'rgba(43,33,24,.55)',
    sand: '#e6d3a2',
    sandEdge: '#c9ad74',
    shallow: '#c3d8c7',
    river: '#7fb0aa',
    riverWinter: '#b7d3d6',
    riverBank: '#6d7a55',
    riverEdge: '#d8dcb0',
    meadow: [170, 190, 112],
    dry: [228, 212, 164],
    lush: [120, 158, 84],
    autumn: [203, 158, 86],
    summer: [196, 190, 110],
    snow: [246, 244, 236],
    wetTint: [92, 132, 124],
    toxic: [112, 100, 76],
    rad: [160, 168, 80],
    friendly: '#2f5d91',
    enemy: '#b8452f',
    label: 'rgba(43,33,24,.78)',
  },
  classic: {
    sea: '#237f8c',
    seaDeep: '#1d7280',
    seaInk: 'rgba(210,241,216,.14)',
    coastInk: '#a28252',
    paper: '#f5e5aa',
    ink: '#18343d',
    inkSoft: 'rgba(24,52,61,.5)',
    sand: '#e1d09a',
    sandEdge: '#a28252',
    shallow: '#8fe0cf',
    river: '#2d8990',
    riverWinter: '#84c8d5',
    riverBank: '#4e7150',
    riverEdge: '#c7d397',
    meadow: [113, 183, 73],
    dry: [220, 194, 118],
    lush: [94, 177, 75],
    autumn: [198, 151, 64],
    summer: [197, 193, 83],
    snow: [238, 245, 250],
    wetTint: [54, 109, 112],
    toxic: [108, 101, 72],
    rad: [151, 170, 68],
    friendly: '#39c5e3',
    enemy: '#e07c5c',
    label: '#314b45b0',
  },
};
function rng(e) {
  let t = e >>> 0;
  return () => (
    (t = Math.imul(t ^ (t >>> 15), 2246822507) ^ Math.imul(t ^ (t >>> 13), 3266489909)),
    (t ^= t >>> 16),
    (t >>> 0) / 4294967296
  );
}
var x8 = new Map();
function made(e, t, a, n) {
  let r = x8.get(e);
  return (
    r ||
    ((r = document.createElement('canvas')),
    (r.width = t),
    (r.height = a),
    n(r.getContext('2d')),
    x8.set(e, r),
    r)
  );
}
function seaTexture() {
  return made('sea', 320, 160, (e) => {
    let t = rng(7);
    ((e.strokeStyle = 'rgba(40,64,68,.5)'), (e.lineWidth = 1.05), (e.lineCap = 'round'));
    for (let a = 0; a < 10; a++) {
      let n = 8 + a * 16,
        r = a % 2 ? 20 : 0;
      for (let o = -40 + r; o < 360; o += 40) {
        let l = 15 + t() * 9,
          s = o + t() * 8,
          c = n + (t() - 0.5) * 3;
        (e.beginPath(),
          e.moveTo(s - l / 2, c + 1.5),
          e.quadraticCurveTo(s - l / 4, c - 2.8, s, c),
          e.quadraticCurveTo(s + l / 4, c + 2.8, s + l / 2, c - 1.2),
          e.stroke());
      }
    }
    e.fillStyle = 'rgba(40,64,68,.22)';
    for (let a = 0; a < 70; a++) e.fillRect(t() * 320, t() * 160, 1, 1);
  });
}
function paperTexture() {
  return made('paper', 256, 256, (e) => {
    let t = rng(11),
      a = e.createImageData(256, 256);
    for (let n = 0; n < a.data.length; n += 4) {
      let r = t(),
        o = r < 0.5;
      ((a.data[n] = o ? 70 : 255),
        (a.data[n + 1] = o ? 55 : 248),
        (a.data[n + 2] = o ? 35 : 225),
        (a.data[n + 3] = Math.floor(Math.abs(r - 0.5) * 26)));
    }
    (e.putImageData(a, 0, 0), (e.strokeStyle = 'rgba(90,70,45,.07)'), (e.lineWidth = 0.6));
    for (let n = 0; n < 60; n++) {
      let r = t() * 256,
        o = t() * 256,
        l = t() * Math.PI;
      (e.beginPath(),
        e.moveTo(r, o),
        e.lineTo(r + Math.cos(l) * (6 + t() * 14), o + Math.sin(l) * (3 + t() * 6)),
        e.stroke());
    }
  });
}
var Sf = new WeakMap();
function roadTexture(e, t) {
  return made(`road|${e}|${t}`, 256, 256, (n) => {
    let r = rng(e === 'paved' ? 21 : e === 'road' ? 33 : e === 'bridge' ? 45 : 57),
      o = (l) => {
        for (let s of [-256, 0, 256]) for (let c of [-256, 0, 256]) l(s, c);
      };
    if (e === 'paved') {
      ((n.fillStyle = t ? '#8e8672' : '#7d7a6c'), n.fillRect(0, 0, 256, 256));
      let l = 16,
        s = 256 / l;
      for (let c = 0; c < l; c++)
        for (let u = 0; u < l; u++) {
          let d = (u + 0.5 + (c % 2) * 0.5) * s + (r() - 0.5) * 3,
            m = (c + 0.5) * s + (r() - 0.5) * 3,
            h = s * (0.78 + r() * 0.14),
            p = s * (0.7 + r() * 0.16),
            g = r(),
            v = t
              ? `hsl(${34 + g * 16},${14 + g * 14}%,${72 + g * 12}%)`
              : `hsl(${30 + g * 30},${8 + g * 10}%,${58 + g * 16}%)`;
          o((M, w) => {
            (n.beginPath(),
              n.roundRect(d - h / 2 + M, m - p / 2 + w, h, p, 4),
              (n.fillStyle = v),
              n.fill(),
              t
                ? ((n.strokeStyle = 'rgba(43,33,24,.55)'), (n.lineWidth = 1), n.stroke())
                : ((n.fillStyle = 'rgba(255,255,255,.18)'),
                  n.fillRect(d - h / 2 + M + 2, m - p / 2 + w + 1.5, h - 5, 2)));
          });
        }
    } else if (e === 'road') {
      ((n.fillStyle = t ? '#9a917c' : '#8d8b7c'), n.fillRect(0, 0, 256, 256));
      for (let l = 0; l < 8; l++) {
        let s = (l % 2) * 16,
          c = s;
        for (; c < 256 + s; ) {
          let u = 24 + r() * 16;
          c + u > 256 + s - 12 && (u = 256 + s - c);
          let d = r(),
            m = t ? `hsl(40,${12 + d * 10}%,${74 + d * 10}%)` : `hsl(45,${6 + d * 8}%,${64 + d * 12}%)`,
            h = c;
          (o((p, g) => {
            (n.beginPath(),
              n.roundRect(h + 1 + p, l * 32 + 1 + g, u - 2, 30, 3),
              (n.fillStyle = m),
              n.fill(),
              t && ((n.strokeStyle = 'rgba(43,33,24,.45)'), (n.lineWidth = 1), n.stroke()));
          }),
            (c += u));
        }
      }
    } else if (e === 'bridge') {
      ((n.fillStyle = t ? '#b48850' : '#a87a44'), n.fillRect(0, 0, 256, 256));
      for (let l = 0; l < 16; l++)
        ((n.fillStyle = `rgba(90,60,30,${0.08 + r() * 0.1})`),
          n.fillRect(0, l * 16, 256, 16),
          (n.strokeStyle = t ? 'rgba(43,33,24,.55)' : 'rgba(60,40,20,.5)'),
          (n.lineWidth = 1),
          n.beginPath(),
          n.moveTo(0, l * 16 + 0.5),
          n.lineTo(256, l * 16 + 0.5),
          n.stroke());
    } else {
      ((n.fillStyle = t ? '#d9bf86' : '#c4a56a'), n.fillRect(0, 0, 256, 256));
      for (let l = 0; l < 1e3; l++) {
        let s = r() * 256,
          c = r() * 256,
          u = 0.6 + r() * 1.8,
          m = r() > 0.55 ? (t ? 'rgba(120,92,52,.45)' : 'rgba(110,84,48,.4)') : 'rgba(255,245,220,.35)';
        o((h, p) => {
          ((n.fillStyle = m), n.beginPath(), n.arc(s + h, c + p, u, 0, Math.PI * 2), n.fill());
        });
      }
    }
  });
}
function roadPattern(e, t, a) {
  let n = Sf.get(e);
  n || ((n = new Map()), Sf.set(e, n));
  let r = `road|${t}|${a}`,
    o = n.get(r);
  return (
    o ||
      ((o = e.createPattern(roadTexture(t, a), 'repeat')),
      o.setTransform(new DOMMatrix([29 / 128, 14.5 / 128, -29 / 128, 14.5 / 128, 0, 0])),
      n.set(r, o)),
    o
  );
}
function pattern(e, t) {
  let a = Sf.get(e);
  a || ((a = new Map()), Sf.set(e, a));
  let n = a.get(t);
  return (
    n || ((n = e.createPattern(t === 'sea' ? seaTexture() : paperTexture(), 'repeat')), a.set(t, n)),
    n
  );
}
function compassRose() {
  return made('rose', 360, 360, (e) => {
    (e.translate(180, 180),
      (e.lineJoin = 'round'),
      (e.strokeStyle = '#2b2118'),
      (e.lineWidth = 2),
      (e.fillStyle = 'rgba(239,228,200,.85)'),
      e.beginPath(),
      e.arc(0, 0, 150, 0, Math.PI * 2),
      e.fill(),
      e.stroke(),
      (e.lineWidth = 1),
      e.beginPath(),
      e.arc(0, 0, 140, 0, Math.PI * 2),
      e.stroke());
    for (let a = 0; a < 32; a++) {
      let n = (a * Math.PI) / 16;
      (e.beginPath(),
        e.moveTo(Math.cos(n) * 140, Math.sin(n) * 140),
        e.lineTo(Math.cos(n) * (a % 2 ? 132 : 126), Math.sin(n) * (a % 2 ? 132 : 126)),
        e.stroke());
    }
    let t = (a, n, r, o, l) => {
      let s = Math.cos(a),
        c = Math.sin(a),
        u = -c,
        d = s;
      (e.beginPath(),
        e.moveTo(0, 0),
        e.lineTo(s * n, c * n),
        e.lineTo(u * r, d * r),
        e.closePath(),
        (e.fillStyle = o),
        e.fill(),
        e.stroke(),
        e.beginPath(),
        e.moveTo(0, 0),
        e.lineTo(s * n, c * n),
        e.lineTo(-u * r, -d * r),
        e.closePath(),
        (e.fillStyle = l),
        e.fill(),
        e.stroke());
    };
    for (let a = 0; a < 16; a++) {
      let n = (a * Math.PI) / 8 - Math.PI / 2;
      a % 2 && t(n, 70, 9, '#efe4c8', '#b89f72');
    }
    for (let a = 0; a < 8; a++) {
      let n = (a * Math.PI) / 4 - Math.PI / 2 + Math.PI / 8;
      t(n, 98, 13, '#e3cf9b', '#8b6b47');
    }
    for (let a = 0; a < 4; a++) {
      let n = (a * Math.PI) / 2 - Math.PI / 2;
      t(n, 128, 18, a === 0 ? '#c8553c' : '#efe4c8', a === 0 ? '#8e2f22' : '#2f5d91');
    }
    ((e.fillStyle = '#efe4c8'),
      e.beginPath(),
      e.arc(0, 0, 10, 0, Math.PI * 2),
      e.fill(),
      e.stroke(),
      (e.font = 'italic 26px Georgia, serif'),
      (e.textAlign = 'center'),
      (e.fillStyle = '#2b2118'),
      e.fillText('N', 0, -156));
  });
}
function cartouche(e, t) {
  return made('cartouche|' + e + '|' + t, 520, 180, (a) => {
    (a.translate(260, 90), (a.lineJoin = 'round'), (a.strokeStyle = '#2b2118'), (a.lineWidth = 2.2));
    let n = (r) => {
      (a.save(),
        a.scale(r, 1),
        a.beginPath(),
        a.moveTo(200, -46),
        a.bezierCurveTo(250, -46, 250, 10, 222, 10),
        a.bezierCurveTo(205, 10, 205, -14, 222, -14),
        a.stroke(),
        a.beginPath(),
        a.moveTo(200, 46),
        a.bezierCurveTo(240, 46, 248, 20, 226, 14),
        a.stroke(),
        a.restore());
    };
    ((a.fillStyle = 'rgba(239,228,200,.92)'),
      a.beginPath(),
      a.moveTo(-200, -46),
      a.lineTo(200, -46),
      a.quadraticCurveTo(214, 0, 200, 46),
      a.lineTo(-200, 46),
      a.quadraticCurveTo(-214, 0, -200, -46),
      a.closePath(),
      a.fill(),
      a.stroke(),
      (a.lineWidth = 1),
      a.strokeRect(-186, -36, 372, 72),
      n(1),
      n(-1),
      (a.fillStyle = '#2b2118'),
      (a.textAlign = 'center'),
      (a.font = '600 34px Georgia, serif'),
      a.fillText(e.split('').join('\u200A'), 0, 6),
      (a.font = 'italic 15px Georgia, serif'),
      (a.fillStyle = '#8e2f22'),
      a.fillText(t, 0, 30));
  });
}
function drawSerpent(e, t, a, n, r) {
  let o = (n * 12e-5) % 1,
    l = Math.sin(o * Math.PI);
  if (l < 0.05) return;
  (e.save(),
    e.translate(t, a),
    e.scale(r, r),
    (e.globalAlpha *= Math.min(1, l * 1.6)),
    (e.lineCap = 'round'),
    (e.lineJoin = 'round'));
  for (let c = 0; c < 3; c++) {
    let u = -70 + c * 52,
      d = (20 - c * 3) * l;
    ((e.fillStyle = c % 2 ? '#5d7f6e' : '#6f9180'),
      (e.strokeStyle = '#2b2118'),
      (e.lineWidth = 2.4),
      e.beginPath(),
      e.moveTo(u - 22, 0),
      e.bezierCurveTo(u - 18, -d * 1.5, u + 18, -d * 1.5, u + 22, 0),
      e.bezierCurveTo(u + 12, -d * 0.6, u - 12, -d * 0.6, u - 22, 0),
      e.fill(),
      e.stroke(),
      (e.lineWidth = 1),
      e.beginPath());
    for (let m = -12; m <= 12; m += 6) (e.moveTo(u + m, -d * 0.9), e.lineTo(u + m + 3, -d * 1.15));
    e.stroke();
  }
  let s = -22 * l;
  ((e.fillStyle = '#6f9180'),
    (e.strokeStyle = '#2b2118'),
    (e.lineWidth = 2.4),
    e.beginPath(),
    e.moveTo(80, 0),
    e.quadraticCurveTo(84, s, 98, s - 6),
    e.quadraticCurveTo(118, s - 4, 122, s + 4),
    e.quadraticCurveTo(110, s + 6, 100, s + 4),
    e.quadraticCurveTo(92, s + 8, 94, 2),
    e.closePath(),
    e.fill(),
    e.stroke(),
    (e.fillStyle = '#b8452f'),
    e.beginPath(),
    e.moveTo(100, s - 5),
    e.lineTo(104, s - 16),
    e.lineTo(109, s - 6),
    e.fill(),
    e.stroke(),
    (e.fillStyle = '#2b2118'),
    e.beginPath(),
    e.arc(110, s - 1, 1.8, 0, Math.PI * 2),
    e.fill(),
    (e.strokeStyle = 'rgba(43,33,24,.55)'),
    (e.lineWidth = 1.2),
    e.beginPath());
  for (let c = -100; c <= 130; c += 26) (e.moveTo(c, 4), e.quadraticCurveTo(c + 6, 1, c + 13, 4));
  (e.stroke(), e.restore());
}
function drawShip(e, t, a, n, r, o = 1) {
  (e.save(),
    e.translate(t, a + Math.sin(n * 0.0015) * 1.5),
    e.scale(r * o, r),
    e.rotate(Math.sin(n * 0.0011) * 0.04),
    (e.lineJoin = 'round'),
    (e.strokeStyle = '#2b2118'),
    (e.lineWidth = 1.8),
    (e.fillStyle = '#8a6a44'),
    e.beginPath(),
    e.moveTo(-34, 0),
    e.lineTo(34, 0),
    e.quadraticCurveTo(30, 14, 20, 16),
    e.lineTo(-22, 16),
    e.quadraticCurveTo(-32, 12, -34, 0),
    e.fill(),
    e.stroke(),
    (e.lineWidth = 1),
    e.beginPath(),
    e.moveTo(-28, 6),
    e.lineTo(29, 6),
    e.stroke(),
    (e.lineWidth = 1.8),
    e.beginPath(),
    e.moveTo(0, 0),
    e.lineTo(0, -52),
    e.stroke(),
    (e.fillStyle = '#efe4c8'),
    e.beginPath(),
    e.moveTo(-20, -46),
    e.quadraticCurveTo(0, -40, 20, -46),
    e.quadraticCurveTo(26, -26, 20, -8),
    e.quadraticCurveTo(0, -13, -20, -8),
    e.quadraticCurveTo(-14, -26, -20, -46),
    e.fill(),
    e.stroke(),
    (e.fillStyle = '#b8452f'),
    e.fillRect(-3, -44, 6, 34),
    e.strokeRect(-3, -44, 6, 34),
    e.beginPath(),
    e.moveTo(0, -52),
    e.lineTo(14, -56),
    e.lineTo(0, -60),
    e.fill(),
    (e.strokeStyle = 'rgba(43,33,24,.5)'),
    (e.lineWidth = 1),
    e.beginPath(),
    e.moveTo(-40, 18),
    e.quadraticCurveTo(-30, 14, -20, 19),
    e.moveTo(24, 19),
    e.quadraticCurveTo(34, 15, 44, 19),
    e.stroke(),
    e.restore());
}
function drawWhale(e, t, a, n, r) {
  let o = (n * 9e-5 + 0.5) % 1,
    l = Math.sin(o * Math.PI);
  if (!(l < 0.1)) {
    if (
      (e.save(),
      e.translate(t, a),
      e.scale(r, r),
      (e.globalAlpha *= Math.min(1, l * 1.8)),
      (e.lineJoin = 'round'),
      (e.strokeStyle = '#2b2118'),
      (e.lineWidth = 2.2),
      (e.fillStyle = '#7b8b8a'),
      e.beginPath(),
      e.moveTo(-50, 0),
      e.bezierCurveTo(-44, -26 * l, 30, -30 * l, 46, -6 * l),
      e.quadraticCurveTo(52, 0, 40, 2),
      e.lineTo(-50, 2),
      e.closePath(),
      e.fill(),
      e.stroke(),
      e.beginPath(),
      e.moveTo(-50, 0),
      e.lineTo(-66, -14 * l),
      e.lineTo(-60, 0),
      e.lineTo(-68, 10),
      e.closePath(),
      e.fill(),
      e.stroke(),
      (e.fillStyle = '#2b2118'),
      e.beginPath(),
      e.arc(32, -10 * l, 1.6, 0, Math.PI * 2),
      e.fill(),
      l > 0.6)
    ) {
      ((e.strokeStyle = 'rgba(43,70,74,.8)'), (e.lineWidth = 1.3), e.beginPath());
      for (let s of [-1, 0, 1])
        (e.moveTo(14, -24 * l), e.quadraticCurveTo(14 + s * 8, -44 * l, 14 + s * 16, -40 * l));
      e.stroke();
    }
    e.restore();
  }
}
var A8 = new Map();
function shape(e, t, a) {
  let n = `${e}:${t}:${a}`,
    r = A8.get(n);
  if (r) return r;
  let o = new Path2D(),
    l = 0.505;
  return (
    o.rect(-a, -a, 2 * a, 2 * a),
    e & 1 && o.rect(-a, -l, 2 * a, l - a),
    e & 2 && o.rect(a, -a, l - a, 2 * a),
    e & 4 && o.rect(-a, a, 2 * a, l - a),
    e & 8 && o.rect(-l, -a, l - a, 2 * a),
    t & 1 && o.rect(a, -l, l - a, l - a),
    t & 2 && o.rect(a, a, l - a, l - a),
    t & 4 && o.rect(-l, a, l - a, l - a),
    t & 8 && o.rect(-l, -l, l - a, l - a),
    A8.set(n, o),
    o
  );
}

export { PALETTES, cartouche, compassRose, drawSerpent, drawShip, drawWhale, pattern, roadPattern, shape };

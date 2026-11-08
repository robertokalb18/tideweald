// Recovered from the Tideweald v16.11 build. Module: render/textures

var l8, s8;
function noise(e, t, a) {
  let n = Math.sin(e * 127.1 + t * 311.7 + a) * 43758.5453;
  return n - Math.floor(n);
}
function smooth(e, t, a, n) {
  let r = Math.floor(e / a),
    o = Math.floor(t / a),
    l = (e / a) % 1,
    s = (t / a) % 1,
    c = l * l * (3 - 2 * l),
    u = s * s * (3 - 2 * s),
    d = (m, h) => noise(m % (512 / a), h % (256 / a), n);
  return (d(r, o) * (1 - c) + d(r + 1, o) * c) * (1 - u) + (d(r, o + 1) * (1 - c) + d(r + 1, o + 1) * c) * u;
}
function terrainTexture(e) {
  let t = e === 'grass' ? l8 : s8;
  if (t) return t;
  ((t = document.createElement('canvas')), (t.width = 512), (t.height = 256));
  let a = t.getContext('2d'),
    n = a.createImageData(t.width, t.height);
  for (let r = 0; r < t.height; r++)
    for (let o = 0; o < t.width; o++) {
      let l = e === 'water',
        s = smooth(o, l ? r * 5 : r, 64, 12),
        c = noise(o, r, 89),
        u = smooth(o, l ? r * 4 : r, 8, 31),
        d = (s - 0.5) * 0.7 + (u - 0.5) * 0.3,
        m = d > 0,
        h = l ? (m ? [176, 244, 239] : [8, 74, 121]) : m ? [241, 223, 121] : [35, 92, 36],
        p = (r * t.width + o) * 4;
      ((n.data[p] = h[0]),
        (n.data[p + 1] = h[1]),
        (n.data[p + 2] = h[2]),
        (n.data[p + 3] = Math.min(40, Math.abs(d) * 95 + (c > 0.88 ? (l ? 8 : 16) : 0))));
    }
  return (a.putImageData(n, 0, 0), e === 'grass' ? (l8 = t) : (s8 = t), t);
}
var u8 = new WeakMap();
function cachedPattern(e, t, a) {
  let n = u8.get(e);
  n || ((n = new Map()), u8.set(e, n));
  let r = n.get(t);
  return (r || ((r = a()), n.set(t, r)), r);
}
function texturePattern(e, t) {
  return cachedPattern(e, t, () => e.createPattern(terrainTexture(t), 'repeat'));
}
var Ip;
function wrapNoise(e, t, a, n) {
  let r = e * a,
    o = t * a,
    l = Math.floor(r),
    s = Math.floor(o),
    c = r - l,
    u = o - s,
    d = c * c * (3 - 2 * c),
    m = u * u * (3 - 2 * u),
    h = (p, g) => noise(((p % a) + a) % a, ((g % a) + a) % a, n);
  return (h(l, s) * (1 - d) + h(l + 1, s) * d) * (1 - m) + (h(l, s + 1) * (1 - d) + h(l + 1, s + 1) * d) * m;
}
var Gp = '16,30,6',
  d8 = '255,248,214';
function meadowTexture() {
  if (Ip) return Ip;
  let e = 512,
    t = 2,
    a = 128,
    n = document.createElement('canvas');
  ((n.width = a), (n.height = a));
  let r = n.getContext('2d'),
    o = r.createImageData(a, a);
  for (let m = 0; m < a; m++)
    for (let h = 0; h < a; h++) {
      let p = h / a,
        g = m / a,
        v = wrapNoise(p, g * 2, 4, 3) * 0.6 + wrapNoise(p, g * 2, 9, 7) * 0.4,
        M = wrapNoise(p, g, 24, 11),
        w = (v - 0.5) * 0.95 + (M - 0.5) * 0.4,
        y = (m * a + h) * 4,
        k = w > 0;
      ((o.data[y] = k ? 255 : 16),
        (o.data[y + 1] = k ? 248 : 30),
        (o.data[y + 2] = k ? 214 : 6),
        (o.data[y + 3] = Math.min(255, Math.abs(w) * (k ? 95 : 120))));
    }
  r.putImageData(o, 0, 0);
  let l = document.createElement('canvas');
  ((l.width = e * t), (l.height = e * t));
  let s = l.getContext('2d');
  ((s.imageSmoothingEnabled = !0), s.drawImage(n, 0, 0, a, a, 0, 0, e * t, e * t), s.scale(t, t));
  let c = 1,
    u = () => ((c = (c * 16807) % 2147483647), c / 2147483647),
    d = (m, h, p, g) => {
      for (let v of [-e, 0, e])
        for (let M of [-e, 0, e]) {
          let w = m + v,
            y = h + M;
          w > -p && w < e + p && y > -p && y < e + p && g(w, y);
        }
    };
  s.lineCap = 'round';
  for (let m = 0; m < 650; m++) {
    let h = u() * e,
      p = u() * e,
      g = 0.5 + u() * 1.2;
    d(h, p, 4, (v, M) => {
      ((s.fillStyle = `rgba(${Gp},.15)`),
        s.beginPath(),
        s.ellipse(v, M, g * 1.4, g * 0.8, 0, 0, Math.PI * 2),
        s.fill(),
        g > 1.2 &&
          ((s.fillStyle = `rgba(${d8},.14)`),
          s.beginPath(),
          s.ellipse(v - 0.3, M - 0.4, g * 0.7, g * 0.35, 0, 0, Math.PI * 2),
          s.fill()));
    });
  }
  for (let m = 0; m < 2200; m++) {
    let h = u() * e,
      p = u() * e,
      g = 2 + Math.floor(u() * 4),
      v = 2.4 + u() * 3.8,
      M = (u() - 0.5) * 1.4,
      w = wrapNoise(h / e, (p / e) * 2, 4, 3) < 0.5 ? 0.2 : 0.15,
      y = Array.from({ length: g }, (x, T) => (T - (g - 1) / 2) * (0.45 + u() * 0.25) + M * 0.4),
      k = y.map(() => v * (0.65 + u() * 0.55));
    d(h, p, 12, (x, T) => {
      ((s.fillStyle = `rgba(${Gp},.07)`),
        s.beginPath(),
        s.ellipse(x, T + 0.3, 1.2 + g * 0.5, 0.8, 0, 0, Math.PI * 2),
        s.fill(),
        y.forEach((C, R) => {
          let b = k[R],
            A = x + Math.sin(C) * b,
            E = T - Math.cos(C) * b,
            V = x + Math.sin(C * 0.4) * b * 0.5,
            Z = T - b * 0.55;
          ((s.strokeStyle = `rgba(${Gp},${w})`),
            (s.lineWidth = 0.9),
            s.beginPath(),
            s.moveTo(x, T),
            s.quadraticCurveTo(V, Z, A, E),
            s.stroke(),
            (s.strokeStyle = `rgba(${d8},.22)`),
            (s.lineWidth = 0.55),
            s.beginPath(),
            s.moveTo((V + A) / 2, (Z + E) / 2),
            s.lineTo(A, E),
            s.stroke());
        }));
    });
  }
  return ((Ip = l), l);
}
var Ho;
function meadowPattern(e, t) {
  return t > 1.05
    ? cachedPattern(e, 'meadow2', () => {
        let a = e.createPattern(meadowTexture(), 'repeat');
        return (a.setTransform(new DOMMatrix().scale(0.5)), a);
      })
    : cachedPattern(e, 'meadow1', () => {
        if (!Ho) {
          let a = meadowTexture();
          ((Ho = document.createElement('canvas')), (Ho.width = a.width / 2), (Ho.height = a.height / 2));
          let n = Ho.getContext('2d');
          ((n.imageSmoothingQuality = 'high'), n.drawImage(a, 0, 0, Ho.width, Ho.height));
        }
        return e.createPattern(Ho, 'repeat');
      });
}
function contourRings(e, t, a) {
  let n = [],
    r = new Map(),
    o = (u) => `${u.x},${u.y}`,
    l = (u, d) => u >= 0 && d >= 0 && u < e && d < t && a(u, d),
    s = (u, d, m, h, p) => {
      let g = { a: { x: u, y: d }, b: { x: m, y: h }, dir: p, used: !1 };
      n.push(g);
      let v = o(g.a),
        M = r.get(v);
      M ? M.push(g) : r.set(v, [g]);
    };
  for (let u = 0; u < t; u++)
    for (let d = 0; d < e; d++)
      l(d, u) &&
        (l(d, u - 1) || s(d, u, d + 1, u, 0),
        l(d + 1, u) || s(d + 1, u, d + 1, u + 1, 1),
        l(d, u + 1) || s(d + 1, u + 1, d, u + 1, 2),
        l(d - 1, u) || s(d, u + 1, d, u, 3));
  let c = [];
  for (let u of n) {
    if (u.used) continue;
    let d = [],
      m = u;
    for (; m && !m.used; ) {
      ((m.used = !0), d.push(m.a));
      let h = m.dir,
        p = (r.get(o(m.b)) ?? []).filter((g) => !g.used);
      (p.sort(
        (g, v) => [1, 0, 3, 2].indexOf((g.dir - h + 4) % 4) - [1, 0, 3, 2].indexOf((v.dir - h + 4) % 4),
      ),
        (m = p[0]));
    }
    d.length >= 4 && c.push(d);
  }
  return c;
}

export { contourRings, meadowPattern, texturePattern };

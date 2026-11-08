// Recovered from the Tideweald v16.11 build. Module: render/tile-cache

var levelFor = (e) => Math.ceil(Math.log2(Math.max(1e-4, e)) * 4 - 1e-6),
  levelScale = (e) => 2 ** (e / 4),
  bs = -18,
  OM = 24,
  Qp = 4,
  LM = 9,
  TileLayer = class Jp {
    constructor(t, a, n, r = 1, o = 1 / 0) {
      this.source = t;
      this.maxBytes = a;
      this.bounds = n;
      this.minForced = r;
      this.maxCoverGap = o;
      this.tiles = new Map();
      this.pool = [];
      this.bytes = 0;
      this.epoch = 0;
      this.fpChecked = new Map();
      this.built = 0;
      this.stats = { holes: 0, forced: 0, builds: 0, buildMs: 0, fallbacks: 0, farFallbacks: 0 };
    }
    invalidate() {
      this.epoch++;
    }
    recheck() {
      this.fpChecked.clear();
    }
    info() {
      return { tiles: this.tiles.size, bytes: this.bytes, limit: this.maxBytes };
    }
    clear() {
      for (let t of this.tiles.values()) this.release(t);
      (this.tiles.clear(), (this.bytes = 0));
    }
    release(t) {
      (this.pool.length < 24 ? this.pool.push(t.canvas) : ((t.canvas.width = 0), (t.canvas.height = 0)),
        (this.bytes -= 260 ** 2 * 4));
    }
    key(t, a, n) {
      return t + ':' + a + ':' + n;
    }
    rectOf(t, a, n) {
      let r = 256 / levelScale(t);
      return { x: a * r, y: n * r, w: r, h: r };
    }
    build(t, a, n, r, o) {
      let l = levelScale(t),
        s = this.rectOf(t, a, n),
        c = r;
      if (!c) {
        let m = this.pool.pop() ?? document.createElement('canvas'),
          h = 260;
        (m.width !== h && ((m.width = h), (m.height = h)),
          (c = { canvas: m, fp: 0, epoch: -1, used: 0, ready: !1, level: t, i: a, j: n }),
          (this.bytes += h * h * 4),
          this.tiles.set(this.key(t, a, n), c));
      }
      let u = c.canvas.getContext('2d');
      (u.setTransform(1, 0, 0, 1, 0, 0), u.clearRect(0, 0, c.canvas.width, c.canvas.height));
      let d = 2 / l;
      return (
        u.setTransform(l, 0, 0, l, -s.x * l + 2, -s.y * l + 2),
        u.save(),
        (c.empty = this.source.draw(u, { x: s.x - d, y: s.y - d, w: s.w + 2 * d, h: s.h + 2 * d }, l) === !1),
        u.restore(),
        (c.fp = o ?? this.source.fingerprint(s, l)),
        (c.epoch = this.epoch),
        (c.ready = !0),
        this.built++,
        c
      );
    }
    evict(t) {
      if (this.bytes <= this.maxBytes) return;
      let a = [...this.tiles.values()]
        .filter((n) => !t.has(n) && n.level !== bs)
        .sort((n, r) => n.used - r.used);
      for (let n of a) {
        if (this.bytes <= this.maxBytes) break;
        (this.tiles.delete(this.key(n.level, n.i, n.j)), this.release(n));
      }
    }
    draw(t, a, n, r) {
      this.fpChecked.size > 4e3 && this.fpChecked.clear();
      let o = levelFor(a.zoom * a.dpr),
        l = a.zooming ? Math.round(o / 4) * 4 : o,
        s = 256 / levelScale(l),
        c = -a.camX / a.zoom,
        u = -a.camY / a.zoom,
        d = c + a.width / a.zoom,
        m = u + a.height / a.zoom,
        h = Math.floor(c / s),
        p = Math.floor(d / s),
        g = Math.floor(u / s),
        v = Math.floor(m / s),
        M = new Set(),
        w = performance.now(),
        y = !1,
        k = 0,
        x = 0,
        T = 0,
        C = 0,
        R = 0;
      (t.save(), t.setTransform(1, 0, 0, 1, 0, 0), (t.imageSmoothingEnabled = !0));
      let b = (z) => Math.round((z * a.zoom + a.camX) * a.dpr),
        A = (z) => Math.round((z * a.zoom + a.camY) * a.dpr),
        E = (h + p) / 2,
        V = (g + v) / 2,
        Z = [];
      for (let z = g; z <= v; z++) for (let U = h; U <= p; U++) Z.push([U, z]);
      Z.sort((z, U) => Math.hypot(z[0] - E, z[1] - V) - Math.hypot(U[0] - E, U[1] - V));
      let L = [],
        N = { x: c, y: u, w: d - c, h: m - u },
        O = [
          ...new Set([...this.tiles.values()].filter((z) => z.ready && z.level !== l).map((z) => z.level)),
        ].sort((z, U) => Math.abs(z - l) - Math.abs(U - l) || U - z);
      for (let [z, U] of Z) {
        let Y = this.key(l, z, U),
          W = this.tiles.get(Y),
          j = !W || !W.ready || W.epoch !== this.epoch,
          Ae,
          Xe = null;
        if (
          (W &&
            !j &&
            this.fpChecked.get(Y) !== this.epoch &&
            ((Ae = this.source.fingerprint(this.rectOf(l, z, U), levelScale(l))),
            Ae !== W.fp ? (j = !0) : this.fpChecked.set(Y, this.epoch)),
          j)
        ) {
          W?.ready || (Xe = this.coverLevel(O, l, z, U, N));
          let Fe = Xe !== null && l - Xe <= this.maxCoverGap,
            ct = !!W?.ready || Fe;
          (!ct && x < OM && (x < this.minForced || performance.now() - w < LM)) ||
          (k < Qp && performance.now() < n)
            ? (ct ? k++ : x++,
              (W = this.build(l, z, U, W, Ae)),
              this.fpChecked.set(Y, this.epoch),
              (Xe = null))
            : (y = !0);
        }
        (W && (W.used = r), L.push({ tile: W?.ready ? W : null, i: z, j: U, cover: Xe }), W && M.add(W));
      }
      for (let z of L) {
        let U = b(z.i * s),
          Y = A(z.j * s),
          W = b((z.i + 1) * s),
          j = A((z.j + 1) * s);
        z.tile
          ? z.tile.empty || t.drawImage(z.tile.canvas, 2, 2, 256, 256, U, Y, W - U, j - Y)
          : z.cover !== null
            ? (C++,
              l - z.cover > 4 * 1.5 && R++,
              this.drawFallback(t, z.cover, l, z.i, z.j, a, M, U, Y, W - U, j - Y))
            : T++;
      }
      if (
        (t.restore(),
        (this.stats = {
          holes: T,
          forced: x,
          builds: k,
          buildMs: performance.now() - w,
          fallbacks: C,
          farFallbacks: R,
        }),
        performance.now() < n && this.bytes < this.maxBytes * 0.85)
      )
        e: for (let z = g - 1; z <= v + 1; z++)
          for (let U = h - 1; U <= p + 1; U++) {
            if (U >= h && U <= p && z >= g && z <= v) continue;
            let Y = this.tiles.get(this.key(l, U, z));
            if (Y && Y.ready && Y.epoch === this.epoch) {
              ((Y.used = r), M.add(Y));
              continue;
            }
            if (performance.now() >= n || k >= Qp) {
              y = !0;
              break e;
            }
            k++;
            let W = this.build(l, U, z, Y);
            ((W.used = r), M.add(W), this.fpChecked.set(this.key(l, U, z), this.epoch));
          }
      if (this.bounds && l !== bs && performance.now() < n && k < Qp) {
        let z = 256 / levelScale(bs),
          U = this.bounds;
        e: for (let Y = Math.floor(U.y / z); Y <= Math.floor((U.y + U.h) / z); Y++)
          for (let W = Math.floor(U.x / z); W <= Math.floor((U.x + U.w) / z); W++) {
            let j = this.tiles.get(this.key(bs, W, Y));
            if (!(j && j.ready && j.epoch === this.epoch)) {
              (this.build(bs, W, Y, j), this.fpChecked.set(this.key(bs, W, Y), this.epoch), (y = !0));
              break e;
            }
          }
      }
      return (this.evict(M), y);
    }
    coverLevel(t, a, n, r, o) {
      let l = this.rectOf(a, n, r),
        s = Math.max(l.x, o.x),
        c = Math.max(l.y, o.y),
        u = Math.min(l.x + l.w, o.x + o.w),
        d = Math.min(l.y + l.h, o.y + o.h);
      if (u <= s || d <= c) return null;
      let m = { x: s, y: c, w: u - s, h: d - c };
      for (let h of t) {
        let p = 256 / levelScale(h),
          g = Math.floor(m.x / p),
          v = Math.floor((m.x + m.w) / p - 1e-9),
          M = Math.floor(m.y / p),
          w = Math.floor((m.y + m.h) / p - 1e-9);
        if ((v - g + 1) * (w - M + 1) > 16) continue;
        let y = !0;
        for (let k = M; k <= w && y; k++)
          for (let x = g; x <= v; x++) {
            let T = this.tiles.get(this.key(h, x, k));
            if (!T || !T.ready) {
              y = !1;
              break;
            }
          }
        if (y) return h;
      }
      return null;
    }
    drawFallback(t, a, n, r, o, l, s, c, u, d, m) {
      let h = this.rectOf(n, r, o),
        p = 256 / levelScale(a),
        g = Math.floor(h.x / p),
        v = Math.floor((h.x + h.w) / p - 1e-9),
        M = Math.floor(h.y / p),
        w = Math.floor((h.y + h.h) / p - 1e-9);
      (t.save(), t.beginPath(), t.rect(c, u, d, m), t.clip());
      for (let y = M; y <= w; y++)
        for (let k = g; k <= v; k++) {
          let x = this.tiles.get(this.key(a, k, y));
          if (!x || !x.ready || (s.add(x), x.empty)) continue;
          let T = this.rectOf(a, k, y),
            C = Math.round((T.x * l.zoom + l.camX) * l.dpr),
            R = Math.round((T.y * l.zoom + l.camY) * l.dpr),
            b = Math.round(((T.x + T.w) * l.zoom + l.camX) * l.dpr),
            A = Math.round(((T.y + T.h) * l.zoom + l.camY) * l.dpr);
          t.drawImage(x.canvas, 2, 2, 256, 256, C, R, b - C, A - R);
        }
      t.restore();
    }
  };
var kc = TileLayer;
var ATLASES = {
    flora: 'flora',
    animals: 'animals',
    fauna: 'fauna',
    trees: 'trees',
    settlement: 'settlement',
    characters: 'characters',
    construction: 'construction',
    landmarks: 'landmarks',
    cottages: 'cottages',
    norse: 'norse',
    villagers: 'villagers-v9',
    roads: 'roads-v9',
    botanical: 'botanical',
    woodland: 'woodland',
    workshops: 'workshops',
    units: 'units-v13',
    shore: 'shore',
    bridges: 'bridges',
    folio: 'folio',
  },
  L8 = 'tideweald-art-style',
  currentArtStyle = 'carta';
try {
  let e = typeof localStorage < 'u' ? localStorage.getItem(L8) : null;
  (e === 'classic' || e === 'carta') && (currentArtStyle = e);
} catch {}
var e2 = new Set(),
  artStyle = () => currentArtStyle;
function setArtStyle(e) {
  if (e !== currentArtStyle) {
    currentArtStyle = e;
    try {
      localStorage.setItem(L8, e);
    } catch {}
    for (let t of e2) t(e);
  }
}
function onArtStyle(e) {
  return (
    e2.add(e),
    () => {
      e2.delete(e);
    }
  );
}
var ATLAS_VERSIONS = {
    animals: '169',
    fauna: '169',
    settlement: '169',
    cottages: '167',
    landmarks: '167',
    workshops: '167',
    norse: '169',
    construction: '167',
    bridges: '167',
    woodland: '169',
    botanical: '169',
    flora: '169',
    shore: '169',
    characters: '1610',
    folio: '1611',
    villagers: '169',
    units: '169',
  },
  atlasUrl = (e, t = currentArtStyle) =>
    `./art/${t}/${ATLASES[e] ?? e}.webp${ATLAS_VERSIONS[e] ? `?v=${ATLAS_VERSIONS[e]}` : ''}`;

export { ATLASES, artStyle, atlasUrl, kc, onArtStyle, setArtStyle };

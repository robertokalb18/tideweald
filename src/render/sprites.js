// Recovered from the Tideweald v16.11 build. Module: render/sprites
import { CATALOG } from '../world/catalog.js';
import { w6 } from '../world/spatial-index.js';
import { PLANT_DEFAULT, PLANT_SIZE, TREE_DEFAULT, TREE_SIZE } from './scale.js';

function plantLook(e) {
  let t = CATALOG[e.kind],
    a = !!t?.tree,
    n = t?.atlas ?? 'flora',
    r = t?.sprite ?? 1;
  e.growth < 0.12
    ? ((r = 0), (n = 'flora'))
    : a && e.growth < 0.43
      ? ((r = 2), (n = 'flora'))
      : e.kind === 'fern'
        ? ((n = 'botanical'), (r = 11))
        : e.kind === 'flowers' && e.variant > 0.5 && ((n = 'botanical'), (r = 15));
  // v17.1: sizes come from one scale table (render/scale.js); young plants grow towards the full-grown size.
  let o = a ? (TREE_SIZE[e.kind] ?? TREE_DEFAULT) : (PLANT_SIZE[e.kind] ?? PLANT_DEFAULT),
    l = (a ? 19 + (o - 19) * e.growth : o * (0.3 + 0.7 * e.growth)) * (0.82 + e.variant * 0.36);
  return {
    atlas: n,
    index: r,
    size: l,
    tree: a,
    flip: e.variant > 0.5 ? -1 : 1,
    wide: 0.91 + (e.id % 5) * 0.045,
    deciduous: a && !w6.has(e.kind),
  };
}
var UNIT_SPRITE_RECTS = {
  units: [
    [89, 14, 232, 293],
    [390, 15, 229, 292],
    [694, 16, 238, 290],
    [1011, 14, 225, 292],
    [78, 320, 242, 297],
    [394, 315, 209, 304],
    [697, 317, 227, 302],
    [1011, 320, 212, 298],
    [65, 643, 218, 289],
    [386, 642, 201, 291],
    [688, 643, 217, 290],
    [1010, 640, 198, 293],
    [77, 945, 232, 301],
    [391, 944, 224, 300],
    [695, 945, 228, 301],
    [1014, 944, 219, 301],
  ],
  workshops: [
    [40, 7, 283, 237],
    [449, 15, 192, 216],
    [755, 8, 288, 224],
    [1123, 19, 293, 217],
    [1527, 7, 216, 224],
    [1841, 7, 299, 230],
    [20, 253, 322, 213],
    [393, 254, 301, 216],
    [753, 243, 301, 226],
    [1118, 247, 309, 225],
    [1515, 241, 238, 248],
    [1838, 238, 303, 238],
    [23, 484, 317, 221],
    [372, 493, 343, 215],
    [733, 479, 337, 231],
    [1173, 479, 189, 235],
    [1462, 496, 341, 212],
    [1828, 489, 321, 224],
  ],
};
var vM = [
    [45, 10, 250, 315],
    [324, 20, 302, 300],
    [633, 25, 307, 300],
    [1010, 0, 198, 330],
    [7, 330, 318, 300],
    [403, 325, 135, 309],
    [641, 331, 293, 307],
    [945, 331, 305, 307],
    [5, 633, 318, 287],
    [325, 632, 297, 288],
    [630, 635, 306, 289],
    [945, 636, 303, 289],
    [7, 928, 310, 290],
    [321, 925, 298, 293],
    [636, 925, 288, 295],
    [931, 950, 319, 266],
  ],
  xM = [
    [16, 78, 413, 300],
    [463, 78, 409, 316],
    [902, 82, 417, 318],
    [1354, 86, 392, 282],
    [16, 496, 422, 328],
    [491, 491, 368, 337],
    [913, 489, 391, 352],
    [1357, 476, 392, 363],
  ];
var FOLIO_RECTS = [
  [22, 76, 219, 130],
  [299, 40, 167, 190],
  [537, 56, 211, 178],
  [822, 48, 191, 178],
  [1050, 146, 210, 84],
  [1343, 42, 126, 192],
  [1572, 120, 177, 103],
  [1828, 57, 178, 168],
  [40, 340, 176, 140],
  [290, 350, 190, 131],
  [553, 289, 176, 195],
  [804, 402, 184, 80],
  [1036, 424, 244, 66],
  [1339, 340, 155, 148],
  [1556, 388, 217, 98],
  [1808, 268, 226, 242],
  [23, 538, 212, 227],
  [294, 557, 197, 170],
  [541, 568, 218, 161],
  [812, 585, 189, 140],
  [1068, 586, 192, 139],
  [1310, 596, 215, 106],
  [1587, 542, 180, 116],
  [1843, 628, 180, 110],
  [26, 787, 203, 211],
  [272, 843, 224, 95],
  [519, 889, 236, 79],
  [827, 794, 141, 192],
  [1076, 768, 181, 217],
  [1369, 807, 78, 182],
  [1609, 797, 110, 202],
  [1872, 794, 96, 208],
  [86, 1045, 84, 218],
  [269, 1101, 218, 145],
  [527, 1109, 214, 140],
  [788, 1076, 194, 165],
  [1037, 1095, 218, 153],
];
function spriteRect(e, t) {
  if (e === 'folio') {
    let o = FOLIO_RECTS[t] ?? FOLIO_RECTS[0];
    return { x: o[0], y: o[1], w: o[2], h: o[3], iw: 2048, ih: 1280 };
  }
  if (e === 'bridges' || e === 'shore') {
    let o = (
      e === 'bridges'
        ? [
            [67, 121, 547, 433],
            [644, 121, 547, 433],
            [72, 688, 545, 439],
            [638, 688, 545, 439],
          ]
        : [
            [19, 110, 471, 362],
            [534, 171, 470, 315],
            [1041, 138, 476, 338],
            [28, 614, 484, 314],
            [565, 603, 421, 330],
            [1040, 543, 458, 393],
          ]
    )[t];
    return {
      x: o[0],
      y: o[1],
      w: o[2],
      h: o[3],
      iw: e === 'bridges' ? 1254 : 1536,
      ih: e === 'bridges' ? 1254 : 1024,
    };
  }
  if (e === 'workshops' || e === 'units') {
    let o = UNIT_SPRITE_RECTS[e][t];
    return {
      x: o[0],
      y: o[1],
      w: o[2],
      h: o[3],
      iw: e === 'units' ? 1254 : 2172,
      ih: e === 'units' ? 1254 : 724,
    };
  }
  if (e === 'woodland') {
    let o = [
      [0, 0, 349, 313],
      [348, 0, 294, 313],
      [642, 0, 289, 317],
      [943, 0, 311, 315],
      [0, 316, 344, 324],
      [346, 315, 295, 318],
      [652, 317, 286, 321],
      [955, 316, 299, 323],
      [0, 640, 347, 294],
      [350, 637, 286, 298],
      [640, 638, 300, 299],
      [941, 637, 313, 299],
      [0, 936, 344, 311],
      [345, 938, 296, 309],
      [643, 940, 300, 307],
      [945, 936, 309, 311],
    ][t];
    return { x: o[0], y: o[1], w: o[2], h: o[3], iw: 1254, ih: 1254 };
  }
  if (e === 'botanical') {
    let o = [
      [0, 0, 379, 429],
      [379, 0, 284, 429],
      [665, 0, 236, 429],
      [904, 70, 350, 360],
      [4, 432, 323, 276],
      [319, 463, 352, 240],
      [675, 477, 317, 228],
      [993, 431, 261, 274],
      [6, 711, 300, 291],
      [312, 708, 311, 289],
      [643, 737, 282, 255],
      [924, 733, 330, 268],
      [9, 1034, 342, 202],
      [355, 1040, 278, 191],
      [638, 1008, 315, 235],
      [957, 1010, 297, 237],
    ][t];
    return { x: o[0], y: o[1], w: o[2], h: o[3], iw: 1254, ih: 1254 };
  }
  if (e === 'villagers') {
    let o = t % 4,
      l = Math.floor(t / 4);
    return { x: o * 313.5 + 82, y: l * 313.5 + 4, w: 205, h: 305, iw: 1254, ih: 1254 };
  }
  if (e === 'norse') {
    let o = [
      [106, 6, 311, 506],
      [515, 91, 509, 378],
      [1024, 17, 503, 479],
      [36, 527, 445, 451],
      [540, 520, 464, 444],
      [1050, 631, 470, 320],
      [36, 527, 225, 451],
      [262, 535, 219, 443],
    ][t];
    return { x: o[0], y: o[1], w: o[2], h: o[3], iw: 1536, ih: 1024 };
  }
  if (e === 'landmarks' || e === 'cottages') {
    let o = (
      e === 'landmarks'
        ? [
            [21, 56, 411, 354],
            [476, 10, 324, 410],
            [833, 50, 409, 348],
            [20, 478, 405, 320],
            [447, 435, 392, 359],
            [872, 417, 361, 405],
            [25, 848, 379, 359],
            [440, 798, 404, 423],
            [890, 825, 350, 422],
          ]
        : [
            [20, 27, 476, 456],
            [578, 19, 371, 443],
            [1020, 33, 505, 463],
            [28, 514, 464, 476],
            [521, 514, 480, 445],
            [1026, 530, 496, 435],
          ]
    )[t];
    return {
      x: o[0],
      y: o[1],
      w: o[2],
      h: o[3],
      iw: e === 'landmarks' ? 1254 : 1536,
      ih: e === 'landmarks' ? 1254 : 1024,
    };
  }
  if (e === 'characters' || e === 'construction') {
    let l = (
      e === 'characters'
        ? [
            [23, 17, 477, 511],
            [519, 12, 523, 510],
            [1047, 16, 475, 506],
            [181, 540, 288, 436],
            [680, 545, 231, 421],
            [1138, 541, 273, 433],
          ]
        : [
            [0, 224, 672, 431],
            [725, 35, 666, 613],
            [1440, 7, 731, 682],
          ]
    )[t];
    return {
      x: l[0],
      y: l[1],
      w: l[2],
      h: l[3],
      iw: e === 'characters' ? 1536 : 2172,
      ih: e === 'characters' ? 1024 : 724,
    };
  }
  let a = e === 'trees' ? vM[t] : e === 'settlement' ? xM[t] : null,
    n = e === 'trees' ? 1254 : 1774,
    r = e === 'trees' ? 1254 : 887;
  return a
    ? { x: a[0], y: a[1], w: a[2], h: a[3], iw: n, ih: r }
    : { x: ((t % 4) * n) / 4, y: (Math.floor(t / 4) * r) / 2, w: n / 4, h: r / 2, iw: n, ih: r };
}
var BakeCache = class qp {
  constructor(t) {
    this.limit = t;
    this.map = new Map();
    this.bytes = 0;
  }
  get size() {
    return this.map.size;
  }
  get(t) {
    let a = this.map.get(t);
    return (a && (this.map.delete(t), this.map.set(t, a)), a);
  }
  put(t, a) {
    let n = a.width * a.height * 4;
    for (; this.bytes + n > this.limit && this.map.size; ) {
      let [r, o] = this.map.entries().next().value;
      ((this.bytes -= o.width * o.height * 4), (o.width = 0), (o.height = 0), this.map.delete(r));
    }
    return (this.map.set(t, a), (this.bytes += n), a);
  }
};
var kf = BakeCache,
  bc = new kf(28 * 1024 * 1024),
  wf = new kf(20 * 1024 * 1024),
  g8 = 0,
  y8 = (e, t) => e.naturalWidth / t,
  kM = [160, 240, 300, 400, 520];
function preparedSprite(e, t, a, n, r = 0) {
  r ||
    (r =
      t === 'landmarks' || t === 'norse'
        ? 300
        : t === 'settlement' || t === 'cottages' || t === 'folio'
          ? 240
          : 160);
  let o = `${e.src}|${t}|${a}|${n}|`,
    l = bc.get(o + r);
  if (l) return l;
  for (let h of kM) {
    if (h <= r) continue;
    let p = bc.get(o + h);
    if (p?.width) return p;
  }
  g8++;
  let s = spriteRect(t, a),
    c = y8(e, s.iw),
    u = Math.min(c, r / Math.max(s.w, s.h)),
    d = document.createElement('canvas');
  ((d.width = Math.ceil(s.w * u)), (d.height = Math.ceil(s.h * u)));
  let m = d.getContext('2d');
  return (
    (m.filter = n),
    m.drawImage(e, s.x * c, s.y * c, s.w * c, s.h * c, 0, 0, d.width, d.height),
    bc.put(o + r, d)
  );
}
var spriteCacheInfo = () => ({ entries: bc.size, bytes: bc.bytes + wf.bytes, bakes: g8, plants: wf.size });
function preparedPlant(e, t, a, n, r, o, l, s, c, u, d, m = 120) {
  let h = o ? m : Math.max(72, Math.round(m * 0.42)),
    p = `plant|${h}|${e.src}|${t}|${a}|${n}|${r}|${o}|${l}|${s}|${c}|${!!(u?.complete && u.naturalWidth)}|${!!(d?.complete && d.naturalWidth)}`,
    g = wf.get(p);
  if (g) return g;
  let v = document.createElement('canvas');
  ((v.width = h), (v.height = Math.round(h * (o ? 208 / 192 : 78 / 72))));
  let M = v.getContext('2d');
  M.scale(v.width / 192, v.height / 208);
  let w = spriteRect(t, a),
    y = y8(e, w.iw),
    k = 168 / Math.max(w.w, w.h),
    x = w.w * k,
    T = w.h * k,
    C = M.createRadialGradient(0, 0, 0, 0, 0, 1);
  if (
    (C.addColorStop(0, 'rgba(24,46,22,.24)'),
    C.addColorStop(0.6, 'rgba(24,46,22,.12)'),
    C.addColorStop(1, 'rgba(24,46,22,0)'),
    M.save(),
    M.translate(o ? 106 : 100, 181),
    M.scale(o ? 58 : 52, o ? 13 : 12),
    (M.fillStyle = C),
    M.beginPath(),
    M.arc(0, 0, 1, 0, Math.PI * 2),
    M.fill(),
    M.restore(),
    l && d?.complete && d.naturalWidth)
  ) {
    let R = preparedSprite(d, 'norse', 5, 'none');
    ((M.globalAlpha = 0.78), M.drawImage(R, 38, 162, 121, 39), (M.globalAlpha = 1));
  }
  if (c >= 0 && u?.complete && u.naturalWidth) {
    let R = preparedSprite(u, 'botanical', c, 'none');
    M.drawImage(R, 105, 155, 58, 38);
  }
  return (
    (M.filter = n),
    M.save(),
    M.translate(96, 178),
    M.scale(r, 1),
    M.drawImage(e, w.x * y, w.y * y, w.w * y, w.h * y, -x / 2, -T * 0.94, x, T),
    M.restore(),
    s &&
      (M.save(),
      M.beginPath(),
      M.ellipse(96, 194, 42, 11, 0, 0, Math.PI * 2),
      M.clip(),
      (M.globalAlpha = 0.16),
      M.translate(96, 185),
      M.scale(r, -0.28),
      M.drawImage(e, w.x * y, w.y * y, w.w * y, w.h * y, -x / 2, -T * 0.94, x, T),
      M.restore()),
    wf.put(p, v)
  );
}

export { plantLook, preparedPlant, preparedSprite, spriteCacheInfo, spriteRect };

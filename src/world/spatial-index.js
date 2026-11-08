// Recovered from the Tideweald v16.11 build. Module: world/spatial-index

var Rp = {
    redwood: 'beech',
    cedar: 'spruce',
    cypress: 'yew',
    palm: 'alder',
    baobab: 'hornbeam',
    jacaranda: 'hawthorn',
    olive: 'pear',
    orange: 'plum',
    banana: 'apple',
    bamboo: 'birch',
    acacia: 'rowan',
  },
  Kd = {
    oak: 0,
    pine: 1,
    birch: 2,
    maple: 3,
    willow: 4,
    beech: 5,
    alder: 6,
    hornbeam: 7,
    rowan: 8,
    spruce: 9,
    yew: 10,
    hawthorn: 11,
    apple: 12,
    pear: 13,
    plum: 14,
    cherry_tree: 15,
  },
  is = new Set(['apple', 'pear', 'plum', 'cherry_tree', 'berry']),
  Qd = new Set([
    'flowers',
    'berry',
    'cherry_tree',
    'hawthorn',
    'apple',
    'pear',
    'plum',
    'heather',
    'lupine',
    'bluebells',
  ]),
  w6 = new Set(['pine', 'spruce', 'yew']);
var SpatialIndex = class Ep {
  constructor(t, a = 4) {
    this.buckets = new Map();
    ((this.size = a),
      t.forEach((n, r) => {
        let o = this.key(n.x, n.y),
          l = this.buckets.get(o);
        l ? l.push({ value: n, order: r }) : this.buckets.set(o, [{ value: n, order: r }]);
      }));
  }
  key(t, a) {
    return Math.floor(a / this.size) * 1024 + Math.floor(t / this.size);
  }
  some(t, a, n, r) {
    let o = n * n;
    for (let l = Math.floor((a - n) / this.size); l <= Math.floor((a + n) / this.size); l++)
      for (let s = Math.floor((t - n) / this.size); s <= Math.floor((t + n) / this.size); s++) {
        let c = this.buckets.get(l * 1024 + s);
        if (c) {
          for (let { value: u } of c) if ((u.x - t) ** 2 + (u.y - a) ** 2 < o && r(u)) return !0;
        }
      }
    return !1;
  }
  first(t, a, n, r) {
    let o,
      l = 1 / 0,
      s = n * n;
    for (let c = Math.floor((a - n) / this.size); c <= Math.floor((a + n) / this.size); c++)
      for (let u = Math.floor((t - n) / this.size); u <= Math.floor((t + n) / this.size); u++) {
        let d = this.buckets.get(c * 1024 + u);
        if (d)
          for (let m of d)
            m.order < l &&
              (m.value.x - t) ** 2 + (m.value.y - a) ** 2 < s &&
              r(m.value) &&
              ((o = m.value), (l = m.order));
      }
    return o;
  }
  count(t, a, n, r, o = 1 / 0) {
    let l = 0,
      s = n * n;
    for (let c = Math.floor((a - n) / this.size); c <= Math.floor((a + n) / this.size); c++)
      for (let u = Math.floor((t - n) / this.size); u <= Math.floor((t + n) / this.size); u++) {
        let d = this.buckets.get(c * 1024 + u);
        if (d) {
          for (let { value: m } of d) if ((m.x - t) ** 2 + (m.y - a) ** 2 < s && r(m) && ++l >= o) return l;
        }
      }
    return l;
  }
};
var Kn = SpatialIndex;

export { Kd, Kn, Qd, Rp, is, w6 };

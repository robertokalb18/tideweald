// Recovered from the Tideweald v16.11 build. Module: vendor/class-variance-authority
import { clsx } from './clsx.js';

var falsyToString = (e) => (typeof e == 'boolean' ? `${e}` : e === 0 ? '0' : e),
  fv = clsx,
  cva = (e, t) => (a) => {
    if (t?.variants == null) return fv(e, a?.class, a?.className);
    let { variants: n, defaultVariants: r } = t,
      o = Object.keys(n).map((c) => {
        let u = a?.[c],
          d = r?.[c];
        if (u === null) return null;
        let m = falsyToString(u) || falsyToString(d);
        return n[c][m];
      }),
      l = a && Object.entries(a).reduce((c, [u, d]) => (d === void 0 || (c[u] = d), c), {}),
      s = t?.compoundVariants?.reduce(
        (c, { class: u, className: d, ...m }) =>
          Object.entries(m).every(([h, p]) =>
            Array.isArray(p) ? p.includes({ ...r, ...l }[h]) : { ...r, ...l }[h] === p,
          )
            ? [...c, u, d]
            : c,
        [],
      );
    return fv(e, o, s, a?.class, a?.className);
  };

export { cva };

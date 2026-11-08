// Recovered from the Tideweald v16.11 build. Module: vendor/clsx

function toVal(e) {
  var t,
    a,
    n = '';
  if (typeof e == 'string' || typeof e == 'number') n += e;
  else if (typeof e == 'object')
    if (Array.isArray(e)) {
      var r = e.length;
      for (t = 0; t < r; t++) e[t] && (a = toVal(e[t])) && (n && (n += ' '), (n += a));
    } else for (a in e) e[a] && (n && (n += ' '), (n += a));
  return n;
}
function clsx() {
  for (var e = 0, t, a, n = '', r = arguments.length; e < r; e++)
    (t = arguments[e]) && (a = toVal(t)) && (n && (n += ' '), (n += a));
  return n;
}

export { clsx };

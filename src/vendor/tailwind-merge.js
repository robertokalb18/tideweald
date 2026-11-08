// Recovered from the Tideweald v16.11 build. Module: vendor/tailwind-merge

var concatArrays = (e, t) => {
  let a = new Array(e.length + t.length);
  for (let n = 0; n < e.length; n++) a[n] = e[n];
  for (let n = 0; n < t.length; n++) a[e.length + n] = t[n];
  return a;
};
var createClassValidatorObject = (e, t) => ({ classGroupId: e, validator: t }),
  createClassPartObject = (e = new Map(), t = null, a) => ({ nextPart: e, validators: t, classGroupId: a }),
  Ld = '-',
  vv = [],
  rS = 'arbitrary..',
  createClassGroupUtils = (e) => {
    let t = createClassMap(e),
      { conflictingClassGroups: a, conflictingClassGroupModifiers: n } = e;
    return {
      getClassGroupId: (l) => {
        if (l.startsWith('[') && l.endsWith(']')) return getGroupIdForArbitraryProperty(l);
        let s = l.split(Ld),
          c = s[0] === '' && s.length > 1 ? 1 : 0;
        return getGroupRecursive(s, c, t);
      },
      getConflictingClassGroupIds: (l, s) => {
        if (s) {
          let c = n[l],
            u = a[l];
          return c ? (u ? concatArrays(u, c) : c) : u || vv;
        }
        return a[l] || vv;
      },
    };
  },
  getGroupRecursive = (e, t, a) => {
    if (e.length - t === 0) return a.classGroupId;
    let r = e[t],
      o = a.nextPart.get(r);
    if (o) {
      let u = getGroupRecursive(e, t + 1, o);
      if (u) return u;
    }
    let l = a.validators;
    if (l === null) return;
    let s = t === 0 ? e.join(Ld) : e.slice(t).join(Ld),
      c = l.length;
    for (let u = 0; u < c; u++) {
      let d = l[u];
      if (d.validator(s)) return d.classGroupId;
    }
  },
  getGroupIdForArbitraryProperty = (e) =>
    e.slice(1, -1).indexOf(':') === -1
      ? void 0
      : (() => {
          let t = e.slice(1, -1),
            a = t.indexOf(':'),
            n = t.slice(0, a);
          return n ? rS + n : void 0;
        })(),
  createClassMap = (e) => {
    let { theme: t, classGroups: a } = e;
    return processClassGroups(a, t);
  },
  processClassGroups = (e, t) => {
    let a = createClassPartObject();
    for (let n in e) {
      let r = e[n];
      processClassesRecursively(r, a, n, t);
    }
    return a;
  },
  processClassesRecursively = (e, t, a, n) => {
    let r = e.length;
    for (let o = 0; o < r; o++) {
      let l = e[o];
      processClassDefinition(l, t, a, n);
    }
  },
  processClassDefinition = (e, t, a, n) => {
    if (typeof e == 'string') {
      processStringDefinition(e, t, a);
      return;
    }
    if (typeof e == 'function') {
      processFunctionDefinition(e, t, a, n);
      return;
    }
    processObjectDefinition(e, t, a, n);
  },
  processStringDefinition = (e, t, a) => {
    let n = e === '' ? t : getPart(t, e);
    n.classGroupId = a;
  },
  processFunctionDefinition = (e, t, a, n) => {
    if (isThemeGetter(e)) {
      processClassesRecursively(e(n), t, a, n);
      return;
    }
    (t.validators === null && (t.validators = []), t.validators.push(createClassValidatorObject(a, e)));
  },
  processObjectDefinition = (e, t, a, n) => {
    let r = Object.entries(e),
      o = r.length;
    for (let l = 0; l < o; l++) {
      let [s, c] = r[l];
      processClassesRecursively(c, getPart(t, s), a, n);
    }
  },
  getPart = (e, t) => {
    let a = e,
      n = t.split(Ld),
      r = n.length;
    for (let o = 0; o < r; o++) {
      let l = n[o],
        s = a.nextPart.get(l);
      (s || ((s = createClassPartObject()), a.nextPart.set(l, s)), (a = s));
    }
    return a;
  },
  isThemeGetter = (e) => 'isThemeGetter' in e && e.isThemeGetter === !0;
var createLruCache = (e) => {
  if (e < 1) return { get: () => {}, set: () => {} };
  let t = 0,
    a = Object.create(null),
    n = Object.create(null),
    r = (o, l) => {
      ((a[o] = l), t++, t > e && ((t = 0), (n = a), (a = Object.create(null))));
    };
  return {
    get(o) {
      let l = a[o];
      if (l !== void 0) return l;
      if ((l = n[o]) !== void 0) return (r(o, l), l);
    },
    set(o, l) {
      o in a ? (a[o] = l) : r(o, l);
    },
  };
};
var Bd = '!',
  Tv = ':',
  hS = [],
  createResultObject = (e, t, a, n, r) => ({
    modifiers: e,
    hasImportantModifier: t,
    baseClassName: a,
    maybePostfixModifierPosition: n,
    isExternal: r,
  }),
  createParseClassName = (e) => {
    let { prefix: t, experimentalParseClassName: a } = e,
      n = (r) => {
        let o = [],
          l = 0,
          s = 0,
          c = 0,
          u,
          d = r.length;
        for (let v = 0; v < d; v++) {
          let M = r[v];
          if (l === 0 && s === 0) {
            if (M === Tv) {
              (o.push(r.slice(c, v)), (c = v + 1));
              continue;
            }
            if (M === '/') {
              u = v;
              continue;
            }
          }
          M === '[' ? l++ : M === ']' ? l-- : M === '(' ? s++ : M === ')' && s--;
        }
        let m = o.length === 0 ? r : r.slice(c),
          h = m,
          p = !1;
        m.endsWith(Bd) ? ((h = m.slice(0, -1)), (p = !0)) : m.startsWith(Bd) && ((h = m.slice(1)), (p = !0));
        let g = u && u > c ? u - c : void 0;
        return createResultObject(o, p, h, g);
      };
    if (t) {
      let r = t + Tv,
        o = n;
      n = (l) => (l.startsWith(r) ? o(l.slice(r.length)) : createResultObject(hS, !1, l, void 0, !0));
    }
    if (a) {
      let r = n;
      n = (o) => a({ className: o, parseClassName: r });
    }
    return n;
  };
var createSortModifiers = (e) => {
  let t = new Map();
  return (
    e.orderSensitiveModifiers.forEach((a, n) => {
      t.set(a, 1e6 + n);
    }),
    (a) => {
      let n = [],
        r = [];
      for (let o = 0; o < a.length; o++) {
        let l = a[o],
          s = l[0] === '[',
          c = t.has(l);
        s || c ? (r.length > 0 && (r.sort(), n.push(...r), (r = [])), n.push(l)) : r.push(l);
      }
      return (r.length > 0 && (r.sort(), n.push(...r)), n);
    }
  );
};
var createConfigUtils = (e) => ({
    cache: createLruCache(e.cacheSize),
    parseClassName: createParseClassName(e),
    sortModifiers: createSortModifiers(e),
    postfixLookupClassGroupIds: createPostfixLookupClassGroupIds(e),
    ...createClassGroupUtils(e),
  }),
  createPostfixLookupClassGroupIds = (e) => {
    let t = Object.create(null),
      a = e.postfixLookupClassGroups;
    if (a) for (let n = 0; n < a.length; n++) t[a[n]] = !0;
    return t;
  };
var pS = /\s+/,
  mergeClassList = (e, t) => {
    let {
        parseClassName: a,
        getClassGroupId: n,
        getConflictingClassGroupIds: r,
        sortModifiers: o,
        postfixLookupClassGroupIds: l,
      } = t,
      s = [],
      c = e.trim().split(pS),
      u = '';
    for (let d = c.length - 1; d >= 0; d -= 1) {
      let m = c[d],
        {
          isExternal: h,
          modifiers: p,
          hasImportantModifier: g,
          baseClassName: v,
          maybePostfixModifierPosition: M,
        } = a(m);
      if (h) {
        u = m + (u.length > 0 ? ' ' + u : u);
        continue;
      }
      let w = !!M,
        y;
      if (w) {
        let R = v.substring(0, M);
        y = n(R);
        let b = y && l[y] ? n(v) : void 0;
        b && b !== y && ((y = b), (w = !1));
      } else y = n(v);
      if (!y) {
        if (!w) {
          u = m + (u.length > 0 ? ' ' + u : u);
          continue;
        }
        if (((y = n(v)), !y)) {
          u = m + (u.length > 0 ? ' ' + u : u);
          continue;
        }
        w = !1;
      }
      let k = p.length === 0 ? '' : p.length === 1 ? p[0] : o(p).join(':'),
        x = g ? k + Bd : k,
        T = x + y;
      if (s.indexOf(T) > -1) continue;
      s.push(T);
      let C = r(y, w);
      for (let R = 0; R < C.length; ++R) {
        let b = C[R];
        s.push(x + b);
      }
      u = m + (u.length > 0 ? ' ' + u : u);
    }
    return u;
  };
var twJoin = (...e) => {
    let t = 0,
      a,
      n,
      r = '';
    for (; t < e.length; ) (a = e[t++]) && (n = toValue(a)) && (r && (r += ' '), (r += n));
    return r;
  },
  toValue = (e) => {
    if (typeof e == 'string') return e;
    let t,
      a = '';
    for (let n = 0; n < e.length; n++) e[n] && (t = toValue(e[n])) && (a && (a += ' '), (a += t));
    return a;
  };
var createTailwindMerge = (e, ...t) => {
  let a,
    n,
    r,
    o,
    l = (c) => {
      let u = t.reduce((d, m) => m(d), e());
      return ((a = createConfigUtils(u)), (n = a.cache.get), (r = a.cache.set), (o = s), s(c));
    },
    s = (c) => {
      let u = n(c);
      if (u) return u;
      let d = mergeClassList(c, a);
      return (r(c, d), d);
    };
  return ((o = l), (...c) => o(twJoin(...c)));
};
var gS = [],
  fromTheme = (e) => {
    let t = (a) => a[e] || gS;
    return ((t.isThemeGetter = !0), t);
  };
var Ov = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
  Lv = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
  yS = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
  bS = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
  vS =
    /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
  xS = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
  kS = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
  wS = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
  isFraction = (e) => yS.test(e),
  isNumber = (e) => !!e && !Number.isNaN(Number(e)),
  isInteger = (e) => !!e && Number.isInteger(Number(e)),
  isPercent = (e) => e.endsWith('%') && isNumber(e.slice(0, -1)),
  isTshirtSize = (e) => bS.test(e),
  isAny = () => !0,
  isLengthOnly = (e) => vS.test(e) && !xS.test(e),
  isNever = () => !1,
  isShadow = (e) => kS.test(e),
  isImage = (e) => wS.test(e),
  isAnyNonArbitrary = (e) => !isArbitraryValue(e) && !isArbitraryVariable(e),
  isNamedContainerQuery = (e) =>
    e.startsWith('@container') &&
    ((e[10] === '/' && e[11] !== void 0) ||
      (e[11] === 's' && e[16] !== void 0 && e.startsWith('-size/', 10)) ||
      (e[11] === 'n' && e[18] !== void 0 && e.startsWith('-normal/', 10))),
  isArbitrarySize = (e) => getIsArbitraryValue(e, isLabelSize, isNever),
  isArbitraryValue = (e) => Ov.test(e),
  isArbitraryLength = (e) => getIsArbitraryValue(e, isLabelLength, isLengthOnly),
  isArbitraryNumber = (e) => getIsArbitraryValue(e, isLabelNumber, isNumber),
  isArbitraryWeight = (e) => getIsArbitraryValue(e, isLabelWeight, isAny),
  isArbitraryFamilyName = (e) => getIsArbitraryValue(e, isLabelFamilyName, isNever),
  isArbitraryPosition = (e) => getIsArbitraryValue(e, isLabelPosition, isNever),
  isArbitraryImage = (e) => getIsArbitraryValue(e, isLabelImage, isImage),
  isArbitraryShadow = (e) => getIsArbitraryValue(e, isLabelShadow, isShadow),
  isArbitraryVariable = (e) => Lv.test(e),
  isArbitraryVariableLength = (e) => getIsArbitraryVariable(e, isLabelLength),
  isArbitraryVariableFamilyName = (e) => getIsArbitraryVariable(e, isLabelFamilyName),
  isArbitraryVariablePosition = (e) => getIsArbitraryVariable(e, isLabelPosition),
  isArbitraryVariableSize = (e) => getIsArbitraryVariable(e, isLabelSize),
  isArbitraryVariableImage = (e) => getIsArbitraryVariable(e, isLabelImage),
  isArbitraryVariableShadow = (e) => getIsArbitraryVariable(e, isLabelShadow, !0),
  isArbitraryVariableWeight = (e) => getIsArbitraryVariable(e, isLabelWeight, !0),
  getIsArbitraryValue = (e, t, a) => {
    let n = Ov.exec(e);
    return n ? (n[1] ? t(n[1]) : a(n[2])) : !1;
  },
  getIsArbitraryVariable = (e, t, a = !1) => {
    let n = Lv.exec(e);
    return n ? (n[1] ? t(n[1]) : a) : !1;
  },
  isLabelPosition = (e) => e === 'position' || e === 'percentage',
  isLabelImage = (e) => e === 'image' || e === 'url',
  isLabelSize = (e) => e === 'length' || e === 'size' || e === 'bg-size',
  isLabelLength = (e) => e === 'length',
  isLabelNumber = (e) => e === 'number',
  isLabelFamilyName = (e) => e === 'family-name',
  isLabelWeight = (e) => e === 'number' || e === 'weight',
  isLabelShadow = (e) => e === 'shadow';
var getDefaultConfig = () => {
  let e = fromTheme('color'),
    t = fromTheme('font'),
    a = fromTheme('text'),
    n = fromTheme('font-weight'),
    r = fromTheme('tracking'),
    o = fromTheme('leading'),
    l = fromTheme('breakpoint'),
    s = fromTheme('container'),
    c = fromTheme('spacing'),
    u = fromTheme('radius'),
    d = fromTheme('shadow'),
    m = fromTheme('inset-shadow'),
    h = fromTheme('text-shadow'),
    p = fromTheme('drop-shadow'),
    g = fromTheme('blur'),
    v = fromTheme('perspective'),
    M = fromTheme('aspect'),
    w = fromTheme('ease'),
    y = fromTheme('animate'),
    k = () => ['auto', 'avoid', 'all', 'avoid-page', 'page', 'left', 'right', 'column'],
    x = () => [
      'center',
      'top',
      'bottom',
      'left',
      'right',
      'top-left',
      'left-top',
      'top-right',
      'right-top',
      'bottom-right',
      'right-bottom',
      'bottom-left',
      'left-bottom',
    ],
    T = () => [...x(), isArbitraryVariable, isArbitraryValue],
    C = () => ['auto', 'hidden', 'clip', 'visible', 'scroll'],
    R = () => ['auto', 'contain', 'none'],
    b = () => [isArbitraryVariable, isArbitraryValue, c],
    A = () => [isFraction, 'full', 'auto', ...b()],
    E = () => [isInteger, 'none', 'subgrid', isArbitraryVariable, isArbitraryValue],
    V = () => [
      'auto',
      { span: ['full', isInteger, isArbitraryVariable, isArbitraryValue] },
      isInteger,
      isArbitraryVariable,
      isArbitraryValue,
    ],
    Z = () => [isInteger, 'auto', isArbitraryVariable, isArbitraryValue],
    L = () => ['auto', 'min', 'max', 'fr', isArbitraryVariable, isArbitraryValue],
    N = () => [
      'start',
      'end',
      'center',
      'between',
      'around',
      'evenly',
      'stretch',
      'baseline',
      'center-safe',
      'end-safe',
    ],
    O = () => ['start', 'end', 'center', 'stretch', 'center-safe', 'end-safe'],
    z = () => ['auto', ...b()],
    U = () => [
      isFraction,
      'auto',
      'full',
      'dvw',
      'dvh',
      'lvw',
      'lvh',
      'svw',
      'svh',
      'min',
      'max',
      'fit',
      ...b(),
    ],
    Y = () => [isFraction, 'screen', 'full', 'dvw', 'lvw', 'svw', 'min', 'max', 'fit', ...b()],
    W = () => [isFraction, 'screen', 'full', 'lh', 'dvh', 'lvh', 'svh', 'min', 'max', 'fit', ...b()],
    j = () => [e, isArbitraryVariable, isArbitraryValue],
    Ae = () => [
      ...x(),
      isArbitraryVariablePosition,
      isArbitraryPosition,
      { position: [isArbitraryVariable, isArbitraryValue] },
    ],
    Xe = () => ['no-repeat', { repeat: ['', 'x', 'y', 'space', 'round'] }],
    Fe = () => [
      'auto',
      'cover',
      'contain',
      isArbitraryVariableSize,
      isArbitrarySize,
      { size: [isArbitraryVariable, isArbitraryValue] },
    ],
    ct = () => [isPercent, isArbitraryVariableLength, isArbitraryLength],
    at = () => ['', 'none', 'full', u, isArbitraryVariable, isArbitraryValue],
    qe = () => ['', isNumber, isArbitraryVariableLength, isArbitraryLength],
    le = () => ['solid', 'dashed', 'dotted', 'double'],
    de = () => [
      'normal',
      'multiply',
      'screen',
      'overlay',
      'darken',
      'lighten',
      'color-dodge',
      'color-burn',
      'hard-light',
      'soft-light',
      'difference',
      'exclusion',
      'hue',
      'saturation',
      'color',
      'luminosity',
    ],
    re = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition],
    Ue = () => ['', 'none', g, isArbitraryVariable, isArbitraryValue],
    Be = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue],
    Je = () => ['none', isNumber, isArbitraryVariable, isArbitraryValue],
    Ft = () => [isNumber, isArbitraryVariable, isArbitraryValue],
    P = () => [isFraction, 'full', ...b()];
  return {
    cacheSize: 500,
    theme: {
      animate: ['spin', 'ping', 'pulse', 'bounce'],
      aspect: ['video'],
      blur: [isTshirtSize],
      breakpoint: [isTshirtSize],
      color: [isAny],
      container: [isTshirtSize],
      'drop-shadow': [isTshirtSize],
      ease: ['in', 'out', 'in-out'],
      font: [isAnyNonArbitrary],
      'font-weight': [
        'thin',
        'extralight',
        'light',
        'normal',
        'medium',
        'semibold',
        'bold',
        'extrabold',
        'black',
      ],
      'inset-shadow': [isTshirtSize],
      leading: ['none', 'tight', 'snug', 'normal', 'relaxed', 'loose'],
      perspective: ['dramatic', 'near', 'normal', 'midrange', 'distant', 'none'],
      radius: [isTshirtSize],
      shadow: [isTshirtSize],
      spacing: ['px', isNumber],
      text: [isTshirtSize],
      'text-shadow': [isTshirtSize],
      tracking: ['tighter', 'tight', 'normal', 'wide', 'wider', 'widest'],
    },
    classGroups: {
      aspect: [{ aspect: ['auto', 'square', isFraction, isArbitraryValue, isArbitraryVariable, M] }],
      container: ['container'],
      'container-type': [{ '@container': ['', 'normal', 'size', isArbitraryVariable, isArbitraryValue] }],
      'container-named': [isNamedContainerQuery],
      columns: [{ columns: [isNumber, isArbitraryValue, isArbitraryVariable, s] }],
      'break-after': [{ 'break-after': k() }],
      'break-before': [{ 'break-before': k() }],
      'break-inside': [{ 'break-inside': ['auto', 'avoid', 'avoid-page', 'avoid-column'] }],
      'box-decoration': [{ 'box-decoration': ['slice', 'clone'] }],
      box: [{ box: ['border', 'content'] }],
      display: [
        'block',
        'inline-block',
        'inline',
        'flex',
        'inline-flex',
        'table',
        'inline-table',
        'table-caption',
        'table-cell',
        'table-column',
        'table-column-group',
        'table-footer-group',
        'table-header-group',
        'table-row-group',
        'table-row',
        'flow-root',
        'grid',
        'inline-grid',
        'contents',
        'list-item',
        'hidden',
      ],
      sr: ['sr-only', 'not-sr-only'],
      float: [{ float: ['right', 'left', 'none', 'start', 'end'] }],
      clear: [{ clear: ['left', 'right', 'both', 'none', 'start', 'end'] }],
      isolation: ['isolate', 'isolation-auto'],
      'object-fit': [{ object: ['contain', 'cover', 'fill', 'none', 'scale-down'] }],
      'object-position': [{ object: T() }],
      overflow: [{ overflow: C() }],
      'overflow-x': [{ 'overflow-x': C() }],
      'overflow-y': [{ 'overflow-y': C() }],
      overscroll: [{ overscroll: R() }],
      'overscroll-x': [{ 'overscroll-x': R() }],
      'overscroll-y': [{ 'overscroll-y': R() }],
      position: ['static', 'fixed', 'absolute', 'relative', 'sticky'],
      inset: [{ inset: A() }],
      'inset-x': [{ 'inset-x': A() }],
      'inset-y': [{ 'inset-y': A() }],
      start: [{ 'inset-s': A(), start: A() }],
      end: [{ 'inset-e': A(), end: A() }],
      'inset-bs': [{ 'inset-bs': A() }],
      'inset-be': [{ 'inset-be': A() }],
      top: [{ top: A() }],
      right: [{ right: A() }],
      bottom: [{ bottom: A() }],
      left: [{ left: A() }],
      visibility: ['visible', 'invisible', 'collapse'],
      z: [{ z: [isInteger, 'auto', isArbitraryVariable, isArbitraryValue] }],
      basis: [{ basis: [isFraction, 'full', 'auto', s, ...b()] }],
      'flex-direction': [{ flex: ['row', 'row-reverse', 'col', 'col-reverse'] }],
      'flex-wrap': [{ flex: ['nowrap', 'wrap', 'wrap-reverse'] }],
      flex: [{ flex: [isNumber, isFraction, 'auto', 'initial', 'none', isArbitraryValue] }],
      grow: [{ grow: ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      shrink: [{ shrink: ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      order: [{ order: [isInteger, 'first', 'last', 'none', isArbitraryVariable, isArbitraryValue] }],
      'grid-cols': [{ 'grid-cols': E() }],
      'col-start-end': [{ col: V() }],
      'col-start': [{ 'col-start': Z() }],
      'col-end': [{ 'col-end': Z() }],
      'grid-rows': [{ 'grid-rows': E() }],
      'row-start-end': [{ row: V() }],
      'row-start': [{ 'row-start': Z() }],
      'row-end': [{ 'row-end': Z() }],
      'grid-flow': [{ 'grid-flow': ['row', 'col', 'dense', 'row-dense', 'col-dense'] }],
      'auto-cols': [{ 'auto-cols': L() }],
      'auto-rows': [{ 'auto-rows': L() }],
      gap: [{ gap: b() }],
      'gap-x': [{ 'gap-x': b() }],
      'gap-y': [{ 'gap-y': b() }],
      'justify-content': [{ justify: [...N(), 'normal'] }],
      'justify-items': [{ 'justify-items': [...O(), 'normal'] }],
      'justify-self': [{ 'justify-self': ['auto', ...O()] }],
      'align-content': [{ content: ['normal', ...N()] }],
      'align-items': [{ items: [...O(), { baseline: ['', 'last'] }] }],
      'align-self': [{ self: ['auto', ...O(), { baseline: ['', 'last'] }] }],
      'place-content': [{ 'place-content': N() }],
      'place-items': [{ 'place-items': [...O(), 'baseline'] }],
      'place-self': [{ 'place-self': ['auto', ...O()] }],
      p: [{ p: b() }],
      px: [{ px: b() }],
      py: [{ py: b() }],
      ps: [{ ps: b() }],
      pe: [{ pe: b() }],
      pbs: [{ pbs: b() }],
      pbe: [{ pbe: b() }],
      pt: [{ pt: b() }],
      pr: [{ pr: b() }],
      pb: [{ pb: b() }],
      pl: [{ pl: b() }],
      m: [{ m: z() }],
      mx: [{ mx: z() }],
      my: [{ my: z() }],
      ms: [{ ms: z() }],
      me: [{ me: z() }],
      mbs: [{ mbs: z() }],
      mbe: [{ mbe: z() }],
      mt: [{ mt: z() }],
      mr: [{ mr: z() }],
      mb: [{ mb: z() }],
      ml: [{ ml: z() }],
      'space-x': [{ 'space-x': b() }],
      'space-x-reverse': ['space-x-reverse'],
      'space-y': [{ 'space-y': b() }],
      'space-y-reverse': ['space-y-reverse'],
      size: [{ size: U() }],
      'inline-size': [{ inline: ['auto', ...Y()] }],
      'min-inline-size': [{ 'min-inline': ['auto', ...Y()] }],
      'max-inline-size': [{ 'max-inline': ['none', ...Y()] }],
      'block-size': [{ block: ['auto', ...W()] }],
      'min-block-size': [{ 'min-block': ['auto', ...W()] }],
      'max-block-size': [{ 'max-block': ['none', ...W()] }],
      w: [{ w: [s, 'screen', ...U()] }],
      'min-w': [{ 'min-w': [s, 'screen', 'none', ...U()] }],
      'max-w': [{ 'max-w': [s, 'screen', 'none', 'prose', { screen: [l] }, ...U()] }],
      h: [{ h: ['screen', 'lh', ...U()] }],
      'min-h': [{ 'min-h': ['screen', 'lh', 'none', ...U()] }],
      'max-h': [{ 'max-h': ['screen', 'lh', ...U()] }],
      'font-size': [{ text: ['base', a, isArbitraryVariableLength, isArbitraryLength] }],
      'font-smoothing': ['antialiased', 'subpixel-antialiased'],
      'font-style': ['italic', 'not-italic'],
      'font-weight': [{ font: [n, isArbitraryVariableWeight, isArbitraryWeight] }],
      'font-stretch': [
        {
          'font-stretch': [
            'ultra-condensed',
            'extra-condensed',
            'condensed',
            'semi-condensed',
            'normal',
            'semi-expanded',
            'expanded',
            'extra-expanded',
            'ultra-expanded',
            isPercent,
            isArbitraryValue,
          ],
        },
      ],
      'font-family': [{ font: [isArbitraryVariableFamilyName, isArbitraryFamilyName, t] }],
      'font-features': [{ 'font-features': [isArbitraryValue] }],
      'fvn-normal': ['normal-nums'],
      'fvn-ordinal': ['ordinal'],
      'fvn-slashed-zero': ['slashed-zero'],
      'fvn-figure': ['lining-nums', 'oldstyle-nums'],
      'fvn-spacing': ['proportional-nums', 'tabular-nums'],
      'fvn-fraction': ['diagonal-fractions', 'stacked-fractions'],
      tracking: [{ tracking: [r, isArbitraryVariable, isArbitraryValue] }],
      'line-clamp': [{ 'line-clamp': [isNumber, 'none', isArbitraryVariable, isArbitraryNumber] }],
      leading: [{ leading: [o, ...b()] }],
      'list-image': [{ 'list-image': ['none', isArbitraryVariable, isArbitraryValue] }],
      'list-style-position': [{ list: ['inside', 'outside'] }],
      'list-style-type': [{ list: ['disc', 'decimal', 'none', isArbitraryVariable, isArbitraryValue] }],
      'text-alignment': [{ text: ['left', 'center', 'right', 'justify', 'start', 'end'] }],
      'placeholder-color': [{ placeholder: j() }],
      'text-color': [{ text: j() }],
      'text-decoration': ['underline', 'overline', 'line-through', 'no-underline'],
      'text-decoration-style': [{ decoration: [...le(), 'wavy'] }],
      'text-decoration-thickness': [
        { decoration: [isNumber, 'from-font', 'auto', isArbitraryVariable, isArbitraryLength] },
      ],
      'text-decoration-color': [{ decoration: j() }],
      'underline-offset': [{ 'underline-offset': [isNumber, 'auto', isArbitraryVariable, isArbitraryValue] }],
      'text-transform': ['uppercase', 'lowercase', 'capitalize', 'normal-case'],
      'text-overflow': ['truncate', 'text-ellipsis', 'text-clip'],
      'text-wrap': [{ text: ['wrap', 'nowrap', 'balance', 'pretty'] }],
      indent: [{ indent: b() }],
      'tab-size': [{ tab: [isInteger, isArbitraryVariable, isArbitraryValue] }],
      'vertical-align': [
        {
          align: [
            'baseline',
            'top',
            'middle',
            'bottom',
            'text-top',
            'text-bottom',
            'sub',
            'super',
            isArbitraryVariable,
            isArbitraryValue,
          ],
        },
      ],
      whitespace: [{ whitespace: ['normal', 'nowrap', 'pre', 'pre-line', 'pre-wrap', 'break-spaces'] }],
      break: [{ break: ['normal', 'words', 'all', 'keep'] }],
      wrap: [{ wrap: ['break-word', 'anywhere', 'normal'] }],
      hyphens: [{ hyphens: ['none', 'manual', 'auto'] }],
      content: [{ content: ['none', isArbitraryVariable, isArbitraryValue] }],
      'bg-attachment': [{ bg: ['fixed', 'local', 'scroll'] }],
      'bg-clip': [{ 'bg-clip': ['border', 'padding', 'content', 'text'] }],
      'bg-origin': [{ 'bg-origin': ['border', 'padding', 'content'] }],
      'bg-position': [{ bg: Ae() }],
      'bg-repeat': [{ bg: Xe() }],
      'bg-size': [{ bg: Fe() }],
      'bg-image': [
        {
          bg: [
            'none',
            {
              linear: [
                { to: ['t', 'tr', 'r', 'br', 'b', 'bl', 'l', 'tl'] },
                isInteger,
                isArbitraryVariable,
                isArbitraryValue,
              ],
              radial: ['', isArbitraryVariable, isArbitraryValue],
              conic: [isInteger, isArbitraryVariable, isArbitraryValue],
            },
            isArbitraryVariableImage,
            isArbitraryImage,
          ],
        },
      ],
      'bg-color': [{ bg: j() }],
      'gradient-from-pos': [{ from: ct() }],
      'gradient-via-pos': [{ via: ct() }],
      'gradient-to-pos': [{ to: ct() }],
      'gradient-from': [{ from: j() }],
      'gradient-via': [{ via: j() }],
      'gradient-to': [{ to: j() }],
      rounded: [{ rounded: at() }],
      'rounded-s': [{ 'rounded-s': at() }],
      'rounded-e': [{ 'rounded-e': at() }],
      'rounded-t': [{ 'rounded-t': at() }],
      'rounded-r': [{ 'rounded-r': at() }],
      'rounded-b': [{ 'rounded-b': at() }],
      'rounded-l': [{ 'rounded-l': at() }],
      'rounded-ss': [{ 'rounded-ss': at() }],
      'rounded-se': [{ 'rounded-se': at() }],
      'rounded-ee': [{ 'rounded-ee': at() }],
      'rounded-es': [{ 'rounded-es': at() }],
      'rounded-tl': [{ 'rounded-tl': at() }],
      'rounded-tr': [{ 'rounded-tr': at() }],
      'rounded-br': [{ 'rounded-br': at() }],
      'rounded-bl': [{ 'rounded-bl': at() }],
      'border-w': [{ border: qe() }],
      'border-w-x': [{ 'border-x': qe() }],
      'border-w-y': [{ 'border-y': qe() }],
      'border-w-s': [{ 'border-s': qe() }],
      'border-w-e': [{ 'border-e': qe() }],
      'border-w-bs': [{ 'border-bs': qe() }],
      'border-w-be': [{ 'border-be': qe() }],
      'border-w-t': [{ 'border-t': qe() }],
      'border-w-r': [{ 'border-r': qe() }],
      'border-w-b': [{ 'border-b': qe() }],
      'border-w-l': [{ 'border-l': qe() }],
      'divide-x': [{ 'divide-x': qe() }],
      'divide-x-reverse': ['divide-x-reverse'],
      'divide-y': [{ 'divide-y': qe() }],
      'divide-y-reverse': ['divide-y-reverse'],
      'border-style': [{ border: [...le(), 'hidden', 'none'] }],
      'divide-style': [{ divide: [...le(), 'hidden', 'none'] }],
      'border-color': [{ border: j() }],
      'border-color-x': [{ 'border-x': j() }],
      'border-color-y': [{ 'border-y': j() }],
      'border-color-s': [{ 'border-s': j() }],
      'border-color-e': [{ 'border-e': j() }],
      'border-color-bs': [{ 'border-bs': j() }],
      'border-color-be': [{ 'border-be': j() }],
      'border-color-t': [{ 'border-t': j() }],
      'border-color-r': [{ 'border-r': j() }],
      'border-color-b': [{ 'border-b': j() }],
      'border-color-l': [{ 'border-l': j() }],
      'divide-color': [{ divide: j() }],
      'outline-style': [{ outline: [...le(), 'none', 'hidden'] }],
      'outline-offset': [{ 'outline-offset': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'outline-w': [{ outline: ['', isNumber, isArbitraryVariableLength, isArbitraryLength] }],
      'outline-color': [{ outline: j() }],
      shadow: [{ shadow: ['', 'none', d, isArbitraryVariableShadow, isArbitraryShadow] }],
      'shadow-color': [{ shadow: j() }],
      'inset-shadow': [{ 'inset-shadow': ['none', m, isArbitraryVariableShadow, isArbitraryShadow] }],
      'inset-shadow-color': [{ 'inset-shadow': j() }],
      'ring-w': [{ ring: qe() }],
      'ring-w-inset': ['ring-inset'],
      'ring-color': [{ ring: j() }],
      'ring-offset-w': [{ 'ring-offset': [isNumber, isArbitraryLength] }],
      'ring-offset-color': [{ 'ring-offset': j() }],
      'inset-ring-w': [{ 'inset-ring': qe() }],
      'inset-ring-color': [{ 'inset-ring': j() }],
      'text-shadow': [{ 'text-shadow': ['none', h, isArbitraryVariableShadow, isArbitraryShadow] }],
      'text-shadow-color': [{ 'text-shadow': j() }],
      opacity: [{ opacity: [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'mix-blend': [{ 'mix-blend': [...de(), 'plus-darker', 'plus-lighter'] }],
      'bg-blend': [{ 'bg-blend': de() }],
      'mask-clip': [
        { 'mask-clip': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] },
        'mask-no-clip',
      ],
      'mask-composite': [{ mask: ['add', 'subtract', 'intersect', 'exclude'] }],
      'mask-image-linear-pos': [{ 'mask-linear': [isNumber] }],
      'mask-image-linear-from-pos': [{ 'mask-linear-from': re() }],
      'mask-image-linear-to-pos': [{ 'mask-linear-to': re() }],
      'mask-image-linear-from-color': [{ 'mask-linear-from': j() }],
      'mask-image-linear-to-color': [{ 'mask-linear-to': j() }],
      'mask-image-t-from-pos': [{ 'mask-t-from': re() }],
      'mask-image-t-to-pos': [{ 'mask-t-to': re() }],
      'mask-image-t-from-color': [{ 'mask-t-from': j() }],
      'mask-image-t-to-color': [{ 'mask-t-to': j() }],
      'mask-image-r-from-pos': [{ 'mask-r-from': re() }],
      'mask-image-r-to-pos': [{ 'mask-r-to': re() }],
      'mask-image-r-from-color': [{ 'mask-r-from': j() }],
      'mask-image-r-to-color': [{ 'mask-r-to': j() }],
      'mask-image-b-from-pos': [{ 'mask-b-from': re() }],
      'mask-image-b-to-pos': [{ 'mask-b-to': re() }],
      'mask-image-b-from-color': [{ 'mask-b-from': j() }],
      'mask-image-b-to-color': [{ 'mask-b-to': j() }],
      'mask-image-l-from-pos': [{ 'mask-l-from': re() }],
      'mask-image-l-to-pos': [{ 'mask-l-to': re() }],
      'mask-image-l-from-color': [{ 'mask-l-from': j() }],
      'mask-image-l-to-color': [{ 'mask-l-to': j() }],
      'mask-image-x-from-pos': [{ 'mask-x-from': re() }],
      'mask-image-x-to-pos': [{ 'mask-x-to': re() }],
      'mask-image-x-from-color': [{ 'mask-x-from': j() }],
      'mask-image-x-to-color': [{ 'mask-x-to': j() }],
      'mask-image-y-from-pos': [{ 'mask-y-from': re() }],
      'mask-image-y-to-pos': [{ 'mask-y-to': re() }],
      'mask-image-y-from-color': [{ 'mask-y-from': j() }],
      'mask-image-y-to-color': [{ 'mask-y-to': j() }],
      'mask-image-radial': [{ 'mask-radial': [isArbitraryVariable, isArbitraryValue] }],
      'mask-image-radial-from-pos': [{ 'mask-radial-from': re() }],
      'mask-image-radial-to-pos': [{ 'mask-radial-to': re() }],
      'mask-image-radial-from-color': [{ 'mask-radial-from': j() }],
      'mask-image-radial-to-color': [{ 'mask-radial-to': j() }],
      'mask-image-radial-shape': [{ 'mask-radial': ['circle', 'ellipse'] }],
      'mask-image-radial-size': [
        { 'mask-radial': [{ closest: ['side', 'corner'], farthest: ['side', 'corner'] }] },
      ],
      'mask-image-radial-pos': [{ 'mask-radial-at': x() }],
      'mask-image-conic-pos': [{ 'mask-conic': [isNumber] }],
      'mask-image-conic-from-pos': [{ 'mask-conic-from': re() }],
      'mask-image-conic-to-pos': [{ 'mask-conic-to': re() }],
      'mask-image-conic-from-color': [{ 'mask-conic-from': j() }],
      'mask-image-conic-to-color': [{ 'mask-conic-to': j() }],
      'mask-mode': [{ mask: ['alpha', 'luminance', 'match'] }],
      'mask-origin': [{ 'mask-origin': ['border', 'padding', 'content', 'fill', 'stroke', 'view'] }],
      'mask-position': [{ mask: Ae() }],
      'mask-repeat': [{ mask: Xe() }],
      'mask-size': [{ mask: Fe() }],
      'mask-type': [{ 'mask-type': ['alpha', 'luminance'] }],
      'mask-image': [{ mask: ['none', isArbitraryVariable, isArbitraryValue] }],
      filter: [{ filter: ['', 'none', isArbitraryVariable, isArbitraryValue] }],
      blur: [{ blur: Ue() }],
      brightness: [{ brightness: [isNumber, isArbitraryVariable, isArbitraryValue] }],
      contrast: [{ contrast: [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'drop-shadow': [{ 'drop-shadow': ['', 'none', p, isArbitraryVariableShadow, isArbitraryShadow] }],
      'drop-shadow-color': [{ 'drop-shadow': j() }],
      grayscale: [{ grayscale: ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      'hue-rotate': [{ 'hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      invert: [{ invert: ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      saturate: [{ saturate: [isNumber, isArbitraryVariable, isArbitraryValue] }],
      sepia: [{ sepia: ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-filter': [{ 'backdrop-filter': ['', 'none', isArbitraryVariable, isArbitraryValue] }],
      'backdrop-blur': [{ 'backdrop-blur': Ue() }],
      'backdrop-brightness': [{ 'backdrop-brightness': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-contrast': [{ 'backdrop-contrast': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-grayscale': [{ 'backdrop-grayscale': ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-hue-rotate': [{ 'backdrop-hue-rotate': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-invert': [{ 'backdrop-invert': ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-opacity': [{ 'backdrop-opacity': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-saturate': [{ 'backdrop-saturate': [isNumber, isArbitraryVariable, isArbitraryValue] }],
      'backdrop-sepia': [{ 'backdrop-sepia': ['', isNumber, isArbitraryVariable, isArbitraryValue] }],
      'border-collapse': [{ border: ['collapse', 'separate'] }],
      'border-spacing': [{ 'border-spacing': b() }],
      'border-spacing-x': [{ 'border-spacing-x': b() }],
      'border-spacing-y': [{ 'border-spacing-y': b() }],
      'table-layout': [{ table: ['auto', 'fixed'] }],
      caption: [{ caption: ['top', 'bottom'] }],
      transition: [
        {
          transition: [
            '',
            'all',
            'colors',
            'opacity',
            'shadow',
            'transform',
            'none',
            isArbitraryVariable,
            isArbitraryValue,
          ],
        },
      ],
      'transition-behavior': [{ transition: ['normal', 'discrete'] }],
      duration: [{ duration: [isNumber, 'initial', isArbitraryVariable, isArbitraryValue] }],
      ease: [{ ease: ['linear', 'initial', w, isArbitraryVariable, isArbitraryValue] }],
      delay: [{ delay: [isNumber, isArbitraryVariable, isArbitraryValue] }],
      animate: [{ animate: ['none', y, isArbitraryVariable, isArbitraryValue] }],
      backface: [{ backface: ['hidden', 'visible'] }],
      perspective: [{ perspective: [v, isArbitraryVariable, isArbitraryValue] }],
      'perspective-origin': [{ 'perspective-origin': T() }],
      rotate: [{ rotate: Be() }],
      'rotate-x': [{ 'rotate-x': Be() }],
      'rotate-y': [{ 'rotate-y': Be() }],
      'rotate-z': [{ 'rotate-z': Be() }],
      scale: [{ scale: Je() }],
      'scale-x': [{ 'scale-x': Je() }],
      'scale-y': [{ 'scale-y': Je() }],
      'scale-z': [{ 'scale-z': Je() }],
      'scale-3d': ['scale-3d'],
      skew: [{ skew: Ft() }],
      'skew-x': [{ 'skew-x': Ft() }],
      'skew-y': [{ 'skew-y': Ft() }],
      transform: [{ transform: [isArbitraryVariable, isArbitraryValue, '', 'none', 'gpu', 'cpu'] }],
      'transform-origin': [{ origin: T() }],
      'transform-style': [{ transform: ['3d', 'flat'] }],
      translate: [{ translate: P() }],
      'translate-x': [{ 'translate-x': P() }],
      'translate-y': [{ 'translate-y': P() }],
      'translate-z': [{ 'translate-z': P() }],
      'translate-none': ['translate-none'],
      zoom: [{ zoom: [isInteger, isArbitraryVariable, isArbitraryValue] }],
      accent: [{ accent: j() }],
      appearance: [{ appearance: ['none', 'auto'] }],
      'caret-color': [{ caret: j() }],
      'color-scheme': [{ scheme: ['normal', 'dark', 'light', 'light-dark', 'only-dark', 'only-light'] }],
      cursor: [
        {
          cursor: [
            'auto',
            'default',
            'pointer',
            'wait',
            'text',
            'move',
            'help',
            'not-allowed',
            'none',
            'context-menu',
            'progress',
            'cell',
            'crosshair',
            'vertical-text',
            'alias',
            'copy',
            'no-drop',
            'grab',
            'grabbing',
            'all-scroll',
            'col-resize',
            'row-resize',
            'n-resize',
            'e-resize',
            's-resize',
            'w-resize',
            'ne-resize',
            'nw-resize',
            'se-resize',
            'sw-resize',
            'ew-resize',
            'ns-resize',
            'nesw-resize',
            'nwse-resize',
            'zoom-in',
            'zoom-out',
            isArbitraryVariable,
            isArbitraryValue,
          ],
        },
      ],
      'field-sizing': [{ 'field-sizing': ['fixed', 'content'] }],
      'pointer-events': [{ 'pointer-events': ['auto', 'none'] }],
      resize: [{ resize: ['none', '', 'y', 'x'] }],
      'scroll-behavior': [{ scroll: ['auto', 'smooth'] }],
      'scrollbar-thumb-color': [{ 'scrollbar-thumb': j() }],
      'scrollbar-track-color': [{ 'scrollbar-track': j() }],
      'scrollbar-gutter': [{ 'scrollbar-gutter': ['auto', 'stable', 'both'] }],
      'scrollbar-w': [{ scrollbar: ['auto', 'thin', 'none'] }],
      'scroll-m': [{ 'scroll-m': b() }],
      'scroll-mx': [{ 'scroll-mx': b() }],
      'scroll-my': [{ 'scroll-my': b() }],
      'scroll-ms': [{ 'scroll-ms': b() }],
      'scroll-me': [{ 'scroll-me': b() }],
      'scroll-mbs': [{ 'scroll-mbs': b() }],
      'scroll-mbe': [{ 'scroll-mbe': b() }],
      'scroll-mt': [{ 'scroll-mt': b() }],
      'scroll-mr': [{ 'scroll-mr': b() }],
      'scroll-mb': [{ 'scroll-mb': b() }],
      'scroll-ml': [{ 'scroll-ml': b() }],
      'scroll-p': [{ 'scroll-p': b() }],
      'scroll-px': [{ 'scroll-px': b() }],
      'scroll-py': [{ 'scroll-py': b() }],
      'scroll-ps': [{ 'scroll-ps': b() }],
      'scroll-pe': [{ 'scroll-pe': b() }],
      'scroll-pbs': [{ 'scroll-pbs': b() }],
      'scroll-pbe': [{ 'scroll-pbe': b() }],
      'scroll-pt': [{ 'scroll-pt': b() }],
      'scroll-pr': [{ 'scroll-pr': b() }],
      'scroll-pb': [{ 'scroll-pb': b() }],
      'scroll-pl': [{ 'scroll-pl': b() }],
      'snap-align': [{ snap: ['start', 'end', 'center', 'align-none'] }],
      'snap-stop': [{ snap: ['normal', 'always'] }],
      'snap-type': [{ snap: ['none', 'x', 'y', 'both'] }],
      'snap-strictness': [{ snap: ['mandatory', 'proximity'] }],
      touch: [{ touch: ['auto', 'none', 'manipulation'] }],
      'touch-x': [{ 'touch-pan': ['x', 'left', 'right'] }],
      'touch-y': [{ 'touch-pan': ['y', 'up', 'down'] }],
      'touch-pz': ['touch-pinch-zoom'],
      select: [{ select: ['none', 'text', 'all', 'auto'] }],
      'will-change': [
        { 'will-change': ['auto', 'scroll', 'contents', 'transform', isArbitraryVariable, isArbitraryValue] },
      ],
      fill: [{ fill: ['none', ...j()] }],
      'stroke-w': [{ stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber] }],
      stroke: [{ stroke: ['none', ...j()] }],
      'forced-color-adjust': [{ 'forced-color-adjust': ['auto', 'none'] }],
    },
    conflictingClassGroups: {
      'container-named': ['container-type'],
      overflow: ['overflow-x', 'overflow-y'],
      overscroll: ['overscroll-x', 'overscroll-y'],
      inset: ['inset-x', 'inset-y', 'inset-bs', 'inset-be', 'start', 'end', 'top', 'right', 'bottom', 'left'],
      'inset-x': ['right', 'left'],
      'inset-y': ['top', 'bottom'],
      flex: ['basis', 'grow', 'shrink'],
      gap: ['gap-x', 'gap-y'],
      p: ['px', 'py', 'ps', 'pe', 'pbs', 'pbe', 'pt', 'pr', 'pb', 'pl'],
      px: ['pr', 'pl'],
      py: ['pt', 'pb'],
      m: ['mx', 'my', 'ms', 'me', 'mbs', 'mbe', 'mt', 'mr', 'mb', 'ml'],
      mx: ['mr', 'ml'],
      my: ['mt', 'mb'],
      size: ['w', 'h'],
      'font-size': ['leading'],
      'fvn-normal': ['fvn-ordinal', 'fvn-slashed-zero', 'fvn-figure', 'fvn-spacing', 'fvn-fraction'],
      'fvn-ordinal': ['fvn-normal'],
      'fvn-slashed-zero': ['fvn-normal'],
      'fvn-figure': ['fvn-normal'],
      'fvn-spacing': ['fvn-normal'],
      'fvn-fraction': ['fvn-normal'],
      'line-clamp': ['display', 'overflow'],
      rounded: [
        'rounded-s',
        'rounded-e',
        'rounded-t',
        'rounded-r',
        'rounded-b',
        'rounded-l',
        'rounded-ss',
        'rounded-se',
        'rounded-ee',
        'rounded-es',
        'rounded-tl',
        'rounded-tr',
        'rounded-br',
        'rounded-bl',
      ],
      'rounded-s': ['rounded-ss', 'rounded-es'],
      'rounded-e': ['rounded-se', 'rounded-ee'],
      'rounded-t': ['rounded-tl', 'rounded-tr'],
      'rounded-r': ['rounded-tr', 'rounded-br'],
      'rounded-b': ['rounded-br', 'rounded-bl'],
      'rounded-l': ['rounded-tl', 'rounded-bl'],
      'border-spacing': ['border-spacing-x', 'border-spacing-y'],
      'border-w': [
        'border-w-x',
        'border-w-y',
        'border-w-s',
        'border-w-e',
        'border-w-bs',
        'border-w-be',
        'border-w-t',
        'border-w-r',
        'border-w-b',
        'border-w-l',
      ],
      'border-w-x': ['border-w-r', 'border-w-l'],
      'border-w-y': ['border-w-t', 'border-w-b'],
      'border-color': [
        'border-color-x',
        'border-color-y',
        'border-color-s',
        'border-color-e',
        'border-color-bs',
        'border-color-be',
        'border-color-t',
        'border-color-r',
        'border-color-b',
        'border-color-l',
      ],
      'border-color-x': ['border-color-r', 'border-color-l'],
      'border-color-y': ['border-color-t', 'border-color-b'],
      translate: ['translate-x', 'translate-y', 'translate-none'],
      'translate-none': ['translate', 'translate-x', 'translate-y', 'translate-z'],
      'scroll-m': [
        'scroll-mx',
        'scroll-my',
        'scroll-ms',
        'scroll-me',
        'scroll-mbs',
        'scroll-mbe',
        'scroll-mt',
        'scroll-mr',
        'scroll-mb',
        'scroll-ml',
      ],
      'scroll-mx': ['scroll-mr', 'scroll-ml'],
      'scroll-my': ['scroll-mt', 'scroll-mb'],
      'scroll-p': [
        'scroll-px',
        'scroll-py',
        'scroll-ps',
        'scroll-pe',
        'scroll-pbs',
        'scroll-pbe',
        'scroll-pt',
        'scroll-pr',
        'scroll-pb',
        'scroll-pl',
      ],
      'scroll-px': ['scroll-pr', 'scroll-pl'],
      'scroll-py': ['scroll-pt', 'scroll-pb'],
      touch: ['touch-x', 'touch-y', 'touch-pz'],
      'touch-x': ['touch'],
      'touch-y': ['touch'],
      'touch-pz': ['touch'],
    },
    conflictingClassGroupModifiers: { 'font-size': ['leading'] },
    postfixLookupClassGroups: ['container-type'],
    orderSensitiveModifiers: [
      '*',
      '**',
      'after',
      'backdrop',
      'before',
      'details-content',
      'file',
      'first-letter',
      'first-line',
      'marker',
      'placeholder',
      'selection',
    ],
  };
};
var Tp = createTailwindMerge(getDefaultConfig);

export { Tp };

// Recovered from the Tideweald v16.11 build. Module: vendor/zod

var wT = Object.defineProperty,
  __export = (e, t) => {
    for (var a in t) wT(e, a, { get: t[a], enumerable: !0 });
  },
  z = {};
__export(z, {
  BRAND: () => XT,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => AT,
  INVALID: () => ve,
  NEVER: () => DC,
  OK: () => Ea,
  ParseStatus: () => qa,
  Schema: () => Le,
  ZodAny: () => Uf,
  ZodArray: () => Ec,
  ZodBigInt: () => A2,
  ZodBoolean: () => R2,
  ZodBranded: () => U2,
  ZodCatch: () => H2,
  ZodDate: () => E2,
  ZodDefault: () => j2,
  ZodDiscriminatedUnion: () => N7,
  ZodEffects: () => Ki,
  ZodEnum: () => Wf,
  ZodError: () => Jr,
  ZodFirstPartyTypeKind: () => H7,
  ZodFunction: () => O7,
  ZodIntersection: () => _2,
  ZodIssueCode: () => $,
  ZodLazy: () => O2,
  ZodLiteral: () => L2,
  ZodMap: () => D7,
  ZodNaN: () => B7,
  ZodNativeEnum: () => B2,
  ZodNever: () => qi,
  ZodNull: () => z2,
  ZodNullable: () => zs,
  ZodNumber: () => C2,
  ZodObject: () => Es,
  ZodOptional: () => Wo,
  ZodParsedType: () => ne,
  ZodPipeline: () => P2,
  ZodPromise: () => If,
  ZodReadonly: () => W2,
  ZodRecord: () => z7,
  ZodSchema: () => Le,
  ZodSet: () => _7,
  ZodString: () => Pf,
  ZodSymbol: () => R7,
  ZodTransformer: () => Ki,
  ZodTuple: () => Ns,
  ZodType: () => Le,
  ZodUndefined: () => N2,
  ZodUnion: () => D2,
  ZodUnknown: () => Ac,
  ZodVoid: () => E7,
  addIssueToContext: () => addIssueToContext,
  any: () => rC,
  array: () => sC,
  bigint: () => JT,
  boolean: () => W7,
  coerce: () => zC,
  custom: () => custom,
  date: () => eC,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => Rs,
  discriminatedUnion: () => fC,
  effect: () => S7,
  enum: () => kC,
  function: () => bC,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType,
  instanceof: () => instanceOfType,
  intersection: () => hC,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => FT,
  lazy: () => vC,
  literal: () => xC,
  makeIssue: () => makeIssue,
  map: () => gC,
  nan: () => QT,
  nativeEnum: () => wC,
  never: () => iC,
  null: () => nC,
  nullable: () => TC,
  number: () => P7,
  object: () => cC,
  objectUtil: () => w2,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => MC,
  ostring: () => ostring,
  pipeline: () => AC,
  preprocess: () => CC,
  promise: () => SC,
  quotelessJson: () => quotelessJson,
  record: () => pC,
  set: () => yC,
  setErrorMap: () => setErrorMap,
  strictObject: () => uC,
  string: () => U7,
  symbol: () => tC,
  transformer: () => S7,
  tuple: () => mC,
  undefined: () => aC,
  union: () => dC,
  unknown: () => oC,
  util: () => Ye,
  void: () => lC,
});
var Ye;
((e) => {
  e.assertEqual = (r) => {};
  function t(r) {}
  (t, (e.assertIs = t));
  function a(r) {
    throw new Error();
  }
  (a,
    (e.assertNever = a),
    (e.arrayToEnum = (r) => {
      let o = {};
      for (let l of r) o[l] = l;
      return o;
    }),
    (e.getValidEnumValues = (r) => {
      let o = (0, e.objectKeys)(r).filter((s) => typeof r[r[s]] != 'number'),
        l = {};
      for (let s of o) l[s] = r[s];
      return (0, e.objectValues)(l);
    }),
    (e.objectValues = (r) =>
      (0, e.objectKeys)(r).map(function (o) {
        return r[o];
      })),
    (e.objectKeys =
      typeof Object.keys == 'function'
        ? (r) => Object.keys(r)
        : (r) => {
            let o = [];
            for (let l in r) Object.prototype.hasOwnProperty.call(r, l) && o.push(l);
            return o;
          }),
    (e.find = (r, o) => {
      for (let l of r) if (o(l)) return l;
    }),
    (e.isInteger =
      typeof Number.isInteger == 'function'
        ? (r) => Number.isInteger(r)
        : (r) => typeof r == 'number' && Number.isFinite(r) && Math.floor(r) === r));
  function n(r, o = ' | ') {
    return r.map((l) => (typeof l == 'string' ? `'${l}'` : l)).join(o);
  }
  (n, (e.joinValues = n), (e.jsonStringifyReplacer = (r, o) => (typeof o == 'bigint' ? o.toString() : o)));
})(Ye || (Ye = {}));
var w2;
((e) => {
  e.mergeShapes = (t, a) => ({ ...t, ...a });
})(w2 || (w2 = {}));
var ne = Ye.arrayToEnum([
    'string',
    'nan',
    'number',
    'integer',
    'float',
    'boolean',
    'date',
    'bigint',
    'symbol',
    'function',
    'undefined',
    'null',
    'array',
    'object',
    'unknown',
    'promise',
    'void',
    'never',
    'map',
    'set',
  ]),
  getParsedType = (e) => {
    switch (typeof e) {
      case 'undefined':
        return ne.undefined;
      case 'string':
        return ne.string;
      case 'number':
        return Number.isNaN(e) ? ne.nan : ne.number;
      case 'boolean':
        return ne.boolean;
      case 'function':
        return ne.function;
      case 'bigint':
        return ne.bigint;
      case 'symbol':
        return ne.symbol;
      case 'object':
        return Array.isArray(e)
          ? ne.array
          : e === null
            ? ne.null
            : e.then && typeof e.then == 'function' && e.catch && typeof e.catch == 'function'
              ? ne.promise
              : typeof Map < 'u' && e instanceof Map
                ? ne.map
                : typeof Set < 'u' && e instanceof Set
                  ? ne.set
                  : typeof Date < 'u' && e instanceof Date
                    ? ne.date
                    : ne.object;
      default:
        return ne.unknown;
    }
  },
  $ = Ye.arrayToEnum([
    'invalid_type',
    'invalid_literal',
    'custom',
    'invalid_union',
    'invalid_union_discriminator',
    'invalid_enum_value',
    'unrecognized_keys',
    'invalid_arguments',
    'invalid_return_type',
    'invalid_date',
    'invalid_string',
    'too_small',
    'too_big',
    'invalid_intersection_types',
    'not_multiple_of',
    'not_finite',
  ]),
  quotelessJson = (e) => JSON.stringify(e, null, 2).replace(/"([^"]+)":/g, '$1:'),
  Zr,
  Jr =
    ((Zr = class extends Error {
      constructor(t) {
        (super(),
          (this.issues = []),
          (this.addIssue = (n) => {
            this.issues = [...this.issues, n];
          }),
          (this.addIssues = (n = []) => {
            this.issues = [...this.issues, ...n];
          }));
        let a = new.target.prototype;
        (Object.setPrototypeOf ? Object.setPrototypeOf(this, a) : (this.__proto__ = a),
          (this.name = 'ZodError'),
          (this.issues = t));
      }
      get errors() {
        return this.issues;
      }
      format(t) {
        let a =
            t ||
            function (o) {
              return o.message;
            },
          n = { _errors: [] },
          r = (o) => {
            for (let l of o.issues)
              if (l.code === 'invalid_union') l.unionErrors.map(r);
              else if (l.code === 'invalid_return_type') r(l.returnTypeError);
              else if (l.code === 'invalid_arguments') r(l.argumentsError);
              else if (l.path.length === 0) n._errors.push(a(l));
              else {
                let s = n,
                  c = 0;
                for (; c < l.path.length; ) {
                  let u = l.path[c];
                  (c === l.path.length - 1
                    ? ((s[u] = s[u] || { _errors: [] }), s[u]._errors.push(a(l)))
                    : (s[u] = s[u] || { _errors: [] }),
                    (s = s[u]),
                    c++);
                }
              }
          };
        return (r(this), n);
      }
      static assert(t) {
        if (!(t instanceof Zr)) throw new Error(`Not a ZodError: ${t}`);
      }
      toString() {
        return this.message;
      }
      get message() {
        return JSON.stringify(this.issues, Ye.jsonStringifyReplacer, 2);
      }
      get isEmpty() {
        return this.issues.length === 0;
      }
      flatten(t = (a) => a.message) {
        let a = {},
          n = [];
        for (let r of this.issues)
          if (r.path.length > 0) {
            let o = r.path[0];
            ((a[o] = a[o] || []), a[o].push(t(r)));
          } else n.push(t(r));
        return { formErrors: n, fieldErrors: a };
      }
      get formErrors() {
        return this.flatten();
      }
    }),
    Zr,
    (Zr.create = (t) => new Zr(t)),
    Zr),
  errorMap = (e, t) => {
    let a;
    switch (e.code) {
      case $.invalid_type:
        e.received === ne.undefined
          ? (a = 'Required')
          : (a = `Expected ${e.expected}, received ${e.received}`);
        break;
      case $.invalid_literal:
        a = `Invalid literal value, expected ${JSON.stringify(e.expected, Ye.jsonStringifyReplacer)}`;
        break;
      case $.unrecognized_keys:
        a = `Unrecognized key(s) in object: ${Ye.joinValues(e.keys, ', ')}`;
        break;
      case $.invalid_union:
        a = 'Invalid input';
        break;
      case $.invalid_union_discriminator:
        a = `Invalid discriminator value. Expected ${Ye.joinValues(e.options)}`;
        break;
      case $.invalid_enum_value:
        a = `Invalid enum value. Expected ${Ye.joinValues(e.options)}, received '${e.received}'`;
        break;
      case $.invalid_arguments:
        a = 'Invalid function arguments';
        break;
      case $.invalid_return_type:
        a = 'Invalid function return type';
        break;
      case $.invalid_date:
        a = 'Invalid date';
        break;
      case $.invalid_string:
        typeof e.validation == 'object'
          ? 'includes' in e.validation
            ? ((a = `Invalid input: must include "${e.validation.includes}"`),
              typeof e.validation.position == 'number' &&
                (a = `${a} at one or more positions greater than or equal to ${e.validation.position}`))
            : 'startsWith' in e.validation
              ? (a = `Invalid input: must start with "${e.validation.startsWith}"`)
              : 'endsWith' in e.validation
                ? (a = `Invalid input: must end with "${e.validation.endsWith}"`)
                : Ye.assertNever(e.validation)
          : e.validation !== 'regex'
            ? (a = `Invalid ${e.validation}`)
            : (a = 'Invalid');
        break;
      case $.too_small:
        e.type === 'array'
          ? (a = `Array must contain ${e.exact ? 'exactly' : e.inclusive ? 'at least' : 'more than'} ${e.minimum} element(s)`)
          : e.type === 'string'
            ? (a = `String must contain ${e.exact ? 'exactly' : e.inclusive ? 'at least' : 'over'} ${e.minimum} character(s)`)
            : e.type === 'number'
              ? (a = `Number must be ${e.exact ? 'exactly equal to ' : e.inclusive ? 'greater than or equal to ' : 'greater than '}${e.minimum}`)
              : e.type === 'bigint'
                ? (a = `Number must be ${e.exact ? 'exactly equal to ' : e.inclusive ? 'greater than or equal to ' : 'greater than '}${e.minimum}`)
                : e.type === 'date'
                  ? (a = `Date must be ${e.exact ? 'exactly equal to ' : e.inclusive ? 'greater than or equal to ' : 'greater than '}${new Date(Number(e.minimum))}`)
                  : (a = 'Invalid input');
        break;
      case $.too_big:
        e.type === 'array'
          ? (a = `Array must contain ${e.exact ? 'exactly' : e.inclusive ? 'at most' : 'less than'} ${e.maximum} element(s)`)
          : e.type === 'string'
            ? (a = `String must contain ${e.exact ? 'exactly' : e.inclusive ? 'at most' : 'under'} ${e.maximum} character(s)`)
            : e.type === 'number'
              ? (a = `Number must be ${e.exact ? 'exactly' : e.inclusive ? 'less than or equal to' : 'less than'} ${e.maximum}`)
              : e.type === 'bigint'
                ? (a = `BigInt must be ${e.exact ? 'exactly' : e.inclusive ? 'less than or equal to' : 'less than'} ${e.maximum}`)
                : e.type === 'date'
                  ? (a = `Date must be ${e.exact ? 'exactly' : e.inclusive ? 'smaller than or equal to' : 'smaller than'} ${new Date(Number(e.maximum))}`)
                  : (a = 'Invalid input');
        break;
      case $.custom:
        a = 'Invalid input';
        break;
      case $.invalid_intersection_types:
        a = 'Intersection results could not be merged';
        break;
      case $.not_multiple_of:
        a = `Number must be a multiple of ${e.multipleOf}`;
        break;
      case $.not_finite:
        a = 'Number must be finite';
        break;
      default:
        ((a = t.defaultError), Ye.assertNever(e));
    }
    return { message: a };
  },
  Rs = errorMap,
  M7 = Rs;
function setErrorMap(e) {
  M7 = e;
}
function getErrorMap() {
  return M7;
}
var makeIssue = (e) => {
    let { data: t, path: a, errorMaps: n, issueData: r } = e,
      o = [...a, ...(r.path || [])],
      l = { ...r, path: o };
    if (r.message !== void 0) return { ...r, path: o, message: r.message };
    let s = '',
      c = n
        .filter((u) => !!u)
        .slice()
        .reverse();
    for (let u of c) s = u(l, { data: t, defaultError: s }).message;
    return { ...r, path: o, message: s };
  },
  AT = [];
function addIssueToContext(e, t) {
  let a = getErrorMap(),
    n = makeIssue({
      issueData: t,
      data: e.data,
      path: e.path,
      errorMaps: [e.common.contextualErrorMap, e.schemaErrorMap, a, a === Rs ? void 0 : Rs].filter(
        (r) => !!r,
      ),
    });
  e.common.issues.push(n);
}
var Yi,
  qa =
    ((Yi = class {
      constructor() {
        this.value = 'valid';
      }
      dirty() {
        this.value === 'valid' && (this.value = 'dirty');
      }
      abort() {
        this.value !== 'aborted' && (this.value = 'aborted');
      }
      static mergeArray(t, a) {
        let n = [];
        for (let r of a) {
          if (r.status === 'aborted') return ve;
          (r.status === 'dirty' && t.dirty(), n.push(r.value));
        }
        return { status: t.value, value: n };
      }
      static async mergeObjectAsync(t, a) {
        let n = [];
        for (let r of a) {
          let o = await r.key,
            l = await r.value;
          n.push({ key: o, value: l });
        }
        return Yi.mergeObjectSync(t, n);
      }
      static mergeObjectSync(t, a) {
        let n = {};
        for (let r of a) {
          let { key: o, value: l } = r;
          if (o.status === 'aborted' || l.status === 'aborted') return ve;
          (o.status === 'dirty' && t.dirty(),
            l.status === 'dirty' && t.dirty(),
            o.value !== '__proto__' && (typeof l.value < 'u' || r.alwaysSet) && (n[o.value] = l.value));
        }
        return { status: t.value, value: n };
      }
    }),
    Yi,
    Yi),
  ve = Object.freeze({ status: 'aborted' }),
  DIRTY = (e) => ({ status: 'dirty', value: e }),
  Ea = (e) => ({ status: 'valid', value: e }),
  isAborted = (e) => e.status === 'aborted',
  isDirty = (e) => e.status === 'dirty',
  isValid = (e) => e.status === 'valid',
  isAsync = (e) => typeof Promise < 'u' && e instanceof Promise,
  ue;
((e) => {
  ((e.errToObj = (t) => (typeof t == 'string' ? { message: t } : t || {})),
    (e.toString = (t) => (typeof t == 'string' ? t : t?.message)));
})(ue || (ue = {}));
var Ts,
  rr =
    ((Ts = class {
      constructor(t, a, n, r) {
        ((this._cachedPath = []), (this.parent = t), (this.data = a), (this._path = n), (this._key = r));
      }
      get path() {
        return (
          this._cachedPath.length ||
            (Array.isArray(this._key)
              ? this._cachedPath.push(...this._path, ...this._key)
              : this._cachedPath.push(...this._path, this._key)),
          this._cachedPath
        );
      }
    }),
    Ts,
    Ts),
  handleResult = (e, t) => {
    if (isValid(t)) return { success: !0, data: t.value };
    if (!e.common.issues.length) throw new Error('Validation failed but no issues detected.');
    return {
      success: !1,
      get error() {
        if (this._error) return this._error;
        let a = new Jr(e.common.issues);
        return ((this._error = a), this._error);
      },
    };
  };
function processCreateParams(e) {
  if (!e) return {};
  let { errorMap: t, invalid_type_error: a, required_error: n, description: r } = e;
  if (t && (a || n))
    throw new Error(
      `Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`,
    );
  return t
    ? { errorMap: t, description: r }
    : {
        errorMap: (l, s) => {
          let { message: c } = e;
          return l.code === 'invalid_enum_value'
            ? { message: c ?? s.defaultError }
            : typeof s.data > 'u'
              ? { message: c ?? n ?? s.defaultError }
              : l.code !== 'invalid_type'
                ? { message: s.defaultError }
                : { message: c ?? a ?? s.defaultError };
        },
        description: r,
      };
}
var Cs,
  Le =
    ((Cs = class {
      constructor(t) {
        ((this.spa = this.safeParseAsync),
          (this._def = t),
          (this.parse = this.parse.bind(this)),
          (this.safeParse = this.safeParse.bind(this)),
          (this.parseAsync = this.parseAsync.bind(this)),
          (this.safeParseAsync = this.safeParseAsync.bind(this)),
          (this.spa = this.spa.bind(this)),
          (this.refine = this.refine.bind(this)),
          (this.refinement = this.refinement.bind(this)),
          (this.superRefine = this.superRefine.bind(this)),
          (this.optional = this.optional.bind(this)),
          (this.nullable = this.nullable.bind(this)),
          (this.nullish = this.nullish.bind(this)),
          (this.array = this.array.bind(this)),
          (this.promise = this.promise.bind(this)),
          (this.or = this.or.bind(this)),
          (this.and = this.and.bind(this)),
          (this.transform = this.transform.bind(this)),
          (this.brand = this.brand.bind(this)),
          (this.default = this.default.bind(this)),
          (this.catch = this.catch.bind(this)),
          (this.describe = this.describe.bind(this)),
          (this.pipe = this.pipe.bind(this)),
          (this.readonly = this.readonly.bind(this)),
          (this.isNullable = this.isNullable.bind(this)),
          (this.isOptional = this.isOptional.bind(this)),
          (this['~standard'] = { version: 1, vendor: 'zod', validate: (a) => this['~validate'](a) }));
      }
      get description() {
        return this._def.description;
      }
      _getType(t) {
        return getParsedType(t.data);
      }
      _getOrReturnCtx(t, a) {
        return (
          a || {
            common: t.parent.common,
            data: t.data,
            parsedType: getParsedType(t.data),
            schemaErrorMap: this._def.errorMap,
            path: t.path,
            parent: t.parent,
          }
        );
      }
      _processInputParams(t) {
        return {
          status: new qa(),
          ctx: {
            common: t.parent.common,
            data: t.data,
            parsedType: getParsedType(t.data),
            schemaErrorMap: this._def.errorMap,
            path: t.path,
            parent: t.parent,
          },
        };
      }
      _parseSync(t) {
        let a = this._parse(t);
        if (isAsync(a)) throw new Error('Synchronous parse encountered promise.');
        return a;
      }
      _parseAsync(t) {
        let a = this._parse(t);
        return Promise.resolve(a);
      }
      parse(t, a) {
        let n = this.safeParse(t, a);
        if (n.success) return n.data;
        throw n.error;
      }
      safeParse(t, a) {
        let n = {
            common: { issues: [], async: a?.async ?? !1, contextualErrorMap: a?.errorMap },
            path: a?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: t,
            parsedType: getParsedType(t),
          },
          r = this._parseSync({ data: t, path: n.path, parent: n });
        return handleResult(n, r);
      }
      '~validate'(t) {
        let a = {
          common: { issues: [], async: !!this['~standard'].async },
          path: [],
          schemaErrorMap: this._def.errorMap,
          parent: null,
          data: t,
          parsedType: getParsedType(t),
        };
        if (!this['~standard'].async)
          try {
            let n = this._parseSync({ data: t, path: [], parent: a });
            return isValid(n) ? { value: n.value } : { issues: a.common.issues };
          } catch (n) {
            (n?.message?.toLowerCase()?.includes('encountered') && (this['~standard'].async = !0),
              (a.common = { issues: [], async: !0 }));
          }
        return this._parseAsync({ data: t, path: [], parent: a }).then((n) =>
          isValid(n) ? { value: n.value } : { issues: a.common.issues },
        );
      }
      async parseAsync(t, a) {
        let n = await this.safeParseAsync(t, a);
        if (n.success) return n.data;
        throw n.error;
      }
      async safeParseAsync(t, a) {
        let n = {
            common: { issues: [], contextualErrorMap: a?.errorMap, async: !0 },
            path: a?.path || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data: t,
            parsedType: getParsedType(t),
          },
          r = this._parse({ data: t, path: n.path, parent: n }),
          o = await (isAsync(r) ? r : Promise.resolve(r));
        return handleResult(n, o);
      }
      refine(t, a) {
        let n = (r) =>
          typeof a == 'string' || typeof a > 'u' ? { message: a } : typeof a == 'function' ? a(r) : a;
        return this._refinement((r, o) => {
          let l = t(r),
            s = () => o.addIssue({ code: $.custom, ...n(r) });
          return typeof Promise < 'u' && l instanceof Promise
            ? l.then((c) => (c ? !0 : (s(), !1)))
            : l
              ? !0
              : (s(), !1);
        });
      }
      refinement(t, a) {
        return this._refinement((n, r) =>
          t(n) ? !0 : (r.addIssue(typeof a == 'function' ? a(n, r) : a), !1),
        );
      }
      _refinement(t) {
        return new Ki({
          schema: this,
          typeName: 'ZodEffects',
          effect: { type: 'refinement', refinement: t },
        });
      }
      superRefine(t) {
        return this._refinement(t);
      }
      optional() {
        return Wo.create(this, this._def);
      }
      nullable() {
        return zs.create(this, this._def);
      }
      nullish() {
        return this.nullable().optional();
      }
      array() {
        return Ec.create(this);
      }
      promise() {
        return If.create(this, this._def);
      }
      or(t) {
        return D2.create([this, t], this._def);
      }
      and(t) {
        return _2.create(this, t, this._def);
      }
      transform(t) {
        return new Ki({
          ...processCreateParams(this._def),
          schema: this,
          typeName: 'ZodEffects',
          effect: { type: 'transform', transform: t },
        });
      }
      default(t) {
        let a = typeof t == 'function' ? t : () => t;
        return new j2({
          ...processCreateParams(this._def),
          innerType: this,
          defaultValue: a,
          typeName: 'ZodDefault',
        });
      }
      brand() {
        return new U2({ typeName: 'ZodBranded', type: this, ...processCreateParams(this._def) });
      }
      catch(t) {
        let a = typeof t == 'function' ? t : () => t;
        return new H2({
          ...processCreateParams(this._def),
          innerType: this,
          catchValue: a,
          typeName: 'ZodCatch',
        });
      }
      describe(t) {
        let a = this.constructor;
        return new a({ ...this._def, description: t });
      }
      pipe(t) {
        return P2.create(this, t);
      }
      readonly() {
        return W2.create(this);
      }
      isOptional() {
        return this.safeParse(void 0).success;
      }
      isNullable() {
        return this.safeParse(null).success;
      }
    }),
    Cs,
    Cs),
  RT = /^c[^\s-]{8,}$/i,
  ET = /^[0-9a-z]+$/,
  NT = /^[0-9A-HJKMNP-TV-Z]{26}$/i,
  zT = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i,
  DT = /^[a-z0-9_-]{21}$/i,
  _T = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/,
  OT =
    /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/,
  LT = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i,
  BT = '^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$',
  k2,
  jT =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/,
  HT =
    /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/,
  UT =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/,
  PT =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/,
  WT = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/,
  IT = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/,
  T7 =
    '((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))',
  GT = new RegExp(`^${T7}$`);
function timeRegexSource(e) {
  let t = '[0-5]\\d';
  e.precision ? (t = `${t}\\.\\d{${e.precision}}`) : e.precision == null && (t = `${t}(\\.\\d+)?`);
  let a = e.precision ? '+' : '?';
  return `([01]\\d|2[0-3]):[0-5]\\d(:${t})${a}`;
}
function timeRegex(e) {
  return new RegExp(`^${timeRegexSource(e)}$`);
}
function datetimeRegex(e) {
  let t = `${T7}T${timeRegexSource(e)}`,
    a = [];
  return (
    a.push(e.local ? 'Z?' : 'Z'),
    e.offset && a.push('([+-]\\d{2}:?\\d{2})'),
    (t = `${t}(${a.join('|')})`),
    new RegExp(`^${t}$`)
  );
}
function isValidIP(e, t) {
  return !!(((t === 'v4' || !t) && jT.test(e)) || ((t === 'v6' || !t) && UT.test(e)));
}
function isValidJWT(e, t) {
  if (!_T.test(e)) return !1;
  try {
    let [a] = e.split('.');
    if (!a) return !1;
    let n = a
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(a.length + ((4 - (a.length % 4)) % 4), '='),
      r = JSON.parse(atob(n));
    return !(
      typeof r != 'object' ||
      r === null ||
      ('typ' in r && r?.typ !== 'JWT') ||
      !r.alg ||
      (t && r.alg !== t)
    );
  } catch {
    return !1;
  }
}
function isValidCidr(e, t) {
  return !!(((t === 'v4' || !t) && HT.test(e)) || ((t === 'v6' || !t) && PT.test(e)));
}
var Sn,
  Pf =
    ((Sn = class extends Le {
      _parse(t) {
        if ((this._def.coerce && (t.data = String(t.data)), this._getType(t) !== ne.string)) {
          let o = this._getOrReturnCtx(t);
          return (
            addIssueToContext(o, { code: $.invalid_type, expected: ne.string, received: o.parsedType }),
            ve
          );
        }
        let n = new qa(),
          r;
        for (let o of this._def.checks)
          if (o.kind === 'min')
            t.data.length < o.value &&
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, {
                code: $.too_small,
                minimum: o.value,
                type: 'string',
                inclusive: !0,
                exact: !1,
                message: o.message,
              }),
              n.dirty());
          else if (o.kind === 'max')
            t.data.length > o.value &&
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, {
                code: $.too_big,
                maximum: o.value,
                type: 'string',
                inclusive: !0,
                exact: !1,
                message: o.message,
              }),
              n.dirty());
          else if (o.kind === 'length') {
            let l = t.data.length > o.value,
              s = t.data.length < o.value;
            (l || s) &&
              ((r = this._getOrReturnCtx(t, r)),
              l
                ? addIssueToContext(r, {
                    code: $.too_big,
                    maximum: o.value,
                    type: 'string',
                    inclusive: !0,
                    exact: !0,
                    message: o.message,
                  })
                : s &&
                  addIssueToContext(r, {
                    code: $.too_small,
                    minimum: o.value,
                    type: 'string',
                    inclusive: !0,
                    exact: !0,
                    message: o.message,
                  }),
              n.dirty());
          } else if (o.kind === 'email')
            LT.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, { validation: 'email', code: $.invalid_string, message: o.message }),
              n.dirty());
          else if (o.kind === 'emoji')
            (k2 || (k2 = new RegExp(BT, 'u')),
              k2.test(t.data) ||
                ((r = this._getOrReturnCtx(t, r)),
                addIssueToContext(r, { validation: 'emoji', code: $.invalid_string, message: o.message }),
                n.dirty()));
          else if (o.kind === 'uuid')
            zT.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, { validation: 'uuid', code: $.invalid_string, message: o.message }),
              n.dirty());
          else if (o.kind === 'nanoid')
            DT.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, { validation: 'nanoid', code: $.invalid_string, message: o.message }),
              n.dirty());
          else if (o.kind === 'cuid')
            RT.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, { validation: 'cuid', code: $.invalid_string, message: o.message }),
              n.dirty());
          else if (o.kind === 'cuid2')
            ET.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, { validation: 'cuid2', code: $.invalid_string, message: o.message }),
              n.dirty());
          else if (o.kind === 'ulid')
            NT.test(t.data) ||
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, { validation: 'ulid', code: $.invalid_string, message: o.message }),
              n.dirty());
          else if (o.kind === 'url')
            try {
              new URL(t.data);
            } catch {
              ((r = this._getOrReturnCtx(t, r)),
                addIssueToContext(r, { validation: 'url', code: $.invalid_string, message: o.message }),
                n.dirty());
            }
          else
            o.kind === 'regex'
              ? ((o.regex.lastIndex = 0),
                o.regex.test(t.data) ||
                  ((r = this._getOrReturnCtx(t, r)),
                  addIssueToContext(r, { validation: 'regex', code: $.invalid_string, message: o.message }),
                  n.dirty()))
              : o.kind === 'trim'
                ? (t.data = t.data.trim())
                : o.kind === 'includes'
                  ? t.data.includes(o.value, o.position) ||
                    ((r = this._getOrReturnCtx(t, r)),
                    addIssueToContext(r, {
                      code: $.invalid_string,
                      validation: { includes: o.value, position: o.position },
                      message: o.message,
                    }),
                    n.dirty())
                  : o.kind === 'toLowerCase'
                    ? (t.data = t.data.toLowerCase())
                    : o.kind === 'toUpperCase'
                      ? (t.data = t.data.toUpperCase())
                      : o.kind === 'startsWith'
                        ? t.data.startsWith(o.value) ||
                          ((r = this._getOrReturnCtx(t, r)),
                          addIssueToContext(r, {
                            code: $.invalid_string,
                            validation: { startsWith: o.value },
                            message: o.message,
                          }),
                          n.dirty())
                        : o.kind === 'endsWith'
                          ? t.data.endsWith(o.value) ||
                            ((r = this._getOrReturnCtx(t, r)),
                            addIssueToContext(r, {
                              code: $.invalid_string,
                              validation: { endsWith: o.value },
                              message: o.message,
                            }),
                            n.dirty())
                          : o.kind === 'datetime'
                            ? datetimeRegex(o).test(t.data) ||
                              ((r = this._getOrReturnCtx(t, r)),
                              addIssueToContext(r, {
                                code: $.invalid_string,
                                validation: 'datetime',
                                message: o.message,
                              }),
                              n.dirty())
                            : o.kind === 'date'
                              ? GT.test(t.data) ||
                                ((r = this._getOrReturnCtx(t, r)),
                                addIssueToContext(r, {
                                  code: $.invalid_string,
                                  validation: 'date',
                                  message: o.message,
                                }),
                                n.dirty())
                              : o.kind === 'time'
                                ? timeRegex(o).test(t.data) ||
                                  ((r = this._getOrReturnCtx(t, r)),
                                  addIssueToContext(r, {
                                    code: $.invalid_string,
                                    validation: 'time',
                                    message: o.message,
                                  }),
                                  n.dirty())
                                : o.kind === 'duration'
                                  ? OT.test(t.data) ||
                                    ((r = this._getOrReturnCtx(t, r)),
                                    addIssueToContext(r, {
                                      validation: 'duration',
                                      code: $.invalid_string,
                                      message: o.message,
                                    }),
                                    n.dirty())
                                  : o.kind === 'ip'
                                    ? isValidIP(t.data, o.version) ||
                                      ((r = this._getOrReturnCtx(t, r)),
                                      addIssueToContext(r, {
                                        validation: 'ip',
                                        code: $.invalid_string,
                                        message: o.message,
                                      }),
                                      n.dirty())
                                    : o.kind === 'jwt'
                                      ? isValidJWT(t.data, o.alg) ||
                                        ((r = this._getOrReturnCtx(t, r)),
                                        addIssueToContext(r, {
                                          validation: 'jwt',
                                          code: $.invalid_string,
                                          message: o.message,
                                        }),
                                        n.dirty())
                                      : o.kind === 'cidr'
                                        ? isValidCidr(t.data, o.version) ||
                                          ((r = this._getOrReturnCtx(t, r)),
                                          addIssueToContext(r, {
                                            validation: 'cidr',
                                            code: $.invalid_string,
                                            message: o.message,
                                          }),
                                          n.dirty())
                                        : o.kind === 'base64'
                                          ? WT.test(t.data) ||
                                            ((r = this._getOrReturnCtx(t, r)),
                                            addIssueToContext(r, {
                                              validation: 'base64',
                                              code: $.invalid_string,
                                              message: o.message,
                                            }),
                                            n.dirty())
                                          : o.kind === 'base64url'
                                            ? IT.test(t.data) ||
                                              ((r = this._getOrReturnCtx(t, r)),
                                              addIssueToContext(r, {
                                                validation: 'base64url',
                                                code: $.invalid_string,
                                                message: o.message,
                                              }),
                                              n.dirty())
                                            : Ye.assertNever(o);
        return { status: n.value, value: t.data };
      }
      _regex(t, a, n) {
        return this.refinement((r) => t.test(r), {
          validation: a,
          code: $.invalid_string,
          ...ue.errToObj(n),
        });
      }
      _addCheck(t) {
        return new Sn({ ...this._def, checks: [...this._def.checks, t] });
      }
      email(t) {
        return this._addCheck({ kind: 'email', ...ue.errToObj(t) });
      }
      url(t) {
        return this._addCheck({ kind: 'url', ...ue.errToObj(t) });
      }
      emoji(t) {
        return this._addCheck({ kind: 'emoji', ...ue.errToObj(t) });
      }
      uuid(t) {
        return this._addCheck({ kind: 'uuid', ...ue.errToObj(t) });
      }
      nanoid(t) {
        return this._addCheck({ kind: 'nanoid', ...ue.errToObj(t) });
      }
      cuid(t) {
        return this._addCheck({ kind: 'cuid', ...ue.errToObj(t) });
      }
      cuid2(t) {
        return this._addCheck({ kind: 'cuid2', ...ue.errToObj(t) });
      }
      ulid(t) {
        return this._addCheck({ kind: 'ulid', ...ue.errToObj(t) });
      }
      base64(t) {
        return this._addCheck({ kind: 'base64', ...ue.errToObj(t) });
      }
      base64url(t) {
        return this._addCheck({ kind: 'base64url', ...ue.errToObj(t) });
      }
      jwt(t) {
        return this._addCheck({ kind: 'jwt', ...ue.errToObj(t) });
      }
      ip(t) {
        return this._addCheck({ kind: 'ip', ...ue.errToObj(t) });
      }
      cidr(t) {
        return this._addCheck({ kind: 'cidr', ...ue.errToObj(t) });
      }
      datetime(t) {
        return typeof t == 'string'
          ? this._addCheck({ kind: 'datetime', precision: null, offset: !1, local: !1, message: t })
          : this._addCheck({
              kind: 'datetime',
              precision: typeof t?.precision > 'u' ? null : t?.precision,
              offset: t?.offset ?? !1,
              local: t?.local ?? !1,
              ...ue.errToObj(t?.message),
            });
      }
      date(t) {
        return this._addCheck({ kind: 'date', message: t });
      }
      time(t) {
        return typeof t == 'string'
          ? this._addCheck({ kind: 'time', precision: null, message: t })
          : this._addCheck({
              kind: 'time',
              precision: typeof t?.precision > 'u' ? null : t?.precision,
              ...ue.errToObj(t?.message),
            });
      }
      duration(t) {
        return this._addCheck({ kind: 'duration', ...ue.errToObj(t) });
      }
      regex(t, a) {
        return this._addCheck({ kind: 'regex', regex: t, ...ue.errToObj(a) });
      }
      includes(t, a) {
        return this._addCheck({
          kind: 'includes',
          value: t,
          position: a?.position,
          ...ue.errToObj(a?.message),
        });
      }
      startsWith(t, a) {
        return this._addCheck({ kind: 'startsWith', value: t, ...ue.errToObj(a) });
      }
      endsWith(t, a) {
        return this._addCheck({ kind: 'endsWith', value: t, ...ue.errToObj(a) });
      }
      min(t, a) {
        return this._addCheck({ kind: 'min', value: t, ...ue.errToObj(a) });
      }
      max(t, a) {
        return this._addCheck({ kind: 'max', value: t, ...ue.errToObj(a) });
      }
      length(t, a) {
        return this._addCheck({ kind: 'length', value: t, ...ue.errToObj(a) });
      }
      nonempty(t) {
        return this.min(1, ue.errToObj(t));
      }
      trim() {
        return new Sn({ ...this._def, checks: [...this._def.checks, { kind: 'trim' }] });
      }
      toLowerCase() {
        return new Sn({ ...this._def, checks: [...this._def.checks, { kind: 'toLowerCase' }] });
      }
      toUpperCase() {
        return new Sn({ ...this._def, checks: [...this._def.checks, { kind: 'toUpperCase' }] });
      }
      get isDatetime() {
        return !!this._def.checks.find((t) => t.kind === 'datetime');
      }
      get isDate() {
        return !!this._def.checks.find((t) => t.kind === 'date');
      }
      get isTime() {
        return !!this._def.checks.find((t) => t.kind === 'time');
      }
      get isDuration() {
        return !!this._def.checks.find((t) => t.kind === 'duration');
      }
      get isEmail() {
        return !!this._def.checks.find((t) => t.kind === 'email');
      }
      get isURL() {
        return !!this._def.checks.find((t) => t.kind === 'url');
      }
      get isEmoji() {
        return !!this._def.checks.find((t) => t.kind === 'emoji');
      }
      get isUUID() {
        return !!this._def.checks.find((t) => t.kind === 'uuid');
      }
      get isNANOID() {
        return !!this._def.checks.find((t) => t.kind === 'nanoid');
      }
      get isCUID() {
        return !!this._def.checks.find((t) => t.kind === 'cuid');
      }
      get isCUID2() {
        return !!this._def.checks.find((t) => t.kind === 'cuid2');
      }
      get isULID() {
        return !!this._def.checks.find((t) => t.kind === 'ulid');
      }
      get isIP() {
        return !!this._def.checks.find((t) => t.kind === 'ip');
      }
      get isCIDR() {
        return !!this._def.checks.find((t) => t.kind === 'cidr');
      }
      get isBase64() {
        return !!this._def.checks.find((t) => t.kind === 'base64');
      }
      get isBase64url() {
        return !!this._def.checks.find((t) => t.kind === 'base64url');
      }
      get minLength() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'min' && (t === null || a.value > t) && (t = a.value);
        return t;
      }
      get maxLength() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'max' && (t === null || a.value < t) && (t = a.value);
        return t;
      }
    }),
    Sn,
    (Sn.create = (t) =>
      new Sn({ checks: [], typeName: 'ZodString', coerce: t?.coerce ?? !1, ...processCreateParams(t) })),
    Sn);
function floatSafeRemainder(e, t) {
  let a = (e.toString().split('.')[1] || '').length,
    n = (t.toString().split('.')[1] || '').length,
    r = a > n ? a : n,
    o = Number.parseInt(e.toFixed(r).replace('.', '')),
    l = Number.parseInt(t.toFixed(r).replace('.', ''));
  return (o % l) / 10 ** r;
}
var er,
  C2 =
    ((er = class extends Le {
      constructor() {
        (super(...arguments), (this.min = this.gte), (this.max = this.lte), (this.step = this.multipleOf));
      }
      _parse(t) {
        if ((this._def.coerce && (t.data = Number(t.data)), this._getType(t) !== ne.number)) {
          let o = this._getOrReturnCtx(t);
          return (
            addIssueToContext(o, { code: $.invalid_type, expected: ne.number, received: o.parsedType }),
            ve
          );
        }
        let n,
          r = new qa();
        for (let o of this._def.checks)
          o.kind === 'int'
            ? Ye.isInteger(t.data) ||
              ((n = this._getOrReturnCtx(t, n)),
              addIssueToContext(n, {
                code: $.invalid_type,
                expected: 'integer',
                received: 'float',
                message: o.message,
              }),
              r.dirty())
            : o.kind === 'min'
              ? (o.inclusive ? t.data < o.value : t.data <= o.value) &&
                ((n = this._getOrReturnCtx(t, n)),
                addIssueToContext(n, {
                  code: $.too_small,
                  minimum: o.value,
                  type: 'number',
                  inclusive: o.inclusive,
                  exact: !1,
                  message: o.message,
                }),
                r.dirty())
              : o.kind === 'max'
                ? (o.inclusive ? t.data > o.value : t.data >= o.value) &&
                  ((n = this._getOrReturnCtx(t, n)),
                  addIssueToContext(n, {
                    code: $.too_big,
                    maximum: o.value,
                    type: 'number',
                    inclusive: o.inclusive,
                    exact: !1,
                    message: o.message,
                  }),
                  r.dirty())
                : o.kind === 'multipleOf'
                  ? floatSafeRemainder(t.data, o.value) !== 0 &&
                    ((n = this._getOrReturnCtx(t, n)),
                    addIssueToContext(n, {
                      code: $.not_multiple_of,
                      multipleOf: o.value,
                      message: o.message,
                    }),
                    r.dirty())
                  : o.kind === 'finite'
                    ? Number.isFinite(t.data) ||
                      ((n = this._getOrReturnCtx(t, n)),
                      addIssueToContext(n, { code: $.not_finite, message: o.message }),
                      r.dirty())
                    : Ye.assertNever(o);
        return { status: r.value, value: t.data };
      }
      gte(t, a) {
        return this.setLimit('min', t, !0, ue.toString(a));
      }
      gt(t, a) {
        return this.setLimit('min', t, !1, ue.toString(a));
      }
      lte(t, a) {
        return this.setLimit('max', t, !0, ue.toString(a));
      }
      lt(t, a) {
        return this.setLimit('max', t, !1, ue.toString(a));
      }
      setLimit(t, a, n, r) {
        return new er({
          ...this._def,
          checks: [...this._def.checks, { kind: t, value: a, inclusive: n, message: ue.toString(r) }],
        });
      }
      _addCheck(t) {
        return new er({ ...this._def, checks: [...this._def.checks, t] });
      }
      int(t) {
        return this._addCheck({ kind: 'int', message: ue.toString(t) });
      }
      positive(t) {
        return this._addCheck({ kind: 'min', value: 0, inclusive: !1, message: ue.toString(t) });
      }
      negative(t) {
        return this._addCheck({ kind: 'max', value: 0, inclusive: !1, message: ue.toString(t) });
      }
      nonpositive(t) {
        return this._addCheck({ kind: 'max', value: 0, inclusive: !0, message: ue.toString(t) });
      }
      nonnegative(t) {
        return this._addCheck({ kind: 'min', value: 0, inclusive: !0, message: ue.toString(t) });
      }
      multipleOf(t, a) {
        return this._addCheck({ kind: 'multipleOf', value: t, message: ue.toString(a) });
      }
      finite(t) {
        return this._addCheck({ kind: 'finite', message: ue.toString(t) });
      }
      safe(t) {
        return this._addCheck({
          kind: 'min',
          inclusive: !0,
          value: Number.MIN_SAFE_INTEGER,
          message: ue.toString(t),
        })._addCheck({ kind: 'max', inclusive: !0, value: Number.MAX_SAFE_INTEGER, message: ue.toString(t) });
      }
      get minValue() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'min' && (t === null || a.value > t) && (t = a.value);
        return t;
      }
      get maxValue() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'max' && (t === null || a.value < t) && (t = a.value);
        return t;
      }
      get isInt() {
        return !!this._def.checks.find(
          (t) => t.kind === 'int' || (t.kind === 'multipleOf' && Ye.isInteger(t.value)),
        );
      }
      get isFinite() {
        let t = null,
          a = null;
        for (let n of this._def.checks) {
          if (n.kind === 'finite' || n.kind === 'int' || n.kind === 'multipleOf') return !0;
          n.kind === 'min'
            ? (a === null || n.value > a) && (a = n.value)
            : n.kind === 'max' && (t === null || n.value < t) && (t = n.value);
        }
        return Number.isFinite(a) && Number.isFinite(t);
      }
    }),
    er,
    (er.create = (t) =>
      new er({ checks: [], typeName: 'ZodNumber', coerce: t?.coerce || !1, ...processCreateParams(t) })),
    er),
  tr,
  A2 =
    ((tr = class extends Le {
      constructor() {
        (super(...arguments), (this.min = this.gte), (this.max = this.lte));
      }
      _parse(t) {
        if (this._def.coerce)
          try {
            t.data = BigInt(t.data);
          } catch {
            return this._getInvalidInput(t);
          }
        if (this._getType(t) !== ne.bigint) return this._getInvalidInput(t);
        let n,
          r = new qa();
        for (let o of this._def.checks)
          o.kind === 'min'
            ? (o.inclusive ? t.data < o.value : t.data <= o.value) &&
              ((n = this._getOrReturnCtx(t, n)),
              addIssueToContext(n, {
                code: $.too_small,
                type: 'bigint',
                minimum: o.value,
                inclusive: o.inclusive,
                message: o.message,
              }),
              r.dirty())
            : o.kind === 'max'
              ? (o.inclusive ? t.data > o.value : t.data >= o.value) &&
                ((n = this._getOrReturnCtx(t, n)),
                addIssueToContext(n, {
                  code: $.too_big,
                  type: 'bigint',
                  maximum: o.value,
                  inclusive: o.inclusive,
                  message: o.message,
                }),
                r.dirty())
              : o.kind === 'multipleOf'
                ? t.data % o.value !== BigInt(0) &&
                  ((n = this._getOrReturnCtx(t, n)),
                  addIssueToContext(n, { code: $.not_multiple_of, multipleOf: o.value, message: o.message }),
                  r.dirty())
                : Ye.assertNever(o);
        return { status: r.value, value: t.data };
      }
      _getInvalidInput(t) {
        let a = this._getOrReturnCtx(t);
        return (
          addIssueToContext(a, { code: $.invalid_type, expected: ne.bigint, received: a.parsedType }),
          ve
        );
      }
      gte(t, a) {
        return this.setLimit('min', t, !0, ue.toString(a));
      }
      gt(t, a) {
        return this.setLimit('min', t, !1, ue.toString(a));
      }
      lte(t, a) {
        return this.setLimit('max', t, !0, ue.toString(a));
      }
      lt(t, a) {
        return this.setLimit('max', t, !1, ue.toString(a));
      }
      setLimit(t, a, n, r) {
        return new tr({
          ...this._def,
          checks: [...this._def.checks, { kind: t, value: a, inclusive: n, message: ue.toString(r) }],
        });
      }
      _addCheck(t) {
        return new tr({ ...this._def, checks: [...this._def.checks, t] });
      }
      positive(t) {
        return this._addCheck({ kind: 'min', value: BigInt(0), inclusive: !1, message: ue.toString(t) });
      }
      negative(t) {
        return this._addCheck({ kind: 'max', value: BigInt(0), inclusive: !1, message: ue.toString(t) });
      }
      nonpositive(t) {
        return this._addCheck({ kind: 'max', value: BigInt(0), inclusive: !0, message: ue.toString(t) });
      }
      nonnegative(t) {
        return this._addCheck({ kind: 'min', value: BigInt(0), inclusive: !0, message: ue.toString(t) });
      }
      multipleOf(t, a) {
        return this._addCheck({ kind: 'multipleOf', value: t, message: ue.toString(a) });
      }
      get minValue() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'min' && (t === null || a.value > t) && (t = a.value);
        return t;
      }
      get maxValue() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'max' && (t === null || a.value < t) && (t = a.value);
        return t;
      }
    }),
    tr,
    (tr.create = (t) =>
      new tr({ checks: [], typeName: 'ZodBigInt', coerce: t?.coerce ?? !1, ...processCreateParams(t) })),
    tr),
  Io,
  R2 =
    ((Io = class extends Le {
      _parse(t) {
        if ((this._def.coerce && (t.data = !!t.data), this._getType(t) !== ne.boolean)) {
          let n = this._getOrReturnCtx(t);
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.boolean, received: n.parsedType }),
            ve
          );
        }
        return Ea(t.data);
      }
    }),
    Io,
    (Io.create = (t) =>
      new Io({ typeName: 'ZodBoolean', coerce: t?.coerce || !1, ...processCreateParams(t) })),
    Io),
  Xr,
  E2 =
    ((Xr = class extends Le {
      _parse(t) {
        if ((this._def.coerce && (t.data = new Date(t.data)), this._getType(t) !== ne.date)) {
          let o = this._getOrReturnCtx(t);
          return (
            addIssueToContext(o, { code: $.invalid_type, expected: ne.date, received: o.parsedType }),
            ve
          );
        }
        if (Number.isNaN(t.data.getTime())) {
          let o = this._getOrReturnCtx(t);
          return (addIssueToContext(o, { code: $.invalid_date }), ve);
        }
        let n = new qa(),
          r;
        for (let o of this._def.checks)
          o.kind === 'min'
            ? t.data.getTime() < o.value &&
              ((r = this._getOrReturnCtx(t, r)),
              addIssueToContext(r, {
                code: $.too_small,
                message: o.message,
                inclusive: !0,
                exact: !1,
                minimum: o.value,
                type: 'date',
              }),
              n.dirty())
            : o.kind === 'max'
              ? t.data.getTime() > o.value &&
                ((r = this._getOrReturnCtx(t, r)),
                addIssueToContext(r, {
                  code: $.too_big,
                  message: o.message,
                  inclusive: !0,
                  exact: !1,
                  maximum: o.value,
                  type: 'date',
                }),
                n.dirty())
              : Ye.assertNever(o);
        return { status: n.value, value: new Date(t.data.getTime()) };
      }
      _addCheck(t) {
        return new Xr({ ...this._def, checks: [...this._def.checks, t] });
      }
      min(t, a) {
        return this._addCheck({ kind: 'min', value: t.getTime(), message: ue.toString(a) });
      }
      max(t, a) {
        return this._addCheck({ kind: 'max', value: t.getTime(), message: ue.toString(a) });
      }
      get minDate() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'min' && (t === null || a.value > t) && (t = a.value);
        return t != null ? new Date(t) : null;
      }
      get maxDate() {
        let t = null;
        for (let a of this._def.checks) a.kind === 'max' && (t === null || a.value < t) && (t = a.value);
        return t != null ? new Date(t) : null;
      }
    }),
    Xr,
    (Xr.create = (t) =>
      new Xr({ checks: [], coerce: t?.coerce || !1, typeName: 'ZodDate', ...processCreateParams(t) })),
    Xr),
  Go,
  R7 =
    ((Go = class extends Le {
      _parse(t) {
        if (this._getType(t) !== ne.symbol) {
          let n = this._getOrReturnCtx(t);
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.symbol, received: n.parsedType }),
            ve
          );
        }
        return Ea(t.data);
      }
    }),
    Go,
    (Go.create = (t) => new Go({ typeName: 'ZodSymbol', ...processCreateParams(t) })),
    Go),
  $o,
  N2 =
    (($o = class extends Le {
      _parse(t) {
        if (this._getType(t) !== ne.undefined) {
          let n = this._getOrReturnCtx(t);
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.undefined, received: n.parsedType }),
            ve
          );
        }
        return Ea(t.data);
      }
    }),
    $o,
    ($o.create = (t) => new $o({ typeName: 'ZodUndefined', ...processCreateParams(t) })),
    $o),
  Vo,
  z2 =
    ((Vo = class extends Le {
      _parse(t) {
        if (this._getType(t) !== ne.null) {
          let n = this._getOrReturnCtx(t);
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.null, received: n.parsedType }),
            ve
          );
        }
        return Ea(t.data);
      }
    }),
    Vo,
    (Vo.create = (t) => new Vo({ typeName: 'ZodNull', ...processCreateParams(t) })),
    Vo),
  qo,
  Uf =
    ((qo = class extends Le {
      constructor() {
        (super(...arguments), (this._any = !0));
      }
      _parse(t) {
        return Ea(t.data);
      }
    }),
    qo,
    (qo.create = (t) => new qo({ typeName: 'ZodAny', ...processCreateParams(t) })),
    qo),
  Yo,
  Ac =
    ((Yo = class extends Le {
      constructor() {
        (super(...arguments), (this._unknown = !0));
      }
      _parse(t) {
        return Ea(t.data);
      }
    }),
    Yo,
    (Yo.create = (t) => new Yo({ typeName: 'ZodUnknown', ...processCreateParams(t) })),
    Yo),
  Zo,
  qi =
    ((Zo = class extends Le {
      _parse(t) {
        let a = this._getOrReturnCtx(t);
        return (
          addIssueToContext(a, { code: $.invalid_type, expected: ne.never, received: a.parsedType }),
          ve
        );
      }
    }),
    Zo,
    (Zo.create = (t) => new Zo({ typeName: 'ZodNever', ...processCreateParams(t) })),
    Zo),
  Xo,
  E7 =
    ((Xo = class extends Le {
      _parse(t) {
        if (this._getType(t) !== ne.undefined) {
          let n = this._getOrReturnCtx(t);
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.void, received: n.parsedType }),
            ve
          );
        }
        return Ea(t.data);
      }
    }),
    Xo,
    (Xo.create = (t) => new Xo({ typeName: 'ZodVoid', ...processCreateParams(t) })),
    Xo),
  On,
  Ec =
    ((On = class extends Le {
      _parse(t) {
        let { ctx: a, status: n } = this._processInputParams(t),
          r = this._def;
        if (a.parsedType !== ne.array)
          return (
            addIssueToContext(a, { code: $.invalid_type, expected: ne.array, received: a.parsedType }),
            ve
          );
        if (r.exactLength !== null) {
          let l = a.data.length > r.exactLength.value,
            s = a.data.length < r.exactLength.value;
          (l || s) &&
            (addIssueToContext(a, {
              code: l ? $.too_big : $.too_small,
              minimum: s ? r.exactLength.value : void 0,
              maximum: l ? r.exactLength.value : void 0,
              type: 'array',
              inclusive: !0,
              exact: !0,
              message: r.exactLength.message,
            }),
            n.dirty());
        }
        if (
          (r.minLength !== null &&
            a.data.length < r.minLength.value &&
            (addIssueToContext(a, {
              code: $.too_small,
              minimum: r.minLength.value,
              type: 'array',
              inclusive: !0,
              exact: !1,
              message: r.minLength.message,
            }),
            n.dirty()),
          r.maxLength !== null &&
            a.data.length > r.maxLength.value &&
            (addIssueToContext(a, {
              code: $.too_big,
              maximum: r.maxLength.value,
              type: 'array',
              inclusive: !0,
              exact: !1,
              message: r.maxLength.message,
            }),
            n.dirty()),
          a.common.async)
        )
          return Promise.all([...a.data].map((l, s) => r.type._parseAsync(new rr(a, l, a.path, s)))).then(
            (l) => qa.mergeArray(n, l),
          );
        let o = [...a.data].map((l, s) => r.type._parseSync(new rr(a, l, a.path, s)));
        return qa.mergeArray(n, o);
      }
      get element() {
        return this._def.type;
      }
      min(t, a) {
        return new On({ ...this._def, minLength: { value: t, message: ue.toString(a) } });
      }
      max(t, a) {
        return new On({ ...this._def, maxLength: { value: t, message: ue.toString(a) } });
      }
      length(t, a) {
        return new On({ ...this._def, exactLength: { value: t, message: ue.toString(a) } });
      }
      nonempty(t) {
        return this.min(1, t);
      }
    }),
    On,
    (On.create = (t, a) =>
      new On({
        type: t,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: 'ZodArray',
        ...processCreateParams(a),
      })),
    On);
function deepPartialify(e) {
  if (e instanceof Es) {
    let t = {};
    for (let a in e.shape) {
      let n = e.shape[a];
      t[a] = Wo.create(deepPartialify(n));
    }
    return new Es({ ...e._def, shape: () => t });
  } else
    return e instanceof Ec
      ? new Ec({ ...e._def, type: deepPartialify(e.element) })
      : e instanceof Wo
        ? Wo.create(deepPartialify(e.unwrap()))
        : e instanceof zs
          ? zs.create(deepPartialify(e.unwrap()))
          : e instanceof Ns
            ? Ns.create(e.items.map((t) => deepPartialify(t)))
            : e;
}
var jt,
  Es =
    ((jt = class extends Le {
      constructor() {
        (super(...arguments),
          (this._cached = null),
          (this.nonstrict = this.passthrough),
          (this.augment = this.extend));
      }
      _getCached() {
        if (this._cached !== null) return this._cached;
        let t = this._def.shape(),
          a = Ye.objectKeys(t);
        return ((this._cached = { shape: t, keys: a }), this._cached);
      }
      _parse(t) {
        if (this._getType(t) !== ne.object) {
          let u = this._getOrReturnCtx(t);
          return (
            addIssueToContext(u, { code: $.invalid_type, expected: ne.object, received: u.parsedType }),
            ve
          );
        }
        let { status: n, ctx: r } = this._processInputParams(t),
          { shape: o, keys: l } = this._getCached(),
          s = [];
        if (!(this._def.catchall instanceof qi && this._def.unknownKeys === 'strip'))
          for (let u in r.data) l.includes(u) || s.push(u);
        let c = [];
        for (let u of l) {
          let d = o[u],
            m = r.data[u];
          c.push({
            key: { status: 'valid', value: u },
            value: d._parse(new rr(r, m, r.path, u)),
            alwaysSet: u in r.data,
          });
        }
        if (this._def.catchall instanceof qi) {
          let u = this._def.unknownKeys;
          if (u === 'passthrough')
            for (let d of s)
              c.push({ key: { status: 'valid', value: d }, value: { status: 'valid', value: r.data[d] } });
          else if (u === 'strict')
            s.length > 0 && (addIssueToContext(r, { code: $.unrecognized_keys, keys: s }), n.dirty());
          else if (u !== 'strip') throw new Error('Internal ZodObject error: invalid unknownKeys value.');
        } else {
          let u = this._def.catchall;
          for (let d of s) {
            let m = r.data[d];
            c.push({
              key: { status: 'valid', value: d },
              value: u._parse(new rr(r, m, r.path, d)),
              alwaysSet: d in r.data,
            });
          }
        }
        return r.common.async
          ? Promise.resolve()
              .then(async () => {
                let u = [];
                for (let d of c) {
                  let m = await d.key,
                    h = await d.value;
                  u.push({ key: m, value: h, alwaysSet: d.alwaysSet });
                }
                return u;
              })
              .then((u) => qa.mergeObjectSync(n, u))
          : qa.mergeObjectSync(n, c);
      }
      get shape() {
        return this._def.shape();
      }
      strict(t) {
        return (
          ue.errToObj,
          new jt({
            ...this._def,
            unknownKeys: 'strict',
            ...(t !== void 0
              ? {
                  errorMap: (a, n) => {
                    let r = this._def.errorMap?.(a, n).message ?? n.defaultError;
                    return a.code === 'unrecognized_keys'
                      ? { message: ue.errToObj(t).message ?? r }
                      : { message: r };
                  },
                }
              : {}),
          })
        );
      }
      strip() {
        return new jt({ ...this._def, unknownKeys: 'strip' });
      }
      passthrough() {
        return new jt({ ...this._def, unknownKeys: 'passthrough' });
      }
      extend(t) {
        return new jt({ ...this._def, shape: () => ({ ...this._def.shape(), ...t }) });
      }
      merge(t) {
        return new jt({
          unknownKeys: t._def.unknownKeys,
          catchall: t._def.catchall,
          shape: () => ({ ...this._def.shape(), ...t._def.shape() }),
          typeName: 'ZodObject',
        });
      }
      setKey(t, a) {
        return this.augment({ [t]: a });
      }
      catchall(t) {
        return new jt({ ...this._def, catchall: t });
      }
      pick(t) {
        let a = {};
        for (let n of Ye.objectKeys(t)) t[n] && this.shape[n] && (a[n] = this.shape[n]);
        return new jt({ ...this._def, shape: () => a });
      }
      omit(t) {
        let a = {};
        for (let n of Ye.objectKeys(this.shape)) t[n] || (a[n] = this.shape[n]);
        return new jt({ ...this._def, shape: () => a });
      }
      deepPartial() {
        return deepPartialify(this);
      }
      partial(t) {
        let a = {};
        for (let n of Ye.objectKeys(this.shape)) {
          let r = this.shape[n];
          t && !t[n] ? (a[n] = r) : (a[n] = r.optional());
        }
        return new jt({ ...this._def, shape: () => a });
      }
      required(t) {
        let a = {};
        for (let n of Ye.objectKeys(this.shape))
          if (t && !t[n]) a[n] = this.shape[n];
          else {
            let o = this.shape[n];
            for (; o instanceof Wo; ) o = o._def.innerType;
            a[n] = o;
          }
        return new jt({ ...this._def, shape: () => a });
      }
      keyof() {
        return createZodEnum(Ye.objectKeys(this.shape));
      }
    }),
    jt,
    (jt.create = (t, a) =>
      new jt({
        shape: () => t,
        unknownKeys: 'strip',
        catchall: qi.create(),
        typeName: 'ZodObject',
        ...processCreateParams(a),
      })),
    (jt.strictCreate = (t, a) =>
      new jt({
        shape: () => t,
        unknownKeys: 'strict',
        catchall: qi.create(),
        typeName: 'ZodObject',
        ...processCreateParams(a),
      })),
    (jt.lazycreate = (t, a) =>
      new jt({
        shape: t,
        unknownKeys: 'strip',
        catchall: qi.create(),
        typeName: 'ZodObject',
        ...processCreateParams(a),
      })),
    jt),
  Fo,
  D2 =
    ((Fo = class extends Le {
      _parse(t) {
        let { ctx: a } = this._processInputParams(t),
          n = this._def.options;
        function r(o) {
          for (let s of o) if (s.result.status === 'valid') return s.result;
          for (let s of o)
            if (s.result.status === 'dirty') return (a.common.issues.push(...s.ctx.common.issues), s.result);
          let l = o.map((s) => new Jr(s.ctx.common.issues));
          return (addIssueToContext(a, { code: $.invalid_union, unionErrors: l }), ve);
        }
        if ((r, a.common.async))
          return Promise.all(
            n.map(async (o) => {
              let l = { ...a, common: { ...a.common, issues: [] }, parent: null };
              return { result: await o._parseAsync({ data: a.data, path: a.path, parent: l }), ctx: l };
            }),
          ).then(r);
        {
          let o,
            l = [];
          for (let c of n) {
            let u = { ...a, common: { ...a.common, issues: [] }, parent: null },
              d = c._parseSync({ data: a.data, path: a.path, parent: u });
            if (d.status === 'valid') return d;
            (d.status === 'dirty' && !o && (o = { result: d, ctx: u }),
              u.common.issues.length && l.push(u.common.issues));
          }
          if (o) return (a.common.issues.push(...o.ctx.common.issues), o.result);
          let s = l.map((c) => new Jr(c));
          return (addIssueToContext(a, { code: $.invalid_union, unionErrors: s }), ve);
        }
      }
      get options() {
        return this._def.options;
      }
    }),
    Fo,
    (Fo.create = (t, a) => new Fo({ options: t, typeName: 'ZodUnion', ...processCreateParams(a) })),
    Fo),
  getDiscriminator = (e) =>
    e instanceof O2
      ? getDiscriminator(e.schema)
      : e instanceof Ki
        ? getDiscriminator(e.innerType())
        : e instanceof L2
          ? [e.value]
          : e instanceof Wf
            ? e.options
            : e instanceof B2
              ? Ye.objectValues(e.enum)
              : e instanceof j2
                ? getDiscriminator(e._def.innerType)
                : e instanceof N2
                  ? [void 0]
                  : e instanceof z2
                    ? [null]
                    : e instanceof Wo
                      ? [void 0, ...getDiscriminator(e.unwrap())]
                      : e instanceof zs
                        ? [null, ...getDiscriminator(e.unwrap())]
                        : e instanceof U2 || e instanceof W2
                          ? getDiscriminator(e.unwrap())
                          : e instanceof H2
                            ? getDiscriminator(e._def.innerType)
                            : [],
  Zi,
  N7 =
    ((Zi = class extends Le {
      _parse(t) {
        let { ctx: a } = this._processInputParams(t);
        if (a.parsedType !== ne.object)
          return (
            addIssueToContext(a, { code: $.invalid_type, expected: ne.object, received: a.parsedType }),
            ve
          );
        let n = this.discriminator,
          r = a.data[n],
          o = this.optionsMap.get(r);
        return o
          ? a.common.async
            ? o._parseAsync({ data: a.data, path: a.path, parent: a })
            : o._parseSync({ data: a.data, path: a.path, parent: a })
          : (addIssueToContext(a, {
              code: $.invalid_union_discriminator,
              options: Array.from(this.optionsMap.keys()),
              path: [n],
            }),
            ve);
      }
      get discriminator() {
        return this._def.discriminator;
      }
      get options() {
        return this._def.options;
      }
      get optionsMap() {
        return this._def.optionsMap;
      }
      static create(t, a, n) {
        let r = new Map();
        for (let o of a) {
          let l = getDiscriminator(o.shape[t]);
          if (!l.length)
            throw new Error(
              `A discriminator value for key \`${t}\` could not be extracted from all schema options`,
            );
          for (let s of l) {
            if (r.has(s))
              throw new Error(`Discriminator property ${String(t)} has duplicate value ${String(s)}`);
            r.set(s, o);
          }
        }
        return new Zi({
          typeName: 'ZodDiscriminatedUnion',
          discriminator: t,
          options: a,
          optionsMap: r,
          ...processCreateParams(n),
        });
      }
    }),
    Zi,
    Zi);
function mergeValues(e, t) {
  let a = getParsedType(e),
    n = getParsedType(t);
  if (e === t) return { valid: !0, data: e };
  if (a === ne.object && n === ne.object) {
    let r = Ye.objectKeys(t),
      o = Ye.objectKeys(e).filter((s) => r.indexOf(s) !== -1),
      l = { ...e, ...t };
    for (let s of o) {
      let c = mergeValues(e[s], t[s]);
      if (!c.valid) return { valid: !1 };
      l[s] = c.data;
    }
    return { valid: !0, data: l };
  } else if (a === ne.array && n === ne.array) {
    if (e.length !== t.length) return { valid: !1 };
    let r = [];
    for (let o = 0; o < e.length; o++) {
      let l = e[o],
        s = t[o],
        c = mergeValues(l, s);
      if (!c.valid) return { valid: !1 };
      r.push(c.data);
    }
    return { valid: !0, data: r };
  } else return a === ne.date && n === ne.date && +e == +t ? { valid: !0, data: e } : { valid: !1 };
}
var Ko,
  _2 =
    ((Ko = class extends Le {
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t),
          r = (o, l) => {
            if (isAborted(o) || isAborted(l)) return ve;
            let s = mergeValues(o.value, l.value);
            return s.valid
              ? ((isDirty(o) || isDirty(l)) && a.dirty(), { status: a.value, value: s.data })
              : (addIssueToContext(n, { code: $.invalid_intersection_types }), ve);
          };
        return n.common.async
          ? Promise.all([
              this._def.left._parseAsync({ data: n.data, path: n.path, parent: n }),
              this._def.right._parseAsync({ data: n.data, path: n.path, parent: n }),
            ]).then(([o, l]) => r(o, l))
          : r(
              this._def.left._parseSync({ data: n.data, path: n.path, parent: n }),
              this._def.right._parseSync({ data: n.data, path: n.path, parent: n }),
            );
      }
    }),
    Ko,
    (Ko.create = (t, a, n) =>
      new Ko({ left: t, right: a, typeName: 'ZodIntersection', ...processCreateParams(n) })),
    Ko),
  Fr,
  Ns =
    ((Fr = class extends Le {
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t);
        if (n.parsedType !== ne.array)
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.array, received: n.parsedType }),
            ve
          );
        if (n.data.length < this._def.items.length)
          return (
            addIssueToContext(n, {
              code: $.too_small,
              minimum: this._def.items.length,
              inclusive: !0,
              exact: !1,
              type: 'array',
            }),
            ve
          );
        !this._def.rest &&
          n.data.length > this._def.items.length &&
          (addIssueToContext(n, {
            code: $.too_big,
            maximum: this._def.items.length,
            inclusive: !0,
            exact: !1,
            type: 'array',
          }),
          a.dirty());
        let o = [...n.data]
          .map((l, s) => {
            let c = this._def.items[s] || this._def.rest;
            return c ? c._parse(new rr(n, l, n.path, s)) : null;
          })
          .filter((l) => !!l);
        return n.common.async ? Promise.all(o).then((l) => qa.mergeArray(a, l)) : qa.mergeArray(a, o);
      }
      get items() {
        return this._def.items;
      }
      rest(t) {
        return new Fr({ ...this._def, rest: t });
      }
    }),
    Fr,
    (Fr.create = (t, a) => {
      if (!Array.isArray(t)) throw new Error('You must pass an array of schemas to z.tuple([ ... ])');
      return new Fr({ items: t, typeName: 'ZodTuple', rest: null, ...processCreateParams(a) });
    }),
    Fr),
  Qo,
  z7 =
    ((Qo = class extends Le {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t);
        if (n.parsedType !== ne.object)
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.object, received: n.parsedType }),
            ve
          );
        let r = [],
          o = this._def.keyType,
          l = this._def.valueType;
        for (let s in n.data)
          r.push({
            key: o._parse(new rr(n, s, n.path, s)),
            value: l._parse(new rr(n, n.data[s], n.path, s)),
            alwaysSet: s in n.data,
          });
        return n.common.async ? qa.mergeObjectAsync(a, r) : qa.mergeObjectSync(a, r);
      }
      get element() {
        return this._def.valueType;
      }
      static create(t, a, n) {
        return a instanceof Le
          ? new Qo({ keyType: t, valueType: a, typeName: 'ZodRecord', ...processCreateParams(n) })
          : new Qo({ keyType: Pf.create(), valueType: t, typeName: 'ZodRecord', ...processCreateParams(a) });
      }
    }),
    Qo,
    Qo),
  Jo,
  D7 =
    ((Jo = class extends Le {
      get keySchema() {
        return this._def.keyType;
      }
      get valueSchema() {
        return this._def.valueType;
      }
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t);
        if (n.parsedType !== ne.map)
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.map, received: n.parsedType }),
            ve
          );
        let r = this._def.keyType,
          o = this._def.valueType,
          l = [...n.data.entries()].map(([s, c], u) => ({
            key: r._parse(new rr(n, s, n.path, [u, 'key'])),
            value: o._parse(new rr(n, c, n.path, [u, 'value'])),
          }));
        if (n.common.async) {
          let s = new Map();
          return Promise.resolve().then(async () => {
            for (let c of l) {
              let u = await c.key,
                d = await c.value;
              if (u.status === 'aborted' || d.status === 'aborted') return ve;
              ((u.status === 'dirty' || d.status === 'dirty') && a.dirty(), s.set(u.value, d.value));
            }
            return { status: a.value, value: s };
          });
        } else {
          let s = new Map();
          for (let c of l) {
            let u = c.key,
              d = c.value;
            if (u.status === 'aborted' || d.status === 'aborted') return ve;
            ((u.status === 'dirty' || d.status === 'dirty') && a.dirty(), s.set(u.value, d.value));
          }
          return { status: a.value, value: s };
        }
      }
    }),
    Jo,
    (Jo.create = (t, a, n) =>
      new Jo({ valueType: a, keyType: t, typeName: 'ZodMap', ...processCreateParams(n) })),
    Jo),
  ar,
  _7 =
    ((ar = class extends Le {
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t);
        if (n.parsedType !== ne.set)
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.set, received: n.parsedType }),
            ve
          );
        let r = this._def;
        (r.minSize !== null &&
          n.data.size < r.minSize.value &&
          (addIssueToContext(n, {
            code: $.too_small,
            minimum: r.minSize.value,
            type: 'set',
            inclusive: !0,
            exact: !1,
            message: r.minSize.message,
          }),
          a.dirty()),
          r.maxSize !== null &&
            n.data.size > r.maxSize.value &&
            (addIssueToContext(n, {
              code: $.too_big,
              maximum: r.maxSize.value,
              type: 'set',
              inclusive: !0,
              exact: !1,
              message: r.maxSize.message,
            }),
            a.dirty()));
        let o = this._def.valueType;
        function l(c) {
          let u = new Set();
          for (let d of c) {
            if (d.status === 'aborted') return ve;
            (d.status === 'dirty' && a.dirty(), u.add(d.value));
          }
          return { status: a.value, value: u };
        }
        l;
        let s = [...n.data.values()].map((c, u) => o._parse(new rr(n, c, n.path, u)));
        return n.common.async ? Promise.all(s).then((c) => l(c)) : l(s);
      }
      min(t, a) {
        return new ar({ ...this._def, minSize: { value: t, message: ue.toString(a) } });
      }
      max(t, a) {
        return new ar({ ...this._def, maxSize: { value: t, message: ue.toString(a) } });
      }
      size(t, a) {
        return this.min(t, a).max(t, a);
      }
      nonempty(t) {
        return this.min(1, t);
      }
    }),
    ar,
    (ar.create = (t, a) =>
      new ar({ valueType: t, minSize: null, maxSize: null, typeName: 'ZodSet', ...processCreateParams(a) })),
    ar),
  Kr,
  O7 =
    ((Kr = class extends Le {
      constructor() {
        (super(...arguments), (this.validate = this.implement));
      }
      _parse(t) {
        let { ctx: a } = this._processInputParams(t);
        if (a.parsedType !== ne.function)
          return (
            addIssueToContext(a, { code: $.invalid_type, expected: ne.function, received: a.parsedType }),
            ve
          );
        function n(s, c) {
          return makeIssue({
            data: s,
            path: a.path,
            errorMaps: [a.common.contextualErrorMap, a.schemaErrorMap, getErrorMap(), Rs].filter((u) => !!u),
            issueData: { code: $.invalid_arguments, argumentsError: c },
          });
        }
        n;
        function r(s, c) {
          return makeIssue({
            data: s,
            path: a.path,
            errorMaps: [a.common.contextualErrorMap, a.schemaErrorMap, getErrorMap(), Rs].filter((u) => !!u),
            issueData: { code: $.invalid_return_type, returnTypeError: c },
          });
        }
        r;
        let o = { errorMap: a.common.contextualErrorMap },
          l = a.data;
        if (this._def.returns instanceof If) {
          let s = this;
          return Ea(async function (...c) {
            let u = new Jr([]),
              d = await s._def.args.parseAsync(c, o).catch((p) => {
                throw (u.addIssue(n(c, p)), u);
              }),
              m = await Reflect.apply(l, this, d);
            return await s._def.returns._def.type.parseAsync(m, o).catch((p) => {
              throw (u.addIssue(r(m, p)), u);
            });
          });
        } else {
          let s = this;
          return Ea(function (...c) {
            let u = s._def.args.safeParse(c, o);
            if (!u.success) throw new Jr([n(c, u.error)]);
            let d = Reflect.apply(l, this, u.data),
              m = s._def.returns.safeParse(d, o);
            if (!m.success) throw new Jr([r(d, m.error)]);
            return m.data;
          });
        }
      }
      parameters() {
        return this._def.args;
      }
      returnType() {
        return this._def.returns;
      }
      args(...t) {
        return new Kr({ ...this._def, args: Ns.create(t).rest(Ac.create()) });
      }
      returns(t) {
        return new Kr({ ...this._def, returns: t });
      }
      implement(t) {
        return this.parse(t);
      }
      strictImplement(t) {
        return this.parse(t);
      }
      static create(t, a, n) {
        return new Kr({
          args: t || Ns.create([]).rest(Ac.create()),
          returns: a || Ac.create(),
          typeName: 'ZodFunction',
          ...processCreateParams(n),
        });
      }
    }),
    Kr,
    Kr),
  ei,
  O2 =
    ((ei = class extends Le {
      get schema() {
        return this._def.getter();
      }
      _parse(t) {
        let { ctx: a } = this._processInputParams(t);
        return this._def.getter()._parse({ data: a.data, path: a.path, parent: a });
      }
    }),
    ei,
    (ei.create = (t, a) => new ei({ getter: t, typeName: 'ZodLazy', ...processCreateParams(a) })),
    ei),
  ti,
  L2 =
    ((ti = class extends Le {
      _parse(t) {
        if (t.data !== this._def.value) {
          let a = this._getOrReturnCtx(t);
          return (
            addIssueToContext(a, { received: a.data, code: $.invalid_literal, expected: this._def.value }),
            ve
          );
        }
        return { status: 'valid', value: t.data };
      }
      get value() {
        return this._def.value;
      }
    }),
    ti,
    (ti.create = (t, a) => new ti({ value: t, typeName: 'ZodLiteral', ...processCreateParams(a) })),
    ti);
function createZodEnum(e, t) {
  return new Wf({ values: e, typeName: 'ZodEnum', ...processCreateParams(t) });
}
var Qr,
  Wf =
    ((Qr = class extends Le {
      _parse(t) {
        if (typeof t.data != 'string') {
          let a = this._getOrReturnCtx(t),
            n = this._def.values;
          return (
            addIssueToContext(a, {
              expected: Ye.joinValues(n),
              received: a.parsedType,
              code: $.invalid_type,
            }),
            ve
          );
        }
        if ((this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(t.data))) {
          let a = this._getOrReturnCtx(t),
            n = this._def.values;
          return (addIssueToContext(a, { received: a.data, code: $.invalid_enum_value, options: n }), ve);
        }
        return Ea(t.data);
      }
      get options() {
        return this._def.values;
      }
      get enum() {
        let t = {};
        for (let a of this._def.values) t[a] = a;
        return t;
      }
      get Values() {
        let t = {};
        for (let a of this._def.values) t[a] = a;
        return t;
      }
      get Enum() {
        let t = {};
        for (let a of this._def.values) t[a] = a;
        return t;
      }
      extract(t, a = this._def) {
        return Qr.create(t, { ...this._def, ...a });
      }
      exclude(t, a = this._def) {
        return Qr.create(
          this.options.filter((n) => !t.includes(n)),
          { ...this._def, ...a },
        );
      }
    }),
    Qr,
    (Qr.create = createZodEnum),
    Qr),
  ai,
  B2 =
    ((ai = class extends Le {
      _parse(t) {
        let a = Ye.getValidEnumValues(this._def.values),
          n = this._getOrReturnCtx(t);
        if (n.parsedType !== ne.string && n.parsedType !== ne.number) {
          let r = Ye.objectValues(a);
          return (
            addIssueToContext(n, {
              expected: Ye.joinValues(r),
              received: n.parsedType,
              code: $.invalid_type,
            }),
            ve
          );
        }
        if (
          (this._cache || (this._cache = new Set(Ye.getValidEnumValues(this._def.values))),
          !this._cache.has(t.data))
        ) {
          let r = Ye.objectValues(a);
          return (addIssueToContext(n, { received: n.data, code: $.invalid_enum_value, options: r }), ve);
        }
        return Ea(t.data);
      }
      get enum() {
        return this._def.values;
      }
    }),
    ai,
    (ai.create = (t, a) => new ai({ values: t, typeName: 'ZodNativeEnum', ...processCreateParams(a) })),
    ai),
  ni,
  If =
    ((ni = class extends Le {
      unwrap() {
        return this._def.type;
      }
      _parse(t) {
        let { ctx: a } = this._processInputParams(t);
        if (a.parsedType !== ne.promise && a.common.async === !1)
          return (
            addIssueToContext(a, { code: $.invalid_type, expected: ne.promise, received: a.parsedType }),
            ve
          );
        let n = a.parsedType === ne.promise ? a.data : Promise.resolve(a.data);
        return Ea(
          n.then((r) =>
            this._def.type.parseAsync(r, { path: a.path, errorMap: a.common.contextualErrorMap }),
          ),
        );
      }
    }),
    ni,
    (ni.create = (t, a) => new ni({ type: t, typeName: 'ZodPromise', ...processCreateParams(a) })),
    ni),
  nr,
  Ki =
    ((nr = class extends Le {
      innerType() {
        return this._def.schema;
      }
      sourceType() {
        return this._def.schema._def.typeName === 'ZodEffects'
          ? this._def.schema.sourceType()
          : this._def.schema;
      }
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t),
          r = this._def.effect || null,
          o = {
            addIssue: (l) => {
              (addIssueToContext(n, l), l.fatal ? a.abort() : a.dirty());
            },
            get path() {
              return n.path;
            },
          };
        if (((o.addIssue = o.addIssue.bind(o)), r.type === 'preprocess')) {
          let l = r.transform(n.data, o);
          if (n.common.async)
            return Promise.resolve(l).then(async (s) => {
              if (a.value === 'aborted') return ve;
              let c = await this._def.schema._parseAsync({ data: s, path: n.path, parent: n });
              return c.status === 'aborted'
                ? ve
                : c.status === 'dirty' || a.value === 'dirty'
                  ? DIRTY(c.value)
                  : c;
            });
          {
            if (a.value === 'aborted') return ve;
            let s = this._def.schema._parseSync({ data: l, path: n.path, parent: n });
            return s.status === 'aborted'
              ? ve
              : s.status === 'dirty' || a.value === 'dirty'
                ? DIRTY(s.value)
                : s;
          }
        }
        if (r.type === 'refinement') {
          let l = (s) => {
            let c = r.refinement(s, o);
            if (n.common.async) return Promise.resolve(c);
            if (c instanceof Promise)
              throw new Error(
                'Async refinement encountered during synchronous parse operation. Use .parseAsync instead.',
              );
            return s;
          };
          if (n.common.async === !1) {
            let s = this._def.schema._parseSync({ data: n.data, path: n.path, parent: n });
            return s.status === 'aborted'
              ? ve
              : (s.status === 'dirty' && a.dirty(), l(s.value), { status: a.value, value: s.value });
          } else
            return this._def.schema
              ._parseAsync({ data: n.data, path: n.path, parent: n })
              .then((s) =>
                s.status === 'aborted'
                  ? ve
                  : (s.status === 'dirty' && a.dirty(),
                    l(s.value).then(() => ({ status: a.value, value: s.value }))),
              );
        }
        if (r.type === 'transform')
          if (n.common.async === !1) {
            let l = this._def.schema._parseSync({ data: n.data, path: n.path, parent: n });
            if (!isValid(l)) return ve;
            let s = r.transform(l.value, o);
            if (s instanceof Promise)
              throw new Error(
                'Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.',
              );
            return { status: a.value, value: s };
          } else
            return this._def.schema
              ._parseAsync({ data: n.data, path: n.path, parent: n })
              .then((l) =>
                isValid(l)
                  ? Promise.resolve(r.transform(l.value, o)).then((s) => ({ status: a.value, value: s }))
                  : ve,
              );
        Ye.assertNever(r);
      }
    }),
    nr,
    (nr.create = (t, a, n) =>
      new nr({ schema: t, typeName: 'ZodEffects', effect: a, ...processCreateParams(n) })),
    (nr.createWithPreprocess = (t, a, n) =>
      new nr({
        schema: a,
        effect: { type: 'preprocess', transform: t },
        typeName: 'ZodEffects',
        ...processCreateParams(n),
      })),
    nr),
  ri,
  Wo =
    ((ri = class extends Le {
      _parse(t) {
        return this._getType(t) === ne.undefined ? Ea(void 0) : this._def.innerType._parse(t);
      }
      unwrap() {
        return this._def.innerType;
      }
    }),
    ri,
    (ri.create = (t, a) => new ri({ innerType: t, typeName: 'ZodOptional', ...processCreateParams(a) })),
    ri),
  oi,
  zs =
    ((oi = class extends Le {
      _parse(t) {
        return this._getType(t) === ne.null ? Ea(null) : this._def.innerType._parse(t);
      }
      unwrap() {
        return this._def.innerType;
      }
    }),
    oi,
    (oi.create = (t, a) => new oi({ innerType: t, typeName: 'ZodNullable', ...processCreateParams(a) })),
    oi),
  ii,
  j2 =
    ((ii = class extends Le {
      _parse(t) {
        let { ctx: a } = this._processInputParams(t),
          n = a.data;
        return (
          a.parsedType === ne.undefined && (n = this._def.defaultValue()),
          this._def.innerType._parse({ data: n, path: a.path, parent: a })
        );
      }
      removeDefault() {
        return this._def.innerType;
      }
    }),
    ii,
    (ii.create = (t, a) =>
      new ii({
        innerType: t,
        typeName: 'ZodDefault',
        defaultValue: typeof a.default == 'function' ? a.default : () => a.default,
        ...processCreateParams(a),
      })),
    ii),
  li,
  H2 =
    ((li = class extends Le {
      _parse(t) {
        let { ctx: a } = this._processInputParams(t),
          n = { ...a, common: { ...a.common, issues: [] } },
          r = this._def.innerType._parse({ data: n.data, path: n.path, parent: { ...n } });
        return isAsync(r)
          ? r.then((o) => ({
              status: 'valid',
              value:
                o.status === 'valid'
                  ? o.value
                  : this._def.catchValue({
                      get error() {
                        return new Jr(n.common.issues);
                      },
                      input: n.data,
                    }),
            }))
          : {
              status: 'valid',
              value:
                r.status === 'valid'
                  ? r.value
                  : this._def.catchValue({
                      get error() {
                        return new Jr(n.common.issues);
                      },
                      input: n.data,
                    }),
            };
      }
      removeCatch() {
        return this._def.innerType;
      }
    }),
    li,
    (li.create = (t, a) =>
      new li({
        innerType: t,
        typeName: 'ZodCatch',
        catchValue: typeof a.catch == 'function' ? a.catch : () => a.catch,
        ...processCreateParams(a),
      })),
    li),
  si,
  B7 =
    ((si = class extends Le {
      _parse(t) {
        if (this._getType(t) !== ne.nan) {
          let n = this._getOrReturnCtx(t);
          return (
            addIssueToContext(n, { code: $.invalid_type, expected: ne.nan, received: n.parsedType }),
            ve
          );
        }
        return { status: 'valid', value: t.data };
      }
    }),
    si,
    (si.create = (t) => new si({ typeName: 'ZodNaN', ...processCreateParams(t) })),
    si),
  XT = Symbol('zod_brand'),
  As,
  U2 =
    ((As = class extends Le {
      _parse(t) {
        let { ctx: a } = this._processInputParams(t),
          n = a.data;
        return this._def.type._parse({ data: n, path: a.path, parent: a });
      }
      unwrap() {
        return this._def.type;
      }
    }),
    As,
    As),
  Xi,
  P2 =
    ((Xi = class extends Le {
      _parse(t) {
        let { status: a, ctx: n } = this._processInputParams(t);
        if (n.common.async)
          return (async () => {
            let o = await this._def.in._parseAsync({ data: n.data, path: n.path, parent: n });
            return o.status === 'aborted'
              ? ve
              : o.status === 'dirty'
                ? (a.dirty(), DIRTY(o.value))
                : this._def.out._parseAsync({ data: o.value, path: n.path, parent: n });
          })();
        {
          let r = this._def.in._parseSync({ data: n.data, path: n.path, parent: n });
          return r.status === 'aborted'
            ? ve
            : r.status === 'dirty'
              ? (a.dirty(), { status: 'dirty', value: r.value })
              : this._def.out._parseSync({ data: r.value, path: n.path, parent: n });
        }
      }
      static create(t, a) {
        return new Xi({ in: t, out: a, typeName: 'ZodPipeline' });
      }
    }),
    Xi,
    Xi),
  ci,
  W2 =
    ((ci = class extends Le {
      _parse(t) {
        let a = this._def.innerType._parse(t),
          n = (r) => (isValid(r) && (r.value = Object.freeze(r.value)), r);
        return isAsync(a) ? a.then((r) => n(r)) : n(a);
      }
      unwrap() {
        return this._def.innerType;
      }
    }),
    ci,
    (ci.create = (t, a) => new ci({ innerType: t, typeName: 'ZodReadonly', ...processCreateParams(a) })),
    ci);
function cleanParams(e, t) {
  let a = typeof e == 'function' ? e(t) : typeof e == 'string' ? { message: e } : e;
  return typeof a == 'string' ? { message: a } : a;
}
function custom(e, t = {}, a) {
  return e
    ? Uf.create().superRefine((n, r) => {
        let o = e(n);
        if (o instanceof Promise)
          return o.then((l) => {
            if (!l) {
              let s = cleanParams(t, n),
                c = s.fatal ?? a ?? !0;
              r.addIssue({ code: 'custom', ...s, fatal: c });
            }
          });
        if (!o) {
          let l = cleanParams(t, n),
            s = l.fatal ?? a ?? !0;
          r.addIssue({ code: 'custom', ...l, fatal: s });
        }
      })
    : Uf.create();
}
var FT = { object: Es.lazycreate },
  H7 = ((e) => (
    (e.ZodString = 'ZodString'),
    (e.ZodNumber = 'ZodNumber'),
    (e.ZodNaN = 'ZodNaN'),
    (e.ZodBigInt = 'ZodBigInt'),
    (e.ZodBoolean = 'ZodBoolean'),
    (e.ZodDate = 'ZodDate'),
    (e.ZodSymbol = 'ZodSymbol'),
    (e.ZodUndefined = 'ZodUndefined'),
    (e.ZodNull = 'ZodNull'),
    (e.ZodAny = 'ZodAny'),
    (e.ZodUnknown = 'ZodUnknown'),
    (e.ZodNever = 'ZodNever'),
    (e.ZodVoid = 'ZodVoid'),
    (e.ZodArray = 'ZodArray'),
    (e.ZodObject = 'ZodObject'),
    (e.ZodUnion = 'ZodUnion'),
    (e.ZodDiscriminatedUnion = 'ZodDiscriminatedUnion'),
    (e.ZodIntersection = 'ZodIntersection'),
    (e.ZodTuple = 'ZodTuple'),
    (e.ZodRecord = 'ZodRecord'),
    (e.ZodMap = 'ZodMap'),
    (e.ZodSet = 'ZodSet'),
    (e.ZodFunction = 'ZodFunction'),
    (e.ZodLazy = 'ZodLazy'),
    (e.ZodLiteral = 'ZodLiteral'),
    (e.ZodEnum = 'ZodEnum'),
    (e.ZodEffects = 'ZodEffects'),
    (e.ZodNativeEnum = 'ZodNativeEnum'),
    (e.ZodOptional = 'ZodOptional'),
    (e.ZodNullable = 'ZodNullable'),
    (e.ZodDefault = 'ZodDefault'),
    (e.ZodCatch = 'ZodCatch'),
    (e.ZodPromise = 'ZodPromise'),
    (e.ZodBranded = 'ZodBranded'),
    (e.ZodPipeline = 'ZodPipeline'),
    (e.ZodReadonly = 'ZodReadonly'),
    e
  ))(H7 || {}),
  instanceOfType = (e, t = { message: `Input not instance of ${e.name}` }) =>
    custom((a) => a instanceof e, t),
  U7 = Pf.create,
  P7 = C2.create,
  QT = B7.create,
  JT = A2.create,
  W7 = R2.create,
  eC = E2.create,
  tC = R7.create,
  aC = N2.create,
  nC = z2.create,
  rC = Uf.create,
  oC = Ac.create,
  iC = qi.create,
  lC = E7.create,
  sC = Ec.create,
  cC = Es.create,
  uC = Es.strictCreate,
  dC = D2.create,
  fC = N7.create,
  hC = _2.create,
  mC = Ns.create,
  pC = z7.create,
  gC = D7.create,
  yC = _7.create,
  bC = O7.create,
  vC = O2.create,
  xC = L2.create,
  kC = Wf.create,
  wC = B2.create,
  SC = If.create,
  S7 = Ki.create,
  MC = Wo.create,
  TC = zs.create,
  CC = Ki.createWithPreprocess,
  AC = P2.create,
  ostring = () => U7().optional(),
  onumber = () => P7().optional(),
  oboolean = () => W7().optional(),
  zC = {
    string: (e) => Pf.create({ ...e, coerce: !0 }),
    number: (e) => C2.create({ ...e, coerce: !0 }),
    boolean: (e) => R2.create({ ...e, coerce: !0 }),
    bigint: (e) => A2.create({ ...e, coerce: !0 }),
    date: (e) => E2.create({ ...e, coerce: !0 }),
  },
  DC = ve;

export { z };

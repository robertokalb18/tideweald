// Recovered from the Tideweald v16.11 build. Module: ui/primitives
import * as React from 'react';
import * as ReactDOM from 'react-dom';

var st = React.createElement,
  mp = {},
  Z0 = (e) => mp[e] ?? (mp[e] = React.createContext(null));
function useControllable(e, t, a) {
  let [n, r] = React.useState(t),
    o = e !== void 0,
    l = o ? e : n,
    s = React.useCallback(
      (c) => {
        (o || r(c), a?.(c));
      },
      [o, a],
    );
  return [l, s];
}
function mergeRefs(...e) {
  return (t) => {
    for (let a of e) typeof a == 'function' ? a(t) : a && (a.current = t);
  };
}
function mergeProps(e, t) {
  let a = { ...e, ...t };
  for (let n of Object.keys(e))
    /^on[A-Z]/.test(n) &&
      typeof e[n] == 'function' &&
      typeof t[n] == 'function' &&
      (a[n] = (...r) => {
        (t[n](...r), e[n](...r));
      });
  return (
    (e.className || t.className) && (a.className = [e.className, t.className].filter(Boolean).join(' ')),
    (e.style || t.style) && (a.style = { ...e.style, ...t.style }),
    a
  );
}
var _o = React.forwardRef(function ({ children: t, ...a }, n) {
    let r = React.Children.only(t);
    return React.isValidElement(r)
      ? React.cloneElement(r, { ...mergeProps(a, r.props), ref: mergeRefs(n, r.props.ref) })
      : null;
  }),
  Prim = (e) =>
    React.forwardRef(function ({ asChild: a, ...n }, r) {
      return a ? st(_o, { ...n, ref: r }) : st(e, { ...n, ref: r });
    }),
  pv = { Root: _o, Slot: _o };
function makeDialog(e, t) {
  let a = Z0(e);
  function n({ open: m, defaultOpen: h = !1, onOpenChange: p, children: g }) {
    let [v, M] = useControllable(m, h, p),
      w = React.useId(),
      y = React.useId();
    return st(a.Provider, { value: { open: !!v, setOpen: M, titleId: w, descId: y } }, g);
  }
  n;
  let r = React.forwardRef(function ({ asChild: h, onClick: p, ...g }, v) {
    let M = React.useContext(a);
    return st(h ? _o : 'button', {
      ...g,
      ref: v,
      onClick: (y) => {
        (p?.(y), M.setOpen(!0));
      },
    });
  });
  function o({ children: m }) {
    return React.useContext(a)?.open ? (0, ReactDOM.createPortal)(m, document.body) : null;
  }
  o;
  let l = React.forwardRef(function (h, p) {
      let g = React.useContext(a);
      return st('div', { ...h, ref: p, 'data-state': g.open ? 'open' : 'closed' });
    }),
    s = React.forwardRef(function (
      {
        onEscapeKeyDown: h,
        onPointerDownOutside: p,
        onInteractOutside: g,
        onOpenAutoFocus: v,
        onCloseAutoFocus: M,
        forceMount: w,
        asChild: y,
        ...k
      },
      x,
    ) {
      let T = React.useContext(a),
        C = React.useRef(null),
        R = React.useRef(null);
      return (
        (R.current = {
          c: T,
          onEscapeKeyDown: h,
          onPointerDownOutside: p,
          onInteractOutside: g,
          onOpenAutoFocus: v,
          onCloseAutoFocus: M,
        }),
        React.useEffect(() => {
          let b = () => R.current,
            A = (L) => {
              let N = document.querySelectorAll('[role=dialog],[role=alertdialog]'),
                O = N[N.length - 1] === C.current;
              if (L.key === 'Escape') {
                if (!O) return;
                (b().onEscapeKeyDown?.(L), L.defaultPrevented || b().c.setOpen(!1));
              }
              if (L.key === 'Tab' && O && C.current) {
                let z = [
                  ...C.current.querySelectorAll(
                    'button,a[href],input,select,textarea,summary,[tabindex]:not([tabindex="-1"])',
                  ),
                ].filter((j) => {
                  if (j.disabled || !j.getClientRects().length) return !1;
                  let Ae = j.closest('details:not([open])');
                  return !Ae || (j.tagName === 'SUMMARY' && j.parentElement === Ae);
                });
                if (!z.length) return;
                let U = z[0],
                  Y = z[z.length - 1],
                  W = document.activeElement;
                C.current.contains(W)
                  ? L.shiftKey && (W === U || W === C.current)
                    ? (L.preventDefault(), Y.focus())
                    : !L.shiftKey && W === Y && (L.preventDefault(), U.focus())
                  : (L.preventDefault(), U.focus());
              }
            },
            E = (L) => {
              !C.current ||
                C.current.contains(L.target) ||
                L.target.closest?.('[data-radix-popper]') ||
                t ||
                (b().onPointerDownOutside?.(L),
                b().onInteractOutside?.(L),
                L.defaultPrevented || b().c.setOpen(!1));
            };
          (document.addEventListener('keydown', A), document.addEventListener('pointerdown', E));
          let V = document.activeElement,
            Z = new Event('focusScope.autoFocusOnMount', { cancelable: !0 });
          return (
            b().onOpenAutoFocus?.(Z),
            Z.defaultPrevented || C.current?.focus?.({ preventScroll: !0 }),
            () => {
              (document.removeEventListener('keydown', A), document.removeEventListener('pointerdown', E));
              let L = new Event('focusScope.autoFocusOnUnmount', { cancelable: !0 });
              (b().onCloseAutoFocus?.(L), L.defaultPrevented || V?.focus?.({ preventScroll: !0 }));
            }
          );
        }, []),
        st('div', {
          role: t ? 'alertdialog' : 'dialog',
          'aria-modal': !0,
          'aria-labelledby': T.titleId,
          'aria-describedby': T.descId,
          tabIndex: -1,
          ...k,
          ref: mergeRefs(x, C),
          'data-state': T.open ? 'open' : 'closed',
        })
      );
    }),
    c = React.forwardRef(function ({ asChild: h, onClick: p, ...g }, v) {
      let M = React.useContext(a);
      return st(h ? _o : 'button', {
        type: h ? void 0 : 'button',
        ...g,
        ref: v,
        onClick: (y) => {
          (p?.(y), y.defaultPrevented || M.setOpen(!1));
        },
      });
    }),
    u = React.forwardRef(function ({ asChild: h, ...p }, g) {
      let v = React.useContext(a);
      return st(h ? _o : 'h2', { id: v.titleId, ...p, ref: g });
    }),
    d = React.forwardRef(function ({ asChild: h, ...p }, g) {
      let v = React.useContext(a);
      return st(h ? _o : 'p', { id: v.descId, ...p, ref: g });
    });
  return {
    Root: n,
    Trigger: r,
    Portal: o,
    Overlay: l,
    Content: s,
    Close: c,
    Title: u,
    Description: d,
    Action: c,
    Cancel: c,
  };
}
var zr = makeDialog('dialog', !1),
  Dr = makeDialog('alert', !0),
  yp = Z0('tabs'),
  Iw = React.forwardRef(function (
    {
      value: t,
      defaultValue: a,
      onValueChange: n,
      orientation: r,
      activationMode: o,
      dir: l,
      asChild: s,
      ...c
    },
    u,
  ) {
    let [d, m] = useControllable(t, a, n);
    return st(
      yp.Provider,
      { value: { value: d, set: m } },
      st('div', { ...c, ref: u, 'data-orientation': r ?? 'horizontal' }),
    );
  }),
  Gw = React.forwardRef(function ({ loop: t, asChild: a, ...n }, r) {
    return st('div', { role: 'tablist', ...n, ref: r });
  }),
  $w = React.forwardRef(function ({ value: t, asChild: a, onClick: n, disabled: r, ...o }, l) {
    let s = React.useContext(yp),
      c = s.value === t;
    return st('button', {
      type: 'button',
      role: 'tab',
      'aria-selected': c,
      disabled: r,
      'data-state': c ? 'active' : 'inactive',
      ...o,
      ref: l,
      onClick: (u) => {
        (n?.(u), r || s.set(t));
      },
    });
  }),
  Vw = React.forwardRef(function ({ value: t, forceMount: a, asChild: n, ...r }, o) {
    let l = React.useContext(yp);
    return l.value !== t && !a
      ? null
      : st('div', { role: 'tabpanel', 'data-state': l.value === t ? 'active' : 'inactive', ...r, ref: o });
  }),
  X0 = { Root: Iw, List: Gw, Trigger: $w, Content: Vw },
  bp = Z0('coll'),
  qw = React.forwardRef(function (
    { open: t, defaultOpen: a = !1, onOpenChange: n, asChild: r, disabled: o, ...l },
    s,
  ) {
    let [c, u] = useControllable(t, a, n);
    return st(
      bp.Provider,
      { value: { open: !!c, set: u } },
      st('div', { ...l, ref: s, 'data-state': c ? 'open' : 'closed' }),
    );
  }),
  hv = React.forwardRef(function ({ asChild: t, onClick: a, ...n }, r) {
    let o = React.useContext(bp);
    return st(t ? _o : 'button', {
      ...n,
      ref: r,
      'aria-expanded': o.open,
      'data-state': o.open ? 'open' : 'closed',
      onClick: (s) => {
        (a?.(s), s.defaultPrevented || o.set(!o.open));
      },
    });
  }),
  mv = React.forwardRef(function ({ forceMount: t, asChild: a, ...n }, r) {
    let o = React.useContext(bp);
    return !o.open && !t ? null : st('div', { ...n, ref: r, 'data-state': o.open ? 'open' : 'closed' });
  }),
  Od = { Root: qw, Trigger: hv, Content: mv, CollapsibleTrigger: hv, CollapsibleContent: mv },
  ns = Z0('sel');
function SelRoot({
  value: e,
  defaultValue: t,
  onValueChange: a,
  open: n,
  defaultOpen: r = !1,
  onOpenChange: o,
  children: l,
  disabled: s,
}) {
  let [c, u] = useControllable(e, t, a),
    [d, m] = useControllable(n, r, o),
    h = React.useRef(null),
    p = React.useRef({});
  return st(
    ns.Provider,
    { value: { value: c, set: u, open: !!d, setOpen: m, trigger: h, labels: p, disabled: s } },
    l,
  );
}
var Zw = React.forwardRef(function ({ asChild: t, onClick: a, disabled: n, ...r }, o) {
    let l = React.useContext(ns);
    return st('button', {
      type: 'button',
      role: 'combobox',
      'aria-expanded': l.open,
      disabled: n || l.disabled,
      'data-state': l.open ? 'open' : 'closed',
      ...r,
      ref: mergeRefs(o, l.trigger),
      onClick: (s) => {
        (a?.(s), l.setOpen(!l.open));
      },
    });
  }),
  Xw = React.forwardRef(function ({ placeholder: t, children: a, asChild: n, ...r }, o) {
    let l = React.useContext(ns);
    return st('span', { ...r, ref: o }, a ?? l.value ?? t);
  }),
  Fw = React.forwardRef(function ({ asChild: t, children: a, ...n }, r) {
    return st('span', { 'aria-hidden': !0, ...n, ref: r }, a);
  });
function SelPortal({ children: e }) {
  return React.useContext(ns).open ? (0, ReactDOM.createPortal)(e, document.body) : null;
}
var Qw = React.forwardRef(function (
    {
      position: t,
      side: a = 'bottom',
      sideOffset: n = 4,
      align: r,
      avoidCollisions: o,
      collisionPadding: l,
      asChild: s,
      style: c,
      ...u
    },
    d,
  ) {
    let m = React.useContext(ns),
      h = React.useRef(null),
      [p, g] = React.useState(null);
    return (
      React.useLayoutEffect(() => {
        let v = m.trigger.current?.getBoundingClientRect();
        if (!v) return;
        let w = h.current?.offsetHeight ?? 0;
        g({ left: v.left, top: a === 'top' ? v.top - w - n : v.bottom + n, minWidth: v.width });
      }, [m.open, a]),
      React.useEffect(() => {
        let v = (w) => {
            h.current?.contains(w.target) || m.trigger.current?.contains(w.target) || m.setOpen(!1);
          },
          M = (w) => {
            w.key === 'Escape' && m.setOpen(!1);
          };
        return (
          document.addEventListener('pointerdown', v),
          document.addEventListener('keydown', M),
          () => {
            (document.removeEventListener('pointerdown', v), document.removeEventListener('keydown', M));
          }
        );
      }, [m]),
      st(
        'div',
        {
          'data-radix-popper': '',
          style: { position: 'fixed', zIndex: 60, ...(p ?? { visibility: 'hidden', left: 0, top: 0 }), ...c },
        },
        st('div', { role: 'listbox', 'data-state': 'open', 'data-side': a, ...u, ref: mergeRefs(d, h) }),
      )
    );
  }),
  Jw = React.forwardRef(function ({ asChild: t, ...a }, n) {
    return st('div', { ...a, ref: n });
  }),
  yv = Z0('selitem'),
  eS = React.forwardRef(function ({ value: t, disabled: a, asChild: n, onClick: r, textValue: o, ...l }, s) {
    let c = React.useContext(ns),
      u = c.value === t;
    return st(
      yv.Provider,
      { value: { selected: u } },
      st('div', {
        role: 'option',
        'aria-selected': u,
        'data-state': u ? 'checked' : 'unchecked',
        'data-disabled': a ? '' : void 0,
        tabIndex: -1,
        ...l,
        ref: s,
        onClick: (d) => {
          (r?.(d), !a && (c.set(t), c.setOpen(!1)));
        },
      }),
    );
  }),
  tS = React.forwardRef(function ({ asChild: t, ...a }, n) {
    return st('span', { ...a, ref: n });
  });
function SelItemIndicator({ children: e }) {
  return React.useContext(yv)?.selected ? st('span', null, e) : null;
}
var pp = Prim('div'),
  rn = {
    Root: SelRoot,
    Trigger: Zw,
    Value: Xw,
    Icon: Fw,
    Portal: SelPortal,
    Content: Qw,
    Viewport: Jw,
    Item: eS,
    ItemText: tS,
    ItemIndicator: SelItemIndicator,
    Group: pp,
    Label: pp,
    Separator: pp,
    ScrollUpButton: () => null,
    ScrollDownButton: () => null,
  };

export { Dr, Od, X0, pv, rn, zr };

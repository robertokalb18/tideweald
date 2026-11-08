// Recovered from the Tideweald v16.11 build. Module: ui/kit
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { pt } from './cn.js';
import { A4, M4, Zn, iv, op } from './icons.js';
import { Dr, Od, X0, pv, rn, zr } from './primitives.js';
import { cva } from '../vendor/class-variance-authority.js';

function Tabs({ className: e, orientation: t = 'horizontal', ...a }) {
  return (0, jsxRuntime.jsx)(X0.Root, {
    'data-slot': 'tabs',
    'data-orientation': t,
    orientation: t,
    className: pt('group/tabs flex gap-2 data-[orientation=horizontal]:flex-col', e),
    ...a,
  });
}
var NS = cva(
  'group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-[orientation=horizontal]/tabs:h-9 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col data-[variant=line]:rounded-none',
  {
    variants: { variant: { default: 'bg-muted', line: 'gap-1 bg-transparent' } },
    defaultVariants: { variant: 'default' },
  },
);
function TabsList({ className: e, variant: t = 'default', ...a }) {
  return (0, jsxRuntime.jsx)(X0.List, {
    'data-slot': 'tabs-list',
    'data-variant': t,
    className: pt(NS({ variant: t }), e),
    ...a,
  });
}
function TabsTrigger({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(X0.Trigger, {
    'data-slot': 'tabs-trigger',
    className: pt(
      "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-all group-data-[orientation=vertical]/tabs:w-full group-data-[orientation=vertical]/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-sm group-data-[variant=line]/tabs-list:data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      'group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:border-transparent dark:group-data-[variant=line]/tabs-list:data-[state=active]:bg-transparent',
      'data-[state=active]:bg-background data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:data-[state=active]:text-foreground',
      'after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-[orientation=horizontal]/tabs:after:inset-x-0 group-data-[orientation=horizontal]/tabs:after:bottom-[-5px] group-data-[orientation=horizontal]/tabs:after:h-0.5 group-data-[orientation=vertical]/tabs:after:inset-y-0 group-data-[orientation=vertical]/tabs:after:-right-1 group-data-[orientation=vertical]/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-[state=active]:after:opacity-100',
      e,
    ),
    ...t,
  });
}
function TabsContent({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(X0.Content, {
    'data-slot': 'tabs-content',
    className: pt('flex-1 outline-none', e),
    ...t,
  });
}
function Collapsible({ ...e }) {
  return (0, jsxRuntime.jsx)(Od.Root, { 'data-slot': 'collapsible', ...e });
}
function CollapsibleTrigger({ ...e }) {
  return (0, jsxRuntime.jsx)(Od.CollapsibleTrigger, { 'data-slot': 'collapsible-trigger', ...e });
}
function CollapsibleContent({ ...e }) {
  return (0, jsxRuntime.jsx)(Od.CollapsibleContent, { 'data-slot': 'collapsible-content', ...e });
}
function Select({ ...e }) {
  return (0, jsxRuntime.jsx)(rn.Root, { 'data-slot': 'select', ...e });
}
function SelectValue({ ...e }) {
  return (0, jsxRuntime.jsx)(rn.Value, { 'data-slot': 'select-value', ...e });
}
function SelectTrigger({ className: e, size: t = 'default', children: a, ...n }) {
  return (0, jsxRuntime.jsxs)(rn.Trigger, {
    'data-slot': 'select-trigger',
    'data-size': t,
    className: pt(
      "flex w-fit items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 data-[placeholder]:text-muted-foreground data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground",
      e,
    ),
    ...n,
    children: [
      a,
      (0, jsxRuntime.jsx)(rn.Icon, {
        asChild: !0,
        children: (0, jsxRuntime.jsx)(op, { className: 'size-4 opacity-50' }),
      }),
    ],
  });
}
function SelectContent({
  className: e,
  children: t,
  position: a = 'item-aligned',
  align: n = 'center',
  ...r
}) {
  return (0, jsxRuntime.jsx)(rn.Portal, {
    children: (0, jsxRuntime.jsxs)(rn.Content, {
      'data-slot': 'select-content',
      className: pt(
        'relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        a === 'popper' &&
          'data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1',
        e,
      ),
      position: a,
      align: n,
      ...r,
      children: [
        (0, jsxRuntime.jsx)(SelectScrollUpButton, {}),
        (0, jsxRuntime.jsx)(rn.Viewport, {
          className: pt(
            'p-1',
            a === 'popper' &&
              'h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1',
          ),
          children: t,
        }),
        (0, jsxRuntime.jsx)(SelectScrollDownButton, {}),
      ],
    }),
  });
}
function SelectItem({ className: e, children: t, ...a }) {
  return (0, jsxRuntime.jsxs)(rn.Item, {
    'data-slot': 'select-item',
    className: pt(
      "relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
      e,
    ),
    ...a,
    children: [
      (0, jsxRuntime.jsx)('span', {
        'data-slot': 'select-item-indicator',
        className: 'absolute right-2 flex size-3.5 items-center justify-center',
        children: (0, jsxRuntime.jsx)(rn.ItemIndicator, {
          children: (0, jsxRuntime.jsx)(M4, { className: 'size-4' }),
        }),
      }),
      (0, jsxRuntime.jsx)(rn.ItemText, { children: t }),
    ],
  });
}
function SelectScrollUpButton({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(rn.ScrollUpButton, {
    'data-slot': 'select-scroll-up-button',
    className: pt('flex cursor-default items-center justify-center py-1', e),
    ...t,
    children: (0, jsxRuntime.jsx)(A4, { className: 'size-4' }),
  });
}
function SelectScrollDownButton({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(rn.ScrollDownButton, {
    'data-slot': 'select-scroll-down-button',
    className: pt('flex cursor-default items-center justify-center py-1', e),
    ...t,
    children: (0, jsxRuntime.jsx)(op, { className: 'size-4' }),
  });
}
var _S = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-xs': "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
function Button({ className: e, variant: t = 'default', size: a = 'default', asChild: n = !1, ...r }) {
  let o = n ? pv.Root : 'button';
  return (0, jsxRuntime.jsx)(o, {
    'data-slot': 'button',
    'data-variant': t,
    'data-size': a,
    className: pt(_S({ variant: t, size: a, className: e })),
    ...r,
  });
}
function Dialog({ ...e }) {
  return (0, jsxRuntime.jsx)(zr.Root, { 'data-slot': 'dialog', ...e });
}
function DialogPortal({ ...e }) {
  return (0, jsxRuntime.jsx)(zr.Portal, { 'data-slot': 'dialog-portal', ...e });
}
function DialogClose({ ...e }) {
  return (0, jsxRuntime.jsx)(zr.Close, { 'data-slot': 'dialog-close', ...e });
}
function DialogOverlay({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(zr.Overlay, {
    'data-slot': 'dialog-overlay',
    className: pt(
      'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      e,
    ),
    ...t,
  });
}
function DialogContent({ className: e, children: t, showCloseButton: a = !0, ...n }) {
  return (0, jsxRuntime.jsxs)(DialogPortal, {
    'data-slot': 'dialog-portal',
    children: [
      (0, jsxRuntime.jsx)(DialogOverlay, {}),
      (0, jsxRuntime.jsxs)(zr.Content, {
        'data-slot': 'dialog-content',
        className: pt(
          'fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:max-w-lg',
          e,
        ),
        ...n,
        children: [
          t,
          a &&
            (0, jsxRuntime.jsxs)(zr.Close, {
              'data-slot': 'dialog-close',
              className:
                "absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
              children: [
                (0, jsxRuntime.jsx)(iv, {}),
                (0, jsxRuntime.jsx)('span', { className: 'sr-only', children: 'Close' }),
              ],
            }),
        ],
      }),
    ],
  });
}
function DialogTitle({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(zr.Title, {
    'data-slot': 'dialog-title',
    className: pt('text-lg leading-none font-semibold', e),
    ...t,
  });
}
function DialogDescription({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(zr.Description, {
    'data-slot': 'dialog-description',
    className: pt('text-sm text-muted-foreground', e),
    ...t,
  });
}
var h6 = 0,
  detachViewport = () => {},
  BS = '(max-width:1000px), (max-height:600px)';
function IslandDialogContent({ children: e, className: t = '', showCloseButton: a = !0, ...n }) {
  (0, React.useEffect)(() => {
    if (h6++ === 0) {
      let h = window.visualViewport,
        p = document.documentElement,
        g = () => {
          (p.style.setProperty('--game-vh', `${h?.height ?? window.innerHeight}px`),
            p.style.setProperty('--game-vw', `${h?.width ?? window.innerWidth}px`),
            p.style.setProperty('--game-vtop', `${h?.offsetTop ?? 0}px`),
            p.style.setProperty('--game-vleft', `${h?.offsetLeft ?? 0}px`));
        };
      (g(),
        h?.addEventListener('resize', g),
        h?.addEventListener('scroll', g),
        window.addEventListener('resize', g),
        (detachViewport = () => {
          (h?.removeEventListener('resize', g),
            h?.removeEventListener('scroll', g),
            window.removeEventListener('resize', g));
        }));
    }
    return () => {
      --h6 === 0 && detachViewport();
    };
  }, []);
  let r = (0, React.useRef)(null);
  (0, React.useEffect)(() => {
    let h = [60, 420].map((p) =>
      setTimeout(() => {
        let g = r.current;
        if (!g) return;
        let v = g.scrollTop;
        ((g.scrollTop = v + 1), (g.scrollTop = v));
      }, p),
    );
    return () => h.forEach(clearTimeout);
  }, []);
  let o = (0, React.useRef)(null),
    l = (0, React.useRef)(null),
    s = (h) => {
      if (h.target.closest('.game-dialog-close') || !matchMedia(BS).matches || h.button !== 0) return;
      let p = h.currentTarget.closest('.game-dialog-shell');
      p &&
        (h.currentTarget.setPointerCapture(h.pointerId),
        (l.current = { y: h.clientY, t: performance.now(), dy: 0, v: 0, shell: p }),
        p.style.setProperty('transition', 'none', 'important'));
    },
    c = (h) => {
      let p = l.current;
      if (!p) return;
      let g = performance.now(),
        v = Math.max(0, h.clientY - p.y),
        M = h.clientY < p.y ? -Math.min(14, (p.y - h.clientY) * 0.15) : v;
      ((p.v = (M - p.dy) / Math.max(1, g - p.t)),
        (p.t = g),
        (p.dy = M),
        p.shell.style.setProperty('transform', `translateY(${M}px)`, 'important'));
    },
    u = () => {
      let h = l.current;
      if (!h) return;
      l.current = null;
      let { shell: p } = h;
      (p.style.setProperty('transition', 'transform .24s cubic-bezier(.2,.8,.2,1)', 'important'),
        h.dy > 110 || (h.v > 0.55 && h.dy > 24)
          ? (p.classList.add('sheet-dismissing'),
            p.style.setProperty('transform', 'translateY(105%)', 'important'),
            setTimeout(() => o.current?.click(), 200))
          : (p.style.setProperty('transform', 'translateY(0px)', 'important'),
            setTimeout(() => {
              (p.style.removeProperty('transform'), p.style.removeProperty('transition'));
            }, 260)));
    },
    { onCloseAutoFocus: d } = n;
  return (0, jsxRuntime.jsxs)(DialogContent, {
    ...n,
    onCloseAutoFocus: (h) => {
      (d?.(h),
        document.querySelector('[role=dialog][data-state=open],[role=alertdialog][data-state=open]') &&
          h.preventDefault());
    },
    className: `${t} game-dialog-shell`,
    showCloseButton: !1,
    children: [
      a &&
        (0, jsxRuntime.jsxs)('div', {
          className: 'game-dialog-bar',
          onPointerDown: s,
          onPointerMove: c,
          onPointerUp: u,
          onPointerCancel: u,
          children: [
            (0, jsxRuntime.jsx)('span', { className: 'sheet-grabber', 'aria-hidden': 'true' }),
            (0, jsxRuntime.jsx)('span', { className: 'game-dialog-brand', children: 'TIDEWEALD' }),
            (0, jsxRuntime.jsxs)(DialogClose, {
              ref: o,
              className: 'game-dialog-close',
              'aria-label': 'Close',
              children: [
                (0, jsxRuntime.jsx)(Zn, { size: 18, strokeWidth: 2.4 }),
                (0, jsxRuntime.jsx)('span', { children: 'Close' }),
              ],
            }),
          ],
        }),
      (0, jsxRuntime.jsx)('div', { className: 'game-dialog-scroll', ref: r, children: e }),
    ],
  });
}
function AlertDialog({ ...e }) {
  return (0, jsxRuntime.jsx)(Dr.Root, { 'data-slot': 'alert-dialog', ...e });
}
function AlertDialogPortal({ ...e }) {
  return (0, jsxRuntime.jsx)(Dr.Portal, { 'data-slot': 'alert-dialog-portal', ...e });
}
function AlertDialogOverlay({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(Dr.Overlay, {
    'data-slot': 'alert-dialog-overlay',
    className: pt(
      'fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      e,
    ),
    ...t,
  });
}
function AlertDialogContent({ className: e, size: t = 'default', ...a }) {
  return (0, jsxRuntime.jsxs)(AlertDialogPortal, {
    children: [
      (0, jsxRuntime.jsx)(AlertDialogOverlay, {}),
      (0, jsxRuntime.jsx)(Dr.Content, {
        'data-slot': 'alert-dialog-content',
        'data-size': t,
        className: pt(
          'group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[size=default]:sm:max-w-lg',
          e,
        ),
        ...a,
      }),
    ],
  });
}
function AlertDialogFooter({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)('div', {
    'data-slot': 'alert-dialog-footer',
    className: pt(
      'flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end',
      e,
    ),
    ...t,
  });
}
function AlertDialogTitle({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(Dr.Title, {
    'data-slot': 'alert-dialog-title',
    className: pt(
      'text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2',
      e,
    ),
    ...t,
  });
}
function AlertDialogDescription({ className: e, ...t }) {
  return (0, jsxRuntime.jsx)(Dr.Description, {
    'data-slot': 'alert-dialog-description',
    className: pt('text-sm text-muted-foreground', e),
    ...t,
  });
}
function AlertDialogAction({ className: e, variant: t = 'default', size: a = 'default', ...n }) {
  return (0, jsxRuntime.jsx)(Button, {
    variant: t,
    size: a,
    asChild: !0,
    children: (0, jsxRuntime.jsx)(Dr.Action, { 'data-slot': 'alert-dialog-action', className: pt(e), ...n }),
  });
}
function AlertDialogCancel({ className: e, variant: t = 'outline', size: a = 'default', ...n }) {
  return (0, jsxRuntime.jsx)(Button, {
    variant: t,
    size: a,
    asChild: !0,
    children: (0, jsxRuntime.jsx)(Dr.Cancel, { 'data-slot': 'alert-dialog-cancel', className: pt(e), ...n }),
  });
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogDescription,
  DialogTitle,
  IslandDialogContent,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
};

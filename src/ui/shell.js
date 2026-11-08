// Recovered from the Tideweald v16.11 build. Module: ui/shell
import * as React from 'react';
import { isNativeApp, nativeHaptic } from '../persistence/save.js';

function hostedBelowChrome(e, t, a, n) {
  let r = t >= e,
    o = Math.max(a, n),
    l = Math.min(a, n);
  return (r ? o - t : l - t) > 60;
}
var BAR_HEIGHT = { portrait: 104, landscape: 52 };
function safeInsets(e, t, a, n, r, o) {
  let l = !o && hostedBelowChrome(t, a, n, r),
    s = l ? 0 : e.top,
    c = a >= t,
    u = o ? e.top : Math.max(e.top, c ? BAR_HEIGHT.portrait : BAR_HEIGHT.landscape);
  return { top: s, right: e.right, bottom: e.bottom, left: e.left, hosted: l, topReserve: u };
}
function probeInsets() {
  let e = document.createElement('div');
  ((e.style.cssText =
    'position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)'),
    document.body.appendChild(e));
  let t = getComputedStyle(e),
    a = {
      top: parseFloat(t.paddingTop) || 0,
      right: parseFloat(t.paddingRight) || 0,
      bottom: parseFloat(t.paddingBottom) || 0,
      left: parseFloat(t.paddingLeft) || 0,
    };
  return (e.remove(), a);
}
function haptic(e = 'tap') {
  if (document.documentElement.dataset.haptics !== 'off' && !nativeHaptic(e))
    try {
      let t = navigator;
      if (!t.vibrate || document.documentElement.dataset.haptics === 'off') return;
      t.vibrate(e === 'tap' ? 8 : e === 'success' ? [10, 40, 16] : [18, 50, 18]);
    } catch {}
}
function useAppShell() {
  (0, React.useEffect)(() => {
    let e = document.documentElement,
      t = navigator,
      a = () =>
        isNativeApp() ||
        !!t.standalone ||
        matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches,
      n = 0,
      r = () => {
        (cancelAnimationFrame(n),
          (n = requestAnimationFrame(() => {
            let c = safeInsets(probeInsets(), innerWidth, innerHeight, screen.width, screen.height, a());
            (e.style.setProperty('--safe-top', `${c.top}px`),
              e.style.setProperty('--safe-right', `${c.right}px`),
              e.style.setProperty('--safe-bottom', `${c.bottom}px`),
              e.style.setProperty('--safe-left', `${c.left}px`),
              e.style.setProperty('--top-reserve', `${c.topReserve}px`),
              (e.dataset.hosted = c.hosted ? 'true' : 'false'),
              (e.dataset.standalone = a() ? 'true' : 'false'));
          })));
      };
    (r(),
      addEventListener('resize', r),
      addEventListener('orientationchange', r),
      visualViewport?.addEventListener('resize', r));
    let o = (c) => c.preventDefault();
    (document.addEventListener('gesturestart', o), document.addEventListener('gesturechange', o));
    let l = (c) => {
      c.target?.closest('input,textarea,a[href]') || c.preventDefault();
    };
    (document.addEventListener('contextmenu', l), e.classList.add('app-shell'));
    let s = (() => {
      try {
        return window.top !== window;
      } catch {
        return !0;
      }
    })();
    return (
      'serviceWorker' in navigator &&
        !isNativeApp() &&
        !s &&
        location.protocol === 'https:' &&
        !/claude\.(ai|site)|claudeusercontent|anthropic/.test(location.hostname) &&
        navigator.serviceWorker.register('/sw.js').catch(() => {}),
      () => {
        (cancelAnimationFrame(n),
          removeEventListener('resize', r),
          removeEventListener('orientationchange', r),
          visualViewport?.removeEventListener('resize', r),
          document.removeEventListener('gesturestart', o),
          document.removeEventListener('gesturechange', o),
          document.removeEventListener('contextmenu', l));
      }
    );
  }, []);
}

export { haptic, useAppShell };

// Recovered from the Tideweald v16.11 build. Module: audio/sfx
import { settings } from '../ui/settings.js';

var nl = null,
  or = null,
  p9 = !1;
function audio() {
  if (typeof window > 'u' || !settings().soundEffects) return null;
  if (!nl) {
    let e = window.AudioContext ?? window.webkitAudioContext;
    if (!e) return null;
    ((nl = new e()), (or = nl.createGain()), (or.gain.value = 0.32), or.connect(nl.destination));
  }
  return (nl.state === 'suspended' && nl.resume().catch(() => {}), nl);
}
function unlockSfx() {
  if (p9) return;
  p9 = !0;
  let e = audio();
  if (e) {
    let t = e.createGain();
    ((t.gain.value = 0), t.connect(or));
    let a = e.createOscillator();
    (a.connect(t), a.start(), a.stop(e.currentTime + 0.01));
  }
}
function tone(e, t, a, { type: n = 'sine', gain: r = 0.5, attack: o = 0.005, slide: l = 0 } = {}) {
  let s = audio();
  if (!s || !or) return;
  let c = s.currentTime + t,
    u = s.createOscillator(),
    d = s.createGain();
  ((u.type = n),
    u.frequency.setValueAtTime(e, c),
    l && u.frequency.exponentialRampToValueAtTime(Math.max(20, e * l), c + a),
    d.gain.setValueAtTime(0, c),
    d.gain.linearRampToValueAtTime(r, c + o),
    d.gain.exponentialRampToValueAtTime(1e-4, c + a),
    u.connect(d),
    d.connect(or),
    u.start(c),
    u.stop(c + a + 0.05));
}
function noise2(e, t, { gain: a = 0.3, freq: n = 900, q: r = 0.8 } = {}) {
  let o = audio();
  if (!o || !or) return;
  let l = o.currentTime + e,
    s = Math.ceil(o.sampleRate * t),
    c = o.createBuffer(1, s, o.sampleRate),
    u = c.getChannelData(0);
  for (let p = 0; p < s; p++) u[p] = (Math.random() * 2 - 1) * (1 - p / s) ** 2;
  let d = o.createBufferSource(),
    m = o.createBiquadFilter(),
    h = o.createGain();
  ((d.buffer = c),
    (m.type = 'bandpass'),
    (m.frequency.value = n),
    (m.Q.value = r),
    (h.gain.value = a),
    d.connect(m),
    m.connect(h),
    h.connect(or),
    d.start(l));
}
var y9 = {},
  once = (e, t) => {
    let a = performance.now();
    return a - (y9[e] ?? -1e9) < t ? !1 : ((y9[e] = a), !0);
  },
  Nt = {
    place() {
      once('place', 110) &&
        (noise2(0, 0.09, { gain: 0.55, freq: 520, q: 1.4 }),
        tone(196, 0, 0.16, { type: 'triangle', gain: 0.32 }),
        tone(294, 0.035, 0.14, { type: 'triangle', gain: 0.2 }));
    },
    refuse() {
      once('refuse', 250) && tone(130, 0, 0.18, { type: 'sine', gain: 0.35, slide: 0.7 });
    },
    tap() {
      once('tap', 60) && noise2(0, 0.025, { gain: 0.18, freq: 2400, q: 2 });
    },
    coin() {
      once('coin', 150) &&
        (tone(1318, 0, 0.12, { type: 'triangle', gain: 0.22 }),
        tone(1760, 0.07, 0.22, { type: 'triangle', gain: 0.2 }));
    },
    built() {
      for (let [e, t] of [
        [880, 0.22],
        [1320, 0.12],
        [1760, 0.07],
      ])
        tone(e, 0, 1.1, { gain: t });
      tone(660, 0.12, 0.9, { gain: 0.12 });
    },
    fanfare() {
      [523.25, 659.25, 783.99, 1046.5].forEach((e, t) => {
        (tone(e, t * 0.11, 0.6 + t * 0.12, { type: 'triangle', gain: 0.24 }),
          tone(e / 2, t * 0.11, 0.5, { gain: 0.1 }));
      });
    },
    horn() {
      let e = audio();
      if (!e || !or) return;
      let t = e.currentTime,
        a = e.createOscillator(),
        n = e.createBiquadFilter(),
        r = e.createGain();
      ((a.type = 'sawtooth'),
        a.frequency.setValueAtTime(98, t),
        a.frequency.linearRampToValueAtTime(110, t + 0.9),
        (n.type = 'lowpass'),
        (n.frequency.value = 420),
        r.gain.setValueAtTime(0, t),
        r.gain.linearRampToValueAtTime(0.32, t + 0.35),
        r.gain.exponentialRampToValueAtTime(1e-4, t + 1.6),
        a.connect(n),
        n.connect(r),
        r.connect(or),
        a.start(t),
        a.stop(t + 1.7));
    },
    chirp() {
      (tone(2200, 0, 0.09, { gain: 0.12, slide: 1.5 }), tone(2600, 0.13, 0.09, { gain: 0.1, slide: 1.4 }));
    },
  };

export { Nt, unlockSfx };

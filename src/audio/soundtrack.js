// Recovered from the Tideweald v16.11 build. Module: audio/soundtrack
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';
import { $0, es, ov, ts, z4 } from '../ui/icons.js';
import { Dialog, DialogDescription, DialogTitle, IslandDialogContent } from '../ui/kit.js';

var MUSIC_TRACKS = [
  {
    id: 'come-again',
    title: 'Come again',
    mood: 'John Dowland \xB7 1597',
    instruments: 'Recorder \xB7 Harpsichord \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1691',
    license: 'Public domain edition',
  },
  {
    id: 'el-grillo',
    title: 'El grillo',
    mood: 'Josquin des Prez \xB7 1504',
    instruments: 'Flute \xB7 Harp \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=339',
    license: 'Public domain edition',
  },
  {
    id: 'belle',
    title: 'Belle qui tiens ma vie',
    mood: 'Thoinot Arbeau \xB7 1588\u201389',
    instruments: 'Soft drum \xB7 Recorder \xB7 Harp \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1',
    license: 'Public domain edition',
  },
  {
    id: 'saltarello',
    title: 'Saltarello',
    mood: 'Vincenzo Galilei \xB7 16th century',
    instruments: 'Harpsichord',
    scoring: 'Original chordal writing',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=110',
    license: 'Public domain edition',
  },
  {
    id: 'tmeiskin',
    title: 'Tmeiskin',
    mood: 'Jean Japart \xB7 early 16th century',
    instruments: 'Recorder \xB7 Lute-like plucked strings \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1734',
    license: 'Public domain edition',
  },
  {
    id: 'unquiet-thoughts',
    title: 'Unquiet thoughts',
    mood: 'John Dowland \xB7 1597',
    instruments: 'Flute \xB7 Harpsichord \xB7 Harp \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=21',
    license: 'Public domain edition',
  },
  {
    id: 'bonne-heure',
    title: 'Il est de bonne heure n\xE9',
    mood: 'Anonymous \xB7 c. 1470',
    instruments: 'Recorder \xB7 Psaltery \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=198',
    license: 'Public domain edition',
  },
  {
    id: 'pavan-two',
    title: 'Pavan II',
    mood: 'Luis Mil\xE1n \xB7 16th century',
    instruments: 'Harp',
    scoring: 'Original chordal writing',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=24',
    license: 'Public domain edition',
  },
  {
    id: 'amor',
    title: 'Amor, che sol dei cor leggiadri ha cura',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Flute \xB7 Harpsichord \xB7 Viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1903',
    license: 'CC BY 4.0',
  },
  {
    id: 'beata',
    title: 'O beata colei',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Recorder \xB7 Harp \xB7 Bass viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1904',
    license: 'CC BY 4.0',
  },
  {
    id: 'pesci',
    title: 'Mentr\u2019ameranno i nudi pesci l\u2019onde',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Flute \xB7 Lute-like plucked strings \xB7 Viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1909',
    license: 'CC BY 4.0',
  },
  {
    id: 'vago-monte',
    title: 'Vago monte, fiorite ombrose piagge',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Recorder \xB7 Harpsichord \xB7 Bass viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1910',
    license: 'CC BY 4.0',
  },
  {
    id: 'volentier',
    title: 'Volentier canterei de vostri honori',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Flute \xB7 Harp \xB7 Viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1914',
    license: 'CC BY 4.0',
  },
  {
    id: 'nuz-my-dzis',
    title: 'Nu\u017C my dzi\u015B krze\u015Bcijani',
    mood: 'Anonymous \xB7 1586',
    instruments: 'Recorder \xB7 Harp \xB7 Viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=856',
    license: 'Public domain edition',
  },
  {
    id: 'o-nata-lux',
    title: 'O nata lux',
    mood: 'Thomas Tallis \xB7 1575',
    instruments: 'Flute \xB7 Recorder \xB7 Harp \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 5 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=949',
    license: 'Public domain edition',
  },
  {
    id: 'silver-swan',
    title: 'The Silver Swan',
    mood: 'Orlando Gibbons \xB7 1612',
    instruments: 'Flute \xB7 Recorder \xB7 Viol \xB7 Lute-like plucked strings \xB7 Bass viol',
    scoring: 'Original harmony \xB7 5 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=302',
    license: 'Public domain edition',
  },
  {
    id: 'es-ist-ein-ros',
    title: 'Es ist ein Ros\u2019 entsprungen',
    mood: 'Michael Praetorius \xB7 1609',
    instruments: 'Recorder \xB7 Psaltery \xB7 Viol \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1175',
    license: 'Public domain edition',
  },
  {
    id: 'suonata-prima',
    title: 'Suonata prima, fuga plagale',
    mood: 'Adriano Banchieri \xB7 1605',
    instruments: 'Harpsichord \xB7 Bass viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=31',
    license: 'Public domain edition',
  },
  {
    id: 'suonata-seconda',
    title: 'Suonata seconda, fuga triplicata',
    mood: 'Adriano Banchieri \xB7 1605',
    instruments: 'Psaltery \xB7 Viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=32',
    license: 'Public domain edition',
  },
  {
    id: 'old-hundredth',
    title: 'Old Hundredth',
    mood: 'Genevan Psalter, arr. John Dowland \xB7 1551/1612',
    instruments: 'Flute \xB7 Viol',
    scoring: 'Original harmony \xB7 4 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=90',
    license: 'Public domain edition',
  },
  {
    id: 'chiari-lumi',
    title: 'Chi non s\xE0 come altrui duo chiari lumi',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Recorder \xB7 Lute-like plucked strings \xB7 Bass viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1906',
    license: 'CC BY 4.0',
  },
  {
    id: 'vostro-fui',
    title: 'Vostro fui, vostro son, e sar\xF2 vostro',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Flute \xB7 Psaltery \xB7 Viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1907',
    license: 'CC BY 4.0',
  },
  {
    id: 'lieta-ventura',
    title: 'O mia lieta ventura, hor quale stella',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Recorder \xB7 Harp \xB7 Viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1911',
    license: 'CC BY 4.0',
  },
  {
    id: 'lieto-amante',
    title: 'S\u2019io odo alcun felice, e lieto amante',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Flute \xB7 Lute-like plucked strings \xB7 Bass viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1916',
    license: 'CC BY 4.0',
  },
  {
    id: 'olmo',
    title: 'Cos\xEC d\u2019un olmo sospirando a l\u2019ombra',
    mood: 'Philippe de Monte \xB7 1582',
    instruments: 'Recorder \xB7 Psaltery \xB7 Bass viol',
    scoring: 'Original harmony \xB7 3 independent voices',
    scoreUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=1926',
    license: 'CC BY 4.0',
  },
];
function Soundtrack() {
  let [e, t] = (0, React.useState)(!1),
    [a, n] = (0, React.useState)(!1),
    [r, o] = (0, React.useState)(0),
    [l, s] = (0, React.useState)(0.48),
    [c, u] = (0, React.useState)(!0),
    [d, m] = (0, React.useState)('Music starts automatically with your first tap.'),
    h = (0, React.useRef)(null),
    p = (0, React.useRef)(!0),
    g = (0, React.useRef)(0),
    v = (0, React.useRef)([]);
  (0, React.useEffect)(() => {
    let y = Math.floor(Math.random() * MUSIC_TRACKS.length);
    return ((v.current = [y]), o(y), () => window.clearTimeout(g.current));
  }, []);
  let M = () => {
    let y = h.current;
    !y ||
      !p.current ||
      document.hidden ||
      y.play().catch((k) => {
        (n(!1),
          m(
            k.name === 'NotAllowedError'
              ? 'Tap anywhere on the island to start the music.'
              : 'Music could not start. Tap Play to retry.',
          ));
      });
  };
  ((0, React.useEffect)(() => {
    try {
      p.current = localStorage.getItem('haven.music.muted') !== 'true';
      let x = localStorage.getItem('haven.music.volume');
      x !== null && Number.isFinite(Number(x)) && s(Math.max(0, Math.min(1, Number(x))));
    } catch {}
    let y = () => {
        h.current?.paused && M();
      },
      k = () => {
        document.hidden ? h.current?.pause() : y();
      };
    return (
      document.addEventListener('pointerdown', y, { capture: !0 }),
      document.addEventListener('click', y, { capture: !0 }),
      document.addEventListener('keydown', y, { capture: !0 }),
      document.addEventListener('visibilitychange', k),
      p.current ? M() : m('Music is muted. Your preference is remembered.'),
      () => {
        (document.removeEventListener('pointerdown', y, !0),
          document.removeEventListener('click', y, !0),
          document.removeEventListener('keydown', y, !0),
          document.removeEventListener('visibilitychange', k));
      }
    );
  }, []),
    (0, React.useEffect)(() => {
      let y = () => t(!0);
      return (
        window.addEventListener('tideweald:music', y),
        () => window.removeEventListener('tideweald:music', y)
      );
    }, []),
    (0, React.useEffect)(() => {
      document.documentElement.dataset.music = a ? 'on' : 'off';
    }, [a]),
    (0, React.useEffect)(() => {
      h.current && (h.current.volume = l);
    }, [l]),
    (0, React.useEffect)(() => {
      M();
    }, [r]));
  let w = () => {
    p.current = !a;
    try {
      localStorage.setItem('haven.music.muted', String(!p.current));
    } catch {}
    p.current ? M() : (h.current?.pause(), m('Music is muted.'));
  };
  return (0, jsxRuntime.jsxs)(jsxRuntime.Fragment, {
    children: [
      (0, jsxRuntime.jsx)('audio', {
        ref: h,
        src: `./music/${MUSIC_TRACKS[r].id}.mp3?v=12`,
        preload: 'auto',
        onPlaying: () => {
          (n(!0), m(`Playing \xB7 ${MUSIC_TRACKS[r].title}`));
        },
        onPause: () => n(!1),
        onError: () => {
          (n(!1), m('The music could not load. Tap Play to retry.'));
        },
        onEnded: () => {
          c
            ? (m('A short rest before the next piece\u2026'),
              window.clearTimeout(g.current),
              (g.current = window.setTimeout(
                () => {
                  let y = v.current,
                    k = MUSIC_TRACKS.map((T, C) => C).filter((T) => !y.includes(T)),
                    x = k[Math.floor(Math.random() * k.length)] ?? (r + 1) % MUSIC_TRACKS.length;
                  ((v.current = [...y, x].slice(-Math.min(8, MUSIC_TRACKS.length - 1))), o(x));
                },
                2e4 + Math.random() * 25e3,
              )))
            : ((p.current = !1), n(!1), m('The piece has ended.'));
        },
      }),
      (0, jsxRuntime.jsxs)('button', {
        className: `icon-button music-toggle ${a ? 'music-on' : ''}`,
        'aria-label': 'Open soundtrack',
        onClick: () => t(!0),
        title: a ? 'Music playing' : '25-piece island soundtrack',
        children: [(0, jsxRuntime.jsx)(es, { size: 20 }), a && (0, jsxRuntime.jsx)('i', {})],
      }),
      (0, jsxRuntime.jsx)(Dialog, {
        open: e,
        onOpenChange: t,
        children: (0, jsxRuntime.jsxs)(IslandDialogContent, {
          className: 'music-dialog',
          children: [
            (0, jsxRuntime.jsx)(DialogTitle, { children: 'The northern consort' }),
            (0, jsxRuntime.jsx)(DialogDescription, {
              children: '25 existing Renaissance and early-Baroque pieces from published scores.',
            }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'music-hero',
              children: [
                (0, jsxRuntime.jsx)(es, { size: 32 }),
                (0, jsxRuntime.jsx)('span', { children: 'DOWLAND \xB7 JOSQUIN \xB7 ARBEAU \xB7 TALLIS' }),
                (0, jsxRuntime.jsx)('h3', { children: 'Twenty-five pieces. Written harmony.' }),
                (0, jsxRuntime.jsx)('p', {
                  children:
                    'Harp, harpsichord, recorder, flute, bowed strings, plucked instruments, and occasional soft drums. Every selection has independent written voices or original chordal writing. The complete published parts play together, with varied instrumental colors. No newly composed melodies or accompaniment.',
                }),
              ],
            }),
            (0, jsxRuntime.jsx)('div', {
              className: 'track-list',
              children: MUSIC_TRACKS.map((y, k) =>
                (0, jsxRuntime.jsxs)(
                  'button',
                  {
                    className: r === k ? 'chosen' : '',
                    onClick: () => {
                      (window.clearTimeout(g.current), (p.current = !0));
                      try {
                        localStorage.setItem('haven.music.muted', 'false');
                      } catch {}
                      r === k ? M() : o(k);
                    },
                    'aria-pressed': r === k,
                    children: [
                      (0, jsxRuntime.jsx)('span', {
                        className: 'track-number',
                        children: String(k + 1).padStart(2, '0'),
                      }),
                      (0, jsxRuntime.jsxs)('span', {
                        children: [
                          (0, jsxRuntime.jsx)('strong', { children: y.title }),
                          (0, jsxRuntime.jsx)('small', { children: y.mood }),
                          (0, jsxRuntime.jsx)('small', {
                            className: 'track-instruments',
                            children: y.instruments,
                          }),
                          (0, jsxRuntime.jsx)('small', { children: y.scoring }),
                        ],
                      }),
                      r === k && (0, jsxRuntime.jsx)(es, { size: 17 }),
                    ],
                  },
                  y.id,
                ),
              ),
            }),
            (0, jsxRuntime.jsxs)('div', {
              className: 'music-play-row',
              children: [
                (0, jsxRuntime.jsxs)('button', {
                  className: 'music-play',
                  onClick: w,
                  children: [
                    a ? (0, jsxRuntime.jsx)(ts, { size: 19 }) : (0, jsxRuntime.jsx)($0, { size: 19 }),
                    ' ',
                    a ? 'Pause music' : 'Play music',
                  ],
                }),
                (0, jsxRuntime.jsxs)('label', {
                  children: [
                    (0, jsxRuntime.jsx)(ov, { size: 19 }),
                    (0, jsxRuntime.jsx)('input', {
                      'aria-label': 'Music volume',
                      type: 'range',
                      min: '0',
                      max: '1',
                      step: '.01',
                      value: l,
                      onChange: (y) => {
                        let k = Number(y.target.value);
                        s(k);
                        try {
                          localStorage.setItem('haven.music.volume', String(k));
                        } catch {}
                      },
                    }),
                    (0, jsxRuntime.jsxs)('span', { children: [Math.round(l * 100), '%'] }),
                  ],
                }),
              ],
            }),
            (0, jsxRuntime.jsxs)('label', {
              className: 'playlist-option',
              children: [
                (0, jsxRuntime.jsx)('input', {
                  type: 'checkbox',
                  checked: c,
                  onChange: (y) => u(y.target.checked),
                }),
                'Continue through the playlist',
              ],
            }),
            (0, jsxRuntime.jsx)('p', { className: 'music-status', role: 'status', children: d }),
            (0, jsxRuntime.jsxs)('details', {
              className: 'music-credits',
              children: [
                (0, jsxRuntime.jsx)('summary', { children: 'Music sources & MIDI downloads' }),
                (0, jsxRuntime.jsxs)('p', {
                  children: [
                    'Existing Renaissance and early-1600s compositions (c. 1470\u20131612), realized from complete published scores. Instruments, tempo and exact repetitions vary; no harmony has been added. These pieces accompany a fictional 13th-century North Sea world and were written centuries later. Fifteen ',
                    (0, jsxRuntime.jsx)('a', {
                      href: 'https://www.mutopiaproject.org/',
                      target: '_blank',
                      rel: 'noreferrer',
                      children: 'Mutopia editions',
                    }),
                    ' are marked public domain; ten Philippe de Monte editions by Aaron Dalton use ',
                    (0, jsxRuntime.jsx)('a', {
                      href: 'https://creativecommons.org/licenses/by/4.0/',
                      target: '_blank',
                      rel: 'noreferrer',
                      children: 'CC BY 4.0',
                    }),
                    '. For ten pieces, the MIDI was derived from the editions\u2019 LilyPond sources. Our sample-free MIDI/audio realizations also use CC BY 4.0. ',
                    (0, jsxRuntime.jsx)('a', {
                      href: './music/credits.txt?v=15',
                      target: '_blank',
                      children: 'Full credits and edition details',
                    }),
                    '.',
                  ],
                }),
                (0, jsxRuntime.jsx)('div', {
                  children: MUSIC_TRACKS.map((y) =>
                    (0, jsxRuntime.jsxs)(
                      'a',
                      {
                        href: `./music/${y.id}.mid?v=12`,
                        download: !0,
                        children: [(0, jsxRuntime.jsx)(z4, { size: 14 }), y.title, ' \xB7 MIDI'],
                      },
                      y.id,
                    ),
                  ),
                }),
                (0, jsxRuntime.jsx)('a', {
                  href: './music/tideweald-midi.zip?v=15',
                  download: !0,
                  children: 'Download all 25 MIDI files + sources & credits',
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
var s7 = (0, React.memo)(Soundtrack);

export { s7 };

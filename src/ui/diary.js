// Recovered from the Tideweald v16.11 build. Module: ui/diary

var DIARY_KEY = 'tideweald-playtest-v1';
var rid = () => {
    try {
      return crypto.randomUUID().slice(0, 8);
    } catch {
      return Math.random().toString(36).slice(2, 10);
    }
  },
  Oc = null,
  tl = -1,
  K2 = new Set();
function load() {
  if (Oc) return Oc;
  let e = null;
  try {
    let t = localStorage.getItem(DIARY_KEY);
    t && (e = JSON.parse(t));
  } catch {}
  (!e || e.v !== 1) &&
    (e = { v: 1, enabled: !1, install: rid(), platform: 'web', sessions: [], events: [], notes: [] });
  try {
    (document.documentElement.dataset.playtest === 'on' ||
      new URLSearchParams(location.search).get('playtest') === '1') &&
      (e.enabled = !0);
  } catch {}
  return (Oc = e);
}
function persist() {
  if (Oc) {
    try {
      localStorage.setItem(DIARY_KEY, JSON.stringify(Oc));
    } catch {}
    for (let e of K2) e();
  }
}
var diaryEnabled = () => load().enabled,
  onDiary = (e) => (
    K2.add(e),
    () => {
      K2.delete(e);
    }
  );
function setDiaryEnabled(e, t) {
  let a = load();
  ((a.enabled = e), t !== void 0 && (a.tester = t.trim().slice(0, 40) || void 0), e || (tl = -1), persist());
}
var day = (e) => Math.floor(e.time) + 1;
function diarySession(e, t = 'web') {
  let a = load();
  if (!a.enabled) return;
  a.platform = t;
  let n = Date.now(),
    r = a.sessions[tl];
  if (r && n - r.end < 6e5) {
    ((r.end = n), (r.endDay = day(e)), (r.chapter = e.story.chapter), persist());
    return;
  }
  (a.sessions.push({ start: n, end: n, startDay: day(e), endDay: day(e), chapter: e.story.chapter }),
    a.sessions.length > 400 && a.sessions.shift(),
    (tl = a.sessions.length - 1),
    persist());
}
function diaryTick(e) {
  let t = load();
  if (!t.enabled) return;
  let a = t.sessions[tl];
  if (!a) {
    diarySession(e, t.platform);
    return;
  }
  ((a.end = Date.now()), (a.endDay = day(e)), (a.chapter = e.story.chapter), persist());
}
function diaryLog(e, t, a) {
  let n = load();
  n.enabled &&
    (tl < 0 && diarySession(t, n.platform),
    n.events.push({
      t: Date.now(),
      s: tl,
      k: e,
      d: day(t),
      c: t.story.chapter,
      ...(a ? { x: a.slice(0, 120) } : {}),
    }),
    n.events.length > 3e3 && n.events.splice(0, n.events.length - 3e3),
    persist());
}
function diaryNote(e, t, a) {
  let n = load(),
    r = e.trim().slice(0, 2e3);
  return !r && !t && !a
    ? !1
    : (n.notes.push({ t: Date.now(), text: r, ...(t ? { fun: t } : {}), ...(a ? { clear: a } : {}) }),
      n.notes.length > 200 && n.notes.shift(),
      persist(),
      !0);
}
function diaryClear() {
  let e = load();
  ((e.sessions = []), (e.events = []), (e.notes = []), (tl = -1), persist());
}
var diaryExport = () =>
  JSON.stringify(
    { ...load(), exportedAt: new Date().toISOString(), game: 'Tideweald', format: 'playtest-diary-1' },
    null,
    1,
  );
function diarySummary() {
  let e = load(),
    t = new Set(e.sessions.map((o) => new Date(o.start).toDateString())),
    a = Math.round(e.sessions.reduce((o, l) => o + (l.end - l.start), 0) / 6e4),
    n = e.events.filter((o) => o.k === 'chapter').length,
    r = Math.max(0, ...e.sessions.map((o) => o.chapter + 1));
  return {
    sessions: e.sessions.length,
    days: t.size,
    minutes: a,
    chapters: n,
    best: r,
    notes: e.notes.length,
    events: e.events.length,
    tester: e.tester ?? '',
  };
}

export {
  diaryClear,
  diaryEnabled,
  diaryExport,
  diaryLog,
  diaryNote,
  diarySession,
  diarySummary,
  diaryTick,
  onDiary,
  setDiaryEnabled,
};

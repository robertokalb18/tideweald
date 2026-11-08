// Recovered from the Tideweald v16.11 build. Module: ui/settings

var SETTINGS_KEY = 'tideweald-settings',
  DEFAULT_SETTINGS = {
    batterySaver: !1,
    reducedMotion: !1,
    statusIcons: !0,
    accessibleMarkers: !1,
    largeText: !1,
    soundEffects: !0,
  },
  currentSettings = { ...DEFAULT_SETTINGS };
try {
  let e = typeof localStorage < 'u' ? localStorage.getItem(SETTINGS_KEY) : null;
  e && (currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(e) });
} catch {}
var c2 = new Set(),
  settings = () => currentSettings;
function updateSettings(e) {
  currentSettings = { ...currentSettings, ...e };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings));
  } catch {}
  for (let t of c2) t(currentSettings);
}
function onSettings(e) {
  return (
    c2.add(e),
    () => {
      c2.delete(e);
    }
  );
}

export { onSettings, settings, updateSettings };

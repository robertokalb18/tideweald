// Recovered from the Tideweald v16.11 build. Module: world/seasons

var SEASON_DAYS = 12,
  SEASON_NAMES = ['Spring', 'Summer', 'Autumn', 'Winter'];
function seasonAt(e) {
  let t = Math.floor(e + 1e-8),
    a = Math.floor(t / SEASON_DAYS) % 4;
  return {
    index: a,
    name: SEASON_NAMES[a],
    day: (t % SEASON_DAYS) + 1,
    year: Math.floor(t / 48) + 1,
    remaining: SEASON_DAYS - (t % SEASON_DAYS),
    next: SEASON_NAMES[(a + 1) % 4],
  };
}
function seasonalWeather(e) {
  let { index: t, day: a } = seasonAt(e);
  return t === 0
    ? a % 4 < 2
      ? 'rain'
      : 'sun'
    : t === 1
      ? a % 6 >= 4
        ? 'drought'
        : a % 6 === 1
          ? 'rain'
          : 'sun'
      : t === 2
        ? a % 6 === 4
          ? 'storm'
          : a % 3 === 0
            ? 'sun'
            : 'rain'
        : a % 4 === 0
          ? 'sun'
          : 'snow';
}

export { SEASON_NAMES, seasonAt, seasonalWeather };

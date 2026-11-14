import state from './state.js';
import { cosd, sind, asind } from './helpers/math.js';
import sun from './helpers/sun.js';
import { toMode } from './helpers/time.js';
import time from './helpers/time.js';
// import { geolocation } from './helpers/geolocation.js';

import { fixedGeolocation } from './helpers/geolocation.js';
const geolocation = fixedGeolocation(42.3731022,-71.103081);

// time.set({ start: new Date(2026, 10, 14, 23, 25).valueOf(), speed: 120 });
// time.set({ speed: 2 });

const { sqrt } = Math;

const earthRadius = 6371008.8;     // meters
const displacementTolerance = 250  // meters

const distanceBetween = (loc1, loc2) => {
  const { latitude: lat1, longitude: lon1 } = loc1;
  const { latitude: lat2, longitude: lon2 } = loc2;

  return earthRadius * 2 * asind(sqrt((sind((lat1 - lat2) * 0.5)) ** 2 + cosd(lat1) * cosd(lat2) * (sind((lon1 - lon2) * 0.5)) ** 2));
};

const setTimes = (now) => {
  const { time, timezone } = state;
  time.utc = now;

  const d = new Date(now);
  time.zone = (d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds();
  timezone.name = Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).format(d).split(',')[1].trim();

  time.apparent = toMode('apparent', now);
  time.mean = toMode('mean', now);
};

const initialize = () => new Promise((resolve, reject) => {
  if (!geolocation) {
    reject();
  }

  geolocation.getCurrentPosition((pos) => {
    const { coords } = pos;
    state.location = coords;

    const now = time.now();
    state.ephemeris = sun.ephemeris(now, coords);

    setTimes(now);
    resolve();
  }, reject);
});

const update = () => geolocation.getCurrentPosition((pos) => {
  const { coords } = pos;
  const { location } = state;

  const displacement = distanceBetween(coords, location);
  const displaced = displacement >= displacementTolerance;

  if (displaced) {
    state.location = coords;
  }

  const now = time.now();

  if (displaced || now >= state.ephemeris.endMidnight) {
    state.ephemeris = sun.ephemeris(now, coords);
  }

  setTimes(now);
});

const run = () => {
  update();
  requestAnimationFrame(run);
};

export default { initialize, run };
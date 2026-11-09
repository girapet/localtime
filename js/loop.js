import state from './state.js';
import { cosd, sind, asind } from './helpers/math.js';
import sun from './helpers/sun.js';
import { toMode } from './helpers/time.js';
import time from './helpers/time.js';
import { geolocation } from './helpers/geolocation.js';

// import { fixedGeolocation } from './helpers/geolocation.js';
// const geolocation = fixedGeolocation(42.3809,-71.5448);

// time.set({ start: new Date(2026, 0, 10, 9, 45).valueOf() });
// time.set({ speed: 2 });

const { sqrt } = Math;

const earthRadius = 6371008.8;     // meters
const displacementTolerance = 250  // meters

const distanceBetween = (loc1, loc2) => {
  const { latitude: lat1, longitude: lon1 } = loc1;
  const { latitude: lat2, longitude: lon2 } = loc2;

  return earthRadius * 2 * asind(sqrt((sind((lat1 - lat2) * 0.5)) ** 2 + cosd(lat1) * cosd(lat2) * (sind((lon1 - lon2) * 0.5)) ** 2));
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

    state.time.apparent = toMode('apparent', now);
    state.time.mean = toMode('mean', now);

    resolve();
  }, reject);
});


const update = (now) => geolocation.getCurrentPosition((pos) => {
  const { coords } = pos;
  const { location } = state;

  const displacement = distanceBetween(coords, location);
  const displaced = displacement >= displacementTolerance;

  if (displaced) {
    state.location = coords;
  }

  if (displaced || now >= state.ephemeris.endMidnight) {
    state.ephemeris = sun.ephemeris(now, coords);
  }

  state.time.apparent = toMode('apparent', now);
  state.time.mean = toMode('mean', now);
});

const run = () => {
  update(time.now());
  requestAnimationFrame(run);
};

export default { initialize, run };
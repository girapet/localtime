import state from '../state.js';
import sun from '../helpers/sun.js';
import { toMode } from '../helpers/time.js';
import time from '../helpers/time.js';

// time.set({ start: new Date(2026, 10, 14, 23, 25).valueOf(), speed: 120 });
// time.set({ speed: 2 });

const setTimes = (now) => {
  const { time, timezone } = state;
  time.utc = now;

  const d = new Date(now);
  time.zone = (d.getHours() * 60 + d.getMinutes()) * 60 + d.getSeconds();
  timezone.name = Intl.DateTimeFormat(undefined, { timeZoneName: 'short' }).format(d).split(',')[1].trim();

  time.apparent = toMode('apparent', now);
  time.mean = toMode('mean', now);
};

const initialize = () => {
  const now = time.now();
  state.ephemeris = sun.ephemeris(now, state.location);
  setTimes(now);
};

const update = () => {
  const now = time.now();

  if (now >= state.ephemeris.endMidnight) {
    state.ephemeris = sun.ephemeris(now, state.location);
  }

  setTimes(now);
  requestAnimationFrame(update);
};

const run = () => {
  update();
};

export default { initialize, run };
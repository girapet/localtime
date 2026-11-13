import state from '../state.js';

const { floor, round } = Math;

const secPerHalfDay = 12 * 60 * 60;
const secPerDay = 24 * 60 * 60;
const msPerSec = 1000;

const earthRotSecPerDeg = 240;  // 3,600 seconds in an hour / 15 degrees of Earth rotation per hour = 240 seconds per degree

// Unix time to clock seconds converter

export const toMode = (mode, unixTime) => {
  if (mode === 'apparent') {
    const { startMidnight, noon, endMidnight } = state.ephemeris;

    if (startMidnight <= unixTime && unixTime < noon) {
      return floor(secPerHalfDay * (unixTime - startMidnight) / (noon - startMidnight));
    }

    if (noon <= unixTime && unixTime < endMidnight) {
      return secPerHalfDay + floor(secPerHalfDay * (unixTime - noon) / (endMidnight - noon));
    }

    throw new Error('Specified unixTime is not within the ephemeris day');
  }
  else {
    const { longitude } = state.location;
    return floor(unixTime / msPerSec + longitude * earthRotSecPerDeg) % secPerDay;
  }
};

// current Unix time with development options for time shifting and speed

const settings = {};

const now = () => {
  const n = Date.now();
  
  if (!settings.base) {
    return n;
  }
  
  const elapsed = (n - settings.base) * settings.speed;
  return settings.start + elapsed;
};

const set = (options) => {
  if (!options) {
    settings.base = undefined;
    return;
  }

  const { start, speed } = options;

  settings.base = Date.now();
  settings.start = start ? start : settings.base;
  settings.speed = speed ?? 1;
};


export default { toMode, now, set };


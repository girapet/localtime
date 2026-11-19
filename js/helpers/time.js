import state from '../state.js';
import { secondsPerHour, secondsPerHalfDay, secondsPerDay, millisecondsPerSecond, earthRotationDegreesPerHour } from './constants.js';

const { floor } = Math;

// UTC time to clock seconds converter

export const toMode = (mode, utc) => {
  if (mode === 'apparent') {
    const { startMidnight, noon, endMidnight } = state.ephemeris;

    if (utc < noon) {
      return secondsPerHalfDay * (utc - startMidnight) / (noon - startMidnight);
    }

    if (noon <= utc) {
      return secondsPerHalfDay + secondsPerHalfDay * (utc - noon) / (endMidnight - noon);
    }

    throw new Error('Specified UTC time is not within the ephemeris day');
  }
  else {
    const { longitude } = state.location;
    return (utc / millisecondsPerSecond + longitude * secondsPerHour / earthRotationDegreesPerHour) % secondsPerDay;
  }
};

// current UTC time with development options for time shifting and speed

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


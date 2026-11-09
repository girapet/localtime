import observe from './helpers/observe.js';

const state = {
  time: {
    mode: 'apparent',     // 'apparent', 'mean'
    clockType: '12hr',    // '12hr', '24hr'
    apparent: 0,          // seconds of apparent solar day
    mean: 0               // seconds of mean solar day
  },
  location: {
    latitude: 0.0,        // decimal degrees
    longitude: 0.0
  },
  ephemeris: {            // UTC milliseconds, Unix time
    startMidnight: 0,
    startDawn: 0,
    startRise: 0,
    noon: 0,
    endSet: 0,
    endDusk: 0,
    endMidnight: 0
  }
};

export default observe(state);
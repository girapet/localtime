import observe from './helpers/observe.js';

const state = {
  settings: {
    mode: 'apparent',     // 'apparent', 'mean'
    clockType: '12hr',    // '12hr', '24hr'
  },
  time: {
    apparent: 0,          // seconds of apparent solar day
    mean: 0,              // seconds of mean solar day
    zone: 0,              // seconds of day in current timezone
    utc: 0                // UTC milliseconds
  },
  timezone: {
    name: ''
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

// get settings saved in localStorage if available

const { settings } = state;

Object.keys(settings).forEach((key) => {
  const value = localStorage.getItem(key);

  if (value) {
    settings[key] = value;
  }
});

// update localStorage on any setting change

const observedState = observe(state);

observedState.on('settings.*', (event) => {
  const { property, newValue } = event;
  localStorage.setItem(property, newValue);
});

export default observedState;
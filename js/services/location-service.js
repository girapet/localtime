import state from '../state.js';
import sun from '../helpers/sun.js';
import time from '../helpers/time.js';
import { distanceBetween, trajectoryPoint } from '../helpers/measure.js';

// // high-speed testing

// import travelingGeolocation from './traveling-geolocation.js';
// const boston = { latitude: 42.361468, longitude: -71.0097878 };
// const seattle = { latitude: 47.4517171, longitude: -122.3124929 };
// const london = { latitude: 51.4693031, longitude: -0.4671464 };
// const geolocation = travelingGeolocation(boston, seattle, 900);

const { geolocation } = navigator;

const speedTolerance = 5;      // meters per second, about 11 MPH or 18 KPH

let previousLocation;
let currentLocation;
let baseDistance;
let baseTimeOffset;

const toLocation = (position) => {
  const { latitude, longitude } = position.coords;
  return { latitude, longitude, utc: time.now() };
};

const initialize = () => new Promise(async (resolve, reject) => {
  const permission = await navigator.permissions.query({ name: 'geolocation' });

  if (permission.state === 'denied') {
    reject('Permission to use this device\'s location was denied');
    return;
  }

  geolocation.getCurrentPosition((position) => {
    state.location = toLocation(position);
    previousLocation = state.location;
    currentLocation = state.location;
    resolve();
  },
  () => {
    reject('Could not get a location for this device');
  });
});

// The update cycle of geolocation.watchPosition can be several seconds on a mobile device.
// This would be a problem when traveling at high speeds, as it would normally cause stuttering
// in the displayed time. In this code, we keep track of the previous two locations and at high
// speeds plot a trajectory through them to calculate the latest location.

const update = () => {
  if (baseDistance) {
    const utc = time.now();
    const currentTimeOffset = (utc - previousLocation.utc) * 0.001;      // seconds
    const distance = currentTimeOffset * baseDistance / baseTimeOffset;  // meters

    const trajectoryLocation = trajectoryPoint(previousLocation, currentLocation, distance);
    trajectoryLocation.utc = utc;

    state.location = trajectoryLocation;
    state.ephemeris = sun.ephemeris(state.location.utc, state.location);
  }
  
  requestAnimationFrame(update);
};

const run = () => {
  geolocation.watchPosition((position) => {
    state.location = toLocation(position);
    state.ephemeris = sun.ephemeris(state.location.utc, state.location);

    previousLocation = currentLocation;
    currentLocation = state.location;

    baseDistance = 0;
    baseTimeOffset = 0;

    const distance = distanceBetween(previousLocation, currentLocation);      // meters
    const timeOffset = (currentLocation.utc - previousLocation.utc) * 0.001;  // seconds
    const speed = distance / timeOffset;                                      // meters per second

    if (speed >= speedTolerance) {
      baseDistance = distance;
      baseTimeOffset = timeOffset;
    }
  });

  update();
};


export default { initialize, run };
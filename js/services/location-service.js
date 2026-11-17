import state from '../state.js';
import sun from '../helpers/sun.js';
import { cosd, sind, asind } from '../helpers/math.js';

const { sqrt } = Math;

const { geolocation } = navigator;

const earthRadius = 6371008.8;     // meters
const displacementTolerance = 250  // meters

const distanceBetween = (loc1, loc2) => {
  const { latitude: lat1, longitude: lon1 } = loc1;
  const { latitude: lat2, longitude: lon2 } = loc2;

  return earthRadius * 2 * asind(sqrt((sind((lat1 - lat2) * 0.5)) ** 2 + cosd(lat1) * cosd(lat2) * (sind((lon1 - lon2) * 0.5)) ** 2));
};

const initialize = () => new Promise(async (resolve, reject) => {
  const permission = await navigator.permissions.query({ name: 'geolocation' });

  if (permission.state === 'denied') {
    reject('Permission to use this device\'s location was denied');
    return;
  }

  geolocation.getCurrentPosition((position) => {
    state.location = position.coords;
    resolve();
  },
  () => {
    reject('Could not get a location for this device');
  });
});

const run = () => {
  geolocation.watchPosition((position) => {
    const { coords } = position;
    const { location } = state;

    const displacement = distanceBetween(coords, location);

    if (displacement >= displacementTolerance) {
      state.location = coords;
      state.ephereris = sun.ephemeris(state.time.utc, coords);
    }
  });
};

export default { initialize, run };
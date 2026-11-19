import time from "../helpers/time.js";
import { distanceBetween, trajectoryPoint } from "../helpers/measure.js";

const { floor } = Math;

// for testing: given start and end locations and speed, returns a mock geolocation object
// which emulates a device in motion

const travelingGeolocation = (start, end, speedKph) => {
  const startTime = time.now();
  const speedMps = speedKph / 3.6;
  const baseDistance = distanceBetween(start, end);

  const getCurrentPosition = (callback) => {
    const currentTime = time.now();
    const currentDistance = (currentTime - startTime) * 0.001 * speedMps;

    const fractionalDistance = currentDistance % baseDistance;
    const lap = floor(currentDistance / baseDistance);
    const lapDistance = lap % 2 ? (baseDistance - fractionalDistance) : fractionalDistance;

    const coords = trajectoryPoint(start, end, lapDistance);
    callback({ coords });
  };

  return {
    getCurrentPosition: (callback) => {
      setTimeout(() => {
        getCurrentPosition(callback)
      }, 2000);
    },
    watchPosition: (callback) => {
      setInterval(() => {
        getCurrentPosition(callback)
      }, 2300);      
    }
  };
};

export default travelingGeolocation;
import { toRadians, toDegrees } from "./math.js";

const earthRadius = 6371008.8;     // meters

const { asin, sqrt, sin, cos, atan2 } = Math;

const pointsToRadians = (loc1, loc2) => ({
  lat1: toRadians(loc1.latitude),
  lon1: toRadians(loc1.longitude),
  lat2: toRadians(loc2.latitude),
  lon2: toRadians(loc2.longitude)
});

const angleBetween = (lat1, lon1, lat2, lon2) => {
  return 2 * asin(sqrt((sin((lat1 - lat2) * 0.5)) ** 2 + cos(lat1) * cos(lat2) * (sin((lon1 - lon2) * 0.5)) ** 2));
};

// distance in meters between two points in degrees latitude and longitude

export const distanceBetween = (loc1, loc2) => {
  const { lat1, lon1, lat2, lon2 } = pointsToRadians(loc1, loc2);
  return angleBetween(lat1, lon1, lat2, lon2) * earthRadius;
};

// returns the point a specified distance in meters along the great circle trajectory between
// two points; all points in degrees latitude and longitude

export const trajectoryPoint = (loc1, loc2, distance) => {
  const { lat1, lon1, lat2, lon2 } = pointsToRadians(loc1, loc2);

  // source: https://edwilliams.org/avform147.htm#Intermediate

  const d = angleBetween(lat1, lon1, lat2, lon2);
  const f = (distance / earthRadius) / d;

  const a = sin((1 - f) * d) / sin(d);
  const b = sin(f * d) / sin(d);
  const x = a * cos(lat1) * cos(lon1) + b * cos(lat2) * cos(lon2);
  const y = a * cos(lat1) * sin(lon1) + b * cos(lat2) * sin(lon2);
  const z = a * sin(lat1) + b * sin(lat2);

  return {
    latitude: toDegrees(atan2(z, sqrt(x ** 2 + y ** 2))),
    longitude: toDegrees(atan2(y, x))
  };
};

export default { distanceBetween, trajectoryPoint };


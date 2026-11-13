// sources:
//
//  Paul Schlyter, How to compute planetary positions
//    http://www.stjarnhimlen.se/comp/ppcomp.html
//
//  Jean Meeus, Astronomical Algorithms (1st edition)
//    Willmann-Bell, 1991

import { cosd, sind, acosd, asind, atan2d, rev, rev180, toDegrees } from './math.js';
import { millisecondsPerDay } from './constants.js';

const { abs, sqrt } = Math;

// point conversion

const rectToPolar = (r) => ({
  longitude: rev(atan2d(r.x, r.y)),
  latitude: atan2d(sqrt(r.x * r.x + r.y * r.y), r.z)
});

// epoch time and Julian day functions

const epoch = Date.UTC(1999, 11, 31);

const unixToEpochTime = (unixTime) => (unixTime - epoch) / millisecondsPerDay;
const epochToUnixTime = (epochTime) => epochTime ? epochTime * millisecondsPerDay + epoch : null;

// astronomical functions

const obliquityOfEcliptic = (time) => 23.4393 - (3.563e-7 * time);
const sunArgOfPerihelion = (time) => rev(282.9404 + 4.70935e-5 * time);
const sunEccentricity = (time) => 0.016709 - 1.151e-9 * time;
const sunMeanAnomaly = (time) => rev(356.0470 + 0.9856002585 * time);
const siderealTime = (time, longitude) => rev(280.4606 + 360.98564736629 * (time - 1.5) + longitude);

const eclipticToEquatorial = (time, r) => {
  const o = obliquityOfEcliptic(time);
  const coso = cosd(o);
  const sino = sind(o);
  return {
    x: r.x,
    y: r.y * coso - r.z * sino,
    z: r.y * sino + r.z * coso
  };
};

const sunEclipticPosition = (time) => {
  const w = sunArgOfPerihelion(time);
  const e = sunEccentricity(time);
  const M = sunMeanAnomaly(time);
  const ea = M + toDegrees(e * sind(M) * (1 + e * cosd(M)));
  const xv = cosd(ea) - e;
  const yv = sqrt(1 - e * e) * sind(ea);
  const v = atan2d(xv, yv);
  const r = sqrt(xv * xv + yv * yv);

  return {
    x: r * cosd(v + w),
    y: r * sind(v + w),
    z: 0
  };
};

const sunEquatorialPosition = (time) => eclipticToEquatorial(time, sunEclipticPosition(time));

// time finding functions

const findTransitTime = (time, observer, atNoon) => {
  const offset = atNoon || atNoon === undefined ? 0 : 180;
  let t = time;
  let delta = 0;

  do {
    t += delta / 360;
    const sun = rectToPolar(sunEquatorialPosition(t));
    delta = rev180(sun.longitude - siderealTime(t, observer.longitude + offset));
  } while (abs(delta) > 0.0001);

  return t;
};

const findAltitudeTime = (time, noon, observer, rising, altitude) => {
  let t = time;
  let sun = rectToPolar(sunEquatorialPosition(t));
  const cosh0 = (sind(altitude) - sind(observer.latitude) * sind(sun.latitude)) / (cosd(observer.latitude) * cosd(sun.latitude));

  if (cosh0 > 1) {
    return;
  }

  const direction = rising ? -1 : 1;
  const midnight = findTransitTime(noon + direction * 0.5, observer, false);

  if (cosh0 < -1) {
    return;
  }

  t = noon + direction * acosd(cosh0) / 360;
  let delta = 0;
  let i = -1;

  do {
    t += direction * delta / 360;
    sun = rectToPolar(sunEquatorialPosition(t));
    const h = rev(siderealTime(t, observer.longitude) - sun.longitude);
    const newAltitude = asind(sind(observer.latitude) * sind(sun.latitude) + cosd(observer.latitude) * cosd(sun.latitude) * cosd(h));
    delta = newAltitude - altitude;
    i += 1;
  } while (abs(delta) > 0.0001 && i < 2000);

  if (rising) {
    return midnight <= t && t <= noon ? t : undefined;
  }

  return noon <= t && t <= midnight ? t : undefined;
};

const ephemeris = (unixTime, observer) => {
  const transit = findTransitTime(unixToEpochTime(unixTime), observer);

  const startMidnight = epochToUnixTime(findTransitTime(transit - 0.5, observer, false));
  const startDawn = epochToUnixTime(findAltitudeTime(transit - 0.25, transit, observer, true, -6));
  const startRise = epochToUnixTime(findAltitudeTime(transit - 0.25, transit, observer, true, -0.833));
  const noon = epochToUnixTime(transit);
  const endSet = epochToUnixTime(findAltitudeTime(transit + 0.25, transit, observer, false, -0.833));
  const endDusk = epochToUnixTime(findAltitudeTime(transit + 0.25, transit, observer, false, -6));
  const endMidnight = epochToUnixTime(findTransitTime(transit + 0.5, observer, false));

  return { 
    startMidnight,
    startDawn,
    startRise,
    noon,
    endSet,
    endDusk,
    endMidnight
  };
};

export default { ephemeris };

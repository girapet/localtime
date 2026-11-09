const { cos, sin, acos, asin, atan2, PI } = Math;

// angular unit conversion

export const toRadians = (degrees) => degrees * PI / 180;
export const toDegrees = (radians) => radians * 180 / PI;

// trigonometric functions in degrees

export const cosd = (x) => cos(toRadians(x));
export const sind = (x) => sin(toRadians(x));
export const acosd = (x) => toDegrees(acos(x));
export const asind = (x) => toDegrees(asin(x));
export const atan2d = (x, y) => toDegrees(atan2(y, x));

// angular unwinding in degrees

export const rev = (x) => {
  const xr = x % 360;
  return xr >= 0 ? xr : xr + 360;
};

export const rev180 = (x) => {
  const xr = rev(x);
  return xr <= 180 ? xr : xr - 360;
};

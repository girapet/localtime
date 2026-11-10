
export const pad = (n) => {
  const s = n.toFixed(0);
  return n < 10 ? `0${s}` : s;
};

export const capitalize = (s) => {
  if (!s) {
    return s;
  }

  return `${s[0].toUpperCase()}${s.substring(1)}`;
};

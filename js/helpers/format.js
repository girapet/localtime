
export const pad = (n) => {
  const s = n.toFixed(0);
  return n < 10 ? `0${s}` : s;
};

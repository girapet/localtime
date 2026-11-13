const { floor, round } = Math;

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

export const sexagesimalSeconds = (seconds) => {
  let m = floor(seconds / 60);
  let s = round(seconds - m * 60);

  if (s === 60) {
    s = 0;
    m +=1;
  }

  let unit = floor(m / 60);
  m -= unit * 60;

  if (m === 60) {
    m = 0;
    unit +=1;
  }

  return { unit, mm: pad(m), ss: pad(s) }
};

export const sexagesimalMinutes = (seconds) => {
  let minutes = seconds / 60;
  let unit = floor(minutes / 60);
  let m = round(minutes - unit * 60);

  if (m === 60) {
    m = 0;
    unit +=1;
  }

  return { unit, mm: pad(m) }
};

export const formatHour = (hour, clockType) => {
  let h = hour;

  if (clockType === '12hr') {
    h = ((hour + 11) % 12) + 1;
  }

  return `${h}`;
};

export const getPeriod = (hour, clockType) => {
  if (clockType === '24hr') {
    return '';
  }

  return hour < 12 ? 'AM' : 'PM';
};

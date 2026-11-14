import state from '../state.js';
import dom from '../helpers/dom.js';
import { boxStylesheet } from '../styles/box-styles.js';
import { cosd, sind } from '../helpers/math.js';

const { round } = Math;

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host {
    display: flex;
    justify-content: center;  
  }

  #container {
    width: 70%;
    height: auto;
    aspect-ratio: 1;
    margin-top: 18px;
  }
  
  #night-arc {
    fill: hsl(210, 85%, 20%);
  }
  
  #civil-arc {
    fill: hsl(210, 80%, 65%);
  }

  #day-arc {
    fill: hsl(210, 85%, 80%);
  }
`);

const aor = 100;  // arc outer radius
const aw = 30;    // arc width

const air = aor - aw;               // arc inner radius
const sr = round(aw * 0.3);         // sun radius
const str = round(aor - aw * 0.5);  // sun track radius
const vbs = round(aor * 2.2);       // viewBox size

const svgContent = `
  <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${vbs} ${vbs}">
    <defs>
      <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
        <feOffset result="offOut" in="SourceAlpha" dx="3" dy="-3" />
        <feComponentTransfer result="transferOut" in="offOut">
          <feFuncA type="linear" slope="0.5"/>
        </feComponentTransfer>
        <feGaussianBlur result="blurOut" in="transferOut" stdDeviation="2" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs>
    <defs>
      <filter id="sun-glow" x="-100%" y="-100%" width="300%" height="300%">
        <feMorphology id="sun-dilate" result="dilateOut" in="SourceGraphic" operator="dilate" radius="2"></feMorphology>
        <feGaussianBlur id="sun-blur" result="blurOut" in="dilateOut" stdDeviation="4" />
        <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
      </filter>
    </defs>
    <g transform="matrix(1 0 0 -1 ${vbs * 0.5} ${vbs * 0.5})">
      <path id="night-arc" filter="url(#drop-shadow)" d="M 0 ${-aor} A ${aor} ${aor} 180 0 0 0 ${aor} A ${aor} ${aor} 180 0 0 0 ${-aor} L 0 ${-air} A ${air} ${air} 180 0 1 0 ${air} A ${air} ${air} 180 0 1 0 ${-air} z" />
      <path id="civil-arc" />
      <path id="day-arc" />
      <circle id="sun" filter="url(#sun-glow)" r="${sr}" />
    </g>
  </svg>
`;

const getAngle = (unixTime) => {
  const { startMidnight, noon, endMidnight } = state.ephemeris;

  let angle;

  if (startMidnight <= unixTime && unixTime <= noon) {
    angle = 270 - 180 * (unixTime - startMidnight) / (noon - startMidnight);
  }
  else {
    angle = 90 - 180 * (unixTime - noon) / (endMidnight - noon);
  }

  return angle;
};

class DialPanel extends HTMLElement {
  #civilArc;
  #dayArc;
  #sun;
  #sunDilate;
  #sunBlur;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [boxStylesheet, stylesheet];

    const container = dom.create('div', { id: 'container' }, svgContent);
    this.#civilArc = dom.find(container, '#civil-arc')[0];
    this.#dayArc = dom.find(container, '#day-arc')[0];

    this.#sun = dom.find(container, '#sun')[0];
    this.#sunDilate = dom.find(container, '#sun-dilate')[0];
    this.#sunBlur = dom.find(container, '#sun-blur')[0];
    
    dom.add(shadow, [
      container
    ]);

    state.on('location,ephemeris', () => this.#updateArcs());
    state.on('time.utc', () => this.#updateSun());

    this.#updateArcs();
    this.#updateSun();
  }

  #updateArc(arc, start, noon, end) {
    if (start === noon && noon === end) {
      arc.setAttribute('d', '');
      return;
    }

    let a = getAngle(start);
    let cosa = cosd(a);
    let sina = sind(a);
    const x0 = (cosa * aor).toFixed(2);
    const y0 = (sina * aor).toFixed(2);
    const x3 = (cosa * air).toFixed(2);
    const y3 = (sina * air).toFixed(2);
    const a0 = (a - 90).toFixed(2);

    a = getAngle(end);
    cosa = cosd(a);
    sina = sind(a);
    const x1 = (cosa * aor).toFixed(2);
    const y1 = (sina * aor).toFixed(2);
    const x2 = (cosa * air).toFixed(2);
    const y2 = (sina * air).toFixed(2);
    const a1 = ((90 - a) % 360).toFixed(2);

    arc.setAttribute('d', `M ${x0} ${y0} A ${aor} ${aor} ${a0} 0 0 0 ${aor} A ${aor} ${aor} ${a1} 0 0 ${x1} ${y1} L ${x2} ${y2} A ${air} ${air} ${a1} 0 1 0 ${air} A ${air} ${air} ${a0} 0 1 ${x3} ${y3} z`);
  }

  #updateArcs() {
    const { startDawn, startRise, noon, endSet, endDusk } = state.ephemeris;

    this.#updateArc(this.#civilArc, startDawn, noon, endDusk);
    this.#updateArc(this.#dayArc, startRise, noon, endSet);
  }

  #updateSun() {
    const { utc: now } = state.time;
    const { startDawn, startRise, endSet, endDusk } = state.ephemeris;

    const angle = getAngle(now);
    this.#sun.setAttribute('cx', (cosd(angle) * str).toFixed(2));
    this.#sun.setAttribute('cy', (sind(angle) * str).toFixed(2));

    let ratio;

    if (now < startDawn || endDusk < now) {
      this.#sun.setAttribute('fill', 'hsl(60, 0%, 90%)');
      this.#sunDilate.setAttribute('radius', 0);
      this.#sunBlur.setAttribute('stdDeviation', 0);
    }
    else if (now < startRise) {
      ratio = (now - startDawn) / (startRise - startDawn);
      this.#sun.setAttribute('fill', `hsl(60, ${95 * ratio}%, ${70 + 20 * (1 - ratio)}%)`);
      this.#sunDilate.setAttribute('radius', 2 * ratio);
      this.#sunBlur.setAttribute('stdDeviation', 4 * ratio);
    }
    else if (now < endSet) {
      this.#sun.setAttribute('fill', 'hsl(60, 95%, 70%)');
      this.#sunDilate.setAttribute('radius', 2);
      this.#sunBlur.setAttribute('stdDeviation', 4);
    }
    else if (now < endDusk) {
      ratio = (endDusk - now) / (endDusk - endSet);
      this.#sun.setAttribute('fill', `hsl(60, ${95 * ratio}%, ${70 + 20 * (1 - ratio)}%)`);
      this.#sunDilate.setAttribute('radius', 2 * ratio);
      this.#sunBlur.setAttribute('stdDeviation', 4 * ratio);
    }
  }
}

customElements.define('lt-dial-panel', DialPanel);

export default DialPanel;
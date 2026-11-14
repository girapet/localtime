import state from '../state.js';
import dom from '../helpers/dom.js';
import { toMode } from '../helpers/time.js';
import { sexagesimalMinutes, formatHour, getPeriod } from '../helpers/format.js';
import { tileStylesheet } from '../styles/tile-styles.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  #time {
    padding: 10px;
    font-size: 14pt;
    background-color: var(--content-color);
  }
`);

class EphemerisTile extends HTMLElement {
  #property;
  #title;
  #time;

  constructor(title, property) {
    super();
    this.#title = title;
    this.#property = property;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [tileStylesheet, stylesheet];

    const title = dom.create('div', this.#title, { id: 'title' });
    this.#time = dom.create('div', { id: 'time' });

    dom.add(shadow, [
      title,
      this.#time
    ]);

    state.on('settings.*,ephemeris', () => this.#display());

    this.#display();
  }

  #display() {
    const { mode, clockType } = state.settings;
    const { startMidnight, noon, endMidnight } = state.ephemeris;
    const prop = this.#property;

    const unixTime = state.ephemeris[prop];

    if (prop !== 'startMidnight' && prop !== 'noon' && (unixTime === startMidnight || unixTime === noon || unixTime === endMidnight)) {
      this.#time.innerText = `-:--`;
    }
    else {
      const seconds = toMode(mode, unixTime);
      const { unit: hour, mm } = sexagesimalMinutes(seconds);

      const h = formatHour(hour, clockType);
      const period = getPeriod(hour, clockType);
      
      this.#time.innerText = `${h}:${mm} ${period}`;
    }
  }
}

customElements.define('lt-ephemeris-tile', EphemerisTile);

export default EphemerisTile;
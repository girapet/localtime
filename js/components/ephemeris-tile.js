import state from '../state.js';
import dom from '../helpers/dom.js';
import { toMode } from '../helpers/time.js';
import { sexagesimalMinutes, formatHour, getPeriod } from '../helpers/format.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host div {
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    text-align: center;
  }
  
  #title {
    font-weight: bold;
    font-size: var(--default-font-size);
    padding: 6px;
  }

  #time {
    padding: 10px;
    font-size: 14pt;
    background-color: var(--content-color);
  }
`);

class EphemerisTile extends HTMLElement {
  #title;
  #property;
  #time;

  constructor(title, property) {
    super();
    this.#title = title;
    this.#property = property;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    const title = dom.create('div', this.#title, { id: 'title' });
    this.#time = dom.create('div', { id: 'time' });

    dom.add(shadow, [
      title,
      this.#time
    ]);

    state.on('settings.*,location', () => this.#display());

    this.#display();
  }

  #display() {
    const { mode, clockType } = state.settings;
    const seconds = toMode(mode, state.ephemeris[this.#property]);
    const { unit: hour, mm } = sexagesimalMinutes(seconds);

    const h = formatHour(hour, clockType);
    const period = getPeriod(hour, clockType);
    
    this.#time.innerText = `${h}:${mm} ${period}`;
  }
}

customElements.define('lt-ephemeris-tile', EphemerisTile);

export default EphemerisTile;
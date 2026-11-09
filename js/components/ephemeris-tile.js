import state from '../state.js';
import dom from '../helpers/dom.js';
import { toMode, toHm } from '../helpers/time.js';

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

    this.#time = dom.create('div');

    dom.add(shadow, [
      dom.create('div', this.#title),
      this.#time
    ]);

    state.on('settings.*,location', () => this.#display());

    this.#display();
  }

  #display() {
    const { mode } = state.settings;
    const time = toMode(mode, state.ephemeris[this.#property]);
    const { hh, mm, ampm } = toHm(time);
    
    this.#time.innerText = `${hh}:${mm} ${ampm || ''}`;
  }
}

customElements.define('lt-ephemeris-tile', EphemerisTile);

export default EphemerisTile;
import state from '../state.js';
import dom from '../helpers/dom.js';
import { toHms } from '../helpers/time.js';

class TimePanel extends HTMLElement {
  #time;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    this.#time = dom.create('div');
    dom.add(shadow, [this.#time]);

    state.on('time.*', (event) => this.#display(event));

    this.#display();
  }

  #display(event = {}) {
    const { mode } = state.time;
    const { property } = event;

    if (!property || property === mode || property === 'mode' || property === 'clockType') {
      const { hh, mm, ss, ampm } = toHms(state.time[mode]);
      this.#time.innerText = `${hh}:${mm}:${ss} ${ampm || ''}`;
    }
  }
}

customElements.define('lt-time-panel', TimePanel);

export default TimePanel;
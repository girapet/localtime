import state from '../state.js';
import dom from '../helpers/dom.js';
import { capitalize } from '../helpers/format.js';
import { toHms } from '../helpers/time.js';

const { abs } = Math;

class OffsetPanel extends HTMLElement {
  #type;
  #title;
  #offset;

  constructor(type) {
    super();
    this.#type = type;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    this.#title = dom.create('div');
    this.#offset = dom.create('div');
    dom.add(shadow, [this.#title, this.#offset]);

    state.on('settings.*,time.*', (event) => this.#display(event));

    this.#display();
  }

  #display(event = {}) {
    const { mode } = state.settings;
    const { property, path } = event;

    if (!(!property || property === mode || path.startsWith('settings.'))) {
      return;
    }
    
    let offset;

    if (this.#type === 'local') {
      const otherMode = mode === 'apparent' ? 'mean' : 'apparent';
      this.#title.innerText = `Offset from Local ${capitalize(otherMode)} Time`;
      offset = state.time[mode] - state.time[otherMode];
    }
    else {
      this.#title.innerText = `Offset from ${state.timezone.name}`;
      offset = state.time[mode] - state.time.zone;
    }

    const sign = offset >= 0 ? '+' : '-';
    const { hh, mm, ss } = toHms(abs(offset), '24hr');
    this.#offset.innerText = `${sign}${hh}:${mm}:${ss}`;
  }
}

customElements.define('lt-offset-panel', OffsetPanel);

export default OffsetPanel;
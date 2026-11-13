import state from '../state.js';
import dom from '../helpers/dom.js';
import { capitalize, sexagesimalSeconds } from '../helpers/format.js';

const { abs } = Math;

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

  #offset {
    padding: 10px;
    background-color: var(--content-color);
  }

  .large {
    font-size: 14pt;
  }
  
  .small {
    font-size: 12pt;
  }
`);

class OffsetTile extends HTMLElement {
  #type;
  #title;
  #hoursMinutes;
  #seconds;

  constructor(type) {
    super();
    this.#type = type;
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    this.#title = dom.create('div', { id: 'title' });
    this.#hoursMinutes = dom.create('span', { className: 'large' });
    this.#seconds = dom.create('span', { className: 'small' });
    
    const offset = dom.create('div', { id: 'offset' }, [
      this.#hoursMinutes,
      this.#seconds
    ]);

    dom.add(shadow, [
      this.#title, 
      offset
    ]);

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
      this.#title.innerText = `Local ${capitalize(otherMode)} Time`;
      offset = state.time[mode] - state.time[otherMode];
    }
    else {
      this.#title.innerText = `Device Time (${state.timezone.name})`;
      offset = state.time[mode] - state.time.zone;
    }

    offset = ((offset + 129600) % 86400) - 43200;

    const dir = offset >= 0 ? 'ahead' : 'behind';
    const { unit: h, mm, ss } = sexagesimalSeconds(abs(offset));

    this.#hoursMinutes.innerText = `${dir} ${h}:${mm}`;
    this.#seconds.innerText = `:${ss}`;
  }
}

customElements.define('lt-offset-tile', OffsetTile);

export default OffsetTile;
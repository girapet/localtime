import state from '../state.js';
import dom from '../helpers/dom.js';
import { pad } from '../helpers/format.js';

const { abs, floor, round } = Math;

// import sharedStylesheet from '../style/shared-stylesheet.js';

class TitleBar extends HTMLElement {
  #title;
  #location;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    // shadow.adoptedStyleSheets = [sharedStylesheet];

    this.#title = dom.create('div');
    this.#location = dom.create('div');

    dom.add(shadow, dom.create('div', [
      this.#title,
      this.#location
    ]));

    state.on('time.mode', () => this.#displayTitle());
    state.on('location', () => this.#displayLocation());

    this.#displayTitle();
    this.#displayLocation();
  }

  #displayTitle() {
    const mode = state.time.mode === 'apparent' ? 'Apparent' : 'Mean';
    this.#title.innerText = `Local ${mode} Time`;
  }

  #displayLocation() {
    const { longitude } = state.location;
    const seconds = round(abs(longitude) * 3600);

    let m = floor(seconds / 60);
    let s = seconds - m * 60;

    let d = floor(m / 60);
    m -= d * 60;

    if (s === 60) {
      s = 0;
      m +=1;
    }

    if (m === 60) {
      m = 0;
      d +=1;
    }

    const dir = longitude >= 0 ? 'E' : 'W';

    this.#location.innerText = `for ${abs(d)}° ${pad(m)}' ${pad(s)}" ${dir} longitude`;
  }
}

customElements.define('lt-title-bar', TitleBar);

export default TitleBar;
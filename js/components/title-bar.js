import state from '../state.js';
import dom from '../helpers/dom.js';
import { pad, capitalize, sexagesimalSeconds } from '../helpers/format.js';
import icon from '../styles/icon.js';

const { abs, floor, round } = Math;

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: fit-content;
    padding: 6px;
    text-align: center;
  }
  
  #title {
    display: inline-block;
    font-size: 20pt;
    font-weight: bold;
    margin-top: 12px;
    margin-bottom: 4px;
  }

  #settings {
    position: absolute;
    right: 6px;
    top: 6px;
    width: 24px;
    height: 24px;
    color: var(--text-color);
  }
`);

class TitleBar extends HTMLElement {
  #title;
  #location;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    this.#title = dom.create('span', { id: 'title' });
    this.#location = dom.create('span');

    const app = dom.find('lt-app')[0];
    const settingsButton = dom.create('div', icon('settings'), { id: 'settings' });
    dom.on(settingsButton, 'click', () => app.settingsDialog.open());

    dom.add(shadow, dom.create('div', [
      this.#title,
      dom.create('br'),
      this.#location,
      settingsButton
    ]));

    state.on('settings.mode', () => this.#displayTitle());
    state.on('location', () => this.#displayLocation());

    this.#displayTitle();
    this.#displayLocation();
  }

  #displayTitle() {
    const { mode } = state.settings;
    this.#title.innerText = `Local ${capitalize(mode)} Time`;
  }

  #displayLocation() {
    const { longitude } = state.location;
    const seconds = round(abs(longitude) * 3600);
    const { unit: d, mm, ss } = sexagesimalSeconds(seconds);
    const dir = longitude >= 0 ? 'E' : 'W';

    this.#location.innerText = `for ${d}° ${mm}' ${ss}" ${dir} longitude`;
  }
}

customElements.define('lt-title-bar', TitleBar);

export default TitleBar;
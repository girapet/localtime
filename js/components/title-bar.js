import state from '../state.js';
import dom from '../helpers/dom.js';
import { capitalize, sexagesimalSeconds } from '../helpers/format.js';
import { boxStylesheet } from '../styles/box-styles.js';
import { buttonStyles } from '../styles/button-styles.js';
import icon from '../styles/icon.js';

const { abs } = Math;

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host {
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

  ${buttonStyles}

  #settings {
    right: 10px;
    top: 6px;
  }

  #help {
    right: 10px;
    top: 40px;
  }
`);

class TitleBar extends HTMLElement {
  #title;
  #location;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [boxStylesheet, stylesheet];

    this.#title = dom.create('span', { id: 'title' });
    this.#location = dom.create('span');

    const app = dom.find('lt-app')[0];

    const settingsButton = dom.create('div', icon.settings, { id: 'settings', className: 'button' });
    dom.on(settingsButton, 'click', () => app.settingsDialog.open());

    const helpButton = dom.create('div', icon.help, { id: 'help', className: 'button' });
    dom.on(helpButton, 'click', () => app.helpDialog.open());

    dom.add(shadow, dom.create('div', [
      this.#title,
      dom.create('br'),
      this.#location,
      settingsButton,
      helpButton
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
    const seconds = abs(longitude) * 3600;
    const { unit: d, mm, ss } = sexagesimalSeconds(seconds);
    const dir = longitude >= 0 ? 'E' : 'W';

    this.#location.innerText = `for ${d}° ${mm}' ${ss}" ${dir} longitude`;
  }
}

customElements.define('lt-title-bar', TitleBar);

export default TitleBar;
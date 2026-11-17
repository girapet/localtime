import dom from '../helpers/dom.js';
import { boxStylesheet } from '../styles/box-styles.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  div {
    width: 100%;
    margin-top: 16px;
    text-align: center;
  }
`);

class StartPanel extends HTMLElement {
  #message

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [boxStylesheet, stylesheet];

    this.#message = dom.create('div', 'Getting device location, please wait...');
    dom.add(shadow, this.#message);
  }

  showMessage(message) {
    this.#message.innerHTML = message;
  }
}

customElements.define('lt-start-panel', StartPanel);

export default StartPanel;
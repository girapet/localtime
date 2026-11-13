import state from '../state.js';
import OffsetTile from './offset-tile.js';
import dom from '../helpers/dom.js';
import { capitalize } from '../helpers/format.js';
import { gridStylesheet } from '../styles/grid-styles.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  #grid {
    grid-template-columns: 1fr 1fr;
  }
`);

class OffsetPanel extends HTMLElement {
  #title

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [gridStylesheet, stylesheet];

    this.#title = dom.create('span');
    const title = dom.create('div', { id: 'title' }, [
      this.#title
    ]);

    const grid = dom.create('div', { id: 'grid' }, [
      new OffsetTile('zone'),
      new OffsetTile('local')
    ]);

    dom.add(shadow, [
      title,
      grid
    ]);

    state.on('settings.mode', () => this.#display());

    this.#display();
  }

  #display() {
    this.#title.innerHTML = `Local ${capitalize(state.settings.mode)} Time<br/>relative to`;
  }
}

customElements.define('lt-offset-panel', OffsetPanel);

export default OffsetPanel;
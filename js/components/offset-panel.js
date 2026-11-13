import state from '../state.js';
import OffsetTile from './offset-tile.js';
import dom from '../helpers/dom.js';
import { capitalize } from '../helpers/format.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host {
    display: block;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: fit-content;
  }
  
  #title {
    display: block;
    font-size: 16pt;
    font-weight: bold;
    margin-top: 12px;
    padding: 6px;
    text-align: center;
    border-bottom: solid 1px var(--content-color);
  }

  #grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: fit-content;
  }
`);

class OffsetPanel extends HTMLElement {
  #title

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

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
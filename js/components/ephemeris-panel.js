import EphemerisTile from './ephemeris-tile.js';
import dom from '../helpers/dom.js';

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
    grid-template-columns: 1fr 1fr 1fr;
    box-sizing: border-box;
    position: relative;
    width: 100%;
    height: fit-content;
  }
`);

class EphemerisPanel extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    const title = dom.create('div', 'Sun Events', { id: 'title' });
    const grid = dom.create('div', { id: 'grid' }, [
      new EphemerisTile('Sunrise', 'startRise'),
      new EphemerisTile('Solar Noon', 'noon'),
      new EphemerisTile('Sunset', 'endSet'),
      new EphemerisTile('Dawn', 'startDawn'),
      new EphemerisTile('Solar Midnight', 'startMidnight'),
      new EphemerisTile('End of Dusk', 'endDusk')
    ]);

    dom.add(shadow, [
      title,
      grid
    ]);
  }
}

customElements.define('lt-ephemeris-panel', EphemerisPanel);

export default EphemerisPanel;
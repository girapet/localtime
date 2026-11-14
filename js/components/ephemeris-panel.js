import EphemerisTile from './ephemeris-tile.js';
import dom from '../helpers/dom.js';
import { gridStylesheet } from '../styles/grid-styles.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  #title {
    border-top: solid 1px var(--content-color);
  }

  #grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
`);

class EphemerisPanel extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [gridStylesheet, stylesheet];

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
import TitleBar from './title-bar.js';
import TimePanel from './time-panel.js';
import EphemerisTile from './ephemeris-tile.js';
import loop from '../loop.js';
import dom from '../helpers/dom.js';

const noLocation = () => {
  return dom.create('span', `This app needs your location.<br/><br/>
    Please enable location services on<br/>
    your device and allow access to<br/>
    your location if asked.`);
};

class App extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });

    loop.initialize().then(() => {
      dom.add(shadow, [
        new TitleBar(),
        new TimePanel(),
        new EphemerisTile('Midnight', 'startMidnight'),
        new EphemerisTile('Dawn', 'startDawn'),
        new EphemerisTile('Sunrise', 'startRise'),
        new EphemerisTile('Noon', 'noon'),
        new EphemerisTile('Sunset', 'endSet'),
        new EphemerisTile('Dusk', 'endDusk')
      ]);

      loop.run();
    }, () => {
      dom.add(shadow, noLocation());
    });
  }
}

customElements.define('lt-app', App);

export default App;

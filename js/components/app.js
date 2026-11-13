import SettingsDialog from './settings-dialog.js';
import TitleBar from './title-bar.js';
import TimePanel from './time-panel.js';
import EphemerisPanel from './ephemeris-panel.js';
import OffsetPanel from './offset-panel.js';
import loop from '../loop.js';
import dom from '../helpers/dom.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host {
    position: relative;
    display: block;
    width: 100vw;
    height: 100vh;
    max-width: var(--app-max-width);
    max-height: var(--app-max-height);
    background-color: var(--background-color);
  }
`);

//    
const noLocation = () => {
  return dom.create('span', `This app needs your location.<br/><br/>
    Please enable location services on<br/>
    your device and allow access to<br/>
    your location if asked.`);
};

class App extends HTMLElement {
  settingsDialog;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    this.settingsDialog = new SettingsDialog();
    dom.add(shadow, this.settingsDialog);

    loop.initialize().then(() => {
      dom.add(shadow, [
        new TitleBar(),
        new TimePanel(),
        new EphemerisPanel(),
        new OffsetPanel()
      ]);

      loop.run();
    }, () => {
      dom.add(shadow, noLocation());
    });
  }
}

customElements.define('lt-app', App);

export default App;

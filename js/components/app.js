import SettingsDialog from './settings-dialog.js';
import HelpDialog from './help-dialog.js';
import TitleBar from './title-bar.js';
import TimePanel from './time-panel.js';
import DialPanel from './dial-panel.js';
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
  const content = dom.create('div', `This app needs your location.<br/><br/>
    Please enable location services on<br/>
    your device and allow access to<br/>
    your location if asked.`);
  dom.style(content, { textAlign: 'center', marginTop: '10px' })
  return content;
};

class App extends HTMLElement {
  settingsDialog;
  helpDialog;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    this.settingsDialog = new SettingsDialog();
    this.helpDialog = new HelpDialog();

    dom.add(shadow, [
      this.settingsDialog,
      this.helpDialog
    ]);

    loop.initialize().then(() => {
      dom.add(shadow, [
        new TitleBar(),
        new TimePanel(),
        new DialPanel(),
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

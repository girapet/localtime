import StartPanel from './start-panel.js';
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

class App extends HTMLElement {
  settingsDialog;
  helpDialog;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    const startPanel = new StartPanel();

    dom.add(shadow, [
      startPanel
    ]);

    loop.initialize().then(() => {
      startPanel.hide();

      this.settingsDialog = new SettingsDialog();
      this.helpDialog = new HelpDialog();

      dom.add(shadow, [
        this.settingsDialog,
        this.helpDialog,
        new TitleBar(),
        new TimePanel(),
        new DialPanel(),
        new EphemerisPanel(),
        new OffsetPanel()
      ]);

      loop.run();
    }, 
    (error) => {
      startPanel.showMessage(error);
    });
  }
}

customElements.define('lt-app', App);

export default App;

import state from '../state.js';
import dialogStyle from '../styles/dialog-styles.js';
import dom from '../helpers/dom.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(dialogStyle);

class SettingsDialog extends HTMLElement {
  #dialog;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [stylesheet];

    this.#dialog = dom.create('dialog');

    const { settings } = state;
    const apparentChoice = dom.create('input', { type: 'radio', name: 'mode', id: 'apparent', checked: settings.mode === 'apparent' });
    const meanChoice = dom.create('input', { type: 'radio', name: 'mode', id: 'mean', checked: settings.mode === 'mean' });

    dom.on(apparentChoice, 'click', () => settings.mode = 'apparent');
    dom.on(meanChoice, 'click', () => settings.mode = 'mean');

    dom.add(this.#dialog, dom.create('form', [
      dom.create('div', 'Mode'),
      dom.create('div', [
        apparentChoice,
        dom.create('label', 'Local Apparent Time', { htmlFor: 'apparent' })
      ]),
      dom.create('div', [
        meanChoice,
        dom.create('label', 'Local Mean Time', { htmlFor: 'mean' })
      ])
    ]));

    const hour12Choice = dom.create('input', { type: 'radio', name: 'clock-type', id: '12hr', checked: settings.clockType === '12hr' });
    const hour24Choice = dom.create('input', { type: 'radio', name: 'clock-type', id: '24hr', checked: settings.clockType === '24hr' });

    dom.on(hour12Choice, 'click', () => settings.clockType = '12hr');
    dom.on(hour24Choice, 'click', () => settings.clockType = '24hr');

    dom.add(this.#dialog, dom.create('form', [
      dom.create('div', 'Clock Type'),
      dom.create('div', [
        hour12Choice,
        dom.create('label', '12-hour', { htmlFor: '12hr' })
      ]),
      dom.create('div', [
        hour24Choice,
        dom.create('label', '24-hour', { htmlFor: '24hr' })
      ])
    ]));

    dom.on(this.#dialog, 'click', (event) => {
      if (event.target === this.#dialog) {
        this.#close();
      }
    });

    const closeButton = dom.create('button', 'Close');
    dom.on(closeButton, 'click', () => this.#close());
    
    dom.add(this.#dialog, [closeButton])
    dom.add(shadow, this.#dialog);
  }

  open() {
    this.#dialog.showModal();
  }

  #close() {
    this.#dialog.close();
  }
}

customElements.define('lt-settings-dialog', SettingsDialog);

export default SettingsDialog;
import state from '../state.js';
import dialogStyle from '../styles/dialog-styles.js';
import dom from '../helpers/dom.js';

const { settings } = state;

const createChoice = (type, value, label) => {
  const choice = dom.create('input', { type: 'radio', name: type, id: value, checked: settings[type] === value });
  dom.on(choice, 'click', () => {
    settings[type] = value;
  });

  const box = dom.create('div', { className: 'choice' }, [
    choice,
    dom.create('label', label, { htmlFor: value })
  ]);
  dom.on(box, 'click', () => choice.dispatchEvent(new MouseEvent('click')));

  return box;
};

const dialogStylesheet = new CSSStyleSheet();
dialogStylesheet.replaceSync(dialogStyle);

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  .setting:nth-child(n+1) {
    margin-top: 8px;
  }

  .header {
    font-weight: bold;
    padding: 4px;
  }
  
  .choice {
    padding: 4px;
    border: solid 1px var(--content-color);
    border-radius: 2px;
  }

  .choice:has(input[type="radio"]:checked) {
    border: solid 1px var(--text-color);
  }

  .choice:nth-child(n+1) {
    margin-top: 4px;
  }

  input[type="radio"] {
    accent-color: var(--text-color); 
    margin-right: 6px;
  }
  
  input[type="radio"]:focus {
    outline: none;
  }
`);

class SettingsDialog extends HTMLElement {
  #dialog;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [dialogStylesheet, stylesheet];

    this.#dialog = dom.create('dialog');

    dom.add(this.#dialog, dom.create('div', { className: 'setting' }, [
      dom.create('div', 'Mode', { className: 'header' }),
      createChoice('mode', 'apparent', 'Local Apparent Time'),
      createChoice('mode', 'mean', 'Local Mean Time')
    ]));

    dom.add(this.#dialog, dom.create('div', { className: 'setting' }, [
      dom.create('div', 'Clock Type', { className: 'header' }),
      createChoice('clockType', '12hr', '12-hour'),
      createChoice('clockType', '24hr', '24-hour')
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
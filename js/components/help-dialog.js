// import state from '../state.js';
import dialogStyle from '../styles/dialog-styles.js';
import dom from '../helpers/dom.js';

// const { settings } = state;

const dialogStylesheet = new CSSStyleSheet();
dialogStylesheet.replaceSync(dialogStyle);

// const stylesheet = new CSSStyleSheet();
// stylesheet.replaceSync(`
// `);

class HelpDialog extends HTMLElement {
  #dialog;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [dialogStylesheet];

    this.#dialog = dom.create('dialog');

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

customElements.define('lt-help-dialog', HelpDialog);

export default HelpDialog;
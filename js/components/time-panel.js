import state from '../state.js';
import dom from '../helpers/dom.js';
import { sexagesimalSeconds, formatHour, getPeriod } from '../helpers/format.js';
import { boxStylesheet } from '../styles/box-styles.js';

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  :host {
    padding: 4px;
    text-align: center;
    font-weight: bold;
    background-color: var(--content-color);
  }

  .large {
    font-size: 42pt;
  }
  
  .small {
    font-size: 30pt;
  }
`);

class TimePanel extends HTMLElement {
  #hoursMinutes;
  #seconds;
  #period;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [boxStylesheet, stylesheet];

    this.#hoursMinutes = dom.create('span', { className: 'large' });
    this.#seconds = dom.create('span', { className: 'small' });
    this.#period = dom.create('span', { className: 'large' });

    dom.add(shadow, [
      this.#hoursMinutes,
      this.#seconds,
      this.#period
    ]);

    state.on('settings.*,time', (event) => this.#display(event));

    this.#display();
  }

  #display(event = {}) {
    const { mode, clockType } = state.settings;
    const { unit: hour, mm, ss } = sexagesimalSeconds(state.time[mode]);

    const h = formatHour(hour, clockType);
    const period = getPeriod(hour, clockType);

    this.#hoursMinutes.innerText = `${h}:${mm}`;
    this.#seconds.innerText = `:${ss}`;
    this.#period.innerHTML = period ? `&nbsp;${period}` : '';
  }
}

customElements.define('lt-time-panel', TimePanel);

export default TimePanel;
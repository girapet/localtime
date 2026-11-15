import state from '../state.js';
import dialogStyle from '../styles/dialog-styles.js';
import dom from '../helpers/dom.js';
import icon from '../styles/icon.js';

const { settings } = state;

const dialogStylesheet = new CSSStyleSheet();
dialogStylesheet.replaceSync(dialogStyle);

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(`
  #title {
    font-size: 14pt;
    font-weight: bold;
  }

  #content-scroll {
    margin-top: 10px;
    width: calc(min(100vw, var(--app-max-width)) * 0.7);
    height: calc(min(100vh, var(--app-max-height)) * 0.7);
    overflow-y: scroll;
  }

  #content {
    width: calc(min(100vw, var(--app-max-width)) * 0.7 - 20px);
  }

  .heading {
    font-weight: bold;
  }
  
  a, a:visited {
    color: blue;
    text-decoration: none;
  }
  
  li {
    margin-bottom: 6px;
  }
`);

const content = `
  <p>This app shows the time at the exact location of your device, regardless
    of time zone or daylight savings time.  This is essentially solar time,
    with solar noon occurring at or very close to clock noon.</p>
  <p>You have a choice of two modes for the local time.</p>
  <p class="heading">Local Apparent Time</p>
  <p>In this mode, clock noon (<span class="noon">12:00 PM</span>) is always 
    aligned exactly with solar noon, that time of day when the sun reaches its
    maximum altitude in the sky.</p>
  <p>Due to the tilt of the Earth's rotational axis
    and its elliptical orbit around the Sun, the length of the solar day, from 
    one solar noon to the next, varies over the course of a year.  The deviation
    is never more than 30 seconds from the 24 hours of a standard mean day (see below).</p>
  <p>For this mode to work, hours, minutes and seconds must compressed or extended 
    to fit the solar day.  This means you cannot synchronize a standard clock with
    this one.</p>
  <p>This mode is best for keep track of available daylight.  It's also useful when
    setting up a sundial.</p>
  <p class="heading">Local Mean Time</p>
  <p>Early mechanical clock makers were aware of the varying length of the
    solar day.  For simplicity, they designed their clocks to measure an unvarying
    length of time, the mean solar day.  This is the average length of all 
    the solar days over the course of the year.  All clocks you have ever encountered have 
    measured mean time.</p>
  <p>In this mode, mean clock noon (<span class="noon">12:00 PM</span>) can deviate from
    solar noon, but never by more than 16 minutes.  The advantage of this mode is that you can 
    synchronize a standard clock to it.  This mode will also maintain a constant time offset from 
    your current time zone.</p>
  <p class="heading">Effects of High-Speed Travel</p>
  <p>Traveling with this app at high speeds, as in an airliner, to the east or west will 
    noticeably affect the perceived passage of time.  Traveling to the east will make time 
    appear to go by faster, while traveling to the west will make it appear to go by slower, 
    or stop, or even go backwards.</p>
  <p>There is nothing surprising about this.  The effect can even be seen with normal
    time-zone-based clocks.  Take for example a five-hour flight from New York to Los 
    Angeles.  The time difference between the two cities is three hours, so by the time 
    you land in LA the clock has only advanced two hours (5 - 3).  Time appears to have slowed 
    down.  Travel in the other direction and the time difference is eight hours (5 + 3), an
    apparent speed up.  In this app such time differences are visible from moment 
    to moment.</p>
  <p class="heading">Accuracy</p>
  <p>The timing of this app was compared to values computed in the 
    <a href="https://ssd.jpl.nasa.gov/horizons/app.html" target="_blank">Horizons System</a>
    at the Jet Propulsion Laboratory and the 
    <a href="https://www.kso.ac.at/beobachtungen/ephemeris_en.php" target="_blank">Solar Ephemeris 
    Calculator</a> at the University of Graz, Germany.  It matched solar noon in both systems to 
    about one second.</p>
  <p class="heading">Further Reading</p>
  <p>See these Wikipedia articles for more information.
    <ul>
      <li><a href="https://en.wikipedia.org/wiki/Solar_time" target="_blank">Solar Time</a>
      <li><a href="https://en.wikipedia.org/wiki/Equation_of_time" target="_blank">Equation of Time</a>
    </ul>
  </p>
`;

class HelpDialog extends HTMLElement {
  #dialog;
  #content;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'closed' });
    shadow.adoptedStyleSheets = [dialogStylesheet, stylesheet];

    const closeButton = dom.create('div', icon.close, { id: 'close', className: 'button' });
    this.#content = dom.create('div', content, { id: 'content' });

    this.#dialog = dom.create('dialog', [
      dom.create('div', [
        dom.create('div', 'About Local Time', { id: 'title' }),
        dom.create('div', { id: 'content-scroll' }, [
          this.#content
        ]),
        closeButton
      ])
    ]);

    dom.on(this.#dialog, 'click', (event) => {
      if (event.target === this.#dialog) {
        this.#close();
      }
    });

    dom.on(closeButton, 'click', () => this.#close());
    
    dom.add(shadow, this.#dialog);

    state.on('settings.clockType', () => this.#updateNoon());
    this.#updateNoon();
  }

  open() {
    this.#dialog.showModal();
  }

  #close() {
    this.#dialog.close();
  }

  #updateNoon() {
    const noon = settings.clockType === '12hr' ? '12:00 PM' : '12:00';
    dom.each(dom.find(this.#content, '.noon'), (e) => e.innerText = noon);
  }
}

customElements.define('lt-help-dialog', HelpDialog);

export default HelpDialog;
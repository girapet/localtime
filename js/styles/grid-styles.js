import { boxStyles } from './box-styles.js';

export const gridStyles = `
  ${boxStyles}

  #title {
    display: block;
    font-size: 16pt;
    font-weight: bold;
    margin-top: 12px;
    padding: 6px;
    text-align: center;
    border-bottom: solid 1px var(--content-color);
  }

  #grid {
    display: grid;
    box-sizing: border-box;
    position: relative;
    width: 100%;
  }  
`;

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(gridStyles);

export const gridStylesheet = stylesheet;

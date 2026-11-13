
export const boxStyles = `
  :host {
    display: block;
    box-sizing: border-box;
    position: relative;
    width: 100%;
  }
`;

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(boxStyles);

export const boxStylesheet = stylesheet;


export const tileStyles = `
  :host div {
    box-sizing: border-box;
    width: 100%;
    text-align: center;
  }
  
  #title {
    font-weight: bold;
    font-size: var(--default-font-size);
    padding: 6px;
  }
`;

const stylesheet = new CSSStyleSheet();
stylesheet.replaceSync(tileStyles);

export const tileStylesheet = stylesheet;

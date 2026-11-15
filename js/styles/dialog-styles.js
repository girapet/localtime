import { buttonStyles } from './button-styles.js';

export default `
  :focus {
    outline: none;
  }

  dialog {
    padding: 0;
    border: none;
    border-radius: 2px;
    color: var(--text-color);
    background-color: var(--background-color);
  }

  dialog::backdrop {
    background-color: var(--backdrop-color);
    backdrop-filter: blur(5px);
  }
  
  dialog > div {
    padding: 1.5em;
  }

  .title {
    font-weight: bold;
    margin-bottom: 8px;
  }

  ${buttonStyles}

  #close {
    top: 10px;
    right: 10px;
  }
`;
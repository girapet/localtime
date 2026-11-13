export default `
  dialog {
    border: none;
    border-radius: 2px;
    color: var(--text-color);
    background-color: var(--background-color);
  }

  dialog::backdrop {
    background-color: var(--backdrop-color);
    backdrop-filter: blur(5px);
  }
  
  .title {
    font-weight: bold;
    margin-bottom: 8px;
  }

  button {
    font-family: var(--default-font-family);
    font-size: var(--default-font-size);
    font-weight: bold;
    color: var(--text-color);
    border: solid 1px var(--text-color);
    border-radius: 2px;
    background-color: var(--content-color);
    margin-top: 12px;
    margin-right: 8px;
    padding: 6px 12px 6px 12px;
  }
`;
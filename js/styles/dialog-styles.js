export default `
  dialog {
    border: none;
    border-radius: 2px;
    background-color: white;
  }
  
  dialog::backdrop {
    background-color: #00000080;
    backdrop-filter: blur(5px);
  }
  
  .title {
    font-weight: bold;
    margin-bottom: 8px;
  }

  button {
    margin-top: 6px;
    margin-right: 8px;
    font-weight: bold;
    color: #606060;
  }
`;
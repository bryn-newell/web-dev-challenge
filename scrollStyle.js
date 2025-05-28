const applyScrollStyle = () => {
  let style = `
  <style>
    html {
          scroll-behavior: smooth;
        }
  </style>`;

  document.head.insertAdjacentHTML('beforeend', style);
};

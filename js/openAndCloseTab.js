// this works - but it doesn't allow for scroll styling
// thus the scroll styling is a browser extension, built separately
export const openAndCloseTab = (str, position) => {
  // to do - style the window to be smaller and move position based on the index
  console.log(position, 'inside open close');
  const windProxy = open(
    str,
    '_blank',
    `popup=true, width=300, height=300, left=${position}, top=${position}`
  );

  setTimeout(() => {
    // windProxy.close();
  }, 3000);
};

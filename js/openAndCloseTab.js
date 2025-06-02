// this works - but it doesn't allow for scroll styling
// thus the scroll styling is a browser extension, built separately
export const openAndCloseTab = (str, left, top) => {
  // to do - style the window to be smaller and move position based on the index
  const windProxy = open(
    str,
    "_blank",
    `popup=true, width=300, height=300, left=${left}, top=${top}`,
  );

  setTimeout(() => {
    windProxy.close();
  }, 3000);
};

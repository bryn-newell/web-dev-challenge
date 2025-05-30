export const testOpen = (str) => {
  const windProxy = open(str, '_blank', 'popup');

  setTimeout(() => {
    windProxy.close();
  }, 3000);
};

// testOpen();

setTimeout(() => {
  document.documentElement.style.scrollBehavior = 'smooth';
  window.scrollTo(0, document.body.scrollHeight, {behavior: 'smooth'});
}, 1000)
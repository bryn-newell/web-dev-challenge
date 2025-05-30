const readArticle = () => {
  console.log('running');
  setTimeout(() => {
    var myIframe = document.getElementById('iframe');
    myIframe.onload = function () {
      console.log('the content window', myIframe.contentWindow);
      myIframe.contentWindow.scrollTo(0, myIframe.contentWindow.innerHeight);
    };
  }, 2000);
};

// readArticle();

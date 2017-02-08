export default (function (doc, win) {
  var docEl = doc.documentElement;
  scale();
  function scale () {
    var clientWidth = docEl.clientWidth;
    clientWidth = clientWidth > 640 ? 640 : clientWidth;
    document.documentElement.style.fontSize = clientWidth / 7.5 + 'px';
  }

  win.onresize = function () {
    scale();
  };
})(document, window);


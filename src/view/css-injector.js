const htmlUtils = require('./html-utils');

module.exports = {

  inject: function injectCSS (sdk) {
    const url = `${sdk.assetsUrl}/rf-style.css`;

    const head = htmlUtils.getElement('head');

    const elem = document.createElement('link');
    elem.setAttribute('rel', 'stylesheet');
    elem.setAttribute('type', 'text/css');
    elem.setAttribute('href', url);

    head.appendChild(elem);
  }

};

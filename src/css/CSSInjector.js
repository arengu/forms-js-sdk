const cssRules = require('./style.css');

class CSSInjector {

  injectDefault () {
    const style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    
    const content = document.createTextNode(cssRules);
    style.appendChild(content);

    const head = document.querySelector('head');
    head.appendChild(style);
  }

  static create () {
    return new CSSInjector();
  }

}

module.exports = CSSInjector;

const BaseView = require('../base/BaseView')

class GenericMessage extends BaseView {

  constructor (cssClasses) {
    super();

    this.cssClasses = cssClasses;

    this.node = null;
    this.html = null;
  }

  setText (txt) {
    this.node.innerHTML = txt;
    this.html.style.display = 'block';
  }

  removeText () {
    this.node.innerHTML = null;
    this.html.style.display = 'none';
  }

  build () {
    const container = document.createElement('div');
    this.cssClasses.forEach((c) => container.classList.add(c));
    container.classList.add('af-message');
    container.style.display = 'none';

    const node = document.createElement('p');
    container.appendChild(node);

    this.node = node;
    this.html = container;
  }

  static create (...args) {
    return new GenericMessage(...args);
  }

}

module.exports = GenericMessage;

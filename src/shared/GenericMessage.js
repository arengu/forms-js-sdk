const BaseView = require('../base/BaseView')

class GenericMessage extends BaseView {

  constructor (cssClasses) {
    super();

    this.cssClasses = cssClasses;

    this.node = null;
    this.html = null;
  }

  _show () {
    this.html.style.display = 'block';
  }

  _hide () {
    this.html.style.display = 'none';
  }

  setText (msg) {
    this.node.innerText = msg || null;

    if (msg) {
      this._show();
    } else {
      this._hide();
    }
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

  static create () {
    return new GenericMessage(...arguments);
  }

}

module.exports = GenericMessage;

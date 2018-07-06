const BaseView = require('../base/BaseView')

class GenericButton extends BaseView {

  constructor (text, type, callback, cssClasses) {
    super();

    this.text = text;
    this.type = type;
    this.callback = callback;
    this.cssClasses = cssClasses;

    this.node = null;
    this.html = null;
  }

  build () {
    const container = document.createElement('div');
    this.cssClasses.forEach((c) => container.classList.add(c));
    container.classList.add('af-button');

    const node = document.createElement('button');
    node.setAttribute('type', this.type);
    container.appendChild(node);

    const text = document.createElement('span')
    text.classList.add('af-button-text');
    text.innerText = this.text;
    node.appendChild(text);

    if (this.type == 'submit') {
      const ladda = document.createElement('span');
      ladda.classList.add('af-button-ladda');
      node.appendChild(ladda);
    }

    this.node = node;
    this.html = container;
  }

  enable () {
    this.node.removeAttribute('disabled');
  }

  disable () {
    this.node.setAttribute('disabled', 'true');
  }

  static create () {
    return new GenericButton(...arguments);
  }

}

module.exports = GenericButton;

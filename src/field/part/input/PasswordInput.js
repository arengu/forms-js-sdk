const MD5 = require('crypto-js/md5');
const BaseInput = require('./BaseInput');

class PasswordInput extends BaseInput {

  constructor (model) {
    super(model);

    this.node = null;
  }

  /*
   * Private methods
   */
  
  _buildInput () {
    const { id, uid, placeholder } = this.model;

    const node = document.createElement('input');
    node.setAttribute('id', uid);
    node.setAttribute('name', id);
    node.setAttribute('type', 'password');

    if (placeholder) {
      node.setAttribute('placeholder', placeholder);
    }

    return node;
  }

  /*
   * View actions
   */
  build () {
    const container = document.createElement('div');
    container.classList.add('af-field-wrapper');

    const node = this._buildInput();
    container.appendChild(node);

    this.node = node;
    this.html = container;
  }

  get value () {
    const { config: { hash } } = this.model;

    switch(hash) {
      case 'MD5':
        return MD5(this.node.value).toString();
      case 'NONE':
      default:
        return this.node.value;
    }
  }

  static create () {
    return new PasswordInput(...arguments);
  }

}

module.exports = PasswordInput;

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
    return this.node.value;
  }

  static create () {
    return new PasswordInput(...arguments);
  }

}

module.exports = PasswordInput;

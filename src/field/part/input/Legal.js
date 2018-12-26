const BaseInput = require('./BaseInput');

class Legal extends BaseInput {

  constructor (model, presenter){
    super();

    this.model = model;
    this.presenter = presenter;
    this.node = null;
    this.html = null;
  }

  _buildCheckbox (id, name) {
    const node = document.createElement('input');
    node.setAttribute('id', id);
    node.setAttribute('type', 'checkbox');
    node.setAttribute('name', name);
    node.setAttribute('value', true);

    return node;
  }

  _buildLabel (id, text, required) {
    const node = document.createElement('label');
    node.setAttribute('for', id);

    if (required) {
      node.setAttribute('required', required);
    }

    node.innerHTML = text;

    return node;
  }

  /*
   * View actions
   */
  build (){
    const container = document.createElement('div');
    container.classList.add('af-legal');

    const { id, uid, required } = this.model;
    const { text } = this.model.config;

    const checkbox = this._buildCheckbox(uid, id, required);
    container.appendChild(checkbox);

    const label = this._buildLabel(uid, text, required);
    container.appendChild(label);

    this.node = checkbox;
    this.html = container;
  }

  validate () {
    if (this.model.required && this.value === 'false') {
       return 'Please check this field if you want to proceed';
    }
  }

  reset () {
    this.node.checked = false;
  }

  get value () {
    return String(this.node.checked);
  }

  static create (){
    return new Legal(...arguments);
  }

}

module.exports = Legal;

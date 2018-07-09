const BaseView = require('../../../base/BaseView');

class BooleanField extends BaseView {

  constructor (model) {
    super();

    this.model = model;
    this.nodes = null;
    this.html = null;
  }

  _buildLabel (text , id) {
    const node = document.createElement('label');
    node.setAttribute('for', id);
    node.innerText = text;

    return node;
  }

  _buildOption (id, name, value, required, text) {
    const container = document.createElement('div');
    container.classList.add('af-boolean-option');
    const radio = document.createElement('input');

    radio.setAttribute('id', id);
    radio.setAttribute('type', 'radio');
    radio.setAttribute('name', name);
    radio.setAttribute('value', value);

    if (required) {
      radio.setAttribute('required', required);
    }

    container.appendChild(radio);
    container.appendChild(this._buildLabel(text, id));

    return container;
  }

  _buildInputs (id, name, required) {
    const nodes = [];

    nodes.push(this._buildOption(`${id}-yes`, name, 'true', required, "Yes"));
    nodes.push(this._buildOption(`${id}-no`, name, 'false', required, "No"));

    return nodes;
  }

  get value () {
    const values = this.nodes
      .filter((node) => node.checked)
      .map((node) => node.value);

      return values[0];
  }

  build () {
    const container = document.createElement('div');
    container.classList.add('af-boolean');

    const {id, uid, required} = this.model;
    const nodes = this._buildInputs(uid, id, required);

    nodes.forEach((n) => container.appendChild(n));

    this.nodes = nodes.map((n) => n.querySelector('input'));

    this.html = container;
  }

  static create () {
    return new BooleanField(...arguments);
  }
}

module.exports = BooleanField;

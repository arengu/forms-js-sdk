const BaseInput = require('./BaseInput');

class BooleanField extends BaseInput {

  constructor (model, presenter) {
    super();

    this.model = model;
    this.presenter = presenter;
    this.nodes = null;
    this.html = null;
  }

  _buildLabel (text , id) {
    const node = document.createElement('label');
    node.setAttribute('for', id);
    node.innerText = text;

    return node;
  }

  _buildOption (id, name, value, required, text, checked) {
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

    if (checked) {
      radio.setAttribute('checked', 'true');
    }

    container.appendChild(radio);
    container.appendChild(this._buildLabel(text, id));

    return container;
  }

  _buildInputs (id, name, required, defValue) {
    const nodes = [];

    nodes.push(
      this._buildOption(`${id}-yes`, name, 'true', required,
        "Yes", defValue === 'true')
    );
    nodes.push(
      this._buildOption(`${id}-no`, name, 'false', required,
        "No", defValue === 'false')
    );

    return nodes;
  }

  get value () {
    const values = this.nodes
      .filter((node) => node.checked)
      .map((node) => node.value);

      return values[0];
  }

  /*
   * View actions
   */
  build () {
    const container = document.createElement('div');
    container.classList.add('af-boolean');

    const {id, uid, required, config} = this.model;
    const nodes = this._buildInputs(uid, id, required, config.defaultValue);

    nodes.forEach((n) => container.appendChild(n));

    this.nodes = nodes.map((n) => n.querySelector('input'));

    this.html = container;
  }

  static create (...args) {
    return new BooleanField(...args);
  }
}

module.exports = BooleanField;

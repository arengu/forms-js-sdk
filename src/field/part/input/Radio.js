const BaseView = require('../../../base/BaseView');

class Radio extends BaseView {

  constructor (fieldId, optionId, optionValue, checked) {
    super();

    this.fieldId = fieldId;
    this.optionId = optionId;
    this.optionValue = optionValue;
    this.checked = checked;

    this.node = null;
    this.html = null;
  }

  /*
   * Internal methods
   */
  _buildLabel (id) {
    const node = document.createElement('label');
    node.setAttribute('for', id);

    return node;
  }

  _buildRadio (fieldId, optionId, value, checked) {
    const node = document.createElement('input');
    node.setAttribute('id', optionId);
    node.setAttribute('type', 'radio');
    node.setAttribute('name', fieldId);
    node.setAttribute('value', value);

    if (checked) {
      node.setAttribute('checked', 'true');
    }

    return node;
  }

  _builText (text) {
    const node = document.createElement('span');
    node.innerText = text

    return node;
  } 

  /*
   * View actions
   */
  get value () {
    const node = this.node;
    return node.checked ? node.value : null;
  }

  build () {
    const container = document.createElement('div');
    container.classList.add('af-radio-option');

    const radio = this._buildRadio(this.fieldId, this.optionId, this.optionValue, this.checked);
    container.appendChild(radio);

    const label = this._buildLabel(this.optionId);
    container.appendChild(label);

    const text = this._builText(this.optionValue);
    label.appendChild(text);

    this.node = radio;
    this.html = container;
  }

  static create () {
    return new Radio(...arguments);
  }

  static fromGroup (group) {
    const {id: fieldId, config} = group;
    const {validValues, defaultValue} = config;

    return validValues.map((val, i) => {
      const checked = defaultValue === val;
      const optionId = `${fieldId}-${i}`;

      return Radio.create(fieldId, optionId, val, checked);
    });
  }

}

module.exports = Radio;

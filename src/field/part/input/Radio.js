const BaseView = require('../../../base/BaseView');

class Radio extends BaseView {

  constructor (fieldId, optionId, optionValue, checked, required) {
    super();

    this.fieldId = fieldId;
    this.optionId = optionId;
    this.optionValue = optionValue;
    this.checked = checked;
    this.required = required;

    this.node = null;
    this.html = null;
  }

  /*
   * Internal methods
   */
  _buildLabel () {
    const node = document.createElement('label');
    node.setAttribute('for', this.optionId);

    const span = document.createElement('span');
    span.innerText = this.optionValue;
    span.classList.add('label');

    node.appendChild(span);

    return node;
  }

  _buildRadio () {
    const node = document.createElement('input');
    node.setAttribute('id', this.optionId);
    node.setAttribute('type', 'radio'); 
    node.setAttribute('name', this.fieldId);
    node.setAttribute('value', this.optionValue);

    if (this.checked) {
      node.setAttribute('checked', 'true');
    }

    if (this.required) {
      node.setAttribute('required', 'true');
    }

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

    const radio = this._buildRadio();
    container.appendChild(radio);

    const label = this._buildLabel();
    container.appendChild(label);

    this.node = radio;
    this.html = container;
  }

  static create () {
    return new Radio(...arguments);
  }

  static fromGroup (group) {
    const {id: fieldId, uid, required, config} = group;
    const {validValues, defaultValue} = config;

    return validValues.map((val, i) => {
      const checked = defaultValue && defaultValue === val;
      const optionId = `${uid}-${i}`;

      return Radio.create(fieldId, optionId, val, checked, required);
    });
  }

}

module.exports = Radio;

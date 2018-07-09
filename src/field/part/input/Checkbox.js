const BaseView = require('../../../base/BaseView');

class Checkbox extends BaseView {

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

  _buildCheckbox (fieldId, optionId, value, checked) {
    const node = document.createElement('input');
    node.setAttribute('id', optionId);
    node.setAttribute('type', 'checkbox');
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
    container.classList.add('af-checkbox-option');

    const check = this._buildCheckbox(this.fieldId, this.optionId, this.optionValue, this.checked);
    container.appendChild(check);

    const label = this._buildLabel(this.optionId);
    container.appendChild(label);

    const text = this._builText(this.optionValue);
    label.appendChild(text);


    this.node = check;
    this.html = container;
  }

  static create () {
    return new Checkbox(...arguments);
  }

  static fromGroup (group) {
    const {id: fieldId, uid, config} = group;
    const {validValues, defaultValue} = config;

    return validValues.map((val, i) => {
      const checked = defaultValue && defaultValue.includes(val);
      const optionId = `${uid}-${i}`;

      return Checkbox.create(fieldId, optionId, val, checked);
    });
  }

}

module.exports = Checkbox;

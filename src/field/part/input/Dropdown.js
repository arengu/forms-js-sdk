const BaseView = require('../../../base/BaseView');

class Dropdown extends BaseView {

  constructor (model) {
    super();

    this.model = model;
    this.multiple = this.model.config.multiple;
    this.dropdown = null;
    this.options = null;
    this.html = null;
  }

  _buildOption (fieldId, optionId, value, selected) {
    const node = document.createElement('option');
    node.setAttribute('id', optionId);
    node.setAttribute('name', fieldId);
    node.setAttribute('value', value);
    node.setAttribute('label', value);
    node.innerText = value;

    if (selected) {
      node.setAttribute('selected', 'true');
    }

    return node;
  }

  /*
   * View actions
   */
  get value () {
    let result = this.options.filter((o) => o.selected).map((o) => o.value);

    return this.multiple ? result : result[0];
  }

  build () {
    const container = document.createElement('div');
    container.classList.add('af-dropdown');

    const dropdown = document.createElement('select');
    container.appendChild(dropdown);

    const { optionValues, defaultValue } = this.model.config;
    const fieldId = this.model.id;

    if (this.multiple) {
      dropdown.setAttribute('multiple', 'multiple');
    }

    if (this.model.required) {
      dropdown.setAttribute('required', true);
    }

    const options = optionValues
      .map((value, i) => {
        const optionId = `${fieldId}-${i}`;
        const selected = defaultValue.includes(value);
        return this._buildOption(fieldId, optionId, value, selected)
      });
    
    options.forEach((n) => dropdown.appendChild(n));
    
    this.dropdown = dropdown;
    this.options = options;
    this.html = container;
  }

  static create () {
    return new Dropdown(...arguments);
  }

}

module.exports = Dropdown;

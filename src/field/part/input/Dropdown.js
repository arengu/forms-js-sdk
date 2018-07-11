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

  _buildOption (optionId, value, selected) {
    const node = document.createElement('option');
    node.setAttribute('id', optionId);
    node.setAttribute('value', value);
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

    const { validValues, defaultValue } = this.model.config;
    const { id, uid } = this.model;

    dropdown.setAttribute('name', id);

    if (this.multiple) {
      dropdown.setAttribute('multiple', 'multiple');
    }

    if (this.model.required) {
      dropdown.setAttribute('required', true);
    }

    const options = validValues
      .map((value, i) => {
        const optionId = `${uid}-${i}`;
        const selected = defaultValue && defaultValue.includes(value);
        return this._buildOption(optionId, value, selected);
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

const BaseInput = require('./BaseInput');

class Choice extends BaseInput {

  constructor (model) {
    super();

    this.model = model;

    this.nodes = [];
    this.html = null;
  }

  /*
   * Internal methods
   */

  _buildChoiceOptionLabel (id, text) {
    const node = document.createElement('label');
    node.setAttribute('for', id);

    const span = document.createElement('span');
    span.innerText = text;

    node.appendChild(span);

    return node;
  }

  _buildChoiceOption(fieldId, optionId, value, checked, multiple) {
    const node = document.createElement('input');
    node.setAttribute('id', optionId);
    node.setAttribute('type', multiple ? 'checkbox' : 'radio');
    node.setAttribute('name', fieldId);
    node.setAttribute('value', value);

    if (checked) {
      node.setAttribute('checked', 'true');
    }

    return node;
  }

  _buildChoiceOptions() {
    const { id: fieldId, uid, config: { validValues, defaultValue, multiple } } = this.model;

    return validValues.map((optionValue, i) => {
      const checked = defaultValue && defaultValue.includes(optionValue);
      const optionId = `${uid}-${i}`;

      const node = document.createElement('div');
      node.classList.add('af-choice-option');

      const input = this._buildChoiceOption(fieldId, optionId, optionValue, checked, multiple);
      node.appendChild(input);

      const label = this._buildChoiceOptionLabel(optionId, optionValue);
      node.appendChild(label);

      this.nodes.push(input);

      return node;
    });
  }

  /**
   * Custom validation for this field
   * @returns {*}
   */
  validate () {
    let error;

    if (this.model.required && !this.value.length && this.model.config.multiple) {
       error = this.model.config.multiple
       ? 'You have to choose at least one option'
       : 'You have to choose one option';
    }

    return error;
  }

  /*
   * View actions
   */
  get value () {
    const { config: { multiple } } = this.model;

    const value = this.nodes
      .filter((o) => o.checked)
      .map((o) => o.value);

    return multiple ? value : value.toString();
  }

  build () {
    const { config: { multiple } } = this.model;

    const container = document.createElement('div');
    container.className = multiple ? 'af-choice-multiple' : 'af-choice';

    const options = this._buildChoiceOptions();
    options.map((o) => container.appendChild(o));

    this.html = container;
  }

  static create () {
    return new Choice(...arguments);
  }

}

module.exports = Choice;

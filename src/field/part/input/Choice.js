const BaseInput = require('./BaseInput');

const { FieldError } = require('../../../error/InvalidFields');

const { CODE } = FieldError;

class Choice extends BaseInput {

  constructor (model, presenter) {
    super();

    this.model = model;
    this.presenter = presenter;

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

  _addListeners (node) {
    const presenter = this.presenter;
    const self = this;

    node.onchange = function () {
      presenter.onValueChange();
      presenter.onChange(self);
    };
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

  validate () {
    if (this.model.required && this.isEmpty) {
      return this.model.config.multiple ?
        FieldError.create(
          CODE.ERR_ZERO_OPTIONS_CHOSEN,
          'You have to select at least one option'
        ) :
        FieldError.create(
          CODE.ERR_NO_OPTION_CHOSEN,
          'You have to select an option'
        );
    }
  }

  get isEmpty() {
    return this.model.config.multiple ? !this.value.length : !this.value;
  }

  build () {
    const { config: { multiple } } = this.model;

    const container = document.createElement('div');
    container.className = multiple ? 'af-choice-multiple' : 'af-choice';

    const options = this._buildChoiceOptions();
    options.map((o) => {
      this._addListeners(o);
      container.appendChild(o);
    });

    this.html = container;
  }

  reset() {
    const { config: { defaultValue } } = this.model;

    this.nodes
      .forEach((o) => {
        const checked = defaultValue && defaultValue.includes(o.value);
        o.checked = !!checked;
      });
  }

  static create () {
    return new Choice(...arguments);
  }

}

module.exports = Choice;

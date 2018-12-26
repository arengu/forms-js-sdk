const CharCounter = require('./CharCounter');

const inputRules = require('./input-rules');

const BaseInput = require('./BaseInput');

class TextInput extends BaseInput {

  constructor (model, presenter) {
    super(model);

    this.model = model;
    this.presenter = presenter;

    this.node = null;
    this.html = null;
  }

  /*
   * Private methods
   */

  _buildCharCounter (input) {
    const { config: { maxLength, defaultValue } } = this.model;
    const node = CharCounter.create(maxLength, defaultValue);

    input.onkeyup = function () {
      node.setValue(input);
    }

    return node.render();
  }
  
  _buildInput () {
    const { id, uid, placeholder, config: { defaultValue, multiline } } = this.model;

    const node = document.createElement(multiline ? 'textarea' : 'input');
    node.setAttribute('id', uid);
    node.setAttribute('name', id);
    
    if (!multiline) {
      const fieldType = this.model.type;
      const inputType = fieldType.toLowerCase();
      node.setAttribute('type', inputType);
    }

    if (placeholder) {
      node.setAttribute('placeholder', placeholder);
    }

    if (multiline && defaultValue) {
      node.innerText = defaultValue;
    }

    inputRules.parseDef(this.model)
      .filter((a) => !multiline || a.name != 'value')
      .forEach((a) => {
        node.setAttribute(a.name, a.value);
      });

    return node;
  }

  _addListeners (node) {
    const presenter = this.presenter;
    const self = this;

    node.onblur = function () {
      presenter.onBlur(self);
    };

    node.onfocus = function () {
      presenter.onFocus(self);
    };

    node.onchange = function () {
      presenter.onChange(self);
    };
  }

  /*
   * View actions
   */
  build () {
    const { config: { maxLength } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-field-wrapper');

    const node = this._buildInput();
    container.appendChild(node);

    if (maxLength) {
      const counter = this._buildCharCounter(node);
      container.appendChild(counter);
    }

    this._addListeners(node);

    this.node = node;
    this.html = container;
  }

  reset () {
    const { config: { defaultValue } } = this.model;

    this.node.value = defaultValue || null;
  }

  get value () {
    return this.node.value;
  }

  static create () {
    return new TextInput(...arguments);
  }

}

module.exports = TextInput;

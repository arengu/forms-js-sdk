const CharCounter = require('./CharCounter');

const inputRules = require('./input-rules');

const BaseInput = require('./BaseInput');

class Textarea extends BaseInput {

  constructor (model) {
    super(model);

    this.node = null;
    this.html = null;
  }

  /*
   * Private methods
   */
  _buildCharCounter (textarea) {
    const { config: { maxLength, defaultValue } } = this.model;
    const node = CharCounter.create(maxLength, defaultValue);

    textarea.onkeyup = function () {
      node.setValue(textarea);
    }

    return node.render();
  }
  
  _buildTextarea () {
    const { id, uid, placeholder, config: { defaultValue } } = this.model;

    const textarea = document.createElement('textarea');
    textarea.setAttribute('id', uid);
    textarea.setAttribute('name', id);

    if (placeholder) {
      textarea.setAttribute('placeholder', placeholder);
    }

    if (defaultValue) {
      textarea.innerText = defaultValue;
    }

    inputRules.parseDef(this.model)
      .filter((attr) => attr.name != 'value')
      .forEach((attr) => {
        textarea.setAttribute(attr.name, attr.value);
      });

    return textarea;
  }

  /*
   * View actions
   */
  build () {
    const { config: { maxLength } } = this.model;

    const container = document.createElement('div');
    container.classList.add('af-textarea');

    const textarea = this._buildTextarea();
    container.appendChild(textarea);

    if (maxLength) {
      const counter = this._buildCharCounter(textarea);
      container.appendChild(counter);
    }

    this.node = textarea;
    this.html = container;
  }

  get value () {
    return this.node.value;
  }

  static create () {
    return new Textarea(...arguments);
  }

}

module.exports = Textarea;

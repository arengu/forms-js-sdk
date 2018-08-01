const InputView = require('./part/InputView');
const BaseView = require('../base/BaseView');

const ErrorMessage = require('./part/ErrorMessage');

class FieldView extends BaseView {

  constructor (model, presenter) {
    super();

    this.fieldM = model;
    this.fieldP = presenter

    this.errorV = null;
    this.inputV = null;

    this.html = null;
  }

  /*
   * Internal methods
   */
  _buildLabel () {
    const { uid, label, required } = this.fieldM;

    const container = document.createElement('div');
    container.classList.add('af-field-label');

    const node = document.createElement('label');
    node.setAttribute('for', uid);
    node.innerText = label;
    container.appendChild(node);

    if (required) {
      node.classList.add('af-required');
    }

    return container;
  }

  _buildHint () {
    const { hint } = this.fieldM;

    const container = document.createElement('div');
    container.classList.add('af-field-hint');

    const node = document.createElement('p');
    node.innerText = hint;
    container.appendChild(node);

    if (!hint || hint.length < 1) {
      container.style.visibility = 'none';
    }

    return container;
  }

  _addListeners (field) {
    const presenter = this.fieldP;
    const self = this;

    field.onblur = function (evt) {
      presenter.onBlur(self);
    };

    field.onfocus = function (evt) {
      presenter.onFocus(self);
    };

    field.onchange = function (evt) {
      presenter.onChange(self);
    };
  }

  _buildInput () {
    const container = document.createElement('div');
    container.classList.add('af-field-input');

    this.inputV = InputView.create(this.fieldM);

    const node = this.inputV.render();
    this._addListeners(node);

    container.appendChild(node);
    return container;
  }

  _buildMessage () {
    this.errorV = ErrorMessage.create();
    const node = this.errorV.render();

    return node;
  }

  /*
   * Public methods
   */
  validate () {
    return this.inputV.validate();
  }

  get id () {
    return this.fieldM.id;
  }

  get value () {
    return this.inputV.value;
  }

  build () {
    const { id, hint, label } = this.fieldM;

    const container = document.createElement('div');
    container.classList.add(`af-field-${id}`);
    container.classList.add('af-field');

    if (label && label.length > 0) {
      container.appendChild(this._buildLabel());
    }

    if (hint && hint.length > 0) {
      container.appendChild(this._buildHint());
    }

    container.appendChild(this._buildInput());

    container.appendChild(this._buildMessage());

    this.html = container;
  }

  setError (msg) {
    this.errorV.setText(msg);
  }

  static create () {
    return new FieldView(...arguments);
  }

}

module.exports = FieldView;

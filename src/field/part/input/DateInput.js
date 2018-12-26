const inputRules = require('./input-rules');

const BaseInput = require('./BaseInput');

class DateInput extends BaseInput {

  constructor (model, presenter) {
    super(model);

    this.model = model;
    this.presenter = presenter;

    this.html = null;
  }

  /*
   * Private methods
   */

  _buildDate () {
    const { id, uid, config: { defaultValue, format } } = this.model;

    const inputFormat = format.toLowerCase();

    const node = document.createElement('input');
    node.setAttribute('id', uid);
    node.setAttribute('name', id);
    node.setAttribute('type', inputFormat);
    node.setAttribute('max', '9999-12-31');

    if (defaultValue) {
      node.innerText = defaultValue;
    }

    inputRules.parseDef(this.model)
    .forEach((o) => {
      node.setAttribute(o.name, o.value);
    })

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

    node.onkeydown = function () {
      presenter.onValueChange();
    }
  }

  /*
   * View actions
   */
  build () {
    const node = this._buildDate();

    this._addListeners(node);

    this.html = node;
  }

  reset () {
    const { config: { defaultValue } } = this.model;

    this.html.value = defaultValue || null;
  }

  reset () {
    const { config: { defaultValue } } = this.model;

    this.html.value = defaultValue || null;
  }

  get value () {
    return this.html.value;
  }

  static create () {
    return new DateInput(...arguments);
  }

}

module.exports = DateInput;

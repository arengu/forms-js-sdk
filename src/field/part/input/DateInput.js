const inputRules = require('./input-rules');

const BaseInput = require('./BaseInput');

class DateInput extends BaseInput {

  constructor (model) {
    super(model);

    this.model = model;

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

  /*
   * View actions
   */
  build () {
    this.html = this._buildDate();
  }

  get value () {
    return this.html.value;
  }

  static create () {
    return new DateInput(...arguments);
  }

}

module.exports = DateInput;

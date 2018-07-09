const inputRules = require('./input-rules');

const BaseInput = require('./BaseInput');

class Textarea extends BaseInput {

  /*
   * Private methods
   */
  _buildInput (model) {
    const { id, uid, placeholder } = model;

    const node = document.createElement('textarea');

    node.setAttribute('id', uid);
    node.setAttribute('name', id);

    if (placeholder) {
      node.setAttribute('placeholder', placeholder);
    }

    inputRules.parseDef(model)
      .forEach((a) => node.setAttribute(a.name, a.value));

    return node;
  }

  /*
   * View actions
   */
  build () {
    this.html = this._buildInput(this.model);
  }

  get value () {
    return this.html.value;
  }

  static create () {
    return new Textarea(...arguments);
  }

}

module.exports = Textarea;

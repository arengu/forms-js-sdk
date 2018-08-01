const BaseInput = require('./BaseInput');
const Checkbox = require('./Checkbox');

class Checkgroup extends BaseInput {

  constructor (model) {
    super();

    this.model = model;

    this.nodes = null;
    this.html = null;
  }

  /**
   * Custom validation for this field
   * @returns {*}
   */
  validate () {
    let error;

    if (this.model.required && !this.value.length) {
       error = 'You have to check at least one option';
    }

    return error;
  }

  /*
   * View actions
   */
  get value () {
    return this.nodes
      .map((o) => o.value)
      .filter((val) => val);
  }

  build () {
    const container = document.createElement('div');
    container.className = 'af-check';

    const options = Checkbox.fromGroup(this.model);
    options
      .map((o) => o.render())
      .forEach((n) => container.appendChild(n));

    this.nodes = options;
    this.html = container;
  }

  static create () {
    return new Checkgroup(...arguments);
  }

}

module.exports = Checkgroup;

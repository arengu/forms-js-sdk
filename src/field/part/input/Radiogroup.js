const BaseInput = require('./BaseInput');
const Radio = require('./Radio');

class Radiogroup extends BaseInput {

  constructor (model) {
    super();

    this.model = model;

    this.nodes = null;
    this.html = null;
  }

  /*
   * View actions
   */
  get value () {
    return this.nodes
      .map((o) => o.value)
      .filter((v) => v)
      .toString();
  }

  build () {
    const container = document.createElement('div');
    container.className = 'af-radio';

    const options = Radio.fromGroup(this.model);
    options
      .map((o) => o.render())
      .forEach((n) => container.appendChild(n));

    this.nodes = options;
    this.html = container;
  }

  static create () {
    return new Radiogroup(...arguments);
  }

}

module.exports = Radiogroup;

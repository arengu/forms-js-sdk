const Radio = require('./Radio');
const BaseView = require('../../../base/BaseView');

class Radiogroup extends BaseView {

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
      .filter((o) => o.checked)
      .map((o) => o.value)
      .toString();
  }

  build () {
    const container = document.createElement('div');
    container.className = 'af-radiogroup';

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

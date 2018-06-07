const Checkbox = require('./Checkbox');
const BaseView = require('../../../base/BaseView');

class Checkgroup extends BaseView {

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
      .filter((val) => val);
  }

  build () {
    const container = document.createElement('div');
    container.className = 'af-checkgroup';

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

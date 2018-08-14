const BaseInput = require('./BaseInput');
const CustomDropdown = require('../../../shared/CustomDropdown');

class Dropdown extends BaseInput {

  constructor(model) {
    super();

    this.model = model;
    this.multiple = model.config.multiple;
    this.dropdown = CustomDropdown.create(this.model);;
    this.nodes = null;
    this.html = null;
  }

  /*
   * View actions
   */
  build() {
    this.html = this.dropdown.render();
    this.nodes = this.dropdown.options;
  }

  get value() {
    return this.dropdown.value;
  }

  static create() {
    return new Dropdown(...arguments);
  }

}

module.exports = Dropdown;

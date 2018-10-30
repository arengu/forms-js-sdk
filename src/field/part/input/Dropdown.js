const BaseInput = require('./BaseInput');
const CustomDropdown = require('../../../shared/CustomDropdown');

class Dropdown extends BaseInput {

  constructor(model, presenter) {
    super();

    this.model = model;
    this.presenter = presenter;
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

  validate () {
    if (this.model.required && !this.value.length) {
       return this.model.config.multiple
       ? 'You have to select at least one option'
       : 'You have to select one option';
    }
  }

  get value() {
    return this.dropdown.value;
  }

  static create() {
    return new Dropdown(...arguments);
  }

}

module.exports = Dropdown;

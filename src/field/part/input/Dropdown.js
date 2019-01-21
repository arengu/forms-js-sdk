const BaseInput = require('./BaseInput');

const CustomDropdown = require('../../../shared/CustomDropdown');
const { FieldError } = require('../../../error/InvalidFields');

const { CODE } = FieldError;

class Dropdown extends BaseInput {

  constructor(model, presenter) {
    super();

    this.model = model;
    this.presenter = presenter;
    this.multiple = model.config.multiple;
    this.dropdown = CustomDropdown.create(this.model, this.presenter);
    this.nodes = null;
    this.html = null;
  }

  /*
   * View actions
   */
  build () {
    this.html = this.dropdown.render();
    this.nodes = this.dropdown.options;
  }

  reset () {
    this.dropdown.reset();
  }

  validate () {
    if (this.model.required && this.isEmpty()) {
      return this.model.config.multiple ?
        FieldError.create(
          CODE.ERR_ZERO_OPTIONS_CHOSEN,
          'You have to select at least one option'
        ) :
        FieldError.create(
          CODE.ERR_NO_OPTION_CHOSEN,
          'You have to select an option'
        );
    }
  }

  isEmpty() {
    return this.model.config.multiple ? !this.value.length : !this.value;
  }

  get value() {
    return this.dropdown.value;
  }

  static create(...args) {
    return new Dropdown(...args);
  }

}

module.exports = Dropdown;

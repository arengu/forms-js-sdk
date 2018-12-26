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
    if (this.model.required && this.isEmpty) {
      const errMessage = this.model.config.multiple
        ? 'You have to select at least one option'
        : 'You have to select one option';

      return FieldError.create(CODE.ERR_UNSPECIFIED, errMessage);
    }
  }

  get isEmpty() {
    return this.model.config.multiple ? !this.value.length : !this.value;
  }

  get value() {
    return this.dropdown.value;
  }

  static create() {
    return new Dropdown(...arguments);
  }

}

module.exports = Dropdown;

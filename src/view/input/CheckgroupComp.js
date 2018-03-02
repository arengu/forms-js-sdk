const CheckboxComp = require('./CheckboxComp');

const compFactory = require('../comp-factory');
const htmlFactory = require('../html-factory');

function createCheckboxes (fieldModel) {
  const {id: fieldId, name, config} = fieldModel;
  const {validValues, defaultValue} = config;

  return validValues.map((val, i) => {
    const checked = defaultValue.includes(val);
    const optionId = `${fieldId}-${i}`;

    return CheckboxComp.create(fieldId, optionId, val, checked);
  });
}

class CheckgroupComp {

  constructor (fieldModel) {
    this.model = fieldModel;

    this.options = createCheckboxes(fieldModel);

    this.html = null;
  }

  get value () {
    return this.options
      .map((o) => o.value)
      .filter((val) => val);
  }

  render () {
    const elems = this.options.map((o) => o.render());
    
    this.html = htmlFactory.checkgroup(elems);

    return this.html;
  }

  static create () {
    return new CheckgroupComp(...arguments);
  }

}

module.exports = CheckgroupComp;

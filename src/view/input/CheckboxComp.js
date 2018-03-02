const compFactory = require('../comp-factory');
const htmlFactory = require('../html-factory');

class CheckboxComp {

  constructor (fieldId, optionId, optionValue, checked) {
    this.fieldId = fieldId;
    this.optionId = optionId;
    this.optionValue = optionValue;
    this.checked = checked;

    this.html = null;
  }

  get value () {
    const node = this.html;
    return node.checked ? node.value : null;
  }

  render () {
    const labelHtml = htmlFactory.label(this.optionValue, this.optionId);

    this.html = htmlFactory.checkbox(this.fieldId, this.optionId, this.optionValue, this.checked);

    return htmlFactory.checkboxContainer(this.html, labelHtml);
  }

  static create () {
    return new CheckboxComp(...arguments);
  }

}

module.exports = CheckboxComp;

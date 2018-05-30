const BaseErrorComp = require('./BaseErrorComp');
const htmlFactory = require('../../html-factory');

const ERROR_FIELD_CONTAINER = 'rf-field-error-container';

class FieldErrorComp extends BaseErrorComp {

  render () {
    const output = super.render();

    this.html.classList.add('rf-field-error-text');

    const container = htmlFactory.errorFieldContainer([output]);

    return container;
  }

  static create () {
    return new FieldErrorComp(...arguments);
  }

}

module.exports = FieldErrorComp;

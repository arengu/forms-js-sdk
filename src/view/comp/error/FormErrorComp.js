const BaseErrorComp = require('./BaseErrorComp');
const htmlFactory = require('../../html-factory');

class FormErrorComp extends BaseErrorComp {

  render () {
    const output = super.render();

    this.html.classList.add('rf-form-error-text');

    const container = htmlFactory.errorFormContainer([output]);

    return container;
  }

  static create () {
    return new FormErrorComp(...arguments);
  }

}

module.exports = FormErrorComp;

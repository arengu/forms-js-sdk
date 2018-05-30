const BaseErrorComp = require('./BaseErrorComp');

class FormErrorComp extends BaseErrorComp {

  render () {
    const output = super.render();

    this.html.classList.add('rf-form-error');

    return output;
  }

  static create () {
    return new FormErrorComp(...arguments);
  }

}

module.exports = FormErrorComp;

const BaseErrorComp = require('./BaseErrorComp');

class FieldErrorComp extends BaseErrorComp {

  render () {
    const output = super.render();

    this.html.classList.add('rf-field-error');

    return output;
  }

  static create () {
    return new FieldErrorComp(...arguments);
  }

}

module.exports = FieldErrorComp;

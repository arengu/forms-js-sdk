const htmlFactory = require('../html-factory');

class SubmitComp {

  constructor () {
    this.html = null;
  }

  render () {
    const nameHtml = htmlFactory.fieldName();

    this.html = htmlFactory.submit();
    const fieldHtml = htmlFactory.fieldContainer([this.html]);

    const container = htmlFactory.rowContainer([nameHtml, fieldHtml]);

    return container;
  }

  enabled (isEnabled) {
    if (isEnabled) {
      this.html.removeAttribute('disabled');
    } else {
      this.html.setAttribute('disabled', 'true');
    }
  }

  static create () {
    return new SubmitComp(...arguments);
  }

}

module.exports = SubmitComp;

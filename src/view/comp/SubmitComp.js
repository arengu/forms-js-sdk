const htmlFactory = require('../html-factory');

class SubmitComp {

  constructor () {
    this.html = null;
  }

  render () {
    this.html = htmlFactory.submit();

    const container = htmlFactory.rowContainer([this.html]);

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

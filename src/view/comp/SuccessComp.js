const htmlFactory = require('../html-factory');

class SuccessComp {

  constructor () {
    this.html = null;
  }

  setMessage (msg) {
    this.html.style.display = msg ? 'inline' : 'none';
    this.html.innerText = msg || null;
  }

  render () {
    this.html = htmlFactory.success();
    this.html.style.display = 'none';
    this.html.classList.add('rf-form-success');

    return htmlFactory.rowContainer([this.html]);
  }

  static create () {
    return new SuccessComp(...arguments);
  }

}

module.exports = SuccessComp;

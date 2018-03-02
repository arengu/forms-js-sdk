const htmlFactory = require('../../html-factory');

class BaseErrorComp {

  constructor () {
    this.html = null;
  }

  setMessage (msg) {
    this.html.style.display = msg ? 'inline' : 'none';
    this.html.innerText = msg || null;
  }

  render () {
    this.html = htmlFactory.error();
    this.html.style.display = 'none';

    return htmlFactory.rowContainer([this.html]);
  }

}

module.exports = BaseErrorComp;

const isString = require('lodash/isString');
const isEmpty = require('lodash/isEmpty');

const BaseInputComp = require('./BaseInputComp');

const compFactory = require('../comp-factory');
const htmlFactory = require('../html-factory');

class TextInputComp extends BaseInputComp {

  render () {
    this.html = htmlFactory.textInput(this.model);

    return this.html;
  }

  get value () {
    return this.html.value;
  }

  static create () {
    return new TextInputComp(...arguments);
  }

}

module.exports = TextInputComp;

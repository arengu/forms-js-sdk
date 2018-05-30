const FieldErrorComp = require('./error/FieldErrorComp');

const htmlFactory = require('../html-factory');
const inputFactory = require('../input-factory');

class FieldComp {

  constructor (model) {
    this.model = model;

    this.errorComp = FieldErrorComp.create();
    this.inputComp = inputFactory.create(this.model);

    this.html = null;
  }

  get id () {
    return this.model.id;
  }

  get value () {
    return this.inputComp.value;
  }

  setError (msg) {
    this.errorComp.setMessage(msg);
  }

  render () {
    const { id, name, type, required } = this.model;

    const errorHtml = this.errorComp.render();
    const inputHtml = this.inputComp.render();
    
    const nameHtml = htmlFactory.fieldName(name, id, required);
    const fieldHtml = htmlFactory.fieldContainer([nameHtml, inputHtml, errorHtml]);

    const container = htmlFactory.rowContainer([fieldHtml]);

    return container;
  }

  static create () {
    return new FieldComp(...arguments);
  }

}

module.exports = FieldComp;

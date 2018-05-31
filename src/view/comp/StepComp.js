const FormErrorComp = require('./error/FormErrorComp');
const FieldComp = require('./FieldComp');
const SubmitComp = require('./SubmitComp');
const SuccessComp = require('./SuccessComp');

const htmlFactory = require('../html-factory');
const htmlUtils = require('../html-utils');

class StepComp {

  constructor (form, model) {
    this.form = form;
    this.model = model;

    const { buttons } = this.model;

    this.successComp = SuccessComp.create();
    this.errorComp = FormErrorComp.create();
    this.compComps = model.components.map(FieldComp.create);
    this.submitComp = SubmitComp.create(buttons.next);

    this.html = null;
  }

  getData () {
    const data = {};

    this.compComps.forEach((f) => {
      data[f.id] = f.value;
    });

    return data;
  }

  render () {
    const compsHtml = this.compComps.map((f) => f.render());
    const errorHtml = this.errorComp.render();
    const successHtml = this.successComp.render();
    const submitHtml = this.submitComp.render();

    const elems = [...compsHtml, errorHtml, successHtml, submitHtml];

    this.html = htmlFactory.form(elems, () => {
      this.form.next();
    });

    this.hide();

    return this.html;
  }

  show () {
    this.html.style.display = 'initial';
  }

  hide () {
    this.html.style.display = 'none';
  }

  enable () {
    this.html.removeAttribute('disabled');
  }

  disable () {
      this.html.setAttribute('disabled', 'true');
  }

  setInvalidFields (errors = {}) {
    this.compComps.forEach((f) => {
      const errMessage = errors[f.id] || null;
      f.setError(errMessage)
    });
  }

  setSuccessMessage (msg) {
    return this.successComp.setMessage(msg);
  }

  setErrorMessage (msg) {
    return this.errorComp.setMessage(msg);
  }

  clearState () {
    this.setSuccessMessage();
    this.setErrorMessage();
    this.setInvalidFields();
  }

  static create () {
    return new StepComp(...arguments);
  }

}

module.exports = StepComp;

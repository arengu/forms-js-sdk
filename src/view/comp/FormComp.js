const FormErrorComp = require('./error/FormErrorComp');
const FieldComp = require('./FieldComp');
const SubmitComp = require('./SubmitComp');
const SuccessComp = require('./SuccessComp');

const htmlFactory = require('../html-factory');
const htmlUtils = require('../html-utils');

const SDKError = require('../../models/SDKError');

class FormComp {

  constructor (model, callback) {
    this.model = model;
    
    this.callback = callback;
    
    this.successComp = SuccessComp.create();
    this.errorComp = FormErrorComp.create();
    this.fieldComps = model.fields.map(FieldComp.create);
    this.submitComp = SubmitComp.create();

    this.html = null;
  }

  getData () {
    const data = {};

    this.fieldComps.forEach((f) => {
      data[f.id] = f.value;
    });

    return data;
  }

  render () {
    const successHtml = this.successComp.render();
    const errorHtml = this.errorComp.render();
    const fieldsHtml = this.fieldComps.map((f) => f.render());
    const submitHtml = this.submitComp.render();

    const elems = [successHtml, errorHtml, ...fieldsHtml, submitHtml];

    this.html = htmlFactory.form(elems, () => {
      this.callback(this.getData());
    });

    return this.html;
  }

  embed (parentSelector) {
    const parent = htmlUtils.getElement(parentSelector);
  
    if (!parent) {
      throw new SDKError(`Selector [${selector}] not found`);
    }

    const form = this.render();

    parent.appendChild(form);
  }

  setSuccess (msg) {
    this.successComp.setMessage(msg);
  }

  setFormError (msg) {
    this.errorComp.setMessage(msg);
  }

  setInvalidFields (errors = {}) {
    this.fieldComps.forEach((f) => {
      const errMessage = errors[f.id] || null;
      f.setError(errMessage)
    });
  }

  clearState () {
    this.setSuccess();
    this.setFormError();
    this.setInvalidFields();
  }

  enable () {
    this.submitComp.enabled(true);
  }

  disable () {
    this.submitComp.enabled(false);
  }

  static create () {
    return new FormComp(...arguments);
  }

}

module.exports = FormComp;

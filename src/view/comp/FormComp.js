const findIndex = require('lodash/findIndex');

const FormErrorComp = require('./error/FormErrorComp');
const StepComp = require('./StepComp');
const SubmitComp = require('./SubmitComp');
const SuccessComp = require('./SuccessComp');

const htmlFactory = require('../html-factory');
const htmlUtils = require('../html-utils');

const SDKError = require('../../models/SDKError');

class FormComp {

  constructor (model, callback) {
    this.model = model;
    this.steps = model.steps;

    this.currStep = 0;

    this.callback = callback;

    this.stepComps = model.steps.map((s) => StepComp.create(this, s));

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
    const { id } = this.model;

    this.html = htmlFactory.container(
      this.stepComps.map((f) => f.render())
    );

    this.currStep = 0;
    const firstStep = this.stepComps[this.currStep];
    firstStep.show();

    return this.html;
  }

  embed (parentSelector) {
    const parent = htmlUtils.getElement(parentSelector);

    if (!parent) {
      throw new SDKError(`Selector [${parentSelector}] not found`);
    }

    const form = this.render();

    parent.appendChild(form);
  }

  setSuccess (msg) {
    const step = this.stepComps[this.currStep];
    step.setSuccessMessage(msg);
  }

  setFormError (msg) {
    const step = this.stepComps[this.currStep];
    step.setErrorMessage(msg);
  }

  setInvalidFields (errors = {}) {
    const step = this.stepComps[this.currStep];
    step.setInvalidFields(errors);
  }

  clearState () {
    this.setSuccess();
    this.setFormError();
    this.setInvalidFields();
  }

  disable () {
    this.stepComps.forEach((s) => s.disable());
  }

  enable () {
    this.stepComps.forEach((s) => s.enable());
  }

  submit () {
    const current = this.stepComps[this.currStep];
    current.disable();

    const data = this.stepComps.reduce((data, step) => {
      return Object.assign(data, step.getData());
    }, {});

    this.callback(data);

    current.enable();
  }

  previous () {
    if (this.currStep === 0) {
      return;
    }

    const current = this.stepComps[this.currStep];
    const previous = this.stepComps[this.currStep + 1];

    this.currStep--;

    current.disable();
    current.hide();

    previous.enable();
    previous.show();
  }

  next () {
    const current = this.stepComps[this.currStep];
    const last = this.stepComps[this.stepComps.length - 1];
    
    if (current === last) {
      this.submit();
      return;
    }

    const next = this.stepComps[this.currStep + 1];
    
    this.currStep++;

    current.disable();
    current.hide();

    next.enable();
    next.show();
  }

  static create () {
    return new FormComp(...arguments);
  }

}

module.exports = FormComp;

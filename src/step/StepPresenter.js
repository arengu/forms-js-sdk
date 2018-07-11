const BasePresenter = require('../base/BasePresenter');
const StepView = require('./StepView');

const FieldView = require('../field/FieldView');

class StepPresenter extends BasePresenter {

  constructor (model, form) {
    super();

    this.stepM = model;
    this.formP = form;

    this.componentsV = model.components.map((c) => FieldView.create(c));
    this.stepV = StepView.create(model, this.componentsV, this);
  }

  /*
   * Step events
   */
  onBack () {
    this.formP.onBack();
  }

  onNext () {
    this.formP.onNext();
  }

  onInvalidFields (errors = {}) {
    this.componentsV.forEach((cv) => {
      const errMessage = errors[cv.id];
      cv.setError(errMessage)
    });
  }

  onSuccess (msg) {
    return this.stepV.setSuccess(msg);
  }

  onError (msg) {
    return this.stepV.setError(msg);
  }

  /*
   * Step actions
   */
  getStepData () {
    const data = {};

    this.componentsV.forEach((c) => {
      data[c.id] = c.value;
    });

    return data;
  }

  validate () {
    const errors = {};

    this.componentsV.forEach((c) => {
      const error = c.validate();
      if (error) {
        errors[c.id] = error;
      }
    });

    return errors;
  }

  render () {
    return this.stepV.render();
  }

  enable () {
    this.stepV.enable();
  }

  disable () {
    this.stepV.disable();
  }

  show () {
    this.stepV.show();
  }

  hide () {
    this.stepV.hide();
  }

  static create () {
    return new StepPresenter(...arguments);
  }

}

module.exports = StepPresenter;

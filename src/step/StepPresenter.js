const BasePresenter = require('../base/BasePresenter');
const StepView = require('./StepView');

const FieldPresenter = require('../field/FieldPresenter');

class StepPresenter extends BasePresenter {

  constructor (model, form) {
    super();

    this.stepM = model;
    this.formP = form;

    this.componentsP = model.components.map((c) => FieldPresenter.create(c, form.getModel()));
    this.stepV = StepView.create(model, this.componentsP, this);
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
    this.componentsP.forEach((cv) => {
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

    this.componentsP.forEach((c) => {
      const { id, value } = c;

      if (value && value.length > 0) {
        data[id] = value;
      }
    });

    return data;
  }

  validate () {
    const errors = {};

    this.componentsP.forEach((c) => {
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

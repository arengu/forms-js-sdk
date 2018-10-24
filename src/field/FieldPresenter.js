const BasePresenter = require('../base/BasePresenter');
const FieldView = require('./FieldView');

const EventsFactory = require('../lib/EventsFactory');

class FieldPresenter extends BasePresenter {

  constructor (fieldM, formM, stepP) {
    super();

    this.fieldM = fieldM;
    this.formM = formM;
    this.stepP = stepP;

    this.hasError = false;

    this.fieldV = FieldView.create(fieldM, this);
  }

  /*
   * Public methods
   */
  get id () {
    return this.fieldV.id;
  }

  get value () {
    return this.fieldV.value;
  }

  setError (msg) {
    this.hasError = true;
    this.stepP.onInvalidField(msg, this);
    return this.fieldV.setError(msg);
  }

  removeError () {
    this.hasError = false;
    this.stepP.onValidField(this);
    return this.fieldV.removeError();
  }

  /*
   * Events
   */
  _fireFieldEvent (fn, fieldView) {
    const formId = this.formM.id;
    const fieldData = {
      id: fieldView.id,
      value: fieldView.value,
    };

    fn.call(EventsFactory, formId, fieldData);
  }

  onBlur (fieldV) {
    this._fireFieldEvent(EventsFactory.onBlurField, fieldV);

    if (!this.hasError) {
      return;
    }

    const error = this.validate();

    if (error) {
      this.setError(error);
    } else {
      this.removeError();
    }
  }

  onChange (fieldV) {
    this._fireFieldEvent(EventsFactory.onChangeField, fieldV);
  }

  onFocus (fieldV) {
    this._fireFieldEvent(EventsFactory.onFocusField, fieldV);
  }

  /*
   * Field actions
   */
  render () {
    return this.fieldV.render();
  }

  validate () {
    return this.fieldV.validate();
  }

  static create () {
    return new FieldPresenter(...arguments);
  }

}

module.exports = FieldPresenter;

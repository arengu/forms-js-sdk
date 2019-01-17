const debounce = require('lodash/debounce');

const BasePresenter = require('../base/BasePresenter');
const FieldView = require('./FieldView');

const EventsFactory = require('../lib/EventsFactory');

class FieldPresenter extends BasePresenter {

  constructor (fieldM, formM, stepP, messages) {
    super();

    this.fieldM = fieldM;
    this.formM = formM;
    this.stepP = stepP;

    this.messages = messages;

    this.hasError = false;
    this.debounceError = debounce(this._debounceValidation.bind(this), 250);

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

  _debounceValidation () {
    const error = this.validate();

    if (error) {
      this.setError(this.messages.getErrorMessage(error));
    } else {
      this.removeError();
    }
  }

  onValueChange () {
    if (!this.hasError) {
      return;
    }

    this.debounceError();
  }

  onBlur (fieldV) {
    this._fireFieldEvent(EventsFactory.onBlurField, fieldV);
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

  reset () {
    return this.fieldV.reset();
  }

  validate () {
    return this.fieldV.validate();
  }

  static create (...args) {
    return new FieldPresenter(...args);
  }

}

module.exports = FieldPresenter;

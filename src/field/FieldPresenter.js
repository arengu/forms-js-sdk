const BasePresenter = require('../base/BasePresenter');
const FieldView = require('./FieldView');

const EventsFactory = require('../lib/EventsFactory');

class FieldPresenter extends BasePresenter {

  constructor (fieldModel, formModel) {
    super();

    this.fieldM = fieldModel;
    this.formM = formModel;

    this.fieldV = FieldView.create(fieldModel, this);

    this.eventsFactory = EventsFactory.create();
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
    return this.fieldV.setError(msg);
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

    fn.call(this.eventsFactory, formId, fieldData);
  }

  onBlur (fieldV) {
    this._fireFieldEvent(this.eventsFactory.onBlurField, fieldV);
  }

  onChange (fieldV) {
    this._fireFieldEvent(this.eventsFactory.onChangeField, fieldV);
  }

  onFocus (fieldV) {
    this._fireFieldEvent(this.eventsFactory.onFocusField, fieldV);
  }

  /*
   * Field actions
   */
  render () {
    return this.fieldV.render();
  }

  static create () {
    return new FieldPresenter(...arguments);
  }

}

module.exports = FieldPresenter;

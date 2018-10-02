
class Form {
  constructor (presenter) {
    this._presenter = presenter;
  }

  getId () {
    return this._presenter.getFormId();
  }

  setHiddenField (key, value) {
    this._presenter.getHiddenFields().set(key, value);
  }

  static create() {
    return new Form(...arguments);
  }
}

module.exports = Form;

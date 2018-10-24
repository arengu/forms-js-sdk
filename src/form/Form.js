class Form {

  static create(presenter, hiddenFields) {
    return {

      getId () {
        return presenter.getFormId();
      },

      setHiddenField (key, value) {
        hiddenFields.set(key, value);
      }

    };
  }

}

module.exports = Form;

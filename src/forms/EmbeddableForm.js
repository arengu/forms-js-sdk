const BaseForm = require('./BaseForm');

class EmbeddableForm extends BaseForm {

  embed (parentSelector) {
    return this._init()
      .then(() => {
        this.comp.embed(parentSelector);
        console.log(`Form [${this.formId}] embed into [${parentSelector}]`);
      })
      .catch((err) => {
        console.error(`Error embedding form [${this.formId}]:`, err.message);
        throw err;
      });
  }

  static create () {
    return new EmbeddableForm(...arguments);
  }

}

module.exports = EmbeddableForm;

const BaseForm = require('./BaseForm');
const htmlUtils = require('../view/html-utils');

class EmbeddableForm extends BaseForm {

  embed (parentSelector) {
    return this._init()
      .then(() => {
        this.comp.embed(parentSelector);
        console.log(`Form [${this.formId}] embed into [${parentSelector}]`);
        htmlUtils.triggerEvent('rf-embedSuccess');
      })
      .catch((err) => {
        console.error(`Error embedding form [${this.formId}]:`, err.message);
        htmlUtils.triggerEvent('rf-embedError');
        throw err;
      });
  }

  static create () {
    return new EmbeddableForm(...arguments);
  }

}

module.exports = EmbeddableForm;

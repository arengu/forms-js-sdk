const EmbeddableForm = require('./forms/EmbeddableForm');

const HTTPClient = require('./repositories/HTTPClient');
const compFactory = require('./view/comp-factory');

const cssInjector = require('./view/css-injector');

class SDK {

  constructor () {
    this.apiEntrypoint = 'https://api.rocketforms.io';
    this.assetsUrl = 'https://sdk.rocketforms.io';
    this.css = true;

    this.repository = HTTPClient.create(this);
    this.compFactory = compFactory;
  }

  embed (formId, parentSelector) {
    this._injectCSS();
    return EmbeddableForm.create(this, formId).embed(parentSelector);
  }

  _injectCSS () {
    if (this.css) {
      cssInjector.inject(this);
      this.css = false;
    }
  }

  static create () {
    return new SDK(...arguments);
  }

}

module.exports = SDK;

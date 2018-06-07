const FormPresenter = require('./form/FormPresenter');
const SDKError = require('./error/SDKError');

const HTTPClient = require('./repository/HTTPClient');

const CSSInjector = require('./css/CSSInjector');
const EventsFactory = require('./lib/EventsFactory');

class SDK {

  constructor () {
    this.cssInjector = CSSInjector.create();
    this.eventsFactory = EventsFactory.create();
    this.repository = HTTPClient.create();
  }

  init () {
    this.cssInjector.injectDefault();
    this.eventsFactory.sdkInit(this);
  }

  embed (formId, parentSelector) {
    this.eventsFactory.getForm(formId);
    return this.repository.getForm((formId))
      .catch((err) => {
        console.error('Error retrieving form', err);
        this.eventsFactory.getFormError(formId, err);
        throw err;
      })
      .then((form) => {
        try {
          this.eventsFactory.getFormSuccess(formId, form);
          const presenter = FormPresenter.create(form);

          this.eventsFactory.embedForm(formId, parentSelector);
          const parent = document.querySelector(parentSelector);

          if (!parent) {
            throw SDKError.create(`Selector [${parentSelector}] not found`);
          }

          const node = presenter.render();
          parent.appendChild(node);
          this.eventsFactory.embedFormSuccess(formId, parent,node);
        } catch (err) {
          console.error('Error embedding form', err);
          this.eventsFactory.embedFormError(formId, err);
          throw err;
        }
      });
  }

  static create () {
    return new SDK(...arguments);
  }

}

module.exports = SDK;

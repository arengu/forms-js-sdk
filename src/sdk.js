const FormPresenter = require('./form/FormPresenter');
const FormModel = require('./form/FormModel');
const Form = require('./form/Form');

const SDKError = require('./error/SDKError');

const HTTPClient = require('./repository/HTTPClient');

const CSSInjector = require('./css/CSSInjector');
const EventsFactory = require('./lib/EventsFactory');

const MAGIC_SELECTOR = 'data-arengu-form-id';

class SDK {

  constructor () {
    this.cssInjector = CSSInjector.create();
    this.eventsFactory = EventsFactory.create();
    this.repository = HTTPClient.create();
  }

  _findNode (selector) {
    const node = document.querySelector(selector);

    if (!node) {
      throw SDKError.create(`There is not any node for the provided criteria [${selector}]`);
    }

    return node;
  }

  _getForm (formId) {
    if (typeof(formId) === 'object') {
      return Promise.resolve(FormModel.create(formId))
    }

    this.eventsFactory.getForm(formId);
    return this.repository.getForm((formId))
      .catch((err) => {
        console.error('Error retrieving form', err);
        this.eventsFactory.getFormError(formId, err);
        throw err;
      })
      .then((form) => {
          this.eventsFactory.getFormSuccess(formId, form);
          return form;
      });
  }

  embed (form, parent, initValues) {
    if (!form) {
      throw new SDKError('Specify the form you want to embed');
    }
    if (!parent) {
      throw new SDKError('Specify the node where you want to embed the form');
    }

    const parentNode = parent.length ? this._findNode(parent) : parent;

    return this._getForm(form)
      .then((formData) => {
        const formId = formData.id;

        try {
          this.eventsFactory.embedForm(formId, parent.length ? parent : null);

          const presenter = FormPresenter.create(formData, initValues);
          const formNode = presenter.render();

          parentNode.appendChild(formNode);
          this.eventsFactory.embedFormSuccess(formId, parentNode, formNode);

          return presenter;
        } catch (err) {
          console.error('Error embedding form', err);
          this.eventsFactory.embedFormError(formId, err);
          throw err;
        }
      }).then((presenter) => Form.create(presenter));
  }

  _waitForDom (fn) {
    const VALID_STATES = ['interactive', 'complete'];

    if (VALID_STATES.includes(document.readyState)) {
      fn();
      return;
    }

    let executed = false;
    document.addEventListener('readystatechange', function listenState (event) {
      if (VALID_STATES.includes(event.target.readyState) && !executed) {
        executed = true;
        fn();
      }
    });
  }

  _auto () {
    document.querySelectorAll(`[${MAGIC_SELECTOR}]`)
      .forEach((node) => {
        const formId = node.dataset.arenguFormId;
        this.embed(formId, node);
      });
  }

  init () {
    this.cssInjector.injectDefault();
    this.eventsFactory.sdkInit(this);
    this._waitForDom(this._auto.bind(this));
  }

  static create () {
    return new SDK(...arguments);
  }

}

module.exports = SDK;

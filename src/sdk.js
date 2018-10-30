const FormPresenter = require('./form/FormPresenter');
const FormModel = require('./form/FormModel');
const Form = require('./form/Form');

const HiddenFields = require('./form/HiddenFields');

const SDKError = require('./error/SDKError');

const Repository = require('./repository/HTTPClient');

const CSSInjector = require('./css/CSSInjector');
const EventsFactory = require('./lib/EventsFactory');

const MAGIC_SELECTOR = 'data-arengu-form-id';

class SDK {

  constructor () {
    this.cssInjector = CSSInjector.create();
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

    EventsFactory.getForm(formId);
    return Repository.getForm((formId))
      .catch((err) => {
        EventsFactory.getFormError(formId, err);
        throw err;
      })
      .then((form) => {
        EventsFactory.getFormSuccess(formId, form);
        return form;
      });
  }

  async embed (form, parent, initValues) {
    if (!form) {
      throw new SDKError('Specify the form you want to embed');
    }
    if (!parent) {
      throw new SDKError('Specify the node where you want to embed the form');
    }

    const parentNode = parent.length ? this._findNode(parent) : parent;

    const formId = form.id || form;

    try {
      const formData = await this._getForm(form)

      EventsFactory.embedForm(formId, parent.length ? parent : null);

      const hiddenFields = HiddenFields.create(formData.hiddenFields, initValues);
      const presenter = FormPresenter.create(formData, hiddenFields);

      const formNode = presenter.render();

      parentNode.appendChild(formNode);
      EventsFactory.embedFormSuccess(formId, parentNode, formNode);

      return Form.create(presenter, hiddenFields);
    } catch (err) {
      console.error('Error embedding form', err);
      EventsFactory.embedFormError(formId, err);
      throw err;
    }
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
    EventsFactory.sdkInit(this);
    this._waitForDom(this._auto.bind(this));
  }

  static create () {
    return new SDK(...arguments);
  }

}

module.exports = SDK;

const htmlUtils = require('./html-utils');

const SDKError = require('../models/SDKError');

module.exports = {

  checkbox: function createCheckbox (fieldId, optionId, value, checked) {
    const elem = document.createElement('input');
    elem.setAttribute('id', optionId);
    elem.setAttribute('type', 'checkbox');
    elem.setAttribute('name', fieldId);
    elem.setAttribute('value', value);
    
    if (checked) {
      elem.setAttribute('checked', 'true');
    }
    
    return elem;
  },

  checkboxContainer: function createCheckboxContainer (check, label) {
    const container = this.container([check, label]);
    container.classList.add('rf-checkbox');

    return container;
  },

  checkgroup: function createCheckgroup (children) {
    const container = this.container(children);
    container.classList.add('rf-checkgroup');

    return container;
  },

  container: function createContainer (children) {
    const group = document.createElement('div');

    if (children) {
      children.forEach((c) => group.appendChild(c));
    }

    return group;
  },

  error: function createError () {
    return document.createElement('p');
  },

  errorFieldContainer: function createErrorFieldContainer (children) {
    const container = this.container(children);
    container.classList.add('rf-field-error-container');

    return container;
  },

  errorFormContainer: function createErrorFormContainer (children) {
    const container = this.container(children);
    container.classList.add('rf-form-error-container');

    return container;
  },

  success: function createSuccess () {
    return document.createElement('p');
  },

  successContainer: function createSuccessContainer (children) {
    const container = this.container(children);
    container.classList.add('rf-form-success-container');

    return container;
  },

  form: function createForm (children, callback) {
    const form = document.createElement('form');
    form.classList.add('rf-form');

    children.forEach((f) => form.appendChild(f));

    form.onsubmit = (evt) => {
      evt.preventDefault();
      return callback();
    };

    return form;
  },

  textInput: function createTextInput (fieldModel) {
    const { type, id } = fieldModel;

    const elem = document.createElement('input');

    elem.setAttribute('type', type);
    elem.setAttribute('name', id);
    elem.setAttribute('id', id);

    elem.classList.add('rf-input');

    htmlUtils.parseDef(fieldModel)
      .forEach((a) => elem.setAttribute(a.name, a.value));

    return elem;
  },

  label: function createLabel (text, inputId, required) {
    const elem = document.createElement('label');
    
    if (inputId) {
      elem.setAttribute('for', inputId);
    }

    if (required) {
      elem.classList.add('rf-required');
    }

    elem.innerText = text || null;

    return elem;
  },

  fieldContainer: function createFieldContainer (children) {
    const container = this.container(children);
    container.classList.add('rf-field');

    return container;
  },

  fieldName: function createFieldName (text, inputId, required) {
    const label = this.label(text, inputId, required);

    return label;
  },

  rowContainer: function createRowContainer (children) {
    const container = this.container(children);
    container.classList.add('rf-row');

    return container;
  },

  submit: function createSubmit () {
    const button = document.createElement('input');
    button.setAttribute('type', 'submit');
    button.classList.add('rf-submit');

    return button;
  }

};

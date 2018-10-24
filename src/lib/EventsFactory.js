const KEYS = {
  SDK_INIT: 'af-init',
  GET_FORM: 'af-getForm',
  GET_FORM_SUCCESS: 'af-getForm-success',
  GET_FORM_ERROR: 'af-getForm-error',
  EMBED_FORM: 'af-embedForm',
  EMBED_FORM_ERROR: 'af-embedForm-error',
  EMBED_FORM_SUCCESS: 'af-embedForm-success',
  SUBMIT_FORM: 'af-submitForm',
  SUBMIT_FORM_ERROR: 'af-submitForm-error',
  SUBMIT_FORM_SUCCESS: 'af-submitForm-success',
  INVALID_FIELDS_ERROR: 'af-invalidFields-error',
  BLUR_FIELD: 'af-blurField',
  FOCUS_FIELD: 'af-focusField',
  CHANGE_FIELD: 'af-changeField',
};

class EventsFactory {

  static triggerEvent (name, data) {
    const event = new CustomEvent(name, {detail: data});
    return document.dispatchEvent(event);
  }

  static sdkInit (sdk) {
    this.triggerEvent(KEYS.SDK_INIT, {
      sdk
    });
  }

  static getForm (formId) {
    this.triggerEvent(KEYS.GET_FORM, {
      formId: formId,
    });
  }

  static getFormError (formId, err) {
    this.triggerEvent(KEYS.GET_FORM_ERROR, {
      formId: formId,
      error: err
    });
  }

  static getFormSuccess (formId, data) {
    this.triggerEvent(KEYS.GET_FORM_SUCCESS, {
      formId: formId,
      data
    });
  }

  static embedForm (formId, parentSelector) {
    this.triggerEvent(KEYS.EMBED_FORM, {
      formId: formId,
      selector: parentSelector
    });
  }

  static embedFormError (formId, err) {
    this.triggerEvent(KEYS.EMBED_FORM_ERROR, {
      formId: formId,
      error: err
    });
  }

  static embedFormSuccess (formId, parentNode, formNode) {
    this.triggerEvent(KEYS.EMBED_FORM_SUCCESS, {
      formId: formId,
      parent: parentNode,
      node: formNode
    });
  }

  static submitForm (formId, data) {
    this.triggerEvent(KEYS.SUBMIT_FORM, {
      formId: formId,
      data
    });
  }

  static submitFormError (formId, err) {
    this.triggerEvent(KEYS.SUBMIT_FORM_ERROR, {
      formId: formId,
      error: err
    });
  }

  static submitFormSuccess (formId, confirmation) {
    this.triggerEvent(KEYS.SUBMIT_FORM_SUCCESS, {
      formId: formId,
      confirmation
    });
  }

  static invalidFieldsError (formId, fields) {
    this.triggerEvent(KEYS.INVALID_FIELDS_ERROR, {
      formId: formId,
      fields
    });
  }

  static onBlurField (formId, field) {
    this.triggerEvent(KEYS.BLUR_FIELD, { formId, field });
  }

  static onChangeField (formId, field) {
    this.triggerEvent(KEYS.CHANGE_FIELD, { formId, field });
  }

  static onFocusField (formId, field) {
    this.triggerEvent(KEYS.FOCUS_FIELD, { formId, field });
  }

}

module.exports = EventsFactory;

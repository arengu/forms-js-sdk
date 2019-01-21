const KEYS = {
  SDK_INIT: 'af-init',
  GET_FORM: 'af-getForm',
  GET_FORM_SUCCESS: 'af-getForm-success',
  GET_FORM_ERROR: 'af-getForm-error',
  EMBED_FORM: 'af-embedForm',
  EMBED_FORM_ERROR: 'af-embedForm-error',
  EMBED_FORM_SUCCESS: 'af-embedForm-success',
  STEP_PREVIOUS: 'af-previousStep',
  STEP_NEXT: 'af-nextStep',
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
      formId,
    });
  }

  static getFormError (formId, err) {
    this.triggerEvent(KEYS.GET_FORM_ERROR, {
      formId,
      error: err
    });
  }

  static getFormSuccess (formId, data) {
    this.triggerEvent(KEYS.GET_FORM_SUCCESS, {
      formId,
      data
    });
  }

  static embedForm (formId, parentSelector) {
    this.triggerEvent(KEYS.EMBED_FORM, {
      formId,
      selector: parentSelector
    });
  }

  static embedFormError (formId, err) {
    this.triggerEvent(KEYS.EMBED_FORM_ERROR, {
      formId,
      error: err
    });
  }

  static embedFormSuccess (formId, parentNode, formNode) {
    this.triggerEvent(KEYS.EMBED_FORM_SUCCESS, {
      formId,
      parent: parentNode,
      node: formNode
    });
  }

  static previousStep (formId) {
    this.triggerEvent(KEYS.STEP_PREVIOUS, {
      formId,
    });
  }

  static nextStep (formId) {
    this.triggerEvent(KEYS.STEP_NEXT, {
      formId,
    });
  }

  static submitForm (formId, data) {
    this.triggerEvent(KEYS.SUBMIT_FORM, {
      formId,
      formData: data.formData,
      metaData: data.metaData,
    });
  }

  static submitFormError (formId, data, err) {
    this.triggerEvent(KEYS.SUBMIT_FORM_ERROR, {
      formId,
      formData: data.formData,
      metaData: data.metaData,
      error: err,
    });
  }

  static submitFormSuccess (formId, data, confirmation) {
    this.triggerEvent(KEYS.SUBMIT_FORM_SUCCESS, {
      formId,
      formData: data.formData,
      metaData: data.metaData,
      confirmation,
    });
  }

  static invalidFieldsError (formId, data, fields) {
    this.triggerEvent(KEYS.INVALID_FIELDS_ERROR, {
      formId,
      formData: data.formData,
      metaData: data.metaData,
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

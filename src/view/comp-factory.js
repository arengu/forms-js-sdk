const FieldComp = require('./comp/FieldComp');
const FieldErrorComp = require('./comp/error/FieldErrorComp');
const FormErrorComp = require('./comp/error/FormErrorComp');
const FormComp = require('./comp/FormComp');
const SubmitComp = require('./comp/SubmitComp');
const SuccessComp = require('./comp/SuccessComp');

module.exports = {

  field: function createField () {
    return FieldComp.create(...arguments);
  },

  fieldError: function createFieldError () {
    return FieldErrorComp.create(...arguments);
  },

  form: function createForm () {
    return FormComp.create(...arguments);
  },

  formError: function createFormError () {
    return FormErrorComp.create(...arguments);
  },

  submit: function createSubmit () {
    return SubmitComp.create(...arguments);
  },

  success: function createSuccess () {
    return SuccessComp.create(...arguments);
  },

};

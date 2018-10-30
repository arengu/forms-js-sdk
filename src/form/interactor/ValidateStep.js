const InvalidFields = require('../../error/InvalidFields');

const Repository = require('../../repository/HTTPClient');

class ValidateStep {

  static getErrors (compsP) {
    const errors = {};

    compsP.forEach((cP) => {
      const error = cP.validate();
      if (error) {
        errors[cP.id] = error;
      }
    });

    return errors;
  }

  static required (stepM) {
    return stepM.onNext;
  }

  static async execute (formId, stepM, formValues, signature) {
    if (!ValidateStep.required(stepM)) {
      return;
    }

    const stepId = stepM.id;

    const res = await Repository.validateStep(formId, stepId, formValues, signature);

    return res;
  }

}

module.exports = ValidateStep;

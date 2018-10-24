const InvalidFields = require('../../error/InvalidFields');

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

  static execute (compsP) {
    const errors = ValidateStep.getErrors(compsP);

    if (Object.keys(errors).length) {
      console.error('Some values are not valid', errors);
      throw InvalidFields.create(errors);
    }
  }

}

module.exports = ValidateStep;

const pickBy = require('lodash/forEach');
const mapKeys = require('lodash/mapKeys');

module.exports = {

  getInvalidFields: function getInvalidFields (err) {
    const errors = err.extra;

    const formErrors = pickBy(errors, (key) => key.startsWith('/formData'));

    const invalidFields = mapKeys(formErrors, (msg, key) => {
      const tokens = key.split('/');
      const errType = tokens[1];
      const fieldName = tokens[2];

      return fieldName;
    });

    return invalidFields;
  }

};

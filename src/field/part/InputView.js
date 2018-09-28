const Choice = require('./input/Choice');
const Dropdown = require('./input/Dropdown');
const TextInput = require('./input/TextInput');
const DateInput = require('./input/DateInput');
const Rating = require('./input/Rating');
const Legal = require('./input/Legal');
const BooleanField = require('./input/BooleanField');
const PasswordInput = require('./input/PasswordInput');

const SDKError = require('../../error/SDKError');

module.exports = {

  create: function createInput (model) {
    const { type } = model;

    switch (type) {
      case 'choice':
        return Choice.create(model);

      case 'dropdown':
        return Dropdown.create(model);

      case 'rating':
        return Rating.create(model);
      
      case 'boolean':
        return BooleanField.create(model);

      case 'legal':
        return Legal.create(model);

      case 'date':
        return DateInput.create(model);

      case 'email':
      case 'number':
      case 'tel':
      case 'text':
      case 'url':
        return TextInput.create(model);

      case 'password':
        return PasswordInput.create(model);

      default:
        throw SDKError.create(`Input type [${type}] is unknown`, model);
    };
  }

};

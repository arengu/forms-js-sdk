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

  create: function createInput (model, presenter) {
    const { type } = model;

    switch (type) {
      case 'CHOICE':
        return Choice.create(model, presenter);

      case 'DROPDOWN':
        return Dropdown.create(model, presenter);

      case 'RATING':
        return Rating.create(model, presenter);
      
      case 'BOOLEAN':
        return BooleanField.create(model, presenter);

      case 'LEGAL':
        return Legal.create(model, presenter);

      case 'DATE':
        return DateInput.create(model, presenter);

      case 'EMAIL':
      case 'NUMBER':
      case 'TEL':
      case 'TEXT':
      case 'URL':
        return TextInput.create(model, presenter);

      case 'PASSWORD':
        return PasswordInput.create(model);

      default:
        throw SDKError.create(`Input type [${type}] is unknown`, model);
    };
  }

};

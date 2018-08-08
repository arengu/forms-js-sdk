const Choice = require('./input/Choice');
const Dropdown = require('./input/Dropdown');
const TextInput = require('./input/TextInput');
const Rating = require('./input/Rating');
const Legal = require('./input/Legal');
const BooleanField = require('./input/BooleanField');

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
      case 'email':
      case 'number':
      case 'tel':
      case 'time':
      case 'text':
      case 'url':
        return TextInput.create(model);

      default:
        throw SDKError.create(`Input type [${type}] is unknown`, model);
    };
  }

};

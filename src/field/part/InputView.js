const Checkgroup = require('./input/Checkgroup');
const Radiogroup = require('./input/Radiogroup');
const Dropdown = require('./input/Dropdown');
const TextInput = require('./input/TextInput');
const Textarea = require('./input/Textarea');
const Rating = require('./input/Rating');
const Legal = require('./input/Legal');

const SDKError = require('../../error/SDKError');

module.exports = {

  create: function createInput (model) {
    const { type } = model;

    switch (type) {
      case 'check':
        return Checkgroup.create(model);

      case 'radio':
        return Radiogroup.create(model);
      
      case 'textarea':
        return Textarea.create(model);

      case 'dropdown':
        return Dropdown.create(model);

      case 'rating':
        return Rating.create(model);

      case 'legal':
        return Legal.create(model);

      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        return TextInput.create(model);

      default:
        throw SDKError.create(`Input type [${type}] is unknown`, model);
    };
  }

};

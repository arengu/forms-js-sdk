const TextInputComp = require('./input/TextInputComp');
const CheckgroupComp = require('./input/CheckgroupComp');

module.exports = {

  create: function createInput (model) {
    const { type } = model;

    switch (type) {
      case 'check':
        return CheckgroupComp.create(model);

      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        return TextInputComp.create(model);

      default:
        throw new Error(`Input type [${type}] is unknown`, model);
    };
  }

};

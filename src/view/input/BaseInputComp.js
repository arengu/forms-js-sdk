const compFactory = require('../comp-factory');
const htmlFactory = require('../html-factory');

class BaseInputComp {

  constructor (fieldModel) {
    this.model = fieldModel;

    this.html = null;
  }

  get id () {
    return this.model.id;
  }

}

module.exports = BaseInputComp;

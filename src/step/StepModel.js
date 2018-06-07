const BaseModel = require('../base/BaseModel');
const FieldModel = require('../field/FieldModel');

class StepModel extends BaseModel {

  constructor (data) {
    super(data);
    this.id = data.id;
    this.name = data.name;
    this.components = data.components.map(FieldModel.create);
    this.buttons = data.buttons;
  }

  static create () {
    return new StepModel(...arguments);
  }

}

module.exports = StepModel;

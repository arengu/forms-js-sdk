const BaseModel = require('../base/BaseModel');
const StepModel = require('../step/StepModel');

const MODEL_NAME = 'PublicForm';

class FormModel extends BaseModel {

  constructor (data) {
    super(data);
    this.id = data.id;
    this.workspaceId = data.workspaceId;
    this.steps = data.steps.map(StepModel.create);
  }

  static create () {
    return new FormModel(...arguments);
  }
}

module.exports = FormModel;

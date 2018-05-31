const BaseModel = require('./BaseModel');
const StepModel = require('./StepModel');

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

  static matches (obj) {
    return obj && obj.model === MODEL_NAME;
  }

}

module.exports = FormModel;

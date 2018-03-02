const BaseModel = require('./BaseModel');
const FieldModel = require('./FieldModel');

const MODEL_NAME = 'PublicForm';

class FormModel extends BaseModel {

  constructor (data) {
    super(data);
    this.id = data.id;
    this.workspaceId = data.workspaceId;
    this.fields = data.fields.map(FieldModel.create);
  }

  static create () {
    return new FormModel(...arguments);
  }

  static matches (obj) {
    return obj && obj.model === MODEL_NAME;
  }

}

module.exports = FormModel;

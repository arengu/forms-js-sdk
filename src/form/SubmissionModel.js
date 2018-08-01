const BaseModel = require('../base/BaseModel');

const MODEL_NAME = 'SubmissionCreated';

class SubmissionModel extends BaseModel {

  constructor (data) {
    super(data);
    this.id = data.id;
    this.formId = data.formId;
    this.onSubmit = data.onSubmit;
  }

  static create () {
    return new SubmissionModel(...arguments);
  }
}

module.exports = SubmissionModel;

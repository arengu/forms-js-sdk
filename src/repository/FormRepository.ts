import { IFormModel } from '../form/model/FormModel';
import { AppErrorCode } from '../error/ErrorCodes';
import { AppError } from '../error/AppError';
import { InvalidFields } from '../error/InvalidFields';
import { IFormData } from '../form/model/SubmissionModel';
import {
  IHeaders, HTTPClient, ResponseHelper, HeaderName, AuthHelper,
} from '../lib/HTTPClient';
import { IFormInteraction } from '../form/FormInteraction';

declare const API_URL: string;

export class FormRepository {
  public static async getForm(formId: string): Promise<IFormModel> {
    const reqUrl = `${API_URL}/forms/${formId}`;
    const res = await HTTPClient.get(reqUrl);

    const { status, body } = res;

    if (ResponseHelper.isSuccess(status)) {
      return body;
    }

    console.error('Error retrieving form', body);
    throw AppError.create(body);
  }

  public static async createSubmission(formId: string, submission: object,
    signature?: string): Promise<IFormInteraction> {
    const reqUrl = `${API_URL}/forms/${formId}/submissions/`;
    const headers: IHeaders = {};

    if (signature) {
      headers[HeaderName.Authorization] = AuthHelper.bearer(signature);
    }

    const res = await HTTPClient.post(reqUrl, submission, headers);

    const { status, body } = res;

    if (ResponseHelper.isSuccess(status)) {
      return body;
    }

    const errorCode = body.code;

    if (errorCode === AppErrorCode.INVALID_INPUT) {
      throw InvalidFields.fromSchemaError(body);
    }

    console.error('Error creating submission', body);
    throw AppError.create(body);
  }

  public static async executeFlow(formId: string, stepId: string,
    formData: IFormData, signature?: string): Promise<IFormInteraction> {
    const reqUrl = `${API_URL}/forms/${formId}/validations/${stepId}`;
    const headers: IHeaders = {};

    if (signature) {
      headers[HeaderName.Authorization] = AuthHelper.bearer(signature);
    }

    const res = await HTTPClient.post(reqUrl, formData, headers);

    const { status, body } = res;

    if (ResponseHelper.isSuccess(status)) {
      return body;
    }

    const errorCode = body.code;

    if (errorCode === AppErrorCode.INVALID_INPUT) {
      throw InvalidFields.fromSchemaError(body);
    }

    console.error('Error validating data', body);
    throw AppError.create(body);
  }
}

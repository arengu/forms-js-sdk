import { IFormModel } from '../form/model/FormModel';
import { AppErrorCode } from '../error/ErrorCodes';
import { AppError } from '../error/AppError';
import { InvalidFields } from '../error/InvalidFields';
import { ISubmissionData } from '../form/model/SubmissionModel';
import {
  IHeaders, HTTPClient, ResponseHelper, HeaderName, AuthHelper,
} from '../lib/HTTPClient';
import { IFormInteractionResponse } from '../form/FormInteraction';

declare const API_URL: string;

export interface ISubmitFormParams {
  readonly formId: string;
  readonly signature?: string;
  readonly data: ISubmissionData;
}

export interface IValidateStepParams extends ISubmitFormParams {
  readonly stepId: string;
}

export const FormRepository = {
  async getForm(formId: string): Promise<IFormModel> {
    const reqUrl = `${API_URL}/forms/${formId}`;
    const res = await HTTPClient.get(reqUrl);

    const { status, body } = res;

    if (ResponseHelper.isSuccess(status)) {
      return body;
    }

    console.error('Error retrieving form', body);
    throw AppError.create(body);
  },

  async submitForm(params: ISubmitFormParams): Promise<IFormInteractionResponse> {
    const reqUrl = `${API_URL}/forms/${params.formId}/submissions/`;
    const headers: IHeaders = {};

    if (params.signature) {
      headers[HeaderName.Authorization] = AuthHelper.bearer(params.signature);
    }

    const res = await HTTPClient.post(reqUrl, params.data, headers);

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
  },

  async validateStep(params: IValidateStepParams): Promise<IFormInteractionResponse> {
    const reqUrl = `${API_URL}/forms/${params.formId}/validations/${params.stepId}`;
    const headers: IHeaders = {};

    if (params.signature) {
      headers[HeaderName.Authorization] = AuthHelper.bearer(params.signature);
    }

    const res = await HTTPClient.post(reqUrl, params.data, headers);

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
  },
};

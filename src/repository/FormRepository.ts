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

export interface IGetFormParams {
  readonly formId: string;
}

export interface ISubmitFormParams {
  readonly formId: string;
  readonly signature?: string;
  readonly data: ISubmissionData;
}

export interface IValidateStepParams extends ISubmitFormParams {
  readonly stepId: string;
}

export const RepositoryHelper = {
  getLocation(): string {
    const url = new URL(document.location.href);
    return url.origin + url.pathname;
  },
};

export const FormRepository = {
  async getForm(params: IGetFormParams): Promise<IFormModel> {
    const { formId } = params;

    const reqUrl = `${API_URL}/forms/${formId}`;

    const headers: IHeaders = {
      [HeaderName.Location]: RepositoryHelper.getLocation(),
    };

    const res = await HTTPClient.get(reqUrl, headers);

    const { status, body } = res;

    if (ResponseHelper.isSuccess(status)) {
      return body;
    }

    console.error('Error retrieving form', body);
    throw AppError.create(body);
  },

  async submitForm(params: ISubmitFormParams): Promise<IFormInteractionResponse> {
    const reqUrl = `${API_URL}/forms/${params.formId}/submissions/`;
    const headers: IHeaders = {
      [HeaderName.Location]: RepositoryHelper.getLocation(),
    };

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
    const headers: IHeaders = {
      [HeaderName.Location]: RepositoryHelper.getLocation(),
    };

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

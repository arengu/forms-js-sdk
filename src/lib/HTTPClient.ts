declare const SDK_VERSION: string;

export enum HTTPMethod {
  GET = 'get',
  POST = 'post',
}

export type IHeaders = Record<string, string>;

export enum HeaderName {
  ContentType = 'Content-Type',
  Authorization = 'Authorization',
  // User-Agent header is still a forbidden header for some browsers
  SDKVersion = 'X-SDK-Version',
  Location = 'X-Location',
}

export enum ContentType {
  JSON = 'application/json',
}

export enum AuthType {
  Bearer = 'Bearer',
}

export interface IHTTPResponse {
  status: number;
  body: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const ResponseHelper = {
  isSuccess(status: number): boolean {
    return status >= 200 && status < 400;
  },
};

export const AuthHelper = {
  bearer(token: string): string {
    return `Bearer ${token}`;
  },
};

export const HTTPClient = {
  async get(url: string, headers?: IHeaders): Promise<IHTTPResponse> {
    const reqHeaders: IHeaders = {
      ...headers,
      [HeaderName.SDKVersion]: SDK_VERSION,
    };

    const reqOpts: RequestInit = {
      method: HTTPMethod.GET,
      headers: reqHeaders,
    };

    const res = await fetch(url, reqOpts);

    const resBody = await res.json();

    return {
      status: res.status,
      body: resBody,
    };
  },

  async post(url: string, body?: object, headers?: IHeaders): Promise<IHTTPResponse> {
    const reqHeaders: IHeaders = {
      ...headers,
      [HeaderName.SDKVersion]: SDK_VERSION,
    };

    const reqOpts: RequestInit = {
      method: HTTPMethod.POST,
      headers: reqHeaders,
    };

    if (body) {
      reqHeaders[HeaderName.ContentType] = ContentType.JSON;
      reqOpts.body = JSON.stringify(body);
    }

    const res = await fetch(url, reqOpts);

    const resBody = await res.json();

    return {
      status: res.status,
      body: resBody,
    };
  },
};

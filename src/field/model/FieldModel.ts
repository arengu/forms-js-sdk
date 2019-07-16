export enum FieldType {
  BOOLEAN = 'BOOLEAN',
  CHOICE = 'CHOICE',
  DATE = 'DATE',
  DROPDOWN = 'DROPDOWN',
  EMAIL = 'EMAIL',
  LEGAL = 'LEGAL',
  NUMBER = 'NUMBER',
  PASSWORD = 'PASSWORD',
  PAYMENT = 'PAYMENT',
  TEL = 'TEL',
  TEXT = 'TEXT',
  URL = 'URL',
}

export interface IFieldOptionModel {
  readonly value: string;
  readonly label: string;
}

export interface IBaseFieldModel {
  readonly id: string;
  readonly type: FieldType;
  readonly label: null | string;
  readonly hint: null | string;
  readonly placeholder: null | string;
  readonly required: boolean;
  readonly config: object;
}

export interface IBooleanFieldModel extends IBaseFieldModel {
  readonly type: FieldType.BOOLEAN;
  readonly config: {
    readonly defaultValue: string;
  };
}

export interface IChoiceFieldModel extends IBaseFieldModel {
  readonly type: FieldType.CHOICE;
  readonly config: {
    readonly multiple: boolean;
    readonly options: IFieldOptionModel[];
    readonly defaultValue: null | string | string[];
  };
}

export enum DateFormat {
  DATE = 'DATE',
  TIME = 'TIME',
}

export interface IDateFieldModel extends IBaseFieldModel {
  readonly type: FieldType.DATE;
  readonly config: {
    readonly format: DateFormat;
    readonly defaultValue: null | string;
  };
}

export interface IDropdownFieldModel extends IBaseFieldModel {
  readonly type: FieldType.DROPDOWN;
  readonly config: {
    readonly multiple: boolean;
    readonly options: IFieldOptionModel[];
    readonly defaultValue: null | string | string[];
  };
}


export interface IEmailFieldModel extends IBaseFieldModel {
  readonly type: FieldType.EMAIL;
  readonly config: {
    readonly defaultValue: null | string;
  };
}

export interface ILegalFieldModel extends IBaseFieldModel {
  readonly type: FieldType.LEGAL;
  readonly config: {
    readonly text: null | string;
  }
}

export enum NumberFormat {
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  CURRENCY = 'CURRENCY',
}

export interface INumberFieldModel extends IBaseFieldModel {
  readonly type: FieldType.NUMBER;
  readonly config: {
    readonly format: NumberFormat;
    readonly defaultValue: null | number;
    readonly minValue: null | number;
    readonly maxValue: null | number;
  }
}

export enum HashFunction {
  NONE = 'NONE',
  MD5 = 'MD5',
  SHA1 = 'SHA1',
  SHA256 = 'SHA256',
  SHA512 = 'SHA512',
}

export interface IPasswordFieldModel extends IBaseFieldModel {
  readonly type: FieldType.PASSWORD;
  readonly config: {
    readonly hash: HashFunction;
  }
}

export interface IPaymentCardFieldModel {
  readonly label: null | string;
  readonly placeholder: null | string;
}

export interface IPaymentFieldModel extends IBaseFieldModel {
  readonly type: FieldType.PAYMENT;
  readonly config: {
    readonly credentials: {
      readonly publicKey: string;
    };
    readonly fields: {
      readonly cardNumber: IPaymentCardFieldModel;
      readonly expirationDate: IPaymentCardFieldModel;
      readonly securityCode: IPaymentCardFieldModel;
      readonly trustmarks: boolean;
    };
  }
}

export interface ITelFieldModel extends IBaseFieldModel {
  readonly type: FieldType.TEL;
  readonly config: {
    readonly defaultValue: string;
    readonly minLength: number;
    readonly maxLength: null | number;
  }
}

export interface ITextFieldModel extends IBaseFieldModel {
  readonly type: FieldType.TEXT;
  readonly config: {
    readonly multiline: boolean;
    readonly defaultValue: null | string;
    readonly minLength: number;
    readonly maxLength: null | number;
  }
}

export interface IURLFieldModel extends IBaseFieldModel {
  readonly type: FieldType.URL;
  readonly config: {
    readonly defaultValue: null | string;
  }
}

export type IFieldModel = IBooleanFieldModel | IChoiceFieldModel | IDateFieldModel |
  IDropdownFieldModel | IEmailFieldModel | ILegalFieldModel | INumberFieldModel |
  IPasswordFieldModel | IPaymentFieldModel | ITelFieldModel | ITextFieldModel | IURLFieldModel;

export type ISingleFieldValue = null | string;
export type IMultiFieldValue = string[];

export type IBooleanFieldValue = 'false' | 'true';
export type IChoiceFieldValue = ISingleFieldValue | IMultiFieldValue;
export type IDateFieldValue = ISingleFieldValue;
export type IDropdownFieldValue = ISingleFieldValue | IMultiFieldValue;
export type IEmailFieldValue = ISingleFieldValue;
export type ILegalFieldValue = IBooleanFieldValue;
export type INumberFieldValue = ISingleFieldValue;
export type IPasswordFieldValue = ISingleFieldValue;
export type IPaymentFieldValue = ISingleFieldValue;
export type ITelFieldValue = ISingleFieldValue;
export type ITextFieldValue = ISingleFieldValue;
export type IURLFieldValue = ISingleFieldValue;

export type IFieldValue = IBooleanFieldValue | IChoiceFieldValue | IDateFieldValue |
  IDropdownFieldValue | IEmailFieldValue | ILegalFieldValue | INumberFieldValue |
  IPasswordFieldValue | IPaymentFieldValue | ITelFieldValue | ITextFieldValue |
  IURLFieldValue;

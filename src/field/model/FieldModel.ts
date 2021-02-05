import { ComponentCategory } from "../../component/ComponentModel";
import { ISocialInputValue } from "../view/input/SocialInputView";

export enum FieldType {
  BOOLEAN = 'BOOLEAN',
  CARDS = 'CARDS',
  CHOICE = 'CHOICE',
  DATE = 'DATE',
  DROPDOWN = 'DROPDOWN',
  EMAIL = 'EMAIL',
  LEGAL = 'LEGAL',
  NUMBER = 'NUMBER',
  PASSWORD = 'PASSWORD',
  PAYMENT = 'PAYMENT',
  SOCIAL = 'SOCIAL',
  TEL = 'TEL',
  TEXT = 'TEXT',
  URL = 'URL',
}

export interface IFieldOptionModel {
  readonly value: string;
  readonly label: string;
}

export interface ICardsOptionModel extends IFieldOptionModel {
  readonly imageUrl: string;
}

interface IBaseFieldModel {
  readonly id: string;
  readonly category: ComponentCategory.FIELD;
  readonly type: FieldType;
  readonly label?: string;
  readonly hint?: string;
  readonly required: boolean;
  readonly config: object;
}

export interface IBooleanOptions {
  true: string;
  false: string;
}

export interface IBooleanFieldModel extends IBaseFieldModel {
  readonly type: FieldType.BOOLEAN;
  readonly config: {
    readonly defaultValue: string;
    readonly options?: IBooleanOptions;
  };
}

export interface ICardsFieldModel extends IBaseFieldModel {
  readonly type: FieldType.CARDS;
  readonly config: {
    readonly multiple: boolean;
    readonly hideLabels: boolean;
    readonly options: ICardsOptionModel[];
    readonly defaultValue?: string | string[];
  };
}

export interface IChoiceFieldModel extends IBaseFieldModel {
  readonly type: FieldType.CHOICE;
  readonly config: {
    readonly multiple: boolean;
    readonly options: IFieldOptionModel[];
    readonly defaultValue?: string | string[];
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
    readonly defaultValue?: string;
  };
}

export interface IDropdownFieldModel extends IBaseFieldModel {
  readonly type: FieldType.DROPDOWN;
  readonly config: {
    readonly placeholder?: string;
    readonly multiple: boolean;
    readonly options: IFieldOptionModel[];
    readonly defaultValue?: string | string[];
  };
}


export interface IEmailFieldModel extends IBaseFieldModel {
  readonly type: FieldType.EMAIL;
  readonly config: {
    readonly placeholder?: string;
    readonly defaultValue?: string;
  };
}

export interface ILegalFieldModel extends IBaseFieldModel {
  readonly type: FieldType.LEGAL;
  readonly config: {
    readonly text?: string;
  };
}

export enum NumberFormat {
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  CURRENCY = 'CURRENCY',
}

export interface INumberFieldModel extends IBaseFieldModel {
  readonly type: FieldType.NUMBER;
  readonly config: {
    readonly placeholder?: string;
    readonly format: NumberFormat;
    readonly defaultValue?: number;
    readonly minValue?: number;
    readonly maxValue?: number;
  };
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
    readonly placeholder?: string;
    readonly hash: HashFunction;
    readonly minLength?: number;
    readonly maxLength?: number;
  };
}

export interface IPaymentCardFieldModel {
  readonly label?: string;
  readonly placeholder: string | null;
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
}

export enum ChargeType {
  ONE_OFF = 'ONE_OFF',
  SUBSCRIPTION = 'SUBSCRIPTION',
}

export interface IPaymentCardCharge {
  readonly type: ChargeType;
}

export interface IPaymentCardCredentials {
  readonly publicKey: string;
}

export interface IPaymentCardFieldsConfig {
  readonly cardNumber: IPaymentCardFieldModel;
  readonly expirationDate: IPaymentCardFieldModel;
  readonly securityCode: IPaymentCardFieldModel;
  readonly trustmarks: boolean;
}

export interface IPaymentFieldModel extends IBaseFieldModel {
  readonly type: FieldType.PAYMENT;
  readonly config: {
    readonly provider: PaymentProvider;
    readonly charge: IPaymentCardCharge;
    readonly credentials: IPaymentCardCredentials;
    readonly fields: IPaymentCardFieldsConfig;
  };
}

export interface ISocialFieldModel extends IBaseFieldModel {
  readonly type: FieldType.SOCIAL;
}

export interface ITelFieldModel extends IBaseFieldModel {
  readonly type: FieldType.TEL;
  readonly config: {
    readonly placeholder?: string;
    readonly defaultValue: string;
    readonly minLength: number;
    readonly maxLength?: number;
  };
}

export interface ITextFieldModel extends IBaseFieldModel {
  readonly type: FieldType.TEXT;
  readonly config: {
    readonly placeholder?: string;
    readonly multiline: boolean;
    readonly defaultValue?: string;
    readonly minLength: number;
    readonly maxLength?: number;
  };
}

export interface IURLFieldModel extends IBaseFieldModel {
  readonly type: FieldType.URL;
  readonly config: {
    readonly placeholder?: string;
    readonly defaultValue?: string;
  };
}

export type IFieldModel =
    IBooleanFieldModel
  | ICardsFieldModel
  | IChoiceFieldModel
  | IDateFieldModel
  | IDropdownFieldModel
  | IEmailFieldModel
  | ILegalFieldModel
  | INumberFieldModel
  | IPasswordFieldModel
  | IPaymentFieldModel
  | ISocialFieldModel
  | ITelFieldModel
  | ITextFieldModel
  | IURLFieldModel
;

export type IStringFieldValue = string | undefined;
export type IArrayFieldValue = string[];

export type ISocialFieldValue = ISocialInputValue;

export type IBooleanFieldValue = 'false' | 'true';
export type ICardsFieldValue = IStringFieldValue | IArrayFieldValue;
export type IChoiceFieldValue = IStringFieldValue | IArrayFieldValue;
export type IDateFieldValue = IStringFieldValue;
export type IDropdownFieldValue = IStringFieldValue | IArrayFieldValue;
export type IEmailFieldValue = IStringFieldValue;
export type ILegalFieldValue = IBooleanFieldValue;
export type INumberFieldValue = IStringFieldValue;
export type IPasswordFieldValue = IStringFieldValue;
export type IPaymentFieldValue = IStringFieldValue;
export type ITelFieldValue = IStringFieldValue;
export type ITextFieldValue = IStringFieldValue;
export type IURLFieldValue = IStringFieldValue;

export type IFieldValue =
    IBooleanFieldValue
  | ICardsFieldValue
  | IChoiceFieldValue
  | IDateFieldValue
  | IDropdownFieldValue
  | IEmailFieldValue
  | ILegalFieldValue
  | INumberFieldValue
  | IPasswordFieldValue
  | IPaymentFieldValue
  | ISocialFieldValue
  | ITelFieldValue
  | ITextFieldValue
  | IURLFieldValue
;

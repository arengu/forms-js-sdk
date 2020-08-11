export interface IColor {
  readonly red: number;
  readonly green: number;
  readonly blue: number;
  readonly alpha: number;
}

export interface IFormStyle {
  readonly theme?: string;
  readonly primaryColor?: string;

  readonly body?: {
    readonly fontColor?: string;
    readonly fontSize?: string;
    readonly fontFamily?: string;
  };

  readonly input?: {
    readonly fontColor?: string;
    readonly fontSize?: string;
    readonly backgroundColor?: string;
  };

  readonly label?: {
    readonly fontColor?: string;
    readonly fontSize?: string;
  };

  readonly error?: {
    readonly fontColor?: string;
  };

  readonly success?: {
    readonly fontColor?: string;
  };
}

export interface IExtendedFormStyle extends IFormStyle {
  calculated: {
    primaryFontColor?: string;
    dropdownBackgroundColor?: string;
    dropdownOptionBackgroundColor?: string;
    dropdownOptionActiveBackgroundColor?: string;
    dropdownOptionHoverBackgroundColor?: string;
    inputBorderColor?: string;
    inputBorderRadius?: string;
    buttonBorderRadius?: string;
    checkboxBorderRadius?: string;
    messageBorderRadius?: string;
    labelHoverBackgroundColor?: string;
    placeholderFontColor?: string;
    placeholderFocusFontColor?: string;
    hintFontColor?: string;
    hintFontSize?: string;
    legalFontColor?: string;
    legalFontSize?: string;
    fieldErrorFontSize?: string;
    invalidFieldBackgroundColor?: string;
    messageFailFontSize?: string;
    messageFailBackgroundColor?: string;
    messageSuccessBackgroundColor?: string;
    altInputIcons?: boolean;
    altDropdownIcons?: boolean;
  };
}

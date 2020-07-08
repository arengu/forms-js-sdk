import { IColor, IExtendedFormStyle, IFormStyle } from '../model/FormStyle';
import map from 'lodash/map';
import pickBy from 'lodash/pickBy';

export const StyleHelper = {
  HEX_COLOR_REGEX: /^#(?:([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2}))$/i,

  colorToRgba(color: IColor): string {
    return `rgba(${color.red},${color.green},${color.blue},${color.alpha})`;
  },

  colorFromHex(color: string): IColor {
    const BLACK = { red: 0, green: 0, blue: 0, alpha: 1 };

    if (!color.startsWith('#')) {
      return BLACK;
    }

    const result = StyleHelper.HEX_COLOR_REGEX.exec(color);

    if (!result) {
      return BLACK;
    }

    return {
      red: parseInt(result[1], 16),
      green: parseInt(result[2], 16),
      blue: parseInt(result[3], 16),
      alpha: 1,
    };
  },

  clamp(num: number, low: number, high: number): number {
    return Math.max(low, Math.min(num, high));
  },

  // based on bgrins/tinycolor
  isDark(color: IColor): boolean {
    // 0 <= lightness <= 255000
    return color.red * 299 + color.green * 587 + color.blue * 114 < 128000;
  },

  // based on https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
  lighten(color: IColor, percentage: number): IColor {
    const clampedPct = StyleHelper.clamp(percentage, 0, 200);

    // convert the relative percentage into a factor so we can emulate the CSS lighten() filter
    // i.e. 120% => 0.2, 80% => -0.2, 0% => -1, 100% => 0, 200% => 1, etc
    const deltaFactor = (clampedPct < 100 ? -(100 - clampedPct) : (clampedPct - 100)) / 100;

    const delta = deltaFactor < 0 ? 0 : deltaFactor * 255 ** 2;
    const base = deltaFactor < 0 ? 1 + deltaFactor : 1 - deltaFactor;

    return {
      red: Math.round((base * color.red ** 2 + delta) ** 0.5),
      green: Math.round((base * color.green ** 2 + delta) ** 0.5),
      blue: Math.round((base * color.blue ** 2 + delta) ** 0.5),
      alpha: color.alpha,
    };
  },

  // based on https://stackoverflow.com/a/60176719
  saturate(color: IColor, percentage: number): IColor {
    const factor = percentage / 100;

    // magic from https://www.w3.org/TR/filter-effects-1/#feColorMatrixElement
    const red =
      (0.213 + 0.787 * factor) * color.red +
      (0.715 - 0.715 * factor) * color.green +
      (0.072 - 0.072 * factor) * color.blue;

    const green =
      (0.213 - 0.213 * factor) * color.red +
      (0.715 + 0.285 * factor) * color.green +
      (0.072 - 0.072 * factor) * color.blue;

    const blue =
      (0.213 - 0.213 * factor) * color.red +
      (0.715 - 0.715 * factor) * color.green +
      (0.072 + 0.928 * factor) * color.blue;

    return {
      red: StyleHelper.clamp(red, 0, 255),
      green: StyleHelper.clamp(green, 0, 255),
      blue: StyleHelper.clamp(blue, 0, 255),
      alpha: color.alpha,
    };
  },

  setOpacity(color: IColor, newOpacity: number): IColor {
    return { ...color, alpha: newOpacity };
  },

  buildCss(formId: string, vars: Record<string, string | undefined>): string {
    const cleanVars = pickBy(vars, (value) => !!value);
    const pairedVars = map(cleanVars, (value, name) => `${name}: ${value};`);

    return `.af-form-${formId} {\n  ${pairedVars.join('\n  ')}\n}`;
  },

  extendStyle(style: IFormStyle): IExtendedFormStyle {
    const newStyle: IExtendedFormStyle = { ...style, calculated: {} };

    if (style.primaryColor) {
      const parsedPrimaryColor = StyleHelper.colorFromHex(style.primaryColor);

      newStyle.calculated = {
        ...newStyle.calculated,
        primaryFontColor: StyleHelper.isDark(parsedPrimaryColor) ? '#fff' : '#000',
        dropdownOptionBackgroundColor: StyleHelper.colorToRgba(parsedPrimaryColor),
        dropdownOptionActiveBackgroundColor: StyleHelper.colorToRgba(StyleHelper.lighten(parsedPrimaryColor, 50)),
      };
    }

    let
      inputBorderRadius,
      buttonBorderRadius,
      checkboxBorderRadius,
      messageBorderRadius;

    switch (style.theme) {
      case 'SHARP':
        inputBorderRadius =
          buttonBorderRadius =
          checkboxBorderRadius =
          messageBorderRadius = '0';
        break;

      case 'ROUND':
        inputBorderRadius =
          buttonBorderRadius =
          messageBorderRadius = '12px';

        // avoid looking like a radio button!
        checkboxBorderRadius = '3px';
        break;

      default:
        inputBorderRadius =
          buttonBorderRadius =
          checkboxBorderRadius =
          messageBorderRadius = '3px';
    }

    newStyle.calculated = {
      ...newStyle.calculated,
      inputBorderRadius,
      buttonBorderRadius,
      checkboxBorderRadius,
      messageBorderRadius,
    }

    if (style.input?.fontColor) {
      const parsedInputFontColor = StyleHelper.colorFromHex(style.input?.fontColor);

      newStyle.calculated = {
        ...newStyle.calculated,

        inputBorderColor: StyleHelper.colorToRgba(StyleHelper.setOpacity(parsedInputFontColor, 0.4)),

        placeholderFontColor: StyleHelper.colorToRgba(StyleHelper.setOpacity(parsedInputFontColor, 0.6)),
        placeholderFocusFontColor: StyleHelper.colorToRgba(StyleHelper.setOpacity(parsedInputFontColor, 0.8)),
        dropdownOptionHoverBackgroundColor: StyleHelper.colorToRgba(StyleHelper.setOpacity(parsedInputFontColor, 0.3)),
      };
    }

    if (style.input?.backgroundColor) {
      const parsedInputBackgroundColor = StyleHelper.colorFromHex(style.input?.backgroundColor);

      newStyle.calculated = {
        ...newStyle.calculated,
        dropdownIconColor: StyleHelper.isDark(parsedInputBackgroundColor) ? '#fff' : '#323d47',
        dropdownBackgroundColor: StyleHelper.colorToRgba(StyleHelper.setOpacity(parsedInputBackgroundColor, 1)),
      };
    }

    if (style.body?.fontSize) {
      const smallerBodyFontSize = `calc(${style.body?.fontSize} * .8)`;

      newStyle.calculated = {
        ...newStyle.calculated,
        hintFontSize: smallerBodyFontSize,
        legalFontSize: smallerBodyFontSize,
        fieldErrorFontSize: smallerBodyFontSize,
        messageFailFontSize: smallerBodyFontSize,
      };
    }

    if (style.body?.fontColor) {
      const parsedBodyFontColor = StyleHelper.colorFromHex(style.body?.fontColor);

      newStyle.calculated = {
        ...newStyle.calculated,
        legalFontColor: StyleHelper.colorToRgba(StyleHelper.saturate(StyleHelper.lighten(parsedBodyFontColor, 120), 80)),
        labelHoverBackgroundColor: StyleHelper.colorToRgba(StyleHelper.setOpacity(parsedBodyFontColor, 0.2)),
      };
    }

    if (style.label?.fontColor) {
      const parsedLabelFontColor = StyleHelper.colorFromHex(style.label?.fontColor);

      newStyle.calculated = {
        ...newStyle.calculated,
        hintFontColor: StyleHelper.colorToRgba(StyleHelper.saturate(StyleHelper.lighten(parsedLabelFontColor, 40), -40)),
      };
    }

    if (style.error?.fontColor) {
      const failBackgroundColor = StyleHelper.colorToRgba(
        StyleHelper.saturate(StyleHelper.lighten(StyleHelper.colorFromHex(style.error?.fontColor), 160), 80)
      );

      newStyle.calculated = {
        ...newStyle.calculated,
        messageFailBackgroundColor: failBackgroundColor,
        invalidFieldBackgroundColor: failBackgroundColor,
      };
    }

    if (style.success?.fontColor) {
      const parsedSuccessFontColor = StyleHelper.colorFromHex(style.success?.fontColor);

      newStyle.calculated = {
        ...newStyle.calculated,
        messageSuccessBackgroundColor: StyleHelper.colorToRgba(StyleHelper.lighten(parsedSuccessFontColor, 140)),
      };
    }

    // temporary hack to keep supporting legacy --input-border variable as
    // well as the new --input-border-width and --input-border-color
    const doc = document.documentElement;
    const compStyle = getComputedStyle(doc);
    const inputBorder = compStyle.getPropertyValue('--input-border');

    if (compStyle && inputBorder) {
      const input = document.createElement('input');

      input.style.border = 'var(--input-border)';
      input.style.display = 'none';

      document.body.appendChild(input);

      const compStyle = getComputedStyle(input);

      newStyle.calculated = {
        ...newStyle.calculated,
        inputBorderColor: compStyle.borderColor || undefined,
      };

      if (compStyle.borderColor) {
        doc.style.setProperty('--input-border-color', compStyle.borderColor);
      }

      if (compStyle.borderWidth) {
        doc.style.setProperty('--input-border-width', compStyle.borderWidth);
      }
    }

    return newStyle;
  }
}

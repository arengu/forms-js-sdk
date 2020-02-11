import 'whatwg-fetch';
import 'custom-event-polyfill';
import isNil from 'lodash/isNil';

import { AutoMagic, SDK } from './sdk';

if (isNil(window.Promise)) {
  window.Promise = Promise;
}

declare const global: { ArenguForms?: SDK };

if (global.ArenguForms) {
  console.warn('Arengu Forms SDK has been loaded several times');
} else {
  global.ArenguForms = SDK;
  AutoMagic.init();
}

export default SDK;

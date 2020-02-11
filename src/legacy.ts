import 'whatwg-fetch';
import 'custom-event-polyfill';

import isNil from 'lodash/isNil';

import index from './index';

if (isNil(window.Promise)) {
  window.Promise = Promise;
}

export default index;

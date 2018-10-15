const SDK = require('./sdk');

const instance = SDK.create();

if (global.ArenguForms) {
  console.warn('Arengu Forms SDK has been loaded several times');
} else {
  global.ArenguForms = instance; // async
  instance.init();
}

module.exports = instance; // sync

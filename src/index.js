const SDK = require('./sdk');

const instance = SDK.create();

global.ArenguForms = instance; // async

instance.init();

module.exports = instance; // sync

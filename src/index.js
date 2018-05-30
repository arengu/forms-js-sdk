const SDK = require('./SDK');
const htmlUtils = require('./view/html-utils');

module.exports = SDK.create();

htmlUtils.triggerEvent('rf-init');

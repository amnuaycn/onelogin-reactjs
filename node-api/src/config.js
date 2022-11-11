"use strict";
var moment = require('moment');
var env = process.env;

exports.port = env.PORT_SERVER || 6091;
exports.domain_sso = env.DOMAIN_SSO || 'https://egatdev-dev.onelogin.com/oidc/2';

exports.now = moment();
exports.now_log = moment().local().format('YYYY-MM-DD HH:mm:ss');

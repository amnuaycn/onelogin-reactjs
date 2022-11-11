"use strict";
var express = require('express');
var path = require('path');
var fs = require('fs');
var config_1 = require('../../config');
var router = express.Router();
var files = fs.readdirSync(__dirname).filter(function (file) {
    return (file.indexOf('.') !== 0) && (file.indexOf('index') !== 0);
});
files.forEach(function (file) {
    var name = path.basename(file, '.js');
    console.log(config_1.now_log + " | setup routes -> " + name);
    router.use('/' + name, require('./' + file));
});
module.exports = router;
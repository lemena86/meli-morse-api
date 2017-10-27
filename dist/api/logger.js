'use strict';

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bunyan = require('bunyan');

var _bunyan2 = _interopRequireDefault(_bunyan);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = {};
if (!logger.log) {
    var log = _bunyan2.default.createLogger({
        name: 'meli-morse-app',
        streams: [{
            level: 'error',
            path: _path2.default.join(__dirname, '/logs/error.log')
        }]
    });
    logger.log = log;
}
module.exports = logger;
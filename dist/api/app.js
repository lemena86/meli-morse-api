'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _logger = require('./logger');

var _morse = require('./routes/morse.routes');

var _morse2 = _interopRequireDefault(_morse);

var _clientErrors = require('./errors/client-errors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
app.use((0, _cors2.default)());

//set default content type application/json
app.use(function (req, res, next) {
    req.headers['content-type'] = 'application/json';
    next();
});

// parse application/json
app.use(_bodyParser2.default.json());

app.use('/translate', _morse2.default);

// catch 404
app.use(function (req, res) {
    var err = new _clientErrors.NotFoundError();
    _logger.log.error(JSON.stringify(err));
    res.status(404).json(err);
});

exports.default = app;
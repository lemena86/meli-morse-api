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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    _logger.log.error(JSON.stringify(err));
    // error message
    res.status(err.status || 500).json(err);
});

exports.default = app;
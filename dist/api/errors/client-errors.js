'use strict';

var _es6Error = require('es6-error');

var _es6Error2 = _interopRequireDefault(_es6Error);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BadRequestError = function (_ExtendableError) {
    _inherits(BadRequestError, _ExtendableError);

    function BadRequestError() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Bad request error';
        var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'bad_request_error';

        _classCallCheck(this, BadRequestError);

        var _this = _possibleConstructorReturn(this, (BadRequestError.__proto__ || Object.getPrototypeOf(BadRequestError)).call(this, message));

        _this.type = type;
        _this.message = message;
        _this.statusCode = 400;
        _this.error = error;
        return _this;
    }

    return BadRequestError;
}(_es6Error2.default);

var MalformedMorseStringError = function (_BadRequestError) {
    _inherits(MalformedMorseStringError, _BadRequestError);

    function MalformedMorseStringError() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Malformed Morse String';
        var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'malformed_morse_string';

        _classCallCheck(this, MalformedMorseStringError);

        var _this2 = _possibleConstructorReturn(this, (MalformedMorseStringError.__proto__ || Object.getPrototypeOf(MalformedMorseStringError)).call(this, message));

        _this2.type = type;
        _this2.message = message;
        _this2.error = error;
        return _this2;
    }

    return MalformedMorseStringError;
}(BadRequestError);

var MalformedBitsStringError = function (_BadRequestError2) {
    _inherits(MalformedBitsStringError, _BadRequestError2);

    function MalformedBitsStringError() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Malformed Bits String';
        var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'malformed_bits_string';

        _classCallCheck(this, MalformedBitsStringError);

        var _this3 = _possibleConstructorReturn(this, (MalformedBitsStringError.__proto__ || Object.getPrototypeOf(MalformedBitsStringError)).call(this, message));

        _this3.type = type;
        _this3.message = message;
        _this3.error = error;
        return _this3;
    }

    return MalformedBitsStringError;
}(BadRequestError);

var MalformedAlphaNumericStringError = function (_BadRequestError3) {
    _inherits(MalformedAlphaNumericStringError, _BadRequestError3);

    function MalformedAlphaNumericStringError() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Malformed Alpha Numeric String';
        var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'malformed_alphanumeric_string';

        _classCallCheck(this, MalformedAlphaNumericStringError);

        var _this4 = _possibleConstructorReturn(this, (MalformedAlphaNumericStringError.__proto__ || Object.getPrototypeOf(MalformedAlphaNumericStringError)).call(this, message));

        _this4.type = type;
        _this4.message = message;
        _this4.error = error;
        return _this4;
    }

    return MalformedAlphaNumericStringError;
}(BadRequestError);

var MorseToBitsValidationError = function (_BadRequestError4) {
    _inherits(MorseToBitsValidationError, _BadRequestError4);

    function MorseToBitsValidationError() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Morse2Bits Validation Error';
        var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'morse2bits_validation_error';

        _classCallCheck(this, MorseToBitsValidationError);

        var _this5 = _possibleConstructorReturn(this, (MorseToBitsValidationError.__proto__ || Object.getPrototypeOf(MorseToBitsValidationError)).call(this, message));

        _this5.type = type;
        _this5.message = message;
        _this5.error = error;
        return _this5;
    }

    return MorseToBitsValidationError;
}(BadRequestError);

var NotFoundError = function (_ExtendableError2) {
    _inherits(NotFoundError, _ExtendableError2);

    function NotFoundError() {
        var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Not found';
        var error = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'not_found_error';

        _classCallCheck(this, NotFoundError);

        var _this6 = _possibleConstructorReturn(this, (NotFoundError.__proto__ || Object.getPrototypeOf(NotFoundError)).call(this, message));

        _this6.type = type;
        _this6.message = message;
        _this6.statusCode = 404;
        _this6.error = error;
        return _this6;
    }

    return NotFoundError;
}(_es6Error2.default);

module.exports = {
    NotFoundError: NotFoundError,
    MalformedMorseStringError: MalformedMorseStringError,
    MalformedBitsStringError: MalformedBitsStringError,
    MalformedAlphaNumericStringError: MalformedAlphaNumericStringError,
    MorseToBitsValidationError: MorseToBitsValidationError
};
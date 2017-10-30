import ExtendableError from 'es6-error';

class BadRequestError extends ExtendableError {
    constructor(message = 'Bad request error', error = {}, type = 'bad_request_error') {
        super(message);
        this.type = type;
        this.message = message;
        this.statusCode = 400;
        this.error = error;
    }
}

class MalformedMorseStringError extends BadRequestError {
    constructor(message = 'Malformed Morse String', error = {}, type = 'malformed_morse_string') {
        super(message);
        this.type = type;
        this.message = message;
        this.error = error;
    }
}

class MalformedBitsStringError extends BadRequestError {
    constructor(message = 'Malformed Bits String', error = {}, type = 'malformed_bits_string') {
        super(message);
        this.type = type;
        this.message = message;
        this.error = error;
    }
}

class MalformedAlphaNumericStringError extends BadRequestError {
    constructor(message = 'Malformed Alpha Numeric String', error = {}, type = 'malformed_alphanumeric_string') {
        super(message);
        this.type = type;
        this.message = message;
        this.error = error;
    }
}

class MorseToBitsValidationError extends BadRequestError {
    constructor(message = 'Morse2Bits Validation Error', error = {}, type = 'morse2bits_validation_error') {
        super(message);
        this.type = type;
        this.message = message;
        this.error = error;
    }
}

class NotFoundError extends ExtendableError {
    constructor(message = 'Not found', error = {}, type = 'not_found_error') {
        super(message);
        this.type = type;
        this.message = message;
        this.statusCode = 404;
        this.error = error;
    }
}

module.exports = {
    NotFoundError,
    MalformedMorseStringError,
    MalformedBitsStringError,
    MalformedAlphaNumericStringError,
    MorseToBitsValidationError
};
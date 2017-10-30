'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _check = require('express-validator/check');

var _morse = require('../controllers/morse.controller');

var _morse2 = _interopRequireDefault(_morse);

var _logger = require('../logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = (0, _express.Router)();

//validate param text
router.use((0, _check.body)('text').exists().withMessage('Param text is not present in the body. Example is -d \'{"text": "HOLA MELI"}\''), function (req, res, next) {
    var errors = (0, _check.validationResult)(req);
    if (!errors.isEmpty()) {
        _logger.log.error(JSON.stringify(errors.mapped()));
        res.status(422).json({ errors: errors.mapped() });
    } else {
        next();
    }
});

//curl -X POST "http://localhost:3000/translate/2text" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'
/* translate morse to text */
router.post('/2text', function (req, res) {
    return _morse2.default.translate2Human(req, res);
});

//curl -X POST "http://localhost:3000/translate/2morse" -d '{"text": "HOLA MELI"}'
/* translate text to morse */
router.post('/2morse', function (req, res) {
    return _morse2.default.encode2Morse(req, res);
});

//curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'
//values minOnes, maxOnes, minZeros, mediumZeros and maxZeros can be passed in the body
/* translate morse to bits */
router.post('/2bits', function (req, res) {
    return _morse2.default.encodeMorse2Bits(req, res);
});

//curl -X POST "http://localhost:3000/translate/bits2morse" -d '{"text": "101010100110110110010110101001011000110110010010110101001010"}'
/* translate bits to morse */
router.post('/bits2morse', function (req, res) {
    return _morse2.default.decodeBits2Morse(req, res);
});

exports.default = router;
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _check = require('express-validator/check');

var _morse = require('../services/morse.service');

var _morse2 = _interopRequireDefault(_morse);

var _logger = require('../logger');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MorseController = {

    translate2Human: function translate2Human(req, res) {
        //translate
        try {
            var morse = req.body.text;
            var human = _morse2.default.translate2Human(morse);
            res.status(200).json({ code: 200, response: human });
        } catch (err) {
            _logger.log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    },

    encode2Morse: function encode2Morse(req, res) {
        //translate
        try {
            var human = req.body.text;
            var morse = _morse2.default.encode2Morse(human);
            res.status(200).json({ code: 200, response: morse });
        } catch (err) {
            _logger.log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    },

    encodeMorse2Bits: function encodeMorse2Bits(req, res) {
        //translate
        try {
            var morse = req.body.text;
            var minOnes = req.body.minOnes || 1;
            var maxOnes = req.body.maxOnes || 2;
            var minZeros = req.body.minZeros || 1;
            var mediumZeros = req.body.mediumZeros || 1;
            var maxZeros = req.body.maxZeros || 2;
            var bits = _morse2.default.encodeMorse2Bits(morse, minOnes, maxOnes, minZeros, mediumZeros, maxZeros);
            res.status(200).json({ code: 200, response: bits });
        } catch (err) {
            _logger.log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    },

    decodeBits2Morse: function decodeBits2Morse(req, res) {
        //translate
        try {
            var bits = req.body.text;
            var morse = _morse2.default.decodeBits2Morse(bits);
            res.status(200).json({ code: 200, response: morse });
        } catch (err) {
            _logger.log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    }

};
exports.default = MorseController;
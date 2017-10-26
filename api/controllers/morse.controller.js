import {validationResult} from 'express-validator/check';
import MorseService from '../services/morse.service'

const MorseController = {

    translate2Human: (req, res) => {
        //verify param body
        try {
            validationResult(req).throw();
        } catch (err) {
            res.status(400).json({code: 400, error: err.mapped()});
        }
        //verify and translate
        try {
            const morse = req.body.text;
            const human = MorseService.translate2Human(morse);
            res.send({code: 200, response: human});
        } catch (err) {
            res.status(400).json({code: 400, error: err});
        }
    },

    encode2Morse: (req, res) => {
        //verify param body
        try {
            validationResult(req).throw();
        } catch (err) {
            res.status(400).json({code: 400, error: err.mapped()});
        }
        //verify and translate
        try {
            const human = req.body.text;
            const morse = MorseService.encode2Morse(human);
            res.send({code: 200, response: morse});
        } catch (err) {
            res.status(400).json({code: 400, error: err});
        }
    },

    encodeMorse2Bits: (req, res) => {
        //verify param body
        try {
            validationResult(req).throw();
        } catch (err) {
            res.status(400).json({code: 400, error: err.mapped()});
        }
        //verify and translate
        try {
            const morse = req.body.text;
            const minOnes = req.body.minOnes || 1;
            const maxOnes = req.body.maxOnes || 2;
            const minZeros = req.body.minZeros || 1;
            const mediumZeros = req.body.mediumZeros || 1;
            const maxZeros = req.body.maxZeros || 2;
            const bits = MorseService.encodeMorse2Bits(morse, minOnes, maxOnes, minZeros, mediumZeros, maxZeros);
            res.send({code: 200, response: bits});
        } catch (err) {
            res.status(400).json({code: 400, error: err});
        }
    },

    decodeBits2Morse: (req, res) => {
        //verify param body
        try {
            validationResult(req).throw();
        } catch (err) {
            res.status(400).json({code: 400, error: err.mapped()});
        }
        //verify and translate
        try {
            const bits = req.body.text;
            const morse = MorseService.decodeBits2Morse(bits);
            res.send({code: 200, response: morse});
        } catch (err) {
            res.status(400).json({code: 400, error: err});
        }
    }
}
export default MorseController;
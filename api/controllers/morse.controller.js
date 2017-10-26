import {validationResult} from 'express-validator/check';
import MorseService from '../services/morse.service'
import {log} from '../logger'

const MorseController = {

    translate2Human: (req, res) => {
        //verify param body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            return res.status(422).json({errors: errors.mapped()});
        }
        //verify and translate
        try {
            const morse = req.body.text;
            const human = MorseService.translate2Human(morse);
            res.status(200).json({code: 200, response: human});
        } catch (err) {
            log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    },

    encode2Morse: (req, res) => {
        //verify param body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            return res.status(422).json({errors: errors.mapped()});
        }
        //verify and translate
        try {
            const human = req.body.text;
            const morse = MorseService.encode2Morse(human);
            res.status(200).json({code: 200, response: morse});
        } catch (err) {
            log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    },

    encodeMorse2Bits: (req, res) => {
        //verify param body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            return res.status(422).json({errors: errors.mapped()});
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
            res.status(200).json({code: 200, response: bits});
        } catch (err) {
            log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    },

    decodeBits2Morse: (req, res) => {
        //verify param body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            return res.status(422).json({errors: errors.mapped()});
        }
        //verify and translate
        try {
            const bits = req.body.text;
            const morse = MorseService.decodeBits2Morse(bits);
            res.status(200).json({code: 200, response: morse});
        } catch (err) {
            log.error(JSON.stringify(err));
            res.status(400).json(err);
        }
    }

}
export default MorseController;
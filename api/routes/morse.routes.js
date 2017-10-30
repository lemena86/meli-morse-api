import {Router} from 'express';
import {body, validationResult} from 'express-validator/check';
import MorseController from '../controllers/morse.controller'
import {log} from '../logger'

let router = Router();

//curl -X POST "http://localhost:3000/translate/2text" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'
/* translate morse to text */
router.post('/2text',
    body('text')
        .exists()
        .withMessage(`Param text is not present. Example is curl -X POST "http://localhost:3000/translate/2text" -d '{"text": "...."}'`),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            res.status(422).json({errors: errors.mapped()});
        } else {
            MorseController.translate2Human(req, res);
        }
    });

//curl -X POST "http://localhost:3000/translate/2morse" -d '{"text": "HOLA MELI"}'
/* translate text to morse */
router.post('/2morse',
    body('text')
        .exists()
        .withMessage(`Param text is not present. Example is curl -X POST "http://server:port/translate/2morse" -d '{"text": "HOLA MELI"}'`),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            res.status(422).json({errors: errors.mapped()});
        } else {
            MorseController.encode2Morse(req, res);
        }
    });

//curl -X POST "http://localhost:3000/translate/2bits" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'
//values minOnes, maxOnes, minZeros, mediumZeros and maxZeros can be passed in the body
/* translate morse to bits */
router.post('/2bits',
    body('text')
        .exists()
        .withMessage(`Param text is not present. Example is curl -X POST "http://server:port/translate/2bits" -d '{"text": ".... --- .-.. .-  -- . .-.. .."}'`),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            res.status(422).json({errors: errors.mapped()});
        } else {
            MorseController.encodeMorse2Bits(req, res);
        }
    });

//curl -X POST "http://localhost:3000/translate/bits2morse" -d '{"text": "101010100110110110010110101001011000110110010010110101001010"}'
/* translate bits to morse */
router.post('/bits2morse',
    body('text')
        .exists()
        .withMessage(`Param text is not present. Example is curl -X POST "http://server:port/translate/bits2morse" -d '{"text": "10101101"}'`),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log.error(JSON.stringify(errors.mapped()));
            res.status(422).json({errors: errors.mapped()});
        } else {
            MorseController.decodeBits2Morse(req, res);
        }
    });

export default router;
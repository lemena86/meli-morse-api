import {Router} from 'express';
import {body, validationResult} from 'express-validator/check';
import MorseService from '../services/morse.services'

let router = Router();

//curl -X POST "http://localhost:3000/translate/2text" -d "{text: '.... --- .-.. .- -- . .-.. ..'}"
/* translate morse to text */
router.post('/2text', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.text);
    //continue
    res.json("ok 2text");
});

/* translate text to morse */
router.post('/2morse', body('text').exists(), (req, res) => {
    try {
        validationResult(req).throw();
        //continue
        res.json("ok 2morse");
    } catch (err) {
        res.status(400).json(err.mapped());
    }
});

export default router;

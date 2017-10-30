import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {log} from './logger';
import morse from './routes/morse.routes'
import {
    NotFoundError
} from './errors/client-errors'

let app = express();
app.use(cors());

//set default content type application/json
app.use(function (req, res, next) {
    req.headers['content-type'] = 'application/json';
    next();
});

// parse application/json
app.use(bodyParser.json());

app.use('/translate', morse);


// catch 404
app.use((req, res,) => {
    let err = new NotFoundError();
    log.error(JSON.stringify(err));
    res.status(404).json(err);
});

export default app;
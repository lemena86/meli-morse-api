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
app.use((req, res, next) => {
    let err = new NotFoundError();
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    log.error(JSON.stringify(err));
    // error message
    res.status(err.status || err.statusCode || 500).json(err);
});
export default app;
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {log} from './logger';
import morse from './routes/morse.routes'

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


// catch 404 and forward to error handler
app.use((req, res, next) => {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    log.error(JSON.stringify(err));
    // error message
    res.status(err.status || 500).json(err);
});

export default app;
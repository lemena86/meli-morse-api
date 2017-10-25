import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morse from './routes/morse.routes'

let app = express();
app.use(cors());
app.use(function (req, res, next) {
    console.log(req.header('content-type'));
    //req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))

// parse application/json
app.use(bodyParser.json())

app.use('/translate', morse);


// catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // error message
    res.status(err.status || 500).json(err);
});

export default app;
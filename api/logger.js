import path from 'path'
import bunyan from 'bunyan';

const logger = {};
if (!logger.log) {
    const log = bunyan.createLogger({
        name: 'meli-morse-app',
        streams: [
            {
                level: 'error',
                path: path.join(__dirname, '/logs/error.log')
            }
        ]
    });
    logger.log = log;
}
module.exports = logger;
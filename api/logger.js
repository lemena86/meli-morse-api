import path from 'path'
import bunyan from 'bunyan';

const logger = {};
if (!logger.log) {
    const log = bunyan.createLogger({
        name: 'meli-morse-app',
        streams: [
            {
                level: 'error',
                path: './logs/error.log'
            }
        ]
    });
    logger.log = log;
}
module.exports = logger;
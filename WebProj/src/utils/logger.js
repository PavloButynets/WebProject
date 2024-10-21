const pino = require("pino");
const transport = pino.transport({
    targets: [
        {
            target: 'pino-pretty',
            options: {
                colorize: true, 
                translateTime: 'SYS:standard', 
                ignore: 'pid,hostname' 
            }
        }
    ]
});

const logger = pino(transport);

module.exports.logger = logger;

// const { createLogger } = require('winston');

// const logFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} [${level}]  ${message}`;
// });

// const logger = createLogger({
//   format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
//   //   defaultMeta: { service: 'user-service' },
//   transports: [new transports.Console()]
// });

// module.exports = logger;

const buildDevLogger = require('./dev-logger');
const buildProdLogger = require('./prod-logger');

let logger = null;
if (process.env.NODE_ENV === 'development') {
  logger = buildDevLogger();
} else {
  logger = buildProdLogger();
}

module.exports = logger;

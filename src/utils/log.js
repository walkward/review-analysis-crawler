const bunyan = require('bunyan');

const level = process.env.BUNYAN_LOG_LEVEL || 'info';

const log = bunyan.createLogger({
  level,
  name: 'scraper',
  serializers: bunyan.stdSerializers,
});

module.exports = log;

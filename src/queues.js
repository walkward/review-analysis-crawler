const Queue = require('bull');

const log = require('./utils/log');

const handleQueueFailure = (job, error) => log.error(`[${job.queue.name}JobFailed]`, error);
const handleQueueError = (error, queueName) => log.error(`[${queueName}JobError]`, error);
const handleQueueComplete = (job) => log.debug(`[${job.queue.name}JobComplete]`, job.toJSON());

async function setupQueue(queueName, callback) {
  const options = {
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
    },
  };

  const queue = new Queue(queueName, options);

  queue.process(callback);
  queue.on('completed', handleQueueComplete);
  queue.on('error', (error) => handleQueueError(error, queueName));
  queue.on('failed', handleQueueFailure);

  await queue.isReady();

  // Tells the queue remove jobs of a specific type created outside of a grace period
  await queue.clean(0);

  return queue;
}

module.exports = {
  setupQueue,
  handleQueueFailure,
  handleQueueError,
  handleQueueComplete,
};

/**
 * Wait Until Drained: waits until the parent and child queues jobs have drained
 * @see {@link https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#job}
 * @param {Queue} parentQueue
 * @param {Queue} childQueue
 */
module.exports = function waitUtilDrained(parentQueue, childQueue) {
  return new Promise((resolve) => {
    parentQueue.on('drained', async () => {
      childQueue.on('drained', async () => resolve());
    });
  });
};

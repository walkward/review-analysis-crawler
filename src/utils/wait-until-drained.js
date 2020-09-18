module.exports = function waitUtilDrained(parentQueue, childQueue) {
  return new Promise((resolve) => {
    parentQueue.on('drained', async () => {
      childQueue.on('drained', async () => resolve());
    });
  });
};

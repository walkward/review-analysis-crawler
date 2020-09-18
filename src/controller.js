const queues = require('./queues');
const crawler = require('./crawler');
const analysis = require('./analysis');
const waitUntilDrained = require('./utils/wait-until-drained');
const sortFakeReviews = require('./utils/sort-fake-reviews');

module.exports = async function controller(startJobData) {
  const crawlerQueue = await queues.setupQueue('Crawler', crawler);
  const analysisQueue = await queues.setupQueue('Analysis', analysis);

  crawlerQueue.on('completed', (job, result) => {
    if (result.nextPageUrl) {
      crawlerQueue.add({
        url: result.nextPageUrl,
        page: job.data.page + 1,
        maxPages: job.data.maxPages,
      });
    }

    for (const review of result.reviews) {
      analysisQueue.add({ review });
    }
  });

  await crawlerQueue.add(startJobData);
  await waitUntilDrained(crawlerQueue, analysisQueue);

  const jobs = await analysisQueue.getCompleted();
  const sortedReviews = sortFakeReviews(jobs);
  const topFakeReviews = sortedReviews.slice(0, 3).map((o) => o.returnvalue);
  return topFakeReviews;
};

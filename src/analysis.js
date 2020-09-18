const Sentiment = require('sentiment');

const log = require('./utils/log');

/**
 * Analysis: performs analysis on the provided review
 * @see {@link https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#job}
 * @param {Job} job queue job provided by queue
 */
module.exports = function analysis(job) {
  log.debug(job.toJSON(), '[AnalysisJobStarted]');

  try {
    const sentiment = new Sentiment();
    const text = [job.data.review.title, job.data.review.body].join(' ')
    const reviewSentiment = sentiment.analyze(text);
    return Promise.resolve({
      ...job.data,
      analysis: {
        score: reviewSentiment.comparative,
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

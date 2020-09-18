const Sentiment = require('sentiment');

const log = require('./utils/log');

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

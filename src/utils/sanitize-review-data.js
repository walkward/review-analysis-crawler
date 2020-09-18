const { oneLine } = require('common-tags');

/**
 * Sanitize Review Data: sanitizes the data provided in
 * @param {Object} data details extracted from each review
 * @param {String} data.title review title
 * @param {String} data.body review body content
 * @param {String} data.date review date
 * @param {String} data.user review user name
 */
module.exports = function sanitizeReviewData(data) {
  const date = new Date(data.date);
  return {
    title: oneLine(data.title),
    body: oneLine(data.body),
    date: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toJSON(),
    user: data.user.replace(/^-\s/, ''),
  };
};

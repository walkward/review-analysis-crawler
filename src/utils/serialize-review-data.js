const { oneLine } = require('common-tags');

module.exports = function serializeReviewData(data) {
  const date = new Date(data.date);
  return {
    title: oneLine(data.title),
    body: oneLine(data.body),
    date: new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())).toJSON(),
    user: data.user.replace(/^-\s/, ''),
  };
};

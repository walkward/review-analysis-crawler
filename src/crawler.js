const osmosis = require('osmosis');

const serializeReviewData = require('./utils/serialize-review-data');
const joinHrefOrigin = require('./utils/join-href-origin');
const log = require('./utils/log');

module.exports = function crawler(job) {
  return new Promise((resolve, reject) => {
    log.debug('[CrawlerJobStarted]', job.toJSON());

    const result = {
      reviews: [],
      nextPageUrl: null,
    };

    osmosis.config('tries', 3);

    osmosis
      .get(job.data.url)
      .then((context, data, next) => {
        const nextPage = job.data.page + 1;
        const nextPageLink = context.querySelector(`.page_num_${nextPage} a`);
        const hasNextPage = nextPage <= job.data.maxPages && nextPageLink;
        if (hasNextPage) {
          const { href } = nextPageLink;
          const { origin } = context.location;
          result.nextPageUrl = joinHrefOrigin(href, origin);
        }

        next(context, data);
      })
      .find('.review-entry')
      .set({
        title: '.review-wrapper h3',
        body: '.review-content',
        date: '.review-date div:first-child',
        user: '.review-wrapper h3 + span',
      })
      .data((data) => {
        const review = serializeReviewData(data);
        result.reviews.push(review);
      })
      .log((msg) => log.debug('[CrawlerOsmosisLog] %s', msg))
      .error((error) => log.error(error))
      .debug((msg) => log.debug('[CrawlerOsmosisDebug] %s', msg))
      .done(() => {
        if (result.reviews.length === 0) {
          reject(new Error(`[CrawlerOsmosisDebug] failed to get reviews (url: ${job.data.url})`));
        } else {
          resolve(result);
        }
      });
  });
};

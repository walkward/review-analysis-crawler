const controller = require('./controller');
const log = require('./utils/log');

/**
 * Run: invokes the controller which begins crawling process
 */
const run = async function run() {
  try {
    const topReviews = await controller({
      url:
        'https://www.dealerrater.com/dealer/McKaig-Chevrolet-Buick-A-Dealer-For-The-People-dealer-reviews-23685/page1',
      page: 1,
      maxPages: 5,
    });

    log.info(topReviews);

    process.exit();
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  run();
}

module.exports = run;

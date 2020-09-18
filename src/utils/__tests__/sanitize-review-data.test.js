const sanitizeReviewData = require('../sanitize-review-data');

it('should return serialized review data', () => {
  const review = {
    title: '"Always fast and helpful very professional I recommend..."',
    body: 'Always fast \n and helpful very \n professional.',
    date: 'September 11, 2020',
    user: 'Richard Irvine',
  };
  expect(sanitizeReviewData(review)).toMatchObject({
    title: '"Always fast and helpful very professional I recommend..."',
    body: 'Always fast  and helpful very  professional.',
    date: '2020-09-11T00:00:00.000Z',
    user: 'Richard Irvine',
  });
});

const sortFakeReviews = require('../sort-fake-reviews');

it('should sort jobs by review score', () => {
  const jobs = [
    { returnvalue: { analysis: { score: 1 } } },
    { returnvalue: { analysis: { score: 3 } } },
    { returnvalue: { analysis: { score: 2 } } },
  ];
  const result = sortFakeReviews(jobs);
  expect(result[0]).toHaveProperty('returnvalue.analysis.score', 3);
  expect(result[2]).toHaveProperty('returnvalue.analysis.score', 1);
});

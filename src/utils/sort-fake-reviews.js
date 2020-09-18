/**
 * Sort Fake Reviews: sorts reviews in descending order
 * @see {@link https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#job}
 * @param {Job[]} jobs list of jobs with review data
 */
module.exports = (jobs) => jobs.sort((a, b) => {
  return b.returnvalue.analysis.score - a.returnvalue.analysis.score;
});

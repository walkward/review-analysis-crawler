module.exports = (jobs) => jobs.sort((a, b) => {
  return b.returnvalue.analysis.score - a.returnvalue.analysis.score;
});

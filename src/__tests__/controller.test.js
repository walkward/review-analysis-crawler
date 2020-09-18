/* eslint-disable global-require */

const mockSortFakeReviews = jest.fn();
const mockCrawlerQueue = { on: jest.fn(), add: jest.fn(), getCompleted: jest.fn() };
const mockAnalysisQueue = { on: jest.fn(), add: jest.fn(), getCompleted: jest.fn() };
const mockQueues = jest.fn();
jest.mock('../crawler');
jest.mock('../analysis');
jest.mock('../utils/wait-until-drained');
jest.mock('../utils/sort-fake-reviews', () => mockSortFakeReviews);
jest.mock('../queues', () => ({ setupQueue: mockQueues }));

const controller = require('../controller');

describe('controller tests', () => {
  it('should return three jobs', async () => {
    mockSortFakeReviews.mockReturnValue([{}, {}, {}, {}, {}]);
    mockQueues.mockImplementationOnce(() => (mockCrawlerQueue))
      .mockImplementationOnce(() => (mockAnalysisQueue));
    const result = await controller({ url: 'https://www.google.com', page: 1, maxPages: 2 });
    expect(mockCrawlerQueue.on).toHaveBeenCalledTimes(1);
    expect(mockCrawlerQueue.add).toHaveBeenCalledTimes(1);
    expect(mockAnalysisQueue.getCompleted).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(3);
  });

  it('should handle empty list of jobs', async () => {
    mockSortFakeReviews.mockReturnValue([]);
    mockQueues.mockImplementationOnce(() => (mockCrawlerQueue))
      .mockImplementationOnce(() => (mockAnalysisQueue));
    const result = await controller({ url: 'https://www.google.com', page: 1, maxPages: 2 });
    expect(mockCrawlerQueue.on).toHaveBeenCalledTimes(1);
    expect(mockCrawlerQueue.add).toHaveBeenCalledTimes(1);
    expect(mockAnalysisQueue.getCompleted).toHaveBeenCalledTimes(1);
    expect(result).toHaveLength(0);
  });

  it('should handle additional pages', async () => {
    mockSortFakeReviews.mockReturnValue([]);
    mockCrawlerQueue.on.mockImplementationOnce((event, handler) => {
      const job = { data: { page: 1, maxPages: 2 } };
      const result = { nextPageUrl: 'https://www.google.com/page2', reviews: [] };
      handler(job, result);
    });
    mockQueues
      .mockImplementationOnce(() => (mockCrawlerQueue))
      .mockImplementationOnce(() => (mockAnalysisQueue));
    await controller({ url: 'https://www.google.com', page: 1, maxPages: 2 });
    expect(mockCrawlerQueue.add).toHaveBeenCalledTimes(2);
  });

  it('should add reviews to analysis queue', async () => {
    mockSortFakeReviews.mockReturnValue([]);
    mockCrawlerQueue.on.mockImplementationOnce((event, handler) => {
      const job = { data: { page: 1, maxPages: 2 } };
      const result = { nextPageUrl: null, reviews: [{}, {}] };
      handler(job, result);
    });
    mockQueues
      .mockImplementationOnce(() => (mockCrawlerQueue))
      .mockImplementationOnce(() => (mockAnalysisQueue));
    await controller({ url: 'https://www.google.com', page: 1, maxPages: 2 });
    expect(mockCrawlerQueue.add).toHaveBeenCalledTimes(1);
    expect(mockAnalysisQueue.add).toHaveBeenCalledTimes(2);
  });
});

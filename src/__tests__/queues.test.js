const mockQueue = jest.fn();

const mockQueueOn = jest.fn();
const mockQueueProcess = jest.fn();
const mockQueueIsReady = jest.fn();
const mockQueueClean = jest.fn();
mockQueue.mockImplementation(() => {
  return {
    on: mockQueueOn,
    process: mockQueueProcess,
    isReady: mockQueueIsReady,
    clean: mockQueueClean,
  };
});
const mockLog = {
  error: jest.fn(),
  debug: jest.fn(),
};

jest.mock('bull', () => mockQueue);
jest.mock('../utils/log', () => (mockLog));

const queues = require('../queues');

describe('queue-setup tests', () => {
  it('should setup queue', async () => {
    await queues.setupQueue('Sample');
    expect(mockQueue).toHaveBeenCalledTimes(1);
    expect(mockQueueOn).toHaveBeenCalledTimes(3);
    expect(mockQueueOn).toHaveBeenNthCalledWith(1, 'completed', expect.anything(Function));
    expect(mockQueueOn).toHaveBeenNthCalledWith(2, 'error', expect.anything(Function));
    expect(mockQueueOn).toHaveBeenNthCalledWith(3, 'failed', expect.anything(Function));
    expect(mockQueueProcess).toHaveBeenCalledTimes(1);
    expect(mockQueueIsReady).toHaveBeenCalledTimes(1);
    expect(mockQueueClean).toHaveBeenCalledTimes(1);
  });

  it('should log completed events', async () => {
    const mockToJSON = jest.fn();
    const job = { queue: { name: 'Testing' }, toJSON: mockToJSON };
    queues.handleQueueComplete(job);
    expect(mockLog.debug).toHaveBeenCalledWith('[TestingJobComplete]', undefined);
    expect(mockToJSON).toHaveBeenCalledTimes(1);
  });

  it('should log error events', async () => {
    queues.handleQueueError(new Error('Sample Test Error'), 'Testing');
    expect(mockLog.error).toHaveBeenCalledWith('[TestingJobError]', expect.anything(Error));
  });

  it('should log failed events', async () => {
    const job = { queue: { name: 'Testing' } };
    queues.handleQueueFailure(job, new Error('Sample Test Error'));
    expect(mockLog.error).toHaveBeenCalledTimes(1);
    expect(mockLog.error).toHaveBeenCalledWith('[TestingJobFailed]', expect.anything(Error));
  });
});

const waitUtilDrained = require('../wait-until-drained');

const mockChildQueue = { on: jest.fn() };
const mockParentQueue = { on: jest.fn() };

it('should wait until queues are drained', () => {
  mockChildQueue.on.mockImplementationOnce((event, handler) => handler());
  mockParentQueue.on.mockImplementationOnce((event, handler) => handler());
  const promise = waitUtilDrained(mockParentQueue, mockChildQueue);
  expect(mockChildQueue.on).toHaveBeenCalledTimes(1);
  expect(mockParentQueue.on).toHaveBeenCalledTimes(1);
  return expect(promise).resolves.toBeUndefined();
});

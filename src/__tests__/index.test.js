/* eslint-disable global-require */
const mockController = jest.fn();
const mockLogInfo = jest.fn();
const mockLogError = jest.fn();
const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {});

jest.mock('../controller', () => mockController);
jest.mock('../utils/log', () => ({ error: mockLogError, info: mockLogInfo }));

process.env.NODE_ENV = 'test';

const run = require('../index');

describe('testing entry script', () => {
  afterAll(() => {
    mockExit.mockRestore();
  });

  it('should print top reviews', async () => {
    await run();
    expect(mockController).toHaveBeenCalledTimes(1);
    expect(mockLogInfo).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith();
  });

  it('should print error from controller', async () => {
    mockController.mockRejectedValueOnce(new Error('Async error'));
    await run();
    expect(mockController).toHaveBeenCalledTimes(1);
    expect(mockLogError).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledTimes(1);
    expect(mockExit).toHaveBeenCalledWith(1);
  });
});

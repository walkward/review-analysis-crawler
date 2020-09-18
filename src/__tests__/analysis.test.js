jest.mock('../utils/log');

const analysis = require('../analysis');

describe('analysis tests', () => {
  it('should extract analysis data', async () => {
    const mockToJSON = jest.fn();
    const result = await analysis({
      data: {
        review: {
          title: '"This was my first time buy from Mckaig dealership...."',
          body: "This was my first time buy from Mckaig dealership. Everyone was super friendly and didn't push me in any way.",
          date: 'Sun, 13 Sep 2020 06:00:00 GMT',
          user: 'Gypsyboots',
        },
      },
      toJSON: mockToJSON,
    });

    expect(mockToJSON).toHaveBeenCalledTimes(1);
    expect(result).toHaveProperty('analysis.score', 0.1724137931034483);
  });

  it('should reject jobs with partial data', async () => {
    const promise = analysis({
      data: {},
      toJSON: () => null,
    });

    return expect(promise).rejects.toThrow();
  });
});

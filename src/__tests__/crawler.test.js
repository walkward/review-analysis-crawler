const mockLog = { error: jest.fn(), info: jest.fn(), debug: jest.fn() };
jest.mock('../utils/log', () => (mockLog));

const nock = require('nock');
const crawler = require('../crawler');

const MOCK_SERVER = 'http://my.server.com';
const MOCK_HTML = `
  <!DOCTYPE html>
  <html lang="en">
    <body>
      <div class="review-section">
        <div>
          <div class="review-entry">
            <div class="review-date">
              <div>
                September 13, 2020
              </div>
            </div>
            <div class="review-wrapper">
              <div>
                <h3>
                  "This was my first time buy from Mckaig dealership...."
                </h3>
                <span>- Gypsyboots</span>
              </div>
              <div>
                <div>
                  <p class="review-content">
                    This was my first time buy from Mckaig dealership. Everyone was
                    super friendly and didn't push me in any way.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div>
          <div class="page_container">
            <div class="next page_num_2 page">
              <a href="/dealer/page2">
                next&nbsp;&gt;
              </a>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

describe('crawler tests', () => {
  it('should extract review details', () => {
    nock(MOCK_SERVER).get('/page1').reply(200, MOCK_HTML);

    const promise = crawler({
      data: {
        url: `${MOCK_SERVER}/page1`,
        page: 1,
        maxPages: 2,
      },
      toJSON: () => null,
    });

    return expect(promise).resolves.toMatchObject({
      reviews: [
        {
          title: '"This was my first time buy from Mckaig dealership...."',
          body: "This was my first time buy from Mckaig dealership. Everyone was super friendly and didn't push me in any way.",
          date: '2020-09-13T00:00:00.000Z',
          user: 'Gypsyboots',
        },
      ],
      nextPageUrl: 'http://my.server.com/dealer/page2',
    });
  });

  it('should stop when max page is reached', () => {
    nock(MOCK_SERVER).get('/page1').reply(200, MOCK_HTML);

    const promise = crawler({
      data: {
        url: `${MOCK_SERVER}/page1`,
        page: 1,
        maxPages: 1,
      },
      toJSON: () => null,
    });

    return expect(promise).resolves.toHaveProperty('nextPageUrl', null);
  });

  it('should retry failed requests', () => {
    nock(MOCK_SERVER).get('/page1').once().reply(403);
    nock(MOCK_SERVER).get('/page1').query(true).reply(200, MOCK_HTML);

    const promise = crawler({
      data: {
        url: `${MOCK_SERVER}/page1`,
        page: 1,
        maxPages: 1,
      },
      toJSON: () => null,
    });

    return expect(promise).resolves.toHaveProperty('reviews.0.title');
  });

  it('should fail after 3 tries', () => {
    nock(MOCK_SERVER)
      .get('/page1')
      .query(true)
      .times(3)
      .reply(403);

    const promise = crawler({
      data: {
        url: `${MOCK_SERVER}/page1`,
        page: 1,
        maxPages: 1,
      },
      toJSON: () => null,
    });

    return expect(promise).rejects.toThrow();
  });

  it('should handle missing reviews', () => {
    nock(MOCK_SERVER).get('/page1').reply(200, '<html></html>');

    const promise = crawler({
      data: {
        url: `${MOCK_SERVER}/page1`,
        page: 1,
        maxPages: 1,
      },
      toJSON: () => null,
    });

    return expect(promise).rejects.toThrow();
  });
});

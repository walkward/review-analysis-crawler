const joinHrefOrigin = require('../join-href-origin');

it('should join relative path href with origin', () => {
  const href = '/path';
  const origin = 'https://www.example.com';
  expect(joinHrefOrigin(href, origin)).toBe('https://www.example.com/path');
});

it('should join absolute path href with origin', () => {
  const href = 'https://www.example.com/path';
  const origin = 'https://www.example.com';
  expect(joinHrefOrigin(href, origin)).toBe('https://www.example.com/path');
});

module.exports = function joinHrefOrigin(href, origin) {
  const url = new URL(href, origin);
  return url.href;
};

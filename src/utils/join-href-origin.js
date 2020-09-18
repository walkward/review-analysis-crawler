/**
 * Join Href Origin: returns an absolute url provided an href an origin
 * @param {String} href href value from an anchor element
 * @param {String} origin origin of website (window.location.origin)
 */
module.exports = function joinHrefOrigin(href, origin) {
  const url = new URL(href, origin);
  return url.href;
};

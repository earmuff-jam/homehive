import { PropertyRouteUri } from "common/utils";

/**
 * retreiveTourKey ...
 *
 * used to return the correct key for tour steps.
 *
 * @param {string} currentUri - the string representation of the current uri
 * @param {string} expectedStrValue - the expected string value, if matched manipulates data.
 *
 * @returns {string} - the key to retrieve the tour from
 */
export const retrieveTourKey = (currentUri, expectedStrValue) => {
  const isDynamicPropertyPage =
    currentUri.includes(`/${expectedStrValue}/`) &&
    currentUri.split("/")[2] === expectedStrValue;

  // individual properties can share the same help && support
  return isDynamicPropertyPage ? PropertyRouteUri : currentUri;
};

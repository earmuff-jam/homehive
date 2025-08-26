/**
 * retreiveTourKey ...
 *
 * function used to retrieve the proper key based on dynamic properties.
 * This function allows to view help from dynamic properties easily.
 *
 * @param {string} currentUri - the string representation of the current uri
 * @param {string} expectedStrValue - the expected string value, if matched manipulates data.
 *
 * @returns {string} - the key to retrieve the tour from
 */
export const retrieveTourKey = (currentUri, expectedStrValue) => {
  const isDynamicPropertyPage =
    currentUri.includes(`/${expectedStrValue}/`) &&
    currentUri.split("/")[1] === expectedStrValue;

  // individual properties can share the same help && support
  return isDynamicPropertyPage ? "/property/:id" : currentUri;
};

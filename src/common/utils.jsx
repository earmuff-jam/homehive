/**
 * Utils file
 *
 * Used to create common minor functions that can be re-used across the application
 */
import { Typography } from "@mui/material";

/**
 * pluralize
 *
 * function used to add a plural form where applicable.
 *
 * @param {int} arrLength - the length of the array that needs to be tabulated.
 * @param {string} wordStr - the string representation of the selected word.
 *
 * @returns a plural form of the selected word
 *
 */
export function pluralize(arrLength, wordStr) {
  if (arrLength <= 1) return wordStr;
  return `${wordStr}s`;
}

/**
 * createHelperSentences
 *
 * function used to create helper sentences for tour steps.
 * @param {string} verbStr - the string that replaces the verb in each of the sentences
 * @param {string} extraClauseStr - the string that replaces the noun or action in each of the sentences
 */
export function createHelperSentences(verbStr, extraClauseStr) {
  return (
    <Typography variant="caption">
      This help / guide is designed to aide you in learning how to{" "}
      {verbStr + extraClauseStr}? Feel free to restart the guide if necessary.
    </Typography>
  );
}

/**
 * isUserLoggedIn ...
 *
 * determines if the current user is logged in and / or if the user is of a
 * valid type. checks against the local storage only, does not attempt to
 * communicate with the backend jobs for this.
 *
 * @returns user || false
 */
export const isUserLoggedIn = () => {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  if (currentUser?.uid) {
    return true;
  }
  return false;
};

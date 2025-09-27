import { useEffect } from "react";

/**
 * useAppTitle
 *
 * hook used to populate html title based on app
 *
 * @param {string} title - the title of the page
 */
export const useAppTitle = (title) => {
  useEffect(() => {
    document.title = `${title} | HomeHiveSolutions`;
  }, [title]);
};

import React from "react";

import { IconButton } from "@mui/material";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS || "false";

/**
 * AIconButton
 *
 * Muiv5 icon button component setup with analytics tracking. Used to perform
 * analytics of the user location based on the route
 *
 * @param {string} label - the icon that is used as a html element to display
 * @param {function} onClick - the onClick handler to perform action on the icon button
 * @param {object} rest - the props passed in as a ...rest component
 *
 */
const AIconButton = React.forwardRef(function AIconButton(
  { label, onClick, ...rest },
  ref,
) {
  const buttonAnalytics = useButtonAnalytics();

  const handleClick = (ev) => {
    // log data only if analytics is enabled
    if (analyticsEnabled?.toLowerCase() === "true") {
      buttonAnalytics?.(label);
    }
    onClick?.(ev);
  };

  return (
    <IconButton ref={ref} {...rest} onClick={handleClick}>
      {label}
    </IconButton>
  );
});

export default AIconButton;

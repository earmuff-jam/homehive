import React, { forwardRef } from "react";

import { Button } from "@mui/material";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS || "false";

/**
 * AButton
 *
 * Muiv5 button component setup with analytics tracking. Used to perform
 * analytics of the user location based on the route
 *
 * @param {string} label - the label of the button component
 * @param {boolean} loading - the loading state of the selected component, defaults to false
 * @param {function} onClick - the onClick handler to perform action on the button
 * @param {object} rest - the props passed in as a ...rest component
 *
 */

const AButton = forwardRef(function AButton(
  { label, onClick = () => {}, loading = false, ...rest },
  ref,
) {
  const buttonAnalytics = useButtonAnalytics();

  const handleClick = (ev) => {
    // log data only if analytics is enabled
    analyticsEnabled?.toLowerCase() === "true" && buttonAnalytics?.(label);
    if (typeof onClick === "function") {
      onClick?.(ev);
    }
  };

  return (
    <Button ref={ref} {...rest} onClick={handleClick} loading={loading}>
      {label}
    </Button>
  );
});

export default AButton;

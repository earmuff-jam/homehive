import React, { forwardRef } from "react";

import { useLocation } from "react-router-dom";

import { IconButton } from "@mui/material";
import { isBasePlanUser } from "common/utils";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS || "false";

/**
 * AIconButton
 *
 * Muiv5 icon button component setup with analytics tracking. Used to perform
 * analytics of the user location based on the route
 *
 * starterPlanUser are users who are enrolled into the application but have not
 * completed their form of payment to use the application.
 *
 * @param {string} label - the icon that is used as a html element to display
 * @param {function} onClick - the onClick handler to perform action on the icon button
 * @param {object} rest - the props passed in as a ...rest component
 *
 */
const AIconButton = forwardRef(function AIconButton(
  { label, onClick = () => {}, ...rest },
  ref,
) {
  const location = useLocation();
  const starterPlanUser = isBasePlanUser(location.pathname);

  const buttonAnalytics = useButtonAnalytics();

  const handleClick = (ev) => {
    if (analyticsEnabled?.toLowerCase() === "true") {
      buttonAnalytics?.(label);
    }
    onClick?.(ev);
  };

  return (
    <IconButton
      ref={ref}
      onClick={handleClick}
      disabled={starterPlanUser}
      {...rest} // at the end so that we can overwrite default settings
    >
      {label}
    </IconButton>
  );
});

export default AIconButton;

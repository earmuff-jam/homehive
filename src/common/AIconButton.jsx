import React, { forwardRef } from "react";

import { useLocation } from "react-router-dom";

import { IconButton } from "@mui/material";
import { isBasePlanUser, isSelectedFeatureEnabled } from "common/utils";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = isSelectedFeatureEnabled("analytics");

// AIconButton ...
const AIconButton = forwardRef(function AIconButton(
  { label, ariaLabel = "Generic Icon button", onClick = () => {}, ...rest },
  ref,
) {
  const location = useLocation();
  const starterPlanUser = isBasePlanUser(location.pathname);

  const buttonAnalytics = useButtonAnalytics();

  const handleClick = (ev) => {
    // log data only if analytics is enabled
    analyticsEnabled && buttonAnalytics?.(label);
    onClick?.(ev);
  };

  return (
    <IconButton
      ref={ref}
      aria-label={ariaLabel}
      onClick={handleClick}
      disabled={starterPlanUser}
      {...rest} // at the end so that we can overwrite default settings
    >
      {label}
    </IconButton>
  );
});

export default AIconButton;

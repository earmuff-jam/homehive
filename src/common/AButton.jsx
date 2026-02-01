import React, { forwardRef, useMemo } from "react";

import { useLocation } from "react-router-dom";

import { Button } from "@mui/material";
import { isBasePlanUser } from "common/utils";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS || "false";

/**
 * AButton
 *
 * Muiv5 button component setup with analytics tracking. Used to perform
 * analytics of the user location based on the route.
 *
 * starterPlanUser are users who are enrolled into the application but have not
 * completed their form of payment to use the application.
 *
 * expiredPlanUser are users who were enrolled at one point, but have decided to
 * remove subscription or not continue subscription. Todo: we need to create be for
 * support of this functionality. broken down into other tickets - #253
 *
 * @param {string} label - the label of the button component
 * @param {boolean} loading - the loading state of the selected component, defaults to false
 * @param {function} onClick - the onClick handler to perform action on the button
 * @param {object} rest - the props passed in as a ...rest component
 *
 */

const AButton = forwardRef(function AButton(
  { label, onClick = () => {}, loading = false, disabled = false, ...rest },
  ref,
) {
  const location = useLocation();
  const starterPlanUser = isBasePlanUser(location.pathname);

  const buttonAnalytics = useButtonAnalytics();

  const shouldDisableClick = useMemo(() => {
    if (starterPlanUser) {
      return true;
    }
    return disabled;
  }, [starterPlanUser, disabled]);

  const handleClick = (ev) => {
    // log data only if analytics is enabled
    analyticsEnabled?.toLowerCase() === "true" && buttonAnalytics?.(label);
    if (typeof onClick === "function") {
      onClick?.(ev);
    }
  };

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      loading={loading}
      disabled={shouldDisableClick}
      {...rest} // at the end so that we can overwrite default settings
    >
      {label}
    </Button>
  );
});

export default AButton;

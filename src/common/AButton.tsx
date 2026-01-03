import { forwardRef } from "react";

import { useLocation } from "react-router-dom";

import { Button } from "@mui/material";
import { AButtonProps } from "common/types";
import { isBannerVisible } from "common/utils";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";

const AButton = forwardRef<HTMLButtonElement, AButtonProps>(function AButton(
  { label, onClick, loading = false, ...rest },
  ref,
) {
  const location = useLocation();
  const starterPlanUser = isBannerVisible(location.pathname);

  const buttonAnalytics = useButtonAnalytics();

  const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
    // log data only if analytics is enabled
    analyticsEnabled && buttonAnalytics?.(label);
    if (typeof onClick === "function") {
      onClick?.(ev);
    }
  };

  return (
    <Button
      ref={ref}
      onClick={handleClick}
      loading={loading}
      disabled={starterPlanUser}
      {...rest} // custom setting overrides default
    >
      {label}
    </Button>
  );
});

export default AButton;

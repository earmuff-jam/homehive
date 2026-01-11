import { forwardRef } from "react";

import { useLocation } from "react-router-dom";

import { IconButton, IconButtonProps } from "@mui/material";
import { isBannerVisible } from "common/utils";
import { useButtonAnalytics } from "hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === "true";

// AIconButtonProps ...
// defines props for AIconButton
export type AIconButtonProps = {
  label: React.ReactNode;
  loading?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
} & IconButtonProps;

const AIconButton = forwardRef<HTMLButtonElement, AIconButtonProps>(
  function AIconButton({ label, onClick, loading = false, ...rest }, ref) {
    const location = useLocation();
    const starterPlanUser = isBannerVisible(location.pathname);

    const buttonAnalytics = useButtonAnalytics();

    const handleClick = (ev: React.MouseEvent<HTMLButtonElement>) => {
      if (analyticsEnabled) {
        buttonAnalytics?.(label);
      }
      onClick?.(ev);
    };

    return (
      <IconButton
        ref={ref}
        onClick={handleClick}
        loading={loading}
        disabled={starterPlanUser || loading}
        {...rest} // custom setting overrides default
      >
        {label}
      </IconButton>
    );
  },
);

export default AIconButton;

import React from "react";

import { useLocation } from "react-router-dom";

import { ErrorOutlineRounded } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { isBannerVisible } from "common/utils";

export default function Banner() {
  const location = useLocation();
  const currentPath = location?.pathname;

  if (isBannerVisible(currentPath))
    return (
      <Alert icon={<ErrorOutlineRounded fontSize="small" />} severity="error">
        You are currently using a demo account. Please contact your
        administrator to request full access.
      </Alert>
    );
  return null;
}

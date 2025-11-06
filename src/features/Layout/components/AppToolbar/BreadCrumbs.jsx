import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { HomeRounded } from "@mui/icons-material";
import { Box, Breadcrumbs, Stack, Typography } from "@mui/material";
import { HomeRouteUri } from "common/utils";

export default function BreadCrumbs({ currentRoute }) {
  const location = useLocation();
  const navigate = useNavigate();

  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumbs aria-label="breadcrumb" className="no-print">
      <Box
        component="span"
        onClick={() => navigate(HomeRouteUri)}
        sx={{
          color: "primary.main",
          cursor: "pointer",
          textDecoration: "none",
        }}
        role="link"
        tabIndex={0}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <HomeRounded fontSize="small" />
          <Typography variant="caption">Home</Typography>
        </Stack>
      </Box>

      {pathnames.map((_, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;

        return last ? (
          <Stack
            key={to}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ color: "text.primary" }}
          >
            {currentRoute?.config?.breadcrumb?.icon}
            <Typography variant="caption">
              {currentRoute?.config?.breadcrumb?.value}
            </Typography>
          </Stack>
        ) : null;
      })}
    </Breadcrumbs>
  );
}

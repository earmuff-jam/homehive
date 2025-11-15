import React from "react";

import { Button, Tooltip, useMediaQuery, useTheme } from "@mui/material";

export default function TabPanel({ selected, options, updateSelected }) {
  const theme = useTheme();
  const lteMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {Object.entries(options).map(([key, template]) => (
        <Tooltip key={key} title={template?.label}>
          <Button
            variant={selected === key ? "contained" : "outlined"}
            color={selected === key ? "primary" : "secondary"}
            startIcon={!lteMedFormFactor ? template?.icon : null}
            onClick={() => updateSelected(key)}
          >
            {!lteMedFormFactor ? (
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  maxWidth: 120,
                  display: "inline-block",
                }}
              >
                {template?.label}
              </span>
            ) : (
              template?.icon
            )}
          </Button>
        </Tooltip>
      ))}
    </>
  );
}

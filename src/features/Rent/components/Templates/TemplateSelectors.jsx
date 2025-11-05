import React from "react";

import { Button, Tooltip, useMediaQuery, useTheme } from "@mui/material";

export default function TemplateSelectors({
  DefaultTemplateData,
  selectedTemplate,
  updateSelectedTemplate,
}) {
  const theme = useTheme();
  const medFormFactor = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <>
      {Object.entries(DefaultTemplateData).map(([key, template]) => (
        <Tooltip key={key} title={template?.label}>
          <Button
            variant={selectedTemplate === key ? "contained" : "outlined"}
            color={selectedTemplate === key ? "primary" : "secondary"}
            startIcon={template?.icon}
            onClick={() => updateSelectedTemplate(key)}
          >
            {!medFormFactor && (
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
            )}
          </Button>
        </Tooltip>
      ))}
    </>
  );
}

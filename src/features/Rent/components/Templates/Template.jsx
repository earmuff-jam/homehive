import React from "react";

import { TuneRounded } from "@mui/icons-material";
import { Box, Stack, Tooltip } from "@mui/material";
import AIconButton from "common/AIconButton";
import RowHeader from "common/RowHeader";
import TemplateForm from "features/Rent/components/Templates/TemplateForm";

export default function Template({ template, handleSave }) {
  const updateTooltipTitle = (values = []) => {
    if (values.length > 0) {
      return `Missing fields - ${values.join(", ")}`;
    }
    return `No missing fields in html body`;
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
          justifyContent: "space-between",
        }}
      >
        <RowHeader
          title={template?.label || "Template"}
          caption={template?.caption || "Caption"}
          sxProps={{
            textAlign: "left",
            fontSize: "0.875rem",
            fontWeight: "bold",
          }}
        />
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip
            title={updateTooltipTitle(
              template?.fieldsToUse?.filter(
                (field) => !template.html.includes(field),
              ),
            )}
          >
            <AIconButton
              size="small"
              label={<TuneRounded fontSize="small" />}
            />
          </Tooltip>
        </Stack>
      </Box>
      <TemplateForm template={template} handleSave={handleSave} />
    </>
  );
}

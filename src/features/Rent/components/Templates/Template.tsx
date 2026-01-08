import { TuneRounded } from "@mui/icons-material";
import { Box, Stack, Tooltip } from "@mui/material";
import AIconButton from "common/AIconButton";
import { TTemplate } from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import TemplateForm from "features/Rent/components/Templates/TemplateForm";
import { populateTooltipWithArgs } from "features/Rent/utils";

// TTemplateProps ...
type TTemplateProps = {
  template: TTemplate;
  handleSave: (val: TTemplate) => void;
};

export default function Template({ template, handleSave }: TTemplateProps) {
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
            title={populateTooltipWithArgs(
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

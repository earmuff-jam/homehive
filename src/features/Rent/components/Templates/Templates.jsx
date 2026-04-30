import React, { useEffect, useState } from "react";

import { ResetTvRounded } from "@mui/icons-material";
import { Box, Card, Stack, Tooltip } from "@mui/material";
import AIconButton from "common/AIconButton";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import {
  useGetCustomTemplatesQuery,
  useUpsertCustomTemplateMutation,
} from "features/Api/invoiceApi";
import TabPanel from "features/Rent/common/TabPanel";
import EditTemplate from "features/Rent/components/Templates/EditTemplate";
import ViewMissingFields from "features/Rent/components/Templates/ViewMissingFields";
import { DefaultRentalAppEmailTemplates } from "features/Rent/components/Templates/constants";
import { produce } from "immer";

export default function Templates() {
  const {
    data: customTemplates = {},
    isLoading: isCustomTemplatesLoading,
    isSuccess: isCustomTemplatesSuccess,
  } = useGetCustomTemplatesQuery();

  const [upsertCustomTemplate, upsertCustomTemplateResult] =
    useUpsertCustomTemplateMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("invoice");
  const [selectedTemplate, setSelectedTemplate] = useState(
    DefaultRentalAppEmailTemplates.invoice,
  );

  const resetTemplateId = (templateId) =>
    setSelectedTemplate(DefaultRentalAppEmailTemplates[templateId]);
  const updateSelectedTemplate = (title) => setSelectedTemplateId(title);

  const handleSave = (data) => {
    const updatedTemplates = produce(customTemplates, (draft) => {
      draft[data.id] = data;
      delete draft[data.id].icon; // remove icon to support rtk query serialization
    });
    upsertCustomTemplate(updatedTemplates);
  };

  useEffect(() => {
    if (
      !upsertCustomTemplateResult.isLoading &&
      upsertCustomTemplateResult.isSuccess
    ) {
      const updatedTemplate = upsertCustomTemplateResult?.data;
      setSelectedTemplate(updatedTemplate[selectedTemplateId]);
      setShowSnackbar(true);
    }
  }, [upsertCustomTemplateResult.isLoading]);

  useEffect(() => {
    if (!isCustomTemplatesLoading && isCustomTemplatesSuccess) {
      const draftTemplate =
        customTemplates[selectedTemplateId] ||
        DefaultRentalAppEmailTemplates[selectedTemplateId];
      setSelectedTemplate(draftTemplate);
    }
  }, [isCustomTemplatesLoading, selectedTemplateId]);

  return (
    <Stack alignItems="center" spacing={1}>
      <Stack direction="row" spacing={2}>
        <TabPanel
          options={DefaultRentalAppEmailTemplates}
          selected={selectedTemplateId}
          updateSelected={updateSelectedTemplate}
        />
      </Stack>
      <Stack width="100%">
        <Card
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: 2,
              justifyContent: "space-between",
            }}
          >
            <RowHeader
              title={selectedTemplate?.label || "Template"}
              caption={selectedTemplate?.caption || "Caption"}
              sxProps={{
                textAlign: "left",
                fontWeight: "bold",
              }}
            />
            <Tooltip title="Reset Template">
              <AIconButton
                size="small"
                onClick={() => resetTemplateId(selectedTemplate.id)}
                label={<ResetTvRounded fontSize="small" />}
              />
            </Tooltip>
          </Box>
          <Stack direction={{ xs: "column", lg: "row" }} spacing={1}>
            <EditTemplate template={selectedTemplate} handleSave={handleSave} />
            <ViewMissingFields
              fields={selectedTemplate?.fieldsToUse || []}
              templateHtml={selectedTemplate?.html}
            />
          </Stack>
        </Card>
      </Stack>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved. Updated custom template."
      />
    </Stack>
  );
}

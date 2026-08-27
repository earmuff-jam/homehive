import React from "react";

import { Controller, useFormContext, useWatch } from "react-hook-form";

import { CancelOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  Drawer,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
import AIconButton from "common/AIconButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { useGetInvoiceListQuery } from "features/Api/invoiceApi";

export default function EditWidgetDrawer({
  editingWidgetID,
  handleEditingWidget,
}) {
  const theme = useTheme();
  const { control } = useFormContext();

  const widgets = useWatch({
    name: "widgets",
  });

  const { data: invoiceList = [], isLoading: isInvoiceListLoading } =
    useGetInvoiceListQuery();

  const ltMedFormFactor = useMediaQuery(theme.breakpoints.down("md"));
  const widgetIndex = widgets?.findIndex(
    (item) => item.widgetID === editingWidgetID,
  );

  return (
    <Drawer
      anchor="right"
      open={Boolean(editingWidgetID)}
      onClose={() => handleEditingWidget(editingWidgetID)}
      aria-modal="true"
      sx={{
        width: ltMedFormFactor ? "100%" : 440,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: ltMedFormFactor ? "100%" : 440,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {isInvoiceListLoading ? (
        <Skeleton height="10rem" />
      ) : (
        <Stack
          sx={{
            height: "100%",
            minHeight: 0,
          }}
        >
          <Stack padding={1} spacing={1}>
            <Stack
              marginBottom={1}
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h5" fontWeight="bold" color="text.secondary">
                Edit widget
              </Typography>

              <AIconButton
                size="small"
                onClick={() => handleEditingWidget("")}
                label={<CancelOutlined fontSize="small" />}
              />
            </Stack>

            <Divider />
          </Stack>

          <Box
            sx={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              px: 1,
            }}
          >
            <form>
              <Stack spacing={1}>
                <Controller
                  name={`widgets.${widgetIndex}.title`}
                  control={control}
                  render={({ field }) => (
                    <TextFieldWithLabel
                      label="Widget Title *"
                      id="title"
                      placeholder="Widget title"
                      value={field?.value}
                      onChange={field?.onChange}
                    />
                  )}
                />
                <Controller
                  name={`widgets.${widgetIndex}.caption`}
                  control={control}
                  render={({ field }) => (
                    <TextFieldWithLabel
                      label="Widget Caption *"
                      id="caption"
                      placeholder="Widget caption"
                      value={field?.value}
                      onChange={field?.onChange}
                    />
                  )}
                />
                <Divider>Choose Invoice</Divider>
                <Controller
                  name={`widgets.${widgetIndex}.filters.selectedInvoiceID`}
                  control={control}
                  render={({ field }) => (
                    <Stack>
                      <Typography
                        variant="body2"
                        fontWeight="medium"
                        gutterBottom
                      >
                        Select Invoice *
                      </Typography>

                      <Autocomplete
                        options={invoiceList?.invoiceDetails || []}
                        getOptionLabel={(opt) => opt?.invoiceHeader || ""}
                        value={
                          invoiceList?.invoiceDetails?.find(
                            (invoice) => invoice.id === field.value,
                          ) || null
                        }
                        onChange={(_, value) =>
                          field.onChange(value?.id ?? null)
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            size="small"
                            placeholder="Select invoice"
                          />
                        )}
                      />
                    </Stack>
                  )}
                />
              </Stack>
            </form>
          </Box>

          <Box
            sx={{
              p: 1,
              borderTop: 1,
              borderColor: "divider",
              backgroundColor: "background.paper",
              flexShrink: 0,
            }}
          >
            <Stack direction="row" justifyContent="flex-end" spacing={1}>
              <AButton
                label="Close"
                variant="contained"
                size="small"
                onClick={() => handleEditingWidget("")}
              />
            </Stack>
          </Box>
        </Stack>
      )}
    </Drawer>
  );
}

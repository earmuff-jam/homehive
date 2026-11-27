import React from "react";

import { Controller, useForm } from "react-hook-form";

import { CancelRounded } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import AIconButton from "common/AIconButton";
import { getPreprocessedFile } from "features/Esign/utils/getPreprocessedFile";

// DEFAULT_PDF_FORM_TEMPLATE_OPTIONS ...
// defines the existing form template values for easy access
export const DEFAULT_PDF_FORM_TEMPLATE_OPTIONS = [
  {
    id: "form_1",
    name: "Lease Agreement",
    fileName: "lease-agreement.pdf",
    filePath: "/forms/residential-lease.pdf",
  },
  {
    id: "form_2",
    name: "Lease Extension",
    fileName: "lease-extension.pdf",
    filePath: "/forms/residential-lease-extension.pdf",
  },
  {
    id: "form_3",
    name: "Early Termination",
    fileName: "early-termination.pdf",
    filePath: "/forms/residential-lease-early-termination.pdf",
  },
  {
    id: "form_4",
    name: "Lease Renewal",
    fileName: "lease-renewal.pdf",
    filePath: "/forms/lease-renewal.pdf",
  },
];

const DefaultPdfFormTemplates = {
  template: null,
};

const ViewFormTemplates = ({
  savedOptions = [],
  handleUpload,
  handleRemove,
}) => {
  const { control } = useForm({
    mode: "onChange",
    defaultValues: DefaultPdfFormTemplates,
  });

  const handleSelect = async (file) => {
    if (!file) {
      handleUpload({
        target: {
          files: [null],
        },
      });
      return;
    }

    const readableFile = await getPreprocessedFile(
      file.filePath,
      file.fileName,
    );

    handleUpload({
      target: {
        files: [readableFile],
      },
      pdfFormFields: file?.pdfFormFields || [],
      signatureBoxes: file?.signatureBoxes || [],
      signers: file?.signers || [],
    });
  };

  return (
    <Box
      sx={{
        top: 100,
        padding: 1,
        width: "30%",
      }}
      data-tour="esign-3"
    >
      <Typography fontWeight="bold" color="textSecondary" gutterBottom>
        Edit Form Fields
      </Typography>
      <Divider>
        <Typography variant="caption" color="textSecondary">
          Document Information
        </Typography>
      </Divider>
      <Typography gutterBottom>Select Document *</Typography>
      <Controller
        name="template"
        control={control}
        render={({ field }) => (
          <Autocomplete
            options={[...savedOptions, ...DEFAULT_PDF_FORM_TEMPLATE_OPTIONS]}
            getOptionLabel={(option) =>
              option?.name || `Saved ${option?.fileName}` || ""
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={field.value}
            onChange={(_, value) => {
              field.onChange(value);
              handleSelect(value);
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  width="100%"
                >
                  {option?.name || `Saved ${option?.fileName}`}

                  {savedOptions.some((saved) => saved.id === option.id) && (
                    <AIconButton
                      size="small"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleRemove(option?.id);
                      }}
                      label={<CancelRounded fontSize="small" color="error" />}
                    />
                  )}
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Select a form to edit ..."
              />
            )}
          />
        )}
      />
    </Box>
  );
};

export default ViewFormTemplates;

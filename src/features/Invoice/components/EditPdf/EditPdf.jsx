import React, { useEffect, useState } from "react";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  AddRounded,
  CheckRounded,
  InfoRounded,
  SaveRounded,
} from "@mui/icons-material";
import {
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import {
  useGetPdfDetailsQuery,
  useUpsertPdfDetailsMutation,
} from "features/Api/invoiceApi";
import EditPdfLineItemAccordion from "features/Invoice/components/EditPdf/EditPdfLineItemAccordion";
import { DefaultInvoiceStatusOptions } from "features/Invoice/constants";
import { useAppTitle } from "hooks/useAppTitle";
import { produce } from "immer";

const defaultInvoiceFormFields = {
  title: "",
  caption: "",
  note: "",
  startDate: null,
  endDate: null,
  invoiceHeader: "",
  taxRate: "1.00",
  lineItems: [],
};

export default function EditPdf({
  title = "Edit Pdf",
  caption = "Edit data to populate invoice",
}) {
  useAppTitle("Edit Invoice");
  const navigate = useNavigate();

  const {
    data,
    isLoading: isPdfDetailsLoading,
    isSuccess: isPdfDetailsSuccess,
  } = useGetPdfDetailsQuery();

  const [upsertPdf, upsertPdfResult] = useUpsertPdfDetailsMutation();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultInvoiceFormFields,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [options, setOptions] = useState(DefaultInvoiceStatusOptions);

  const handleSelection = (label) => {
    setOptions((prevItems) =>
      produce(prevItems, (draft) => {
        draft.forEach((item) => {
          item.selected = item.label === label;
        });
      }),
    );
  };

  const addLineItems = () => {
    append({
      category: "",
      description: "",
      caption: "",
      quantity: "",
      price: "",
      payment: "",
      paymentMethod: "",
    });
  };

  const submit = (data) => {
    upsertPdf({
      ...data,
      updatedOn: dayjs().toISOString(),
      endDate: dayjs(data.endDate).toISOString(),
      startDate: dayjs(data.startDate).toISOString(),
      invoiceStatus: options.find((option) => option.selected),
    });
  };

  useEffect(() => {
    if (upsertPdfResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [upsertPdfResult.isLoading]);

  useEffect(() => {
    if (isPdfDetailsSuccess) {
      const invoiceDetails = data?.invoiceDetails;
      if (invoiceDetails) {
        reset({
          title: invoiceDetails.title || "",
          caption: invoiceDetails.caption || "",
          note: invoiceDetails.note || "",
          startDate: invoiceDetails.startDate || dayjs(),
          endDate: invoiceDetails.endDate || dayjs(),
          taxRate: invoiceDetails.taxRate || "",
          invoiceHeader: invoiceDetails.invoiceHeader || "",
          lineItems: invoiceDetails.lineItems || [],
        });
      }

      const existingInvoiceStatus = invoiceDetails?.invoiceStatus;
      handleSelection(existingInvoiceStatus?.label);
    }
  }, [isPdfDetailsLoading]);

  return (
    <Container
      maxWidth="md"
      data-tour="edit-pdf-0"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        padding: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack spacing={2}>
        <Stack>
          <IconButton
            onClick={handleSubmit(submit)}
            color="primary"
            size="small"
            sx={{ alignSelf: "flex-end" }}
            disabled={!isValid}
          >
            <SaveRounded />
          </IconButton>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="subtitle2">{caption}</Typography>
        </Stack>
        {/* Invoice title and caption */}
        <Stack direction="row" spacing={2}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: "Title is required",
              validate: (value) =>
                value.trim().length > 3 ||
                "Title must be more than 3 characters",
              maxLength: {
                value: 150,
                message: "Title should be less than 150 characters",
              },
            }}
            render={({ field }) => (
              <TextFieldWithLabel
                {...field}
                fullWidth
                dataTour="edit-pdf-1"
                label="Invoice Title *"
                error={!!errors.title}
                errorMsg={errors.title?.message}
                placeholder="The title of the invoice. Eg, Rent for the month of"
              />
            )}
          />

          <Controller
            name="caption"
            control={control}
            rules={{
              maxLength: {
                value: 150,
                message: "Title caption should be less than 150 characters",
              },
            }}
            render={({ field }) => (
              <TextFieldWithLabel
                {...field}
                fullWidth
                dataTour="edit-pdf-2"
                label="Invoice Caption"
                error={!!errors.caption}
                errorMsg={errors.caption?.message}
                placeholder="The description below the title of invoice"
              />
            )}
          />
        </Stack>
        <Controller
          name="note"
          control={control}
          rules={{
            maxLength: {
              value: 250,
              message: "Notes should be less than 250 characters",
            },
          }}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              fullWidth
              multiline
              maxRows={3}
              dataTour="edit-pdf-3"
              label="Additional Notes"
              error={!!errors.note}
              errorMsg={errors.note?.message}
              placeholder="Additional notes that the user can add"
            />
          )}
        />
        {/* Start and end dates */}
        <Stack direction="row" spacing={2} data-tour="edit-pdf-4">
          <Controller
            name="startDate"
            control={control}
            defaultValue={null}
            rules={{ required: "Start Date is required" }}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Start Date *"
                  value={dayjs(field?.value)}
                  onChange={(newValue) => field?.onChange(newValue)}
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText:
                        fieldState.error?.message ||
                        "Start date for the selected bill",
                      size: "small",
                      sx: { flexGrow: 1 },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
          <Controller
            name="endDate"
            control={control}
            defaultValue={null}
            rules={{
              required: "End Date is required",
            }}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="End Date *"
                  value={dayjs(field?.value)}
                  onChange={(newValue) => field?.onChange(newValue)}
                  slotProps={{
                    textField: {
                      error: !!fieldState.error,
                      helperText:
                        fieldState.error?.message ||
                        "Due date for the selected bill",
                      size: "small",
                      sx: { flexGrow: 1 },
                    },
                  }}
                />
              </LocalizationProvider>
            )}
          />
        </Stack>
        {/* Invoice Header */}
        <Controller
          name="invoiceHeader"
          control={control}
          rules={{
            required: "Invoice Header is required",
            validate: (value) =>
              value.trim().length > 3 ||
              "Invoice Header must be more than 3 characters",
            maxLength: {
              value: 150,
              message: "Invoice Header should be less than 150 characters",
            },
          }}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              fullWidth
              dataTour="edit-pdf-5"
              label="Invoice Header *"
              error={!!errors.invoiceHeader}
              errorMsg={errors.invoiceHeader?.message}
              placeholder="The title of the bill. Eg., Rent Details"
            />
          )}
        />
        {/* Tax Rate */}
        <Controller
          name="taxRate"
          control={control}
          rules={{
            required: "Tax rate is required",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message:
                "Tax rate must be a valid 2 digit decimal. e.g. 2.70. Leave '1.00' for default",
            },
            validate: (value) =>
              value.trim().length > 3 ||
              "Tax rate must be more than 3 characters",
            maxLength: {
              value: 20,
              message: "Tax rate should be less than 20 characters",
            },
          }}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              fullWidth
              label="Tax Rate *"
              dataTour="edit-pdf-6"
              error={!!errors.taxRate}
              errorMsg={errors.taxRate?.message}
              placeholder="The rate of tax in upto 2 decimal places. Eg., 8.25 "
            />
          )}
        />
        <Paper sx={{ padding: "1rem" }} data-tour="edit-pdf-7">
          <Tooltip
            title="The current status of the invoice. Selecting 'none' will not display any status."
            placement="top-start"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ fontWeight: "bold", marginTop: "1rem" }}>
                Invoice status
              </Typography>
              <InfoRounded sx={{ color: "text.secondary" }} fontSize="small" />
            </Stack>
          </Tooltip>
          <MenuList>
            {options.map(({ id, label, icon, selected }) => (
              <MenuItem key={id} onClick={() => handleSelection(label)}>
                <ListItemIcon>{icon}</ListItemIcon>
                <ListItemText>{label}</ListItemText>
                {selected ? <CheckRounded /> : null}
              </MenuItem>
            ))}
          </MenuList>
        </Paper>

        {/* Line items */}
        <Stack alignItems={"flex-end"}>
          <AButton
            data-tour="edit-pdf-8"
            onClick={() => addLineItems()}
            startIcon={<AddRounded />}
            variant="outlined"
            label="Add Item"
          />
        </Stack>
        {fields.map((item, index) => (
          <EditPdfLineItemAccordion
            key={item.id}
            title={`Edit line ${index + 1}`}
            control={control}
            errors={errors}
            index={index}
            onDelete={() => remove(index)}
          />
        ))}
        <AButton
          data-tour="edit-pdf-9"
          variant="contained"
          onClick={handleSubmit(submit)}
          disabled={!isValid}
          label="Save"
        />
      </Stack>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
        caption="View draft invoice."
        onClick={() => navigate("/invoice/view")}
      />
    </Container>
  );
}

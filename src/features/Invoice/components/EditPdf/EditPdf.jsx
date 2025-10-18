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
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import EditPdfLineItemAccordion from "features/Invoice/components/EditPdf/EditPdfLineItemAccordion";
import {
  BLANK_INVOICE_DETAILS_FORM,
  BLANK_INVOICE_LINE_ITEM_FORM,
  DefaultInvoiceStatusOptions,
  InvoiceCategoryOptions,
} from "features/Invoice/constants";
import { useAppTitle } from "hooks/useAppTitle";
import { produce } from "immer";

export default function EditPdf({
  title = "Edit Pdf",
  caption = "Edit data to populate invoice",
}) {
  useAppTitle("Edit Invoice");
  const navigate = useNavigate();

  const {
    watch,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      title: "",
      caption: "",
      note: "",
      start_date: "",
      end_date: "",
      invoice_header: "",
      tax_rate: "",
      lineItems: [],
    },
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

  const handleDateTime = (ev, id) => {
    const value = dayjs(ev).format("MM-DD-YYYY");
    const updatedFormData = { ...formData };
    let errorMsg = "";
    for (const validator of updatedFormData[id].validators) {
      if (validator.validate(value)) {
        errorMsg = validator.message;
        break;
      }
    }
    updatedFormData[id] = {
      ...updatedFormData[id],
      value,
      errorMsg,
    };
    setFormData(updatedFormData);
  };

  const addLineItems = () => {
    append({
      category: "",
      description: "",
      caption: "",
      quantity: "",
      price: "",
      payment: "",
      payment_method: "",
    });
  };

  const submit = (data) => {
    const lineItems = data?.lineItems;
    const draftData = {
      ...data,
      items:
        lineItems?.map((item) => ({
          ...item,
        })) || [],
      updatedOn: dayjs().toISOString(),
    };

    const invoiceStatus = options.find((option) => option.selected) || null;
    console.log(draftData, invoiceStatus);
    // localStorage.setItem(
    //   "pdfDetails",
    //   JSON.stringify({ ...draftData, invoiceStatus }),
    // );
    setShowSnackbar(true);
  };

  useEffect(() => {
    const existingInvoiceStatus = localStorage.getItem("invoiceStatus");
    const parsedExistingInvoiceStatus = JSON.parse(existingInvoiceStatus);

    if (parsedExistingInvoiceStatus) {
      handleSelection(parsedExistingInvoiceStatus.label);
    }

    const localValues = localStorage.getItem("pdfDetails");
    const parsedValues = JSON.parse(localValues);

    if (parsedValues) {
      const draftPdfDetails = produce(BLANK_INVOICE_DETAILS_FORM, (draft) => {
        draft.title.value = parsedValues.title || "";
        draft.caption.value = parsedValues.caption || "";
        draft.note.value = parsedValues.note || "";
        draft.start_date.value = parsedValues.start_date || "";
        draft.end_date.value = parsedValues.end_date || "";
        draft.tax_rate.value = parsedValues.tax_rate || "";
        draft.invoice_header.value = parsedValues.invoice_header || "";
      });
      setFormData(draftPdfDetails);

      const draftLineItems = parsedValues.items.map((element) =>
        produce(BLANK_INVOICE_LINE_ITEM_FORM, (draft) => {
          const draftCategoryValue = element.category || "";

          const selectedCategoryValue = InvoiceCategoryOptions.find(
            (option) => option.value === draftCategoryValue,
          );

          draft.category.value = draftCategoryValue;
          draft.category.selectedOption = selectedCategoryValue;

          draft.descpription.value = element.descpription || "";
          draft.caption.value = element.caption || "";
          draft.quantity.value = element.quantity || "";
          draft.price.value = element.price || "";
          draft.payment.value = element.payment || "";
          draft.payment_method.value = element.payment_method || "";
        }),
      );
      setLineItems(draftLineItems);
    }
  }, []);

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
        {/* First and Last Name */}
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
            name="start_date"
            control={control}
            defaultValue={null}
            rules={{ required: "Start Date is required" }}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="Start Date *"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
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
            name="end_date"
            control={control}
            defaultValue={null}
            rules={{
              required: "End Date is required",
              validate: (value) =>
                value && value?.isAfter(watch("start_date"))
                  ? true
                  : "End Date must be after Start Date",
            }}
            render={({ field, fieldState }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <MobileDatePicker
                  label="End Date *"
                  value={field.value}
                  onChange={(newValue) => field.onChange(newValue)}
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
          name="invoice_header"
          control={control}
          rules={{
            required: "Invoice Caption is required",
            validate: (value) =>
              value.trim().length > 3 ||
              "Invoice Caption must be more than 3 characters",
            maxLength: {
              value: 150,
              message: "Invoice Caption should be less than 150 characters",
            },
          }}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              fullWidth
              dataTour="edit-pdf-5"
              label="Invoice Caption *"
              error={!!errors.title}
              errorMsg={errors.title?.message}
              placeholder="The title of the bill. Eg., Rent Details"
            />
          )}
        />
        {/* Tax Rate */}
        <Controller
          name="tax_rate"
          control={control}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              fullWidth
              label="Tax Rate"
              dataTour="edit-pdf-6"
              error={!!errors.tax_rate}
              errorMsg={errors.tax_rate?.message}
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
        caption="View Invoice"
        onClick={() => navigate("/invoice/view")}
      />
    </Container>
  );
}

import React from "react";

import { Controller } from "react-hook-form";

import { Autocomplete, Stack, TextField, Typography } from "@mui/material";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { InvoiceCategoryOptions } from "features/Invoice/constants";

export default function EditPdfLineItem({ control, index }) {
  return (
    <Stack spacing={2}>
      {/* Category */}
      <Controller
        name={`lineItems.${index}.category`}
        control={control}
        render={({ field }) => (
          <Stack>
            <Typography variant="body2" fontWeight="medium" gutterBottom>
              Category *
            </Typography>
            <Autocomplete
              options={InvoiceCategoryOptions}
              getOptionLabel={(opt) => opt.label || ""}
              value={field?.value || null}
              onChange={(_, value) => field.onChange(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  size="small"
                  placeholder="Select category"
                />
              )}
            />
          </Stack>
        )}
      />

      {/* Description */}
      <Controller
        name={`lineItems.${index}.description`}
        control={control}
        rules={{
          required: "Line item description is required",
          validate: (value) =>
            value.trim().length > 3 ||
            "Line item description must be more than 3 characters",
          maxLength: {
            value: 150,
            message: "Line item description should be less than 150 characters",
          },
        }}
        render={({ field, fieldState }) => (
          <TextFieldWithLabel
            {...field}
            label="Description *"
            placeholder="Description of charge"
            error={!!fieldState.error}
            errorMsg={fieldState.error?.message}
          />
        )}
      />

      <Controller
        name={`lineItems.${index}.caption`}
        control={control}
        render={({ field }) => (
          <TextFieldWithLabel
            {...field}
            label="Caption"
            placeholder="Helper text for description. Eg, monthly subscription"
          />
        )}
      />

      {/* Quantity + Price */}
      <Stack direction="row" spacing={2}>
        <Controller
          name={`lineItems.${index}.quantity`}
          control={control}
          rules={{
            required: "Quantity is required and must be in number format.",
            pattern: {
              value: /^\d+$/,
              message: "Quantity must be a valid amount (e.g. 3)",
            },
          }}
          render={({ field, fieldState }) => (
            <TextFieldWithLabel
              {...field}
              label="Quantity *"
              placeholder="Quantity"
              error={!!fieldState.error}
              errorMsg={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={`lineItems.${index}.price`}
          control={control}
          rules={{
            required: "Price is required and must be in number format.",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Price must be a valid amount (e.g. 12.25)",
            },
          }}
          render={({ field, fieldState }) => (
            <TextFieldWithLabel
              {...field}
              label="Price *"
              placeholder="USD amount"
              error={!!fieldState.error}
              errorMsg={fieldState.error?.message}
            />
          )}
        />
      </Stack>

      {/* Payment + Payment Method */}
      <Stack direction="row" spacing={2}>
        <Controller
          name={`lineItems.${index}.payment`}
          control={control}
          rules={{
            required:
              "Payment recieved is required and must be in number format.",
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: "Payment recieved must be a valid amount (e.g. 12.25)",
            },
          }}
          render={({ field, fieldState }) => (
            <TextFieldWithLabel
              {...field}
              label="Payment Recieved *"
              placeholder="Payment received (deducted from line total)"
              error={!!fieldState.error}
              errorMsg={fieldState.error?.message}
            />
          )}
        />
        <Controller
          name={`lineItems.${index}.paymentMethod`}
          control={control}
          rules={{
            required: "Payment Method is required",
            validate: (value) =>
              value.trim().length > 3 ||
              "Payment Method must be more than 3 characters",
            maxLength: {
              value: 150,
              message: "Payment Method should be less than 150 characters",
            },
          }}
          render={({ field, fieldState }) => (
            <TextFieldWithLabel
              {...field}
              label="Mode of Payment *"
              placeholder="Zelle, Cash..."
              error={!!fieldState.error}
              errorMsg={fieldState.error?.message}
            />
          )}
        />
      </Stack>
    </Stack>
  );
}

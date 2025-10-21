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
        render={({ field }) => (
          <TextFieldWithLabel
            {...field}
            label="Description"
            placeholder="Description of charge"
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
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              label="Quantity *"
              placeholder="Quantity"
            />
          )}
        />
        <Controller
          name={`lineItems.${index}.price`}
          control={control}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              label="Price *"
              placeholder="USD amount"
            />
          )}
        />
      </Stack>

      {/* Payment + Payment Method */}
      <Stack direction="row" spacing={2}>
        <Controller
          name={`lineItems.${index}.payment`}
          control={control}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              label="Payment Recieved *"
              placeholder="Payment received (deducted from line total)"
            />
          )}
        />
        <Controller
          name={`lineItems.${index}.payment_method`}
          control={control}
          render={({ field }) => (
            <TextFieldWithLabel
              {...field}
              label="Mode of Payment *"
              placeholder="Zelle, Cash..."
            />
          )}
        />
      </Stack>
    </Stack>
  );
}

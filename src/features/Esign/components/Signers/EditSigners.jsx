import React from "react";

import { Controller } from "react-hook-form";

import { Stack } from "@mui/material";
import TextFieldWithLabel from "common/TextFieldWithLabel";

const EditSigners = ({ control, errors }) => {
  return (
    <Stack spacing={1}>
      <Controller
        name="name"
        control={control}
        rules={{
          required: "Full name is required",
          validate: (value) =>
            value.trim().length > 3 ||
            "Full name must be more than 3 characters",
          maxLength: {
            value: 150,
            message: "Full name should be less than 150 characters",
          },
        }}
        render={({ field }) => (
          <TextFieldWithLabel
            {...field}
            fullWidth
            label="Name"
            placeholder="The name of the signer. Eg, Jane Smith"
            error={!!errors.name}
            errorMsg={errors.name?.message}
          />
        )}
      />
      <Controller
        name="email_address"
        control={control}
        rules={{
          required: "Email Address is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Enter a valid email address",
          },
        }}
        render={({ field }) => (
          <TextFieldWithLabel
            {...field}
            label="Email"
            error={!!errors.email_address}
            errorMsg={errors.email_address?.message}
            placeholder="The email address of the signer"
          />
        )}
      />
    </Stack>
  );
};

export default EditSigners;

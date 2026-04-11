import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";

import { Box, Button, Stack } from "@mui/material";
import TextFieldWithLabel from "common/TextFieldWithLabel";

// DefaultSigners ...
// defines the default signers
const DefaultSigners = {
  name: "",
  email_address: "",
};

const EditSigners = ({ setEdit, signers, role, updateSignerDetails }) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: DefaultSigners,
  });

  const onSubmit = (data) => {
    updateSignerDetails({ ...data, role });
    reset(DefaultSigners);
    setEdit(null);
  };

  useEffect(() => {
    const selectedSigner = signers?.find((signer) => signer?.role === role);
    if (selectedSigner) {
      reset({
        name: selectedSigner?.name,
        email_address: selectedSigner?.email_address,
      });
    }
  }, [signers, role]);

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
      <Box alignSelf="flex-end">
        <Button
          variant="outlined"
          size="small"
          disabled={!isValid}
          onClick={handleSubmit(onSubmit)}
        >
          Submit
        </Button>
      </Box>
    </Stack>
  );
};

export default EditSigners;

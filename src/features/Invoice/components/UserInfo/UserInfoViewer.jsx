import React from "react";

import { Container, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";

export default function UserInfoViewer({
  title,
  caption,
  register,
  errors,
  isDisabled,
  onSubmit,
  loading,
}) {
  return (
    <Container
      maxWidth="sm"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        padding: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack spacing={2}>
        <Stack>
          <Typography variant="h5" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="subtitle2">{caption}</Typography>
        </Stack>

        {/* First and Last Name */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="First Name *"
            id="first_name"
            placeholder="First Name"
            errorMsg={errors.first_name?.message}
            inputProps={{
              ...register("first_name", {
                required: "First Name is required",
                minLength: {
                  value: 3,
                  message: "First Name must be at least three characters",
                },
                maxLength: {
                  value: 150,
                  message: "First Name must be less than 150 characters",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label="Last Name *"
            id="last_name"
            placeholder="Last Name"
            errorMsg={errors.last_name?.message}
            inputProps={{
              ...register("last_name", {
                required: "Last Name is required",
                minLength: {
                  value: 3,
                  message: "Last Name must be at least three characters",
                },
                maxLength: {
                  value: 150,
                  message: "Last Name must be less than 150 characters",
                },
              }),
            }}
          />
        </Stack>

        {/* Email and Phone Number */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Email address *"
            id="email_address"
            placeholder="Email Address"
            errorMsg={errors.email_address?.message}
            inputProps={{
              ...register("email_address", {
                required: "Email Address is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label="Phone Number *"
            id="phone_number"
            placeholder="Phone Number"
            errorMsg={errors.phone_number?.message}
            inputProps={{
              ...register("phone_number", {
                required: "Phone number is required",
                pattern: {
                  value: /^\+?[\d\s\-().]{10,15}$/,
                  message: "Enter a valid phone number",
                },
              }),
            }}
          />
        </Stack>

        {/* Street Address */}
        <TextFieldWithLabel
          label="Street Address *"
          id="street_address"
          placeholder="Street Address"
          errorMsg={errors.street_address?.message}
          inputProps={{
            ...register("street_address", {
              required: "Street address is required",
            }),
          }}
        />

        {/* City, State, Zip Code */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="City *"
            id="city"
            placeholder="City"
            errorMsg={errors.city?.message}
            inputProps={{
              ...register("city", {
                required: "City is required",
              }),
            }}
          />

          <TextFieldWithLabel
            label="State *"
            id="state"
            placeholder="State"
            errorMsg={errors.state?.message}
            inputProps={{
              ...register("state", {
                required: "State is required",
                pattern: {
                  value: /^[A-Za-z]{2}$/,
                  message: "Enter a valid 2-letter state code",
                },
              }),
            }}
          />

          <TextFieldWithLabel
            label="Zip Code *"
            id="zipcode"
            placeholder="Zip Code"
            errorMsg={errors.zipcode?.message}
            inputProps={{
              ...register("zipcode", {
                required: "Zipcode is required",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: "Enter a valid zipcode",
                },
              }),
            }}
          />
        </Stack>
        <AButton
          label="Save"
          variant="contained"
          onClick={onSubmit}
          disabled={isDisabled}
          loading={loading}
        />
      </Stack>
    </Container>
  );
}

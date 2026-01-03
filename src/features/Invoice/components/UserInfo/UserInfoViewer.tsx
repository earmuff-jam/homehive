import { FieldErrors, UseFormRegister } from "react-hook-form";

import { Container, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { UserInfo } from "features/Invoice/types/Invoice.types";

// UserInfoViewerProps ...
export type UserInfoViewerProps = {
  title: string;
  caption: string;
  register: UseFormRegister<UserInfo>;
  errors: FieldErrors<UserInfo>;
  loading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
};

export default function UserInfoViewer({
  title,
  caption,
  register,
  errors,
  isDisabled = true,
  onSubmit,
  loading,
}: UserInfoViewerProps) {
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
            id="firstName"
            placeholder="First Name"
            errorMsg={errors.firstName?.message}
            inputProps={{
              ...register("firstName", {
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
            id="lastName"
            placeholder="Last Name"
            errorMsg={errors.lastName?.message}
            inputProps={{
              ...register("lastName", {
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
            id="email"
            placeholder="Email Address"
            errorMsg={errors.email?.message}
            inputProps={{
              ...register("email", {
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
            id="phone"
            placeholder="Phone Number"
            errorMsg={errors.phone?.message}
            inputProps={{
              ...register("phone", {
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
          id="streetAddress"
          placeholder="Street Address"
          errorMsg={errors.streetAddress?.message}
          inputProps={{
            ...register("streetAddress", {
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

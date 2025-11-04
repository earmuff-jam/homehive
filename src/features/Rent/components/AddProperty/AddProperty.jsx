import React from "react";

import { InfoRounded } from "@mui/icons-material";
import { Button, Divider, Stack, Tooltip, Typography } from "@mui/material";
import TextFieldWithLabel from "common/TextFieldWithLabel";

export default function AddProperty({
  register,
  errors,
  onSubmit,
  isDisabled = false,
  isEditing = false,
}) {
  return (
    <form onSubmit={onSubmit}>
      <Divider>
        <Typography variant="caption" color="textSecondary">
          Property Information
        </Typography>
      </Divider>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Property Name *"
            id="name"
            placeholder="Name of your property"
            errorMsg={errors.name?.message}
            inputProps={{
              ...register("name", { required: "Property name is required" }),
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Address *"
            id="address"
            placeholder="123 Main St"
            errorMsg={errors.address?.message}
            inputProps={{
              ...register("address", {
                required: "Property address is required",
              }),
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="City *"
            id="city"
            placeholder="Richmond"
            errorMsg={errors.city?.message}
            inputProps={{
              ...register("city", { required: "City is required" }),
            }}
          />
          <TextFieldWithLabel
            label="State *"
            id="state"
            placeholder="NC"
            errorMsg={errors.state?.message}
            inputProps={{
              ...register("state", {
                required: "State is required in the form of XX. Eg, TN",
                pattern: {
                  value: /^[A-Z]{2}$/,
                  message: "State must be 2 uppercase letters (e.g. TX)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label="ZIP Code *"
            id="zipcode"
            placeholder="78701"
            errorMsg={errors.zipcode?.message}
            inputProps={{
              ...register("zipcode", {
                required: "ZipCode is required.",
                pattern: {
                  value: /^\d{5}$/,
                  message: "ZIP Code must be exactly 5 digits",
                },
              }),
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Number of Units / Bedroom *"
            id="units"
            placeholder="e.g. 4"
            errorMsg={errors.units?.message}
            inputProps={{
              ...register("units", {
                required: "Number of bedrooms is required.",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Number of Bathrooms *"
            id="bathrooms"
            placeholder="e.g. 2"
            errorMsg={errors.bathrooms?.message}
            inputProps={{
              ...register("bathrooms", {
                required: "Number of bathrooms is required",
                pattern: {
                  value: /^\d+(\.\d)?$/, // allows optional one decimal digit
                  message: "Enter a valid number like 1, 1.5, or 2",
                },
              }),
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Area of the home in sq ft. *"
            id="sqFt"
            placeholder="7854"
            errorMsg={errors.sqFt?.message}
            inputProps={{
              ...register("sqFt", {
                required: "Area of the home in square ft is required.",
                pattern: {
                  value: /^\d+$/,
                  message: "Square footage must be a whole number",
                },
                min: {
                  value: 100,
                  message: "Value must be at least 100 sq ft",
                },
                max: {
                  value: 20000,
                  message: "Value must be less than 20,000 sq ft",
                },
              }),
            }}
          />
        </Stack>

        {/* Notes section */}
        <TextFieldWithLabel
          label="Additional Notes"
          id="note"
          placeholder="Additional notes "
          errorMsg={errors.note?.message}
          multiline={true}
          maxRows={3}
          inputProps={{
            ...register("note", {
              maxLength: {
                value: 500,
                message: "Notes must be 500 characters or less",
              },
            }),
          }}
        />

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Rental Information
          </Typography>
        </Divider>
        {/* Monthy rent and Additional Rent */}
        <Stack direction="row" spacing={2}>
          <TextFieldWithLabel
            label="Monthly Rent *"
            id="rent"
            placeholder="Monthly rent in USD. Eg, 2750.00"
            errorMsg={errors.rent?.message}
            inputProps={{
              ...register("rent", {
                required: "Rent is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Rent must be a valid amount (e.g. 2750.00)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Includes recurring charges such as utilities, parking, or other monthly services.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Add ons</Typography>
              </Stack>
            }
            id="additional_rent"
            placeholder="Additional fee. Eg, 400.00"
            errorMsg={errors.additional_rent?.message}
            inputProps={{
              ...register("additional_rent", {
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Additional fee must be a valid amount (e.g. 75.00)",
                },
              }),
            }}
          />
        </Stack>

        <Button variant="contained" disabled={isDisabled} type="submit">
          {isEditing ? "Edit Property" : "Add Property"}
        </Button>
      </Stack>
    </form>
  );
}

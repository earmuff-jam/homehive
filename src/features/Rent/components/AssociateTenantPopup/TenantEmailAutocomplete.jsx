import React from "react";

import { Controller } from "react-hook-form";

import { Autocomplete, ListItem, TextField, Typography } from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import { useLazyGetTenantListQuery } from "features/Api/tenantsApi";

const filter = createFilterOptions();

export default function TenantEmailAutocomplete({
  control,
  errors,
  setError,
  clearErrors,
}) {
  const [
    triggerGetExistingTenants,
    { data: existingTenantsList = [], isLoading: isExistingTenantsListLoading },
  ] = useLazyGetTenantListQuery();

  return (
    <Controller
      name="email"
      control={control}
      rules={{
        required: "Email Address is required",
      }}
      render={({ field }) => {
        // display inactive tenants for suggestion
        // active tenants are currently being a tenant somewhere else.
        const inactiveTenants =
          existingTenantsList
            ?.filter((t) => !t.isActive)
            .map((t) => ({ title: t.email })) || [];

        return (
          <Autocomplete
            {...field}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            loading={isExistingTenantsListLoading}
            options={inactiveTenants}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              if (option.inputValue) return option.inputValue;
              return option.title;
            }}
            onOpen={() => triggerGetExistingTenants(false)} // fetch inactive tenants only
            filterOptions={(options, params) => {
              const filtered = filter(options, params);
              const { inputValue } = params;
              const isExisting = options.some(
                (option) => inputValue === option.title,
              );
              if (inputValue !== "" && !isExisting && inputValue.length > 3) {
                filtered.push({
                  inputValue,
                  title: `Add "${inputValue}"`,
                });
              }
              return filtered;
            }}
            onChange={(_, newValue) => {
              let selectedValue = "";

              if (typeof newValue === "string") {
                selectedValue = newValue;
              } else if (newValue?.inputValue) {
                selectedValue = newValue.inputValue;
              } else if (newValue) {
                selectedValue = newValue.title;
              }

              // check if this tenant email already exists and is active elsewhere
              const tenantExists = existingTenantsList?.some(
                (t) => t.email === selectedValue && t.isActive,
              );

              if (tenantExists) {
                setError("email", {
                  type: "manual",
                  message:
                    "Cannot add selected tenant. Found association with another property.",
                });
              } else {
                clearErrors("email");
                field.onChange(selectedValue);
              }
            }}
            onBlur={() => {
              // Reset if user typed but didn’t select anything valid
              const currentValue = field.value || "";
              const validEmails = inactiveTenants.map((t) => t.title);
              if (
                currentValue &&
                !validEmails.includes(currentValue) &&
                !/.+@.+\..+/.test(currentValue)
              ) {
                field.onChange("");
              }
            }}
            renderOption={(props, option) => (
              <ListItem {...props}>
                <Typography>{option.title}</Typography>
              </ListItem>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Tenant Email Address *"
                placeholder="Select or enter tenant email address"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />
        );
      }}
    />
  );
}

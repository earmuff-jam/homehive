import {
  Control,
  Controller,
  FieldErrors,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";

import {
  Autocomplete,
  ListItem,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { createFilterOptions } from "@mui/material/Autocomplete";
import {
  useGetTenantListQuery,
  useLazyGetTenantListQuery,
} from "features/Api/tenantsApi";
import { TTenant, TTenantForm } from "features/Rent/Rent.types";

// TTenantOption ...
type TTenantOption = {
  title: string;
};

// TAddTenantOption ...
type TAddTenantOption = {
  inputValue: string;
  title: string;
};

// TAutocompleteOption ...
type TAutocompleteOption = TTenantOption | TAddTenantOption;

// TTenantEmailAutocompleteProps ...
export type TTenantEmailAutocompleteProps = {
  control: Control<TTenantForm>;
  errors: FieldErrors<TTenantForm>;
  setError: UseFormSetError<TTenantForm>;
  clearErrors: UseFormClearErrors<TTenantForm>;
};

const filter = createFilterOptions<TAutocompleteOption>();

export default function TenantEmailAutocomplete({
  control,
  errors,
  setError,
  clearErrors,
}: TTenantEmailAutocompleteProps) {
  const { data: activeTenants, isLoading } = useGetTenantListQuery(true);

  const [
    triggerGetExistingTenants,
    { data: inactiveTenants = [], isLoading: isInactiveTenantsLoading },
  ] = useLazyGetTenantListQuery();

  if (isLoading) return <Skeleton height="inherit" />;

  return (
    <Controller
      name="email"
      control={control}
      rules={{
        required: "Email Address is required",
      }}
      render={({ field }) => {
        return (
          <Autocomplete
            {...field}
            freeSolo
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            loading={isInactiveTenantsLoading}
            options={inactiveTenants.map((t) => ({ title: t.email })) || []}
            getOptionLabel={(option) => {
              if (typeof option === "string") return option;
              if (option.inputValue) return option.inputValue;
              return option.title;
            }}
            onOpen={() => triggerGetExistingTenants(false)}
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

              const tenantExists = activeTenants?.some(
                (t) => t.email === selectedValue,
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
              const validEmails = inactiveTenants.map((t) => t.email);
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

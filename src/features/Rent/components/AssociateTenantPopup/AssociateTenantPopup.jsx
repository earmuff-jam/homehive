import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { InfoRounded, UpdateRounded } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { useAssociateTenantMutation } from "features/Api/tenantsApi";
import { LEASE_TERM_MENU_OPTIONS } from "features/Rent/common/constants";
import TenantEmailAutocomplete from "features/Rent/components/AssociateTenantPopup/TenantEmailAutocomplete";
import {
  fetchLoggedInUser,
  isAssociatedPropertySoR,
} from "features/Rent/utils";

export default function AssociateTenantPopup({
  closeDialog,
  property,
  tenants,
}) {
  const user = fetchLoggedInUser();
  const currentUserId = user?.uid;

  const [
    associateTenant,
    { isLoading: associateTenantLoading, isSuccess: associateTenantSuccess },
  ] = useAssociateTenantMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    setValue,
    register,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      email: "",
      start_date: dayjs().toISOString(),
      term: "",
      tax_rate: "",
      rent: "",
      isPrimary: false,
      isSoR: false,
      grace_period: 3,
      assignedRoomName: "",
    },
  });

  const onSubmit = async (data) => {
    const draftData = { ...data };

    if (!draftData.isSoR) delete draftData.assignedRoomName;

    draftData.id = uuidv4();
    draftData.isActive = true;
    draftData.propertyId = property.id;
    draftData.createdBy = currentUserId;
    draftData.createdOn = dayjs().toISOString();
    draftData.updatedBy = currentUserId;
    draftData.updatedOn = dayjs().toISOString();

    associateTenant({ draftData, property });
  };

  const isSoR = watch("isSoR");

  useEffect(() => {
    if (property) {
      setValue("rent", property?.rent || "");
    }
  }, [property]);

  useEffect(() => {
    if (associateTenantSuccess) {
      setShowSnackbar(true);
      reset();
      closeDialog();
    }
  }, [associateTenantLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Divider>
        <Typography variant="caption"> Lease Information </Typography>
      </Divider>
      <Stack spacing={2}>
        {/* Lease Start Date */}
        <Box sx={{ flex: 1 }}>
          <Controller
            name="start_date"
            control={control}
            defaultValue={null}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <Box width="100%">
                <Typography
                  variant="body2"
                  color="textSecondary"
                  fontWeight="medium"
                >
                  Lease start date *
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <MobileDatePicker
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: "small",
                      },
                    }}
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(date) => field.onChange(date?.toISOString())}
                  />
                </LocalizationProvider>
              </Box>
            )}
          />
        </Box>

        {/* Lease Term */}
        <Controller
          name="term"
          control={control}
          render={({ field }) => (
            <FormControl
              fullWidth
              size="small"
              variant="standard"
              error={!!errors.term}
            >
              <Typography variant="caption" gutterBottom>
                Select lease term length *
              </Typography>
              <Select
                {...field}
                labelId="lease-term-label"
                displayEmpty
                variant="outlined"
                size="small"
              >
                <MenuItem value="" disabled>
                  <em>Select Lease Term</em>
                </MenuItem>
                {LEASE_TERM_MENU_OPTIONS.map((option) => (
                  <MenuItem key={option.id} value={option?.value}>
                    {option?.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />

        {/* Tax Rate and Rent */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="The tax rate applied in percentage. Set 1 for default value.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Standard Tax rate *</Typography>
              </Stack>
            }
            id="tax_rate"
            placeholder="Standard tax rate. Eg, 1"
            errorMsg={errors.tax_rate?.message}
            inputProps={register("tax_rate", {
              required: "Tax rate is required.",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Must be a valid number with up to 2 decimals.",
              },
            })}
          />

          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Monthly rent amount is the populated from the property details">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2" disabled>
                  Monthly Rent Amount
                </Typography>
              </Stack>
            }
            id="rent"
            isDisabled
            placeholder="Monthly rent amount. Eg, 2150.00"
            errorMsg={errors.rent?.message}
            inputProps={register("rent")}
          />
        </Stack>

        {/* Initial Late Fee and Daily Late Fee */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextFieldWithLabel
            label="Initial Late Fee *"
            id="initial_late_fee"
            placeholder="Initial Late fee. Eg, 75.00"
            errorMsg={errors.initial_late_fee?.message}
            inputProps={{
              ...register("initial_late_fee", {
                required:
                  "Initial Late Fee is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Rent must be a valid amount (e.g. 75.00)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Daily Late fee is the late fee applied after the grace period is over. Eg, 10$ per day daily rental fee should be 10.00">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "0.875rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Late fee / day *</Typography>
              </Stack>
            }
            id="daily_late_fee *"
            placeholder="Daily late fee. Eg, 5.00"
            errorMsg={errors.daily_late_fee?.message}
            inputProps={{
              ...register("daily_late_fee", {
                required:
                  "Daily Late Fee is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Daily late fee must be valid amount per day. Eg, 10.00",
                },
              }),
            }}
          />
        </Stack>

        {/* Grace period */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="The number of days of grace period provided to the tenant. A default value of 3 is provided to the user by default. Property owners are encouraged to keep the default days as is for tenant feasibility.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2"> Grace period *</Typography>
              </Stack>
            }
            id="grace_period"
            placeholder="The days before the late fee is calculated"
            errorMsg={errors.grace_period?.message}
            inputProps={{
              ...register("grace_period", {
                required:
                  "Grace period is required and must be in number format.",
                pattern: {
                  value: /\d+/,
                  message: "Must be a valid amount (e.g. 10)",
                },
              }),
            }}
          />
        </Stack>

        <Divider>
          <Typography variant="caption"> Tenant Information </Typography>
        </Divider>

        <TenantEmailAutocomplete
          control={control}
          errors={errors}
          setError={setError}
          clearErrors={clearErrors}
        />

        {/* Checkboxes */}
        <Controller
          name="isPrimary"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={tenants?.some((t) => t.isPrimary)}
                />
              }
              label="Primary point of contact (PoC)"
            />
          )}
        />

        <Controller
          name="isSoR"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={!isAssociatedPropertySoR(property, tenants)}
                />
              }
              label="Single Occupancy Room (SoR)?"
            />
          )}
        />

        {isSoR && (
          <Controller
            name="assignedRoomName"
            control={control}
            render={({ field }) => (
              <TextFieldWithLabel
                label="Room Name"
                placeholder="Assign the above user a room"
                errorMsg={errors.assignedRoomName?.message}
                {...field}
              />
            )}
          />
        )}

        <Button
          startIcon={<UpdateRounded fontSize="small" />}
          variant="outlined"
          type="submit"
          disabled={!isValid}
        >
          Update
        </Button>

        <CustomSnackbar
          showSnackbar={showSnackbar}
          setShowSnackbar={setShowSnackbar}
          title="Changes saved."
        />
      </Stack>
    </form>
  );
}

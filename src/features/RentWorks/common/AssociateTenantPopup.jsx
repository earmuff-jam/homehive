import { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { InfoRounded, UpdateRounded } from "@mui/icons-material";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import TextFieldWithLabel from "common/UserInfo/TextFieldWithLabel";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import {
  useCreateTenantMutation,
  useLazyGetTenantListQuery,
} from "features/Api/tenantsApi";
import { LEASE_TERM_MENU_OPTIONS } from "features/RentWorks/common/constants";
import {
  fetchLoggedInUser,
  isAssociatedPropertySoR,
} from "features/RentWorks/common/utils";

export default function AssociateTenantPopup({
  closeDialog,
  property,
  tenants,
}) {
  const user = fetchLoggedInUser();
  const currentUserId = user?.uid;

  const [createTenant] = useCreateTenantMutation();
  const [updateProperty] = useUpdatePropertyByIdMutation();
  const [
    triggerGetExistingTenants,
    { data: existingTenantsList = [], isLoading: isExistingTenantsListLoading },
  ] = useLazyGetTenantListQuery();

  // autocomplete needs input for typing
  const [inputValue, setInputValue] = useState("");
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
      assignedRoomName: "",
    },
  });

  const [open, setOpen] = useState(false);

  const handleTriggerAutocomplete = () => {
    setOpen(!open);
    triggerGetExistingTenants();
  };

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

    try {
      await createTenant(draftData).unwrap();
      await updateProperty({
        id: property?.id,
        rentees: [...(property?.rentees || []), draftData?.email],
        updatedBy: user?.uid,
        updatedOn: dayjs().toISOString(),
      }).unwrap();

      setShowSnackbar(true);
      reset();
      closeDialog();
    } catch (error) {
      /* eslint-disable no-console */
      console.error(error);
    }
  };

  const isSoR = watch("isSoR");

  useEffect(() => {
    if (property) {
      setValue("rent", property?.rent || "");
    }
  }, [property]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Divider>
        <Typography variant="caption"> Lease Information </Typography>
      </Divider>
      <Stack spacing={2}>
        {/* Lease Start Date */}
        <Controller
          name="start_date"
          control={control}
          render={({ field }) => (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <MobileDatePicker
                label="Lease start date *"
                value={dayjs(field.value)}
                onChange={(date) => field.onChange(date?.toISOString())}
                slotProps={{
                  textField: {
                    size: "small",
                    variant: "standard",
                    sx: { flexGrow: 1 },
                  },
                }}
              />
            </LocalizationProvider>
          )}
        />

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
        <Stack direction="row" spacing={1}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="The tax rate applied in percentage.">
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
        <Stack direction="row" spacing={2}>
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
                <Typography variant="subtitle2">Late fee / day </Typography>
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

        <Divider>
          <Typography variant="caption"> Tenant Information </Typography>
        </Divider>

        {/* Email Autocomplete */}
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email Address is required",
            validate: (value) =>
              value?.trim().length > 3 ||
              "Email Address must be more than 3 characters",
          }}
          render={({ field }) => {
            // only display inactive members, since active members are tenants somewhere else.
            const existingOptions =
              existingTenantsList
                ?.filter((tenant) => !tenant.isActive)
                .map((v) => v.email) || [];
            const options =
              inputValue &&
              !existingOptions.includes(inputValue) &&
              inputValue.length > 3
                ? [...existingOptions, `Create new: ${inputValue}`]
                : existingOptions;

            return (
              <Autocomplete
                freeSolo
                open={open}
                options={options}
                value={field.value}
                inputValue={inputValue}
                onOpen={handleTriggerAutocomplete}
                loading={isExistingTenantsListLoading}
                onInputChange={(_, newInput) => setInputValue(newInput)}
                onChange={(_, newValue, reason) => {
                  const selectedValue =
                    typeof newValue === "string" &&
                    newValue.startsWith("Create new:")
                      ? newValue.replace("Create new: ", "")
                      : newValue;

                  const doesTenantExist = existingTenantsList?.some(
                    (tenant) => tenant.email === selectedValue,
                  );
                  if (doesTenantExist) {
                    setError("email", {
                      type: "manual",
                      message:
                        "Cannot add selected tenant. Found association with another property.",
                    });
                  } else {
                    clearErrors("email");
                    field.onChange(selectedValue);
                  }
                  // hide menu option when clear is pressed
                  reason === "clear" ? setOpen(false) : setOpen(!open);
                }}
                renderOption={(props, option) => (
                  <ListItem {...props}>
                    <Typography sx={{ textTransform: "initial" }}>
                      {option || ""}
                    </Typography>
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
                    sx={{ textTransform: "initial" }}
                  />
                )}
              />
            );
          }}
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

import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  AutorenewOutlined,
  InfoRounded,
  UpdateRounded,
} from "@mui/icons-material";
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
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useAssociateTenantMutation } from "features/Api/tenantsApi";
import { DefaultLeaseTermOptions } from "features/Rent/common/constants";
import TenantEmailAutocomplete from "features/Rent/components/AssociateTenantPopup/TenantEmailAutocomplete";
import {
  AddNotificationEnumType,
  AddTenantNotificationEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
  isAssociatedPropertySoR,
} from "features/Rent/utils";

export default function AssociateTenantPopup({
  closeDialog,
  property,
  tenants,
  refetchGetProperty,
}) {
  const user = fetchLoggedInUser();

  const [sendEmail] = useSendEmailMutation();
  const [associateTenant, associateTenantResult] = useAssociateTenantMutation();

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
      startDate: dayjs().toISOString(),
      term: DefaultLeaseTermOptions.find(
        (leaseOption) => leaseOption.amount === 12,
      ).value,
      taxRate: 1,
      rent: "",
      initialLateFee: 75,
      dailyLateFee: 10,
      initialAnimalVoilationFee: 300,
      dailyAnimalVoilationFee: 25,
      returnedPaymentFee: 75,
      gracePeriod: 3,
      isAutoRenewPolicySet: false,
      autoRenewDays: 60,
      isPrimary: true,
      isSoR: false,
      assignedRoomName: "",
      guestsPermittedStayDays: 15,
      tripCharge: 60,
      allowKeyboxSince: 4,
      removeKeyboxFee: 50,
      inventoryCompleteWithin: 10,
      rentDueDate: 4, // how many days the rent can be delayed from due date
    },
  });

  const onSubmit = async (data) => {
    const draftData = { ...data };

    if (!draftData.isSoR) {
      draftData.isPrimary = true;
      delete draftData.assignedRoomName;
    }
    draftData.id = uuidv4();
    draftData.isActive = true;
    draftData.propertyId = property.id;
    draftData.propertyName = property.name;
    draftData.createdBy = user?.uid;
    draftData.createdOn = dayjs().toISOString();
    draftData.updatedBy = user?.uid;
    draftData.updatedOn = dayjs().toISOString();

    associateTenant({ draftData, property });
  };

  const isSoR = watch("isSoR");
  const isPrimaryTenant = watch("isPrimary");
  const isAutoRenewPolicySet = watch("isAutoRenewPolicySet");

  useEffect(() => {
    if (property) {
      setValue("rent", property?.rent || "");
    }
  }, [property]);

  useEffect(() => {
    if (associateTenantResult.isSuccess) {
      setShowSnackbar(true);

      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(
          AddNotificationEnumType,
          associateTenantResult.originalArgs.property?.name,
        ),
        user?.email,
      );

      formatAndSendNotification({
        to: associateTenantResult.originalArgs.draftData.email,
        subject: `${AddTenantNotificationEnumValue} - ${associateTenantResult.originalArgs.property?.name}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });

      reset();
      closeDialog();
      refetchGetProperty();
    }
  }, [associateTenantResult.isLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Divider>
        <Typography variant="caption"> Lease Information </Typography>
      </Divider>
      <Stack spacing={2}>
        {/* Lease Start Date */}
        <Box sx={{ flex: 1 }}>
          <Controller
            name="startDate"
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
                {DefaultLeaseTermOptions.map((option) => (
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
            id="taxRate"
            placeholder="Standard tax rate. Eg, 1"
            errorMsg={errors.taxRate?.message}
            inputProps={register("taxRate", {
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

        <Divider>
          <Typography variant="caption"> Charges and Fees </Typography>
        </Divider>

        {/* Initial Late Fee and Daily Late Fee */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Initial Late fee is the late fee applied the first day after the grace period is over. Eg, an initial late fee would be eg, $75.00">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "0.875rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Initial Late fee *</Typography>
              </Stack>
            }
            id="initialLateFee"
            placeholder="Initial Late fee. Eg, 75.00"
            errorMsg={errors.initialLateFee?.message}
            inputProps={{
              ...register("initialLateFee", {
                required:
                  "Initial Late Fee is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Initial late fee must be a valid amount (e.g. 75.00)",
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
            id="dailyLateFee"
            placeholder="Daily late fee. Eg, 5.00"
            errorMsg={errors.dailyLateFee?.message}
            inputProps={{
              ...register("dailyLateFee", {
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

        {/* Initial animal voilation fee and daily animal voilation fee */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Initial Animal Voilation Fee is the voilation fee applied the first day after the voilation was noted. Eg, an initial animal voilation fee would be eg, $300.00">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "0.875rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Initial Animal Voilation Fee *
                </Typography>
              </Stack>
            }
            id="initialAnimalVoilationFee"
            placeholder="Initial Animal Voilation fee. Eg, 300.00"
            errorMsg={errors.initialAnimalVoilationFee?.message}
            inputProps={{
              ...register("initialAnimalVoilationFee", {
                required:
                  "Initial Animal Voilation Fee is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Initial animal voilation fee must be a valid amount (e.g. 300.00)",
                },
              }),
            }}
          />
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Animal voilation fee is the fee applied after the grace period is over. Eg, 10$ per day daily fee should be 10.00">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "0.875rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Animal voilation fee / day *
                </Typography>
              </Stack>
            }
            id="dailyAnimalVoilationFee"
            placeholder="Daily Animal voilation fee. Eg, 5.00"
            errorMsg={errors.dailyAnimalVoilationFee?.message}
            inputProps={{
              ...register("dailyAnimalVoilationFee", {
                required:
                  "Daily Animal voilation fee is required and must be in number format.",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message:
                    "Daily Animal voilation fee must be valid amount per day. Eg, 10.00",
                },
              }),
            }}
          />
        </Stack>

        <TextFieldWithLabel
          label={
            <Stack direction="row" alignItems="center">
              <Tooltip title="Fee amount when payment is incomplete or not processed properly.">
                <InfoRounded
                  color="secondary"
                  fontSize="small"
                  sx={{ fontSize: "1rem", margin: "0.2rem" }}
                />
              </Tooltip>
              <Typography variant="subtitle2">
                Fee associated with each return *
              </Typography>
            </Stack>
          }
          id="returnedPaymentFee"
          placeholder="Enter returned payment fee in exact amount. Eg, 7.25"
          errorMsg={errors.returnedPaymentFee?.message}
          inputProps={{
            ...register("returnedPaymentFee", {
              required: "Returned payment fee is required",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message:
                  "Returned payment fee should be in dollar format. Eg, 7.25",
              },
            }),
          }}
        />

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
            id="gracePeriod"
            placeholder="The days before the late fee is calculated"
            errorMsg={errors.gracePeriod?.message}
            inputProps={{
              ...register("gracePeriod", {
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

        {/* Owner covered utilities */}
        <Stack>
          <Controller
            name="isAutoRenewPolicySet"
            control={control}
            defaultValue={false}
            render={({ field }) => (
              <FormControlLabel
                control={<Checkbox {...field} checked={field.value} />}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AutorenewOutlined />
                    <Typography variant="subtitle2">
                      {`Setup auto renewal for ${property?.name}`}
                    </Typography>
                    <Tooltip title="Auto renewal support includes the ability to auto renew lease as the rental time comes closer to an end. For auto renewal process to work smoothly please ensure that all required values are entered correctly to the best of your knowledge.">
                      <InfoRounded
                        color="secondary"
                        fontSize="small"
                        sx={{ fontSize: "1rem", margin: "0.2rem" }}
                      />
                    </Tooltip>
                  </Stack>
                }
              />
            )}
          />
          {isAutoRenewPolicySet && (
            <TextFieldWithLabel
              label={
                <Stack direction="row" alignItems="center">
                  <Tooltip title="Enter the amount of days you would like the auto renewal notice to be sent within. Eg, 60 days.">
                    <InfoRounded
                      color="secondary"
                      fontSize="small"
                      sx={{ fontSize: "1rem", margin: "0.2rem" }}
                    />
                  </Tooltip>
                  <Typography variant="subtitle2">
                    Send auto renewal notice in *
                  </Typography>
                </Stack>
              }
              id="autoRenewDays"
              placeholder="Enter the exact days to send the lease in. Eg, 60."
              errorMsg={errors.autoRenewDays?.message}
              inputProps={{
                ...register("autoRenewDays", {
                  required: "Auto renewal days is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Auto renewal days must be a valid days (e.g. 60)",
                  },
                }),
              }}
            />
          )}
        </Stack>

        <Stack>
          <Controller
            name="isPrimary"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Checkbox
                    {...field}
                    checked={field.value}
                    disabled={tenants.some((t) => t.isPrimary)}
                  />
                }
                label="Primary point of contact (PoC)"
              />
            )}
          />
        </Stack>

        <Stack>
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
        </Stack>

        <Divider>
          <Typography variant="caption">Permits and Responsibilites</Typography>
        </Divider>

        {/* guestsPermittedStayDays and owner trip charge */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Enter the amount of days the tenant can have guests in the property without informing the owner.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Guests permitted stay days
                </Typography>
              </Stack>
            }
            id="guestsPermittedStayDays"
            placeholder="Enter the number of days tenant's guests are permitted to stay. Eg, 15."
            errorMsg={errors.guestsPermittedStayDays?.message}
            inputProps={{
              ...register("guestsPermittedStayDays", {
                required: "Guest permitted stay days is required",
                pattern: {
                  value: /^\d+$/,
                  message:
                    "Guest permitted stay days must be a valid days (e.g. 60)",
                },
              }),
            }}
          />

          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Enter the charge amount tenants would incur when they request assistance.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Owner trip charge</Typography>
              </Stack>
            }
            id="tripCharge"
            placeholder="Enter the charge amount tenants incur when they request assistance. Eg, 60."
            errorMsg={errors.tripCharge?.message}
            inputProps={{
              ...register("tripCharge", {
                required: "Owner trip charge is required",
                pattern: {
                  value: /^\d+$/,
                  message: "Owner trip charge must be a valid days (e.g. 60)",
                },
              }),
            }}
          />
        </Stack>

        {/* keybox information */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="Enter the amount of days allowed for the owner to setup a keybox for the property for new prospective tenants.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Allow keybox since *
                </Typography>
              </Stack>
            }
            id="allowKeyboxSince"
            placeholder="Enter the number of days allowed to setup a keybox. Eg, 4."
            errorMsg={errors.allowKeyboxSince?.message}
            inputProps={{
              ...register("allowKeyboxSince", {
                required: "Allow keybox since days is required",
                pattern: {
                  value: /^\d+$/,
                  message:
                    "Allow keybox since days must be a valid days (e.g. 4)",
                },
              }),
            }}
          />

          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="The cost tenant can pay to remove the keybox. Eg, 45.00.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Remove keybox fee *</Typography>
              </Stack>
            }
            id="removeKeyboxFee"
            placeholder="Enter fee associated with removing the keybox. Eg, 45."
            errorMsg={errors.removeKeyboxFee?.message}
            inputProps={{
              ...register("removeKeyboxFee", {
                required: "Remove keybox fee is required",
                pattern: {
                  value: /^\d+$/,
                  message: "Remove keybox fee must be a valid days (e.g. 60)",
                },
              }),
            }}
          />

          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="The number of late days payment can be accepted on from the due date. Eg, 4.">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">Rent due date *</Typography>
              </Stack>
            }
            id="rentDueDate"
            placeholder="Enter the days past the start date the rent is due. Eg, 4."
            errorMsg={errors.rentDueDate?.message}
            inputProps={{
              ...register("rentDueDate", {
                required: "Rent due date is required",
                pattern: {
                  value: /^\d+$/,
                  message: "Rent due date must be a valid days (e.g. 5)",
                },
              }),
            }}
          />
        </Stack>

        {/* Tenant must complete inventory within */}
        <Stack>
          <TextFieldWithLabel
            label={
              <Stack direction="row" alignItems="center">
                <Tooltip title="The timeframe allocated to complete the initial home inventory">
                  <InfoRounded
                    color="secondary"
                    fontSize="small"
                    sx={{ fontSize: "1rem", margin: "0.2rem" }}
                  />
                </Tooltip>
                <Typography variant="subtitle2">
                  Complete inventory within days mentioned below
                </Typography>
              </Stack>
            }
            id="inventoryCompleteWithin"
            placeholder="Enter the timeframe allocated to complete an initial home inventory. Eg, 10."
            errorMsg={errors.inventoryCompleteWithin?.message}
            inputProps={{
              ...register("inventoryCompleteWithin", {
                required: "Inventory Complete within is required",
                pattern: {
                  value: /^\d+$/,
                  message:
                    "Inventory Complete within must be a valid days (e.g. 60)",
                },
              }),
            }}
          />
        </Stack>

        <AButton
          label="Associate"
          startIcon={<UpdateRounded fontSize="small" />}
          variant="outlined"
          type="submit"
          disabled={!isValid || (!isSoR && !isPrimaryTenant)}
        />

        <CustomSnackbar
          showSnackbar={showSnackbar}
          setShowSnackbar={setShowSnackbar}
          title="Changes saved."
        />
      </Stack>
    </form>
  );
}

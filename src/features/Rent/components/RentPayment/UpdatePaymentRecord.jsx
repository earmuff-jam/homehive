import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";

import dayjs from "dayjs";

import { AddRounded } from "@mui/icons-material";
import { Alert, Box, Divider, Stack, Typography } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  useGetRentRecordQuery,
  useUpdateRentRecordMutation,
} from "features/Api/rentApi";
import { RentalPaymentEnumValues } from "features/Rent/constants";
import {
  ManualRentStatusEnumValue,
  UpdateRentPaymentNotificationEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
} from "features/Rent/utils";

// DEFAULT_RENT_RECORD_FORM_VALUES ...
// defines the rent record form values
const DEFAULT_RENT_RECORD_FORM_VALUES = {
  ownerFirstName: "",
  ownerLastName: "",
  email: "",
  tenantFirstName: "",
  tenantLastName: "",
  tenantEmailAddress: "",
  rentAmount: "",
  paymentMethod: "",
  rentMonth: "",
  rentPaidDate: "",
  note: "",
};

const UpdateRentRecord = ({ rentId, propertyName, closeDialog }) => {
  const user = fetchLoggedInUser();

  const {
    data: rentRecord,
    isLoading: isRentRecordLoading,
    isSuccess: isRentRecordSuccess,
  } = useGetRentRecordQuery(
    {
      rentId: rentId,
    },
    { skip: !rentId },
  );

  const {
    data: propertyOwnerData = {},
    isLoading: isPropertyOwnerDataLoading,
    isSuccess: isPropertyOwnerDataSuccess,
  } = useGetUserDataByIdQuery(rentRecord?.propertyOwnerId, {
    skip: !rentRecord?.propertyOwnerId,
  });

  const {
    data: tenantData = {},
    isLoading: isTenantsLoading,
    isSuccess: isTenantsSuccess,
  } = useGetUserDataByIdQuery(rentRecord?.tenantId, {
    skip: !rentRecord?.tenantId,
  });

  const [sendEmail] = useSendEmailMutation();

  const [
    updateRentRecord,
    {
      isLoading: isUpdateRentRecordLoading,
      isSuccess: isUpdateRentRecordSuccess,
      originalArgs: updateRentRecordOriginalArgs,
    },
  ] = useUpdateRentRecordMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: DEFAULT_RENT_RECORD_FORM_VALUES,
  });

  const onSubmit = (data) => {
    updateRentRecord({
      ...data,
      id: rentId,
      status: ManualRentStatusEnumValue,
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (!isRentRecordSuccess || !rentRecord) return;

    setValue("tenantFirstName", rentRecord.tenantFirstName || "");
    setValue("tenantLastName", rentRecord.tenantLastName || "");
    setValue("tenantEmailAddress", rentRecord.tenantEmail || "");
    setValue("rentAmount", rentRecord.rentAmount || "");
    setValue("paymentMethod", rentRecord?.paymentMethod || "");
    setValue(
      "rentMonth",
      dayjs(rentRecord?.rentMonth).format("MMMM YYYY") || "",
    );
    setValue("rentPaidDate", dayjs().toISOString() || "");
    setValue("note", rentRecord.note || "");
  }, [isRentRecordLoading, rentRecord]);

  useEffect(() => {
    if (!isPropertyOwnerDataSuccess || !propertyOwnerData) return;

    setValue("ownerFirstName", propertyOwnerData.firstName || "");
    setValue("ownerLastName", propertyOwnerData.lastName || "");
    setValue("email", propertyOwnerData.email || "");
  }, [isPropertyOwnerDataLoading, propertyOwnerData]);

  useEffect(() => {
    if (!isTenantsSuccess || !tenantData) return;

    setValue("tenantFirstName", tenantData?.firstName || "");
    setValue("tenantLastName", tenantData?.lastName || "");
  }, [isTenantsLoading]);

  useEffect(() => {
    if (isUpdateRentRecordSuccess) {
      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(
          UpdateRentPaymentNotificationEnumValue,
          propertyName,
        ),
        user?.email,
      );

      formatAndSendNotification({
        to: updateRentRecordOriginalArgs?.tenantEmail,
        subject: `${UpdateRentPaymentNotificationEnumValue} - ${propertyName}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });

      closeDialog();
    }
  }, [isUpdateRentRecordLoading]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1}>
        <Divider>
          <Typography variant="caption" color="textSecondary">
            Property Owner Information
          </Typography>
        </Divider>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Owner First Name *"
            id="ownerFirstName"
            placeholder="First Name of your property owner"
            errorMsg={errors.ownerFirstName?.message}
            inputProps={{
              ...register("ownerFirstName", {
                required: "Owner First Name is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Owner Last Name *"
            id="ownerLastName"
            placeholder="Last Name of your property owner"
            errorMsg={errors.ownerLastName?.message}
            inputProps={{
              ...register("ownerLastName", {
                required: "Owner Last Name is required",
              }),
            }}
          />
        </Stack>
        <TextFieldWithLabel
          label="Email Address *"
          id="email"
          placeholder="Email address of the property owner"
          errorMsg={errors.email?.message}
          isDisabled
          inputProps={{
            ...register("email", {
              required: "Email address is required",
            }),
          }}
        />

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Tenant Information
          </Typography>
        </Divider>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Tenant First Name *"
            id="tenantFirstName"
            placeholder="First Name of your primary tenant"
            errorMsg={errors.tenantFirstName?.message}
            inputProps={{
              ...register("tenantFirstName", {
                required: "Tenant First Name is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Tenant Last Name *"
            id="tenantLastName"
            placeholder="Last Name of your primary tenant"
            errorMsg={errors.tenantLastName?.message}
            inputProps={{
              ...register("tenantLastName", {
                required: "Tenant Last Name is required",
              }),
            }}
          />
        </Stack>
        <TextFieldWithLabel
          label="Email Address *"
          id="tenantEmailAddress"
          placeholder="Email address of the primary tenant"
          errorMsg={errors.tenantEmailAddress?.message}
          inputProps={{
            ...register("tenantEmailAddress", {
              required: "Email address is required",
            }),
          }}
        />

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Rent Information
          </Typography>
        </Divider>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Rent Amount *"
            id="rentAmount"
            placeholder="Rent Amount"
            errorMsg={errors.rentAmount?.message}
            inputProps={{
              ...register("rentAmount", {
                required: "Rent Amount is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Payment Method *"
            id="paymentMethod"
            value={RentalPaymentEnumValues[watch("paymentMethod")] || ""}
            placeholder="Payment Method"
            errorMsg={errors.paymentMethod?.message}
            inputProps={{
              ...register("paymentMethod", {
                required: "Payment Method is required",
              }),
            }}
          />
        </Stack>

        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <Box sx={{ flex: 1 }}>
            <Controller
              name="rentMonth"
              control={control}
              defaultValue={null}
              rules={{ required: "Rent Month is required" }}
              render={({ field }) => (
                <Box width="100%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontWeight="medium"
                  >
                    Rent Month *
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      openTo="month"
                      views={["year", "month"]}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  </LocalizationProvider>
                </Box>
              )}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Controller
              name="rentPaidDate"
              control={control}
              defaultValue={null}
              rules={{ required: "Rent paid date is required" }}
              render={({ field }) => (
                <Box width="100%">
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontWeight="medium"
                  >
                    Rent paid date *
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileDatePicker
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                      disablePast
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  </LocalizationProvider>
                </Box>
              )}
            />
          </Box>
        </Stack>

        <Stack>
          <TextFieldWithLabel
            label="Note"
            id="note"
            multiline
            maxRows={5}
            placeholder="Note in less than 300 characters"
            errorMsg={errors.note?.message}
            inputProps={{
              ...register("note", {
                max: {
                  value: 300,
                  message: "Note should be less than 300 characters",
                },
              }),
            }}
          />
        </Stack>

        <Alert severity="error">
          <Typography variant="subtitle2" fontWeight={600}>
            Important: Confirm Payment Records
          </Typography>
          <Typography variant="body2">
            By updating this payment record, you acknowledge that you have
            received the agreed payment in full through Cash App. This action
            will mark the payment as completed. This action cannot be undone.
          </Typography>
        </Alert>

        <AButton
          variant="outlined"
          disabled={!isValid}
          endIcon={<AddRounded fontSize="small" />}
          label="Update rent record"
          loading={isUpdateRentRecordLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Stack>
    </form>
  );
};

export default UpdateRentRecord;

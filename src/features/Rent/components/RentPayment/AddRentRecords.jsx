import React, { useEffect, useMemo } from "react";

import { Controller, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { AddRounded } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import {
  useGetUserByEmailAddressQuery,
  useGetUserDataByIdQuery,
} from "features/Api/firebaseUserApi";
import {
  useCreateRentRecordMutation,
  useGetRentsByPropertyIdQuery,
} from "features/Api/rentApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import { RENT_INCOME_BADGES } from "features/Rent/constants";
import {
  AddRentPaymentNotificationEnumValue,
  ManualRentStatusEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
} from "features/Rent/utils";
import { celebrations } from "src/utils/celebrations";

export default function AddRentRecords({
  property,
  validateBadge,
  setShowSnackbar,
  closeDialog,
}) {
  const user = fetchLoggedInUser();

  const [sendEmail] = useSendEmailMutation();

  const [
    createRentRecord,
    {
      isLoading: isCreateRentRecordLoading,
      isSuccess: isCreateRentRecordSuccess,
      originalArgs: createRentRecordOrginalArgs,
    },
  ] = useCreateRentRecordMutation();

  const {
    data: propertyOwnerData = {},
    isLoading: isPropertyOwnerDataLoading,
  } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const { data: tenants = [] } = useGetTenantByPropertyIdQuery(property?.id, {
    skip: !property?.id,
  });

  const { data: rentList = [] } = useGetRentsByPropertyIdQuery(
    { propertyId: property?.id, currentUserEmail: user?.email },
    {
      skip: !property?.id,
    },
  );

  const primaryTenant = useMemo(
    () => tenants?.find((tenant) => tenant.isPrimary),
    [tenants],
  );

  const { data: primaryTenantDetails = {} } = useGetUserByEmailAddressQuery(
    primaryTenant?.email,
    {
      skip: !primaryTenant?.email,
    },
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const draftData = {
      id: uuidv4(),
      tenantEmail: primaryTenant?.email,
      propertyId: property?.id,
      propertyOwnerId: property?.createdBy,
      tenantId: primaryTenant?.id,
      rentAmount: data?.rentAmount,
      rentMonth: dayjs(data?.rentMonth).format("MMMM YYYY"),
      paymentMethod: data?.paymentMethod,
      note: data?.note,
      ...(propertyOwnerData?.stripeOwnerAccountId && {
        stripeOwnerAccountId: propertyOwnerData.stripeOwnerAccountId,
      }),
    };

    createRentRecord({
      ...draftData,
      status: ManualRentStatusEnumValue,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (isCreateRentRecordSuccess && createRentRecord) {
      const allocatedBadge = RENT_INCOME_BADGES[rentList?.length + 1]?.value;
      allocatedBadge &&
        validateBadge({ uid: user?.uid, keys: [allocatedBadge] });

      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(AddRentPaymentNotificationEnumValue, property.name),
        user?.email,
      );

      formatAndSendNotification({
        to: createRentRecordOrginalArgs?.tenantEmail,
        subject: `${AddRentPaymentNotificationEnumValue} - ${property.name}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });

      closeDialog();
      setShowSnackbar(true);
      celebrations?.commonConfetti();
    }
  }, [isCreateRentRecordLoading]);

  useEffect(() => {
    if (primaryTenant) {
      setValue("tenantEmailAddress", primaryTenant?.email);
      setValue("tenantFirstName", primaryTenantDetails?.firstName);
      setValue("tenantLastName", primaryTenantDetails?.lastName);
    }
  }, [primaryTenant?.id]);

  useEffect(() => {
    if (propertyOwnerData) {
      reset({
        ownerFirstName: propertyOwnerData?.firstName,
        ownerLastName: propertyOwnerData?.lastName,
        email: propertyOwnerData?.email,
        rentAmount: Number(property?.rent) + Number(property?.additionalRent),
      });
    }
  }, [isPropertyOwnerDataLoading]);

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

        <AButton
          variant="outlined"
          disabled={!isValid}
          endIcon={<AddRounded fontSize="small" />}
          label="Create rent record"
          loading={isCreateRentRecordLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Stack>
    </form>
  );
}

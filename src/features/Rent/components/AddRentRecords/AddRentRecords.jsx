import React, { useEffect } from "react";

import { Controller, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { AddRounded } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { DateCalendar, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import { useCreateRentRecordMutation } from "features/Api/rentApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import { fetchLoggedInUser, formatCurrency } from "features/Rent/utils/utils";

export const AddRentRecords = ({ property, setShowSnackbar, closeDialog }) => {
  const user = fetchLoggedInUser();
  const [
    createRentRecord,
    {
      isSuccess: isCreateRentRecordSuccess,
      isLoading: isCreateRentRecordLoading,
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

  const primaryTenant = tenants
    ?.filter((tenant) => tenant.isPrimary)
    .find((item) => item);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

  const onSubmit = (data) => {
    const draftRentAmount = formatCurrency(Number(property?.rent));
    const draftAdditionalCharges = formatCurrency(
      Number(property?.additional_rent),
    );
    const draftData = {
      id: uuidv4(),
      rentAmount: Math.round(draftRentAmount * 100),
      additionalCharges: Math.round(draftAdditionalCharges * 100),
      tenantEmail: primaryTenant?.email,
      propertyId: property?.id,
      propertyOwnerId: property?.createdBy,
      tenantId: primaryTenant?.id,
      rentMonth: dayjs(data?.rentMonth).format("MMMM"),
      note: data?.note,
      ...(propertyOwnerData?.stripeOwnerAccountId && {
        stripeOwnerAccountId: propertyOwnerData.stripeOwnerAccountId,
      }),
    };

    createRentRecord({
      ...draftData,
      status: "manual",
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (isCreateRentRecordSuccess) {
      closeDialog();
      setShowSnackbar(true);
    }
  }, [isCreateRentRecordLoading]);

  useEffect(() => {
    if (primaryTenant) {
      setValue("tenant_email_address", primaryTenant?.email);
    }
  }, [primaryTenant?.id]);

  useEffect(() => {
    if (propertyOwnerData) {
      reset({
        owner_first_name: propertyOwnerData?.first_name,
        owner_last_name: propertyOwnerData?.last_name,
        googleEmailAddress: propertyOwnerData?.googleEmailAddress,
        rent_amount: Number(property?.rent) + Number(property?.additional_rent),
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
        <Stack direction="row" spacing={1}>
          <TextFieldWithLabel
            label="Owner First Name *"
            id="owner_first_name"
            placeholder="First Name of your property owner"
            errorMsg={errors.name?.message}
            isDisabled
            inputProps={{
              ...register("owner_first_name", {
                required: "Owner First Name is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Owner Last Name *"
            id="owner_last_name"
            placeholder="Last Name of your property owner"
            errorMsg={errors.name?.message}
            isDisabled
            inputProps={{
              ...register("owner_last_name", {
                required: "Owner Last Name is required",
              }),
            }}
          />
        </Stack>
        <TextFieldWithLabel
          label="Email Address *"
          id="googleEmailAddress"
          placeholder="Email address of the property owner"
          errorMsg={errors.name?.message}
          isDisabled
          inputProps={{
            ...register("googleEmailAddress", {
              required: "Email address is required",
            }),
          }}
        />

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Tenant Information
          </Typography>
        </Divider>
        <Stack direction="row" spacing={1}>
          <TextFieldWithLabel
            label="Tenant First Name *"
            id="tenant_first_name"
            placeholder="First Name of your primary tenant"
            errorMsg={errors.name?.message}
            inputProps={{
              ...register("tenant_first_name", {
                required: "Tenant First Name is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Tenant Last Name *"
            id="tenant_last_name"
            placeholder="Last Name of your primary tenant"
            errorMsg={errors.name?.message}
            inputProps={{
              ...register("tenant_last_name", {
                required: "Tenant Last Name is required",
              }),
            }}
          />
        </Stack>
        <TextFieldWithLabel
          label="Email Address *"
          id="tenant_email_address"
          placeholder="Email address of the primary tenant"
          errorMsg={errors.name?.message}
          inputProps={{
            ...register("tenant_email_address", {
              required: "Email address is required",
            }),
          }}
        />

        <Divider>
          <Typography variant="caption" color="textSecondary">
            Rent Information
          </Typography>
        </Divider>

        <Stack direction="row" spacing={1}>
          <TextFieldWithLabel
            label="Rent Amount *"
            id="rent_amount"
            placeholder="Rent Amount"
            errorMsg={errors.name?.message}
            isDisabled
            inputProps={{
              ...register("rent_amount", {
                required: "Rent Amount is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Payment Method *"
            id="payment_method"
            placeholder="Payment Method"
            errorMsg={errors.name?.message}
            inputProps={{
              ...register("payment_method", {
                required: "Payment Method is required",
              }),
            }}
          />
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="center">
          <Box>
            <Controller
              name="rentMonth"
              control={control}
              defaultValue={null}
              rules={{ required: "Rent Month is required" }}
              render={({ field }) => (
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontWeight="medium"
                  >
                    Rent Month *
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      views={["year", "month"]}
                      defaultValue={dayjs()}
                      openTo="month"
                      sx={{
                        margin: 0,
                        padding: 0,
                        borderRadius: "5px",
                        border: "0.875px solid gray",
                      }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                    />
                  </LocalizationProvider>
                </Box>
              )}
            />
          </Box>

          <Box>
            <Controller
              name="rent_paid_date"
              control={control}
              defaultValue={null}
              rules={{ required: "Rent paid date is required" }}
              render={({ field }) => (
                <Box>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    fontWeight="medium"
                  >
                    Rent paid date *
                  </Typography>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                      sx={{
                        margin: "0",
                        border: "0.875px solid gray",
                        borderRadius: "5px",
                      }}
                      value={field.value ? dayjs(field.value) : null}
                      onChange={(date) => field.onChange(date)}
                      disablePast
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
            placeholder="Notes in less than 300 characters"
            errorMsg={errors.name?.message}
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
          endIcon={<AddRounded />}
          label="Create rent record"
          loading={isCreateRentRecordLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Stack>
    </form>
  );
};

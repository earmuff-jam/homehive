import { useEffect, useMemo } from "react";

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
import {
  // useGetUserByEmailAddressQuery,
  useGetUserDataByIdQuery,
} from "features/Api/firebaseUserApi";
import { useCreateRentRecordMutation } from "features/Api/rentApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import {
  TProperty,
  TRentRecord,
  TRentRecordForm,
  TTenant,
} from "features/Rent/Rent.schema";
import { TUser, TUserDetails } from "src/types";

// TAddRentRecordsProps ...
export type TAddRentRecordsProps = {
  property: TProperty;
  setShowSnackbar: (value: boolean) => void;
  closeDialog: () => void;
};

export default function AddRentRecords({
  property,
  setShowSnackbar,
  closeDialog,
}: TAddRentRecordsProps) {
  const user: TUser = fetchLoggedInUser();

  const [
    createRentRecord,
    {
      isSuccess: isCreateRentRecordSuccess,
      isLoading: isCreateRentRecordLoading,
    },
  ] = useCreateRentRecordMutation();

  const { data: propertyOwnerData, isLoading: isPropertyOwnerDataLoading } =
    useGetUserDataByIdQuery(user?.uid, {
      skip: !user?.uid,
    }) as { data: TUserDetails; isLoading: boolean };

  const { data: tenants = [] } = useGetTenantByPropertyIdQuery(property?.id, {
    skip: !property?.id,
  }) as { data: TTenant[] };

  const primaryTenant = useMemo(
    () => tenants.find((tenant) => tenant.isPrimary),
    [tenants],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<TRentRecordForm>({
    mode: "onChange",
    defaultValues: {
      ownerFirstName: "",
      ownerLastName: "",
      ownerEmail: "",
      tenantFirstName: "",
      tenantLastName: "",
      tenantEmail: "",
      rent: 0,
      paymentMethod: "",
      rentMonth: "",
      rentPaidDate: dayjs().toISOString(),
      note: "",
    },
  });

  const buildAddRentRecordPayload = (
    formData: TRentRecordForm,
  ): TRentRecord => ({
    id: uuidv4(),
    rent: Math.round(property.rent * 100),
    additionalCharges: Math.round(property.additionalRent * 100),
    tenantEmail: primaryTenant.email,
    propertyId: property.id,
    propertyOwnerId: property.createdBy,
    tenantId: primaryTenant.id,
    rentMonth: dayjs(formData?.rentMonth).format("MMMM"),
    note: formData?.note,
    status: "manual",
    createdBy: user?.uid,
    createdOn: dayjs().toISOString(),
    updatedBy: user?.uid,
    updatedOn: dayjs().toISOString(),
  });

  const onSubmit = (data: TRentRecordForm) => {
    const payload = buildAddRentRecordPayload(data);
    createRentRecord(payload);
  };

  useEffect(() => {
    if (isCreateRentRecordSuccess) {
      closeDialog();
      setShowSnackbar(true);
    }
  }, [isCreateRentRecordLoading]);

  useEffect(() => {
    if (primaryTenant) {
      setValue("tenantEmail", primaryTenant?.email);
    }
  }, [primaryTenant?.id]);

  // this field is only true when a user has his information filled out and it seems to be left join on the profile table. we dont do that in the db. .. need to revisit this.
  // useEffect(() => {
  //   if (primaryTenantDetails) {
  //     setValue("tenantFirstName", primaryTenantDetails?.firstName);
  //     setValue("tenantLastName", primaryTenantDetails?.lastName);
  //   }
  // }, [isPrimaryTenantDetailsLoading]);

  useEffect(() => {
    if (propertyOwnerData) {
      reset({
        ownerFirstName: propertyOwnerData?.firstName,
        ownerLastName: propertyOwnerData?.lastName,
        ownerEmail: propertyOwnerData?.email,
        rent: property.rent + property.additionalRent,
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
            name="ownerFirstName"
            placeholder="First Name of your property owner"
            errorMsg={errors.ownerFirstName?.message}
            isDisabled
            inputProps={{
              ...register("ownerFirstName", {
                required: "Owner First Name is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Owner Last Name *"
            name="ownerLastName"
            placeholder="Last Name of your property owner"
            errorMsg={errors.ownerLastName?.message}
            isDisabled
            inputProps={{
              ...register("ownerLastName", {
                required: "Owner Last Name is required",
              }),
            }}
          />
        </Stack>
        <TextFieldWithLabel
          label="Email Address *"
          name="ownerEmail"
          placeholder="Email address of the property owner"
          errorMsg={errors.ownerEmail?.message}
          isDisabled
          inputProps={{
            ...register("ownerEmail", {
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
            name="tenantFirstName"
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
            name="tenantLastName"
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
          name="tenantEmail"
          isDisabled
          placeholder="Email address of the primary tenant"
          errorMsg={errors.tenantEmail?.message}
          inputProps={{
            ...register("tenantEmail", {
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
            name="rent"
            placeholder="Rent Amount"
            errorMsg={errors.rent?.message}
            inputProps={{
              ...register("rent", {
                required: "Rent Amount is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Payment Method *"
            name="paymentMethod"
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
            name="note"
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
          endIcon={<AddRounded />}
          label="Create rent record"
          loading={isCreateRentRecordLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Stack>
    </form>
  );
}

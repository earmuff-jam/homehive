import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import dayjs from "dayjs";

import { InfoRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";

export default function ProfileDetails() {
  const user = fetchLoggedInUser();

  const { data: userData, isLoading } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const [
    updateUser,
    { isSuccess: isUpdateUserSuccess, isLoading: isUpdateUserLoading },
  ] = useUpdateUserByUidMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      street_address: "",
      city: "",
      state: "",
      zipcode: "",
    },
  });

  const onSubmit = (formData) => {
    updateUser({
      uid: user?.uid,
      newData: {
        ...formData,
        uid: user?.uid,
        googleAccountLinkedAt: userData?.googleAccountLinkedAt,
        googleDisplayName: userData?.googleDisplayName,
        email: userData?.email,
        googleLastLoginAt: userData?.googleLastLoginAt,
        googlePhotoURL: userData?.googlePhotoURL,
        updatedOn: dayjs().toISOString(),
        updatedBy: user?.uid,
      },
    });
    setShowSnackbar(true);
  };

  useEffect(() => {
    if (isUpdateUserSuccess) setShowSnackbar(false);
  }, [isUpdateUserSuccess]);

  useEffect(() => {
    if (userData) {
      reset({
        first_name: userData?.first_name || "",
        last_name: userData?.last_name || "",
        phone: userData?.phone || "",
        street_address: userData?.street_address || "",
        city: userData?.city || "",
        state: userData?.state || "",
        zipcode: userData?.zipcode || "",
      });
    }
  }, [isLoading, reset]);

  if (isLoading) return <Skeleton height="10rem" />;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Card elevation={0} sx={{ padding: 3, textAlign: "center" }}>
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              fontSize: "2.5rem",
              bgcolor: "primary.main",
            }}
            src={userData?.googlePhotoURL || ""}
          />

          <Typography variant="h6" fontWeight={600} color="textSecondary">
            {userData.googleDisplayName}
          </Typography>
          <Typography variant="h6" fontWeight={600} color="textSecondary">
            {userData.email}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role}
          </Typography>
          <Chip label="Verified" color="primary" size="small" sx={{ mt: 1 }} />
        </Card>
      </Grid>

      <Grid item xs={12} md={8}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              padding: 2,
            }}
          >
            <RowHeader
              title="Personal Information"
              sxProps={{
                textAlign: "left",
                fontWeight: "bold",
                color: "text.secondary",
              }}
            />

            {/* First and Last Name */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Controller
                name="first_name"
                control={control}
                rules={{
                  required: "First name is required",
                  validate: (value) =>
                    value.trim().length > 3 ||
                    "First name must be more than 3 characters",
                  maxLength: {
                    value: 150,
                    message: "First name should be less than 150 characters",
                  },
                }}
                render={({ field }) => (
                  <TextFieldWithLabel
                    {...field}
                    label="First Name *"
                    id="first_name"
                    name="first_name"
                    placeholder="Enter your first name"
                    error={!!errors.first_name}
                    errorMsg={errors.first_name?.message}
                    fullWidth
                  />
                )}
              />

              <Controller
                name="last_name"
                control={control}
                rules={{
                  required: "Last name is required",
                  validate: (value) =>
                    value.trim().length > 0 || "Last name is required",
                  maxLength: {
                    value: 150,
                    message: "Last name should be less than 150 characters",
                  },
                }}
                render={({ field }) => (
                  <TextFieldWithLabel
                    {...field}
                    label="Last Name *"
                    id="last_name"
                    name="last_name"
                    placeholder="Enter your Last Name"
                    error={!!errors.last_name}
                    errorMsg={errors.last_name?.message}
                    fullWidth
                  />
                )}
              />
            </Stack>

            {/* Email and Phone Number */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <TextFieldWithLabel
                label="Email address *"
                id="email"
                name="email"
                placeholder="Email Address"
                value={userData?.email || ""}
                isDisabled
                errorMsg=""
                labelIcon={<InfoRounded fontSize="small" color="secondary" />}
                labelIconHelper="Editing an email address is prevented by default."
              />

              <Controller
                name="phone"
                control={control}
                rules={{
                  required: "Phone number is required",
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Phone number must be a valid 10-digit number",
                  },
                }}
                render={({ field }) => (
                  <TextFieldWithLabel
                    {...field}
                    label="Phone Number *"
                    id="phone"
                    name="phone"
                    placeholder="Enter your phone number"
                    error={!!errors.phone}
                    errorMsg={errors.phone?.message}
                  />
                )}
              />
            </Stack>

            {/* Street Address */}
            <Controller
              name="street_address"
              control={control}
              rules={{
                required: "Street address is required",
                maxLength: {
                  value: 150,
                  message: "Street address should be less than 150 characters",
                },
              }}
              render={({ field }) => (
                <TextFieldWithLabel
                  {...field}
                  label="Street Address *"
                  id="street_address"
                  name="street_address"
                  placeholder="Enter your primary street address"
                  error={!!errors.street_address}
                  errorMsg={errors.street_address?.message}
                />
              )}
            />

            {/* City, State, Zip Code */}
            <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
              <Controller
                name="city"
                control={control}
                rules={{
                  required: "City is required",
                  maxLength: {
                    value: 150,
                    message: "City should be less than 150 characters",
                  },
                }}
                render={({ field }) => (
                  <TextFieldWithLabel
                    {...field}
                    label="City *"
                    id="city"
                    name="city"
                    placeholder="City"
                    error={!!errors.city}
                    errorMsg={errors.city?.message}
                  />
                )}
              />
              <Controller
                name="state"
                control={control}
                rules={{
                  required: "State is required",
                  minLength: {
                    value: 2,
                    message: "State is required in the form of XX. Eg, AZ",
                  },
                  maxLength: {
                    value: 2,
                    message: "State is required in the form of XX. Eg, AZ",
                  },
                }}
                render={({ field }) => (
                  <TextFieldWithLabel
                    {...field}
                    label="State *"
                    id="state"
                    name="state"
                    placeholder="State"
                    error={!!errors.state}
                    errorMsg={errors.state?.message}
                  />
                )}
              />
              <Controller
                name="zipcode"
                control={control}
                rules={{
                  required: "Zip Code is required",
                  pattern: {
                    value: /^\d{5}$/,
                    message: "Zip Code should be exactly 5 digits",
                  },
                }}
                render={({ field }) => (
                  <TextFieldWithLabel
                    {...field}
                    label="Zip Code *"
                    id="zipcode"
                    name="zipcode"
                    placeholder="Zip Code"
                    error={!!errors.zipcode}
                    errorMsg={errors.zipcode?.message}
                  />
                )}
              />
            </Stack>

            <Box>
              <AButton
                label="Save"
                variant="contained"
                type="submit"
                disabled={!isValid}
                loading={isUpdateUserLoading}
              />
            </Box>
            <Typography variant="caption" sx={{ fontStyle: "italic" }}>
              Last login around&nbsp;
              {dayjs(userData?.googleLastLoginAt).fromNow() ||
                dayjs().fromNow()}
            </Typography>
          </Card>
        </form>
      </Grid>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Grid>
  );
}

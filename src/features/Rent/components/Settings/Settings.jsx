import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import dayjs from "dayjs";

import {
  EmailRounded,
  InfoRounded,
  PaymentRounded,
  PersonRounded,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Card,
  Chip,
  Grid,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import TextFieldWithLabel from "common/UserInfo/TextFieldWithLabel";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  useGetUserDataByIdQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import { OwnerRole } from "features/Layout/components/Landing/constants";
import { fetchLoggedInUser } from "features/Rent/common/utils";
import { TabPanel } from "features/Rent/components/Settings/common";
import StripeConnect from "features/Rent/components/StripeConnect/StripeConnect";
import Templates from "features/Rent/components/Templates/Templates";
import { useAppTitle } from "hooks/useAppTitle";

dayjs.extend(relativeTime);

export default function Settings() {
  useAppTitle("View Settings");

  const user = fetchLoggedInUser();
  const [searchParams] = useSearchParams();

  const currentTab = Number(searchParams.get("tabIdx")) || 0;
  const isPropertyOwner = user?.role === OwnerRole;

  const [
    updateUser,
    { isSuccess: isUpdateUserSuccess, isLoading: isUpdateUserLoading },
  ] = useUpdateUserByUidMutation();

  const [activeTab, setActiveTab] = useState(currentTab);
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

  const { data: userData, isLoading } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const onSubmit = (formData) => {
    updateUser({
      uid: user?.uid,
      newData: {
        ...formData,
        uid: user?.uid,
        googleAccountLinkedAt: userData?.googleAccountLinkedAt,
        googleDisplayName: userData?.googleDisplayName,
        googleEmailAddress: userData?.googleEmailAddress,
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

  const tabConfig = [
    {
      label: "Profile",
      icon: <PersonRounded fontSize="small" />,
      content: (
        <TabPanel value={activeTab} index={0}>
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
                  {userData.googleEmailAddress}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.role}
                </Typography>
                <Chip
                  label="Verified"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />
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
                  <Stack direction="row" spacing={2}>
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
                          message:
                            "First name should be less than 150 characters",
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
                          message:
                            "Last name should be less than 150 characters",
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
                  <Stack direction="row" spacing={2}>
                    <TextFieldWithLabel
                      label="Email address *"
                      id="email"
                      name="email"
                      placeholder="Email Address"
                      value={userData?.googleEmailAddress || ""}
                      isDisabled
                      errorMsg=""
                      labelIcon={
                        <InfoRounded fontSize="small" color="secondary" />
                      }
                      labelIconHelper="Editing an email address is prevented by default."
                    />

                    <Controller
                      name="phone"
                      control={control}
                      rules={{
                        required: "Phone number is required",
                        pattern: {
                          value: /^\d{10}$/,
                          message:
                            "Phone number must be a valid 10-digit number",
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
                        message:
                          "Street address should be less than 150 characters",
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
                  <Stack direction="row" spacing={2}>
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
                          message:
                            "State is required in the form of XX. Eg, AZ",
                        },
                        maxLength: {
                          value: 2,
                          message:
                            "State is required in the form of XX. Eg, AZ",
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
          </Grid>
        </TabPanel>
      ),
    },
    ...(isPropertyOwner
      ? [
          {
            label: "Templates",
            icon: <EmailRounded fontSize="small" />,
            content: (
              <TabPanel value={activeTab} index={1}>
                <Templates />
              </TabPanel>
            ),
          },
          {
            label: "Manage Payments",
            icon: <PaymentRounded fontSize="small" />,
            content: (
              <TabPanel value={activeTab} index={2}>
                <StripeConnect />
              </TabPanel>
            ),
          },
        ]
      : []),
  ];

  return (
    <Stack spacing={1} data-tour={"settings-0"}>
      <RowHeader
        title="Account Settings"
        sxProps={{
          textAlign: "left",
          fontWeight: "bold",
          color: "text.secondary",
        }}
        caption="Manage your profile data, preferences, and communication templates."
      />

      <Card elevation={0}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              minHeight: 64,
              textTransform: "none",
              fontSize: "0.95rem",
              fontWeight: 500,
            },
          }}
        >
          {tabConfig.map(({ label, icon }, idx) => (
            <Tab
              key={label}
              label={<Typography variant="subtitle2">{label}</Typography>}
              icon={icon}
              iconPosition="start"
              data-tour={`settings-${idx + 1}`}
            />
          ))}
        </Tabs>
      </Card>

      {tabConfig.map((tab, idx) => (
        <Box key={idx}>{tab.content}</Box>
      ))}

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
}

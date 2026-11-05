import React, { useEffect, useMemo, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { HandymanOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser, isSelectedFeatureEnabled } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useUploadMultipleImagesMutation } from "features/Api/firebaseStorageApi";
import {
  useGetUserByEmailAddressQuery,
  useLazyGetBadgeValidationByBadgeKeysQuery,
  useUpdateUserByUidMutation,
} from "features/Api/firebaseUserApi";
import {
  useCreateMaintenanceRecordMutation,
  useGetMaintenanceRecordsQuery,
} from "features/Api/maintenanceApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import MultipleImagePicker from "features/Rent/components/Image/MultipleImagePicker";
import {
  COMPLETED_MAINTENANCE_BADGES,
  DefaultMaintenanceCategoryTypes,
  MaintenanceRecordEnumValues,
} from "features/Rent/constants";
import {
  AddMaintenanceRecordEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
} from "features/Rent/utils";
import { celebrations } from "src/utils/celebrations";

// DefaultValuesCreateMaintenanceItem ...
// default values for creating a maintenance item
const DefaultValuesCreateMaintenanceItem = {
  tenantFirstName: "",
  tenantLastName: "",
  tenantEmail: "",
  maintenanceCategory: "",
  description: "",
  status: "",
  paymentMethod: "",
  note: "",
};

const AddMaintenanceDetails = ({ property, setShowSnackbar, closeDialog }) => {
  const user = fetchLoggedInUser();
  const isS3StorageEnabled = isSelectedFeatureEnabled("cloudService");

  const { data: maintenanceRecords = [] } = useGetMaintenanceRecordsQuery(
    { propertyId: property?.id },
    { skip: !property?.id },
  );

  const [
    createMaintenanceRecord,
    {
      originalArgs: maintenanceRecordOriginalArgs,
      isLoading: isMaintenanceRecordLoading,
      isSuccess: isMaintenanceRecordSuccess,
    },
  ] = useCreateMaintenanceRecordMutation();

  const [
    validateBadge,
    {
      data: badgeExists = false,
      isLoading: isValidateBadgeLoading,
      isSuccess: isValidateBadgeSuccess,
      originalArgs: validateBadgeOriginalArgs,
    },
  ] = useLazyGetBadgeValidationByBadgeKeysQuery();

  const { data: tenants = [] } = useGetTenantByPropertyIdQuery(property?.id, {
    skip: !property?.id,
  });

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
    handleSubmit,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: DefaultValuesCreateMaintenanceItem,
  });

  const [sendEmail] = useSendEmailMutation();
  const [updateUser] = useUpdateUserByUidMutation();
  const [uploadMultipleImages] = useUploadMultipleImagesMutation();

  const [selectedImages, setSelectedImages] = useState([]);

  const onSubmit = (data) => {
    createMaintenanceRecord({
      ...data,
      id: uuidv4(),
      propertyId: property?.id,
      propertyOwnerId: property?.createdBy,
      tenantId: primaryTenant?.id || "",
      status: MaintenanceRecordEnumValues?.Created,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (isMaintenanceRecordSuccess) {
      const maintenanceId = maintenanceRecordOriginalArgs?.id;
      const propertyId = maintenanceRecordOriginalArgs?.propertyId;
      // if no tenant is found, use whoever the creator put under tenant email
      const emailAddress = maintenanceRecordOriginalArgs?.tenantEmail;

      const populatedImages = selectedImages.map((image) => ({
        file: image.file,
        path: `properties/${propertyId}/maintenance/${maintenanceId}/${image.id}`,
      }));

      uploadMultipleImages(populatedImages);

      const completedMaintenanceList = maintenanceRecords?.filter(
        (record) => record.status === MaintenanceRecordEnumValues.Completed,
      );

      const allocatedBadge =
        COMPLETED_MAINTENANCE_BADGES[completedMaintenanceList?.length + 1]
          ?.value;
      allocatedBadge &&
        validateBadge({ uid: user?.uid, keys: [allocatedBadge] });

      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(AddMaintenanceRecordEnumValue, property.name),
        user?.email,
      );

      formatAndSendNotification({
        to: emailAddress,
        subject: `${AddMaintenanceRecordEnumValue} - ${property.name}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });
    }
  }, [isMaintenanceRecordLoading]);

  useEffect(() => {
    if (!isValidateBadgeLoading && isValidateBadgeSuccess) {
      if (!badgeExists) {
        updateUser({
          uid: user?.uid,
          newData: {
            badges: validateBadgeOriginalArgs?.keys,
          },
        });
      }

      closeDialog();
      setShowSnackbar(true);
      celebrations.commonConfetti();
    }
  }, [isValidateBadgeLoading]);

  useEffect(() => {
    if (primaryTenant) {
      setValue("tenantEmail", primaryTenant?.email);
      setValue("tenantFirstName", primaryTenantDetails?.firstName);
      setValue("tenantLastName", primaryTenantDetails?.lastName);
    }
  }, [primaryTenant?.id]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={1}>
        <Divider>
          <Typography variant="caption" color="textSecondary">
            Tenant Information
          </Typography>
        </Divider>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
          <TextFieldWithLabel
            label="Tenant First Name *"
            id="tenantFirstName"
            placeholder="First Name"
            errorMsg={errors.tenantFirstName?.message}
            inputProps={{
              ...register("tenantFirstName", {
                required: "First Name is required",
              }),
            }}
          />
          <TextFieldWithLabel
            label="Tenant Last Name *"
            id="tenantLastName"
            placeholder="Last Name"
            errorMsg={errors.tenantLastName?.message}
            inputProps={{
              ...register("tenantLastName", {
                required: "Tenant Last Name is required",
              }),
            }}
          />
        </Stack>
        <TextFieldWithLabel
          // disabled if primary tenant is found
          isDisabled={primaryTenant?.email}
          label="Email Address *"
          id="tenantEmail"
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
            Maintenance Request
          </Typography>
        </Divider>
        <Box>
          <Controller
            name="maintenanceCategory"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl
                size="small"
                sx={{ m: 1, minWidth: 220 }}
                error={!!fieldState.error}
              >
                <InputLabel id="maintenance-category-label">
                  Maintenance type
                </InputLabel>
                <Select
                  {...field}
                  value={field.value ?? ""}
                  labelId="maintenance-category-label"
                  id="maintenanceCategory"
                  label="Maintenance type"
                >
                  {DefaultMaintenanceCategoryTypes.map((item) => (
                    <MenuItem key={item.id} value={item.label}>
                      {item.label}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>{fieldState.error?.message}</FormHelperText>
              </FormControl>
            )}
          />
        </Box>
        <Box flex={3}>
          <TextFieldWithLabel
            label="Description"
            id="description"
            multiline
            maxRows={5}
            placeholder="Enter description of the problem in less than 1000 characters"
            errorMsg={errors.description?.message}
            inputProps={{
              ...register("description", {
                max: {
                  value: 1000,
                  message: "Description should be less than 1000 characters",
                },
              }),
            }}
          />
        </Box>
        {isS3StorageEnabled ? (
          <Box flex={2}>
            <MultipleImagePicker
              value={selectedImages}
              onChange={setSelectedImages}
            />
          </Box>
        ) : null}
        <Box alignSelf="flex-end">
          <AButton
            variant="outlined"
            disabled={!isValid}
            endIcon={<HandymanOutlined fontSize="small" />}
            label="Create maintenance request"
            loading={isMaintenanceRecordLoading}
            onClick={handleSubmit(onSubmit)}
          />
        </Box>
      </Stack>
    </form>
  );
};

export default AddMaintenanceDetails;

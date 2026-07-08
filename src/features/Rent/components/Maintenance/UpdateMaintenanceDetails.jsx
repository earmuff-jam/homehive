import React, { useEffect, useState } from "react";

import { Controller, useForm } from "react-hook-form";

import dayjs from "dayjs";

import { HandymanOutlined, InfoOutlineRounded } from "@mui/icons-material";
import {
  Box,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useViewMaintenanceImagesQuery } from "features/Api/firebaseStorageApi";
import {
  useGetMaintenanceRecordQuery,
  useUpdateMaintenanceDataMutation,
} from "features/Api/maintenanceApi";
import DisplayImages from "features/Rent/components/Image/DisplayImages";
import {
  DefaultMaintenanceCategoryTypes,
  DefaultMaintenanceIssueResolutionTypes,
  MaintenanceRecordEnumValues,
} from "features/Rent/constants";
import {
  UpdateMaintenanceRecordEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
  isFeatureEnabled,
} from "features/Rent/utils";

// DefaultValuesUpdateMaintenanceItem ...
// default values for updating a maintenance item
const DefaultValuesUpdateMaintenanceItem = {
  tenantFirstName: "",
  tenantLastName: "",
  tenantEmailAddress: "",
  maintenanceCategory: "",
  description: "",
  status: "",
  cost: "",
  paymentMethod: "",
  note: "",
};

const UpdateMaintenanceDetails = ({
  id,
  isComplete,
  closeDialog,
  property,
  isPropertyOwner,
  primaryTenantEmail,
}) => {
  const user = fetchLoggedInUser();
  const isS3StorageEnabled = isFeatureEnabled("cloudService");

  const {
    data: maintenanceRecord,
    isLoading: isMaintenanceRecordLoading,
    isSuccess: isMaintenanceRecordSuccess,
  } = useGetMaintenanceRecordQuery({ maintenanceId: id }, { skip: !id });

  const {
    data: maintenanceRecordImages,
    isLoading: isMaintenanceRecordImagesLoading,
    isSuccess: isMaintenanceRecordImagesSuccess,
  } = useViewMaintenanceImagesQuery(
    { propertyId: property?.id, maintenanceId: id },
    { skip: !property?.id || !id },
  );

  const [sendEmail] = useSendEmailMutation();

  const [
    updateMaintenanceRecord,
    {
      isFetching: isUpdateMaintenanceRecordLoading,
      isSuccess: isUpdateMaintenanceRecordSuccess,
    },
  ] = useUpdateMaintenanceDataMutation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: DefaultValuesUpdateMaintenanceItem,
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const maintenanceStatus = watch("status");
  const shouldDisplayPriceOption =
    maintenanceStatus === MaintenanceRecordEnumValues.Completed;

  const onSubmit = (data) => {
    updateMaintenanceRecord({
      ...data,
      id: id,
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (isUpdateMaintenanceRecordSuccess) {
      closeDialog();
      setShowSnackbar(true);

      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(UpdateMaintenanceRecordEnumValue, property?.name),
        user?.email,
      );

      formatAndSendNotification({
        to: primaryTenantEmail,
        subject: `${UpdateMaintenanceRecordEnumValue} - ${property?.name}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });
    }
  }, [isUpdateMaintenanceRecordSuccess]);

  useEffect(() => {
    if (isMaintenanceRecordSuccess && maintenanceRecord) {
      reset({
        tenantFirstName: maintenanceRecord.tenantFirstName,
        tenantLastName: maintenanceRecord.tenantLastName,
        tenantEmailAddress: maintenanceRecord.tenantEmailAddress,
        description: maintenanceRecord.description,
        cost: Number(maintenanceRecord.cost) || 0,
        paymentMethod: maintenanceRecord.paymentMethod,
        note: maintenanceRecord?.note || "",
        maintenanceCategory: maintenanceRecord?.maintenanceCategory ?? "",
        status: maintenanceRecord?.status ?? "",
      });
    }
  }, [isMaintenanceRecordLoading]);

  useEffect(() => {
    if (isMaintenanceRecordImagesSuccess) {
      setSelectedImages(maintenanceRecordImages);
    }
  }, [isMaintenanceRecordImagesLoading]);

  return (
    <Stack spacing={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={1}>
          <Divider>
            <Typography variant="caption" color="textSecondary">
              Tenant Information
            </Typography>
          </Divider>
          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <TextFieldWithLabel
              label="First Name *"
              id="tenantFirstName"
              placeholder="First Name"
              isDisabled={isComplete || !isPropertyOwner}
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
              isDisabled={isComplete || !isPropertyOwner}
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
            isDisabled={isComplete || !isPropertyOwner}
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
                    id="maintenance-category"
                    label="Maintenance type"
                    disabled={isComplete || !isPropertyOwner}
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
              isDisabled={isComplete || !isPropertyOwner}
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

          <Divider>
            <Typography variant="caption" color="textSecondary">
              Maintenance Issue
            </Typography>
          </Divider>

          <Box>
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <FormControl size="small" sx={{ m: 1, minWidth: 220 }}>
                  <InputLabel>Status</InputLabel>

                  <Select
                    {...field}
                    label="Status"
                    id="status"
                    value={field.value ?? ""}
                    disabled={isComplete || !isPropertyOwner}
                  >
                    {DefaultMaintenanceIssueResolutionTypes.map((item) => (
                      <MenuItem key={item.id} value={item.action}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{fieldState.error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Box>

          {/* only allow cost related actions after status is marked complete */}
          {shouldDisplayPriceOption ? (
            <Stack direction="row" spacing={1}>
              <TextFieldWithLabel
                id="cost"
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography fontWeight="medium" sx={{ fontSize: "1rem" }}>
                      Total Repair Cost *
                    </Typography>
                    <Tooltip title="Enter estimated value or leave as zero if unknown">
                      <InfoOutlineRounded
                        sx={{ fontSize: "0.875rem" }}
                        color="primary"
                      />
                    </Tooltip>
                  </Stack>
                }
                isDisabled={isComplete || !isPropertyOwner}
                placeholder="Enter the estimated cost for the repair"
                errorMsg={errors.cost?.message}
                inputProps={{
                  ...register("cost", {
                    required: "Total Cost is required",
                    pattern: {
                      value: /^\d+(\.\d{1,2})?$/,
                      message:
                        "Total cost of repair must be in number format. Eg, 10.00",
                    },
                  }),
                }}
              />
              <TextFieldWithLabel
                id="paymentMethod"
                label="Payment Method *"
                placeholder="Zelle, Cash..."
                isDisabled={isComplete || !isPropertyOwner}
                errorMsg={errors.paymentMethod?.message}
                inputProps={{
                  ...register("paymentMethod", {
                    required: "Payment Method is required",
                  }),
                }}
              />
            </Stack>
          ) : null}
          <Box flex={3}>
            <TextFieldWithLabel
              label="Note *"
              id="note"
              multiline
              maxRows={5}
              isDisabled={isComplete || !isPropertyOwner}
              placeholder="Enter resolution or notes under 500 characters"
              errorMsg={errors.note?.message}
              inputProps={{
                ...register("note", {
                  required: "Note is required",
                  maxLength: {
                    value: 500,
                    message: "Note should be less than 500 characters",
                  },
                }),
              }}
            />
          </Box>
          {isS3StorageEnabled && selectedImages?.length > 0 ? (
            <>
              <RowHeader
                title={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography>Attached Images</Typography>
                    <Tooltip title="Attached images cannot be removed and will be discarded at a later date.">
                      <InfoOutlineRounded sx={{ fontSize: "0.875rem" }} />
                    </Tooltip>
                  </Stack>
                }
                sxProps={{
                  textAlign: "left",
                  variant: "subtitle2",
                  fontWeight: "medium",
                }}
              />
              <DisplayImages
                images={selectedImages}
                isLoading={isMaintenanceRecordImagesLoading}
                sxProps={{ display: "flex", flexWrap: "wrap" }}
              />
            </>
          ) : null}
          <Box alignSelf="flex-end">
            <AButton
              variant="outlined"
              disabled={!isValid || isComplete || !isPropertyOwner}
              endIcon={<HandymanOutlined fontSize="small" />}
              label="Update maintenance request"
              loading={isUpdateMaintenanceRecordLoading}
              onClick={handleSubmit(onSubmit)}
            />
          </Box>
        </Stack>
      </form>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default UpdateMaintenanceDetails;

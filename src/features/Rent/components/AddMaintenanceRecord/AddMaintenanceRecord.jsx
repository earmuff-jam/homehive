import React, { useEffect, useMemo, useState } from "react";

import { useForm } from "react-hook-form";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import { HandymanOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import AButton from "common/AButton";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useGetUserByEmailAddressQuery } from "features/Api/firebaseUserApi";
import { useCreateMaintenanceRecordMutation } from "features/Api/maintenanceApi";
import { useGetTenantByPropertyIdQuery } from "features/Api/tenantsApi";
import {
  AddMaintenanceRecordEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
} from "features/Rent/utils";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  overflow: "hidden",
  position: "absolute",
  width: "100%",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
});

// DefaultMaintenanceCategoryTypes ...
// defines a function that populates the default maintenance categories
const DefaultMaintenanceCategoryTypes = [
  {
    id: 1,
    label: "Plumbing",
  },
  {
    id: 2,
    label: "HVAC",
  },
  {
    id: 3,
    label: "Electrical",
  },
  {
    id: 4,
    label: "Appliances",
  },
  {
    id: 5,
    label: "Exterior",
  },
  {
    id: 6,
    label: "Pest Control",
  },
  {
    id: 7,
    label: "General Repair",
  },
];

export default function AddMaintenanceRecord({
  property,
  setShowSnackbar,
  closeDialog,
}) {
  const user = fetchLoggedInUser();

  const isS3StorageEnabled = false;

  const [sendEmail] = useSendEmailMutation();

  const [
    createMaintenanceRecord,
    {
      isLoading: isMaintenanceRecordLoading,
      isSuccess: isMaintenanceRecordSuccess,
    },
  ] = useCreateMaintenanceRecordMutation();

  const { data: tenants = [] } = useGetTenantByPropertyIdQuery(property?.id, {
    skip: !property?.id,
  });

  const primaryTenant = useMemo(
    () => tenants?.find((tenant) => tenant.isPrimary),
    [tenants],
  );

  const {
    data: primaryTenantDetails = {},
    isLoading: isPrimaryTenantDetailsLoading,
  } = useGetUserByEmailAddressQuery(primaryTenant?.email, {
    skip: !primaryTenant?.email,
  });

  const [maintenanceCategory, setMaintenanceCategory] = useState(
    DefaultMaintenanceCategoryTypes[6]?.label,
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const handleChange = (event) => setMaintenanceCategory(event.target.value);

  const onSubmit = (data) => {
    const draftData = {
      id: uuidv4(),
      ...data,
      tenantEmail: primaryTenant?.email,
      propertyId: property?.id,
      propertyOwnerId: property?.createdBy,
      tenantId: primaryTenant?.id,
      maintenanceCategory: maintenanceCategory,
    };

    createMaintenanceRecord({
      ...draftData,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (isMaintenanceRecordSuccess) {
      closeDialog();
      setShowSnackbar(true);

      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(AddMaintenanceRecordEnumValue, property.name),
        user?.email,
      );

      formatAndSendNotification({
        to: primaryTenant?.email,
        subject: `${AddMaintenanceRecordEnumValue} - ${property.name}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });
    }
  }, [isMaintenanceRecordLoading]);

  useEffect(() => {
    if (primaryTenant) {
      setValue("tenantEmailAddress", primaryTenant?.email);
    }
  }, [primaryTenant?.id]);

  useEffect(() => {
    if (primaryTenantDetails) {
      setValue("tenantFirstName", primaryTenantDetails?.firstName);
      setValue("tenantLastName", primaryTenantDetails?.lastName);
    }
  }, [isPrimaryTenantDetailsLoading]);

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
            Maintenance Request
          </Typography>
        </Divider>
        <Box>
          <FormControl sx={{ m: 1, minWidth: 320 }} size="small">
            <InputLabel id="selected-property-label-id">
              Maintenance type
            </InputLabel>
            <Select
              labelId="selected-property-label-id"
              id="selected-property-id"
              value={maintenanceCategory}
              label="Selected Property"
              onChange={handleChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {DefaultMaintenanceCategoryTypes?.map((item) => (
                <MenuItem key={item?.id} value={item.label}>
                  {item?.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
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
            <Box flex={1}>
              <Typography color="textPrimary" fontWeight="medium" gutterBottom>
                Upload pictures (if any)
              </Typography>
              <Box>
                <Button
                  role="undefined"
                  component="label"
                  variant="outlined"
                  size="small"
                >
                  Add images
                  <VisuallyHiddenInput type="file" onChange={() => {}} />
                </Button>
              </Box>
            </Box>
          ) : null}
        </Stack>
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
}

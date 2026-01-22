import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import {
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import RowHeader from "common/RowHeader";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import {
  AddPropertyTextString,
  AddRentRecordsTextString,
} from "features/Rent/common/constants";
import AddProperty from "features/Rent/components/AddProperty/AddProperty";
import AddRentRecords from "features/Rent/components/AddRentRecords/AddRentRecords";
import { fetchLoggedInUser, sanitizeApiFields } from "features/Rent/utils";

const defaultDialog = {
  title: "",
  type: "",
  display: false,
};

export default function QuickActions({ property }) {
  const navigate = useNavigate();
  const user = fetchLoggedInUser();
  const [
    updateProperty,
    { isSuccess: isUpdatePropertySuccess, isLoading: isUpdatePropertyLoading },
  ] = useUpdatePropertyByIdMutation();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      address: "",
      county: "",
      city: "",
      state: "",
      zipcode: "",
      units: 0,
      bathrooms: 0,
      sqFt: 100,
      note: "",
      emergencyContactNumber: "",
      isTenantCleaningYard: true,
      isSmoking: false,
      isOwnerCoveredUtilities: false,
      ownerCoveredUtilities: "",
      rent: 0,
      additional_rent: 0,
      rent_increment: 100,
      securityDeposit: 0,
      allowedVehicleCounts: 0,
      paymentID: "",
      specialProvisions: "",
      isHoa: false,
      hoaDetails: "",
      isBrokerManaged: false,
      brokerName: "",
      brokerAddress: "",
      isManagerManaged: false,
      managerName: "",
      managerPhone: "",
      managerAddress: "",
    },
  });

  const [dialog, setDialog] = useState(defaultDialog);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const closeDialog = () => {
    setDialog(defaultDialog);
    reset();
  };

  const onSubmit = (data) => {
    const result = {
      ...data,
      id: property?.id,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    };

    const sanitizedPayload = sanitizeApiFields(result);
    updateProperty(sanitizedPayload);
  };

  const isPropertyWithinHOA = watch("isHoa");
  const isBrokerManaged = watch("isBrokerManaged");
  const isManagerManaged = watch("isManagerManaged");
  const isOwnerCoveredUtilities = watch("isOwnerCoveredUtilities");

  useEffect(() => {
    if (isUpdatePropertySuccess) {
      closeDialog();
      setShowSnackbar(true);
    }
  }, [isUpdatePropertySuccess]);

  useEffect(() => {
    if (property?.id) {
      reset({
        name: property?.name || "",
        address: property?.address || "",
        city: property?.city || "",
        state: property?.state || "",
        county: property?.county || "",
        zipcode: property?.zipcode || "",
        owner_email: property?.owner_email || "",
        units: property?.units || "",
        bathrooms: property?.bathrooms || "",
        rent: property?.rent || "",
        additional_rent: property?.additional_rent || "",
        note: property?.note || "",
        sqFt: property?.sqFt || "",
        rent_increment: property?.rent_increment || "",
        emergencyContactNumber: property?.emergencyContactNumber,
        isTenantCleaningYard: property?.isTenantCleaningYard,
        isSmoking: property?.isSmoking,
        isOwnerCoveredUtilities: property?.isOwnerCoveredUtilities,
        ownerCoveredUtilities: property?.ownerCoveredUtilities,
        securityDeposit: property?.securityDeposit,
        allowedVehicleCounts: property?.allowedVehicleCounts,
        paymentID: property?.paymentID,
        specialProvisions: property?.specialProvisions,
        isHoa: property?.isHoa,
        hoaDetails: property?.hoaDetails,
        isBrokerManaged: property?.isBrokerManaged,
        brokerName: property?.brokerName,
        brokerAddress: property?.brokerAddress,
        isManagerManaged: property?.isManagerManaged,
        managerName: property?.managerName,
        managerPhone: property?.managerPhone,
        managerAddress: property?.managerAddress,
      });
    }
  }, [property, reset]);

  return (
    <Card data-tour="property-5">
      <CardContent>
        <RowHeader
          title="Quick Actions"
          sxProps={{
            textAlign: "left",
            variant: "subtitle2",
            fontWeight: "bold",
          }}
        />
        <Stack spacing={1}>
          <AButton
            variant="outlined"
            fullWidth
            onClick={() =>
              setDialog({
                title: "Edit property",
                type: AddPropertyTextString,
                display: true,
              })
            }
            label="Edit Property"
          />
          <AButton
            variant="outlined"
            fullWidth
            onClick={() => navigate("/rent/settings?tabIdx=2")}
            label="View Stripe Payment History"
          />
          <AButton
            variant="outlined"
            fullWidth
            disabled
            label="Add Maintenance Request"
          />
          <AButton
            variant="outlined"
            fullWidth
            label="Pay rent manually"
            onClick={() =>
              setDialog({
                title: "Update rent records manually",
                type: AddRentRecordsTextString,
                display: true,
              })
            }
          />

          <Dialog
            open={dialog.display}
            keepMounted
            fullWidth
            maxWidth="lg"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
              {dialog.type === AddPropertyTextString && (
                <RowHeader
                  title="Edit property"
                  caption="Edit property values"
                  sxProps={{
                    textAlign: "left",
                  }}
                />
              )}
              {dialog.type === AddRentRecordsTextString && (
                <RowHeader
                  title="Add rent records"
                  caption="Editing an existing row is prohibited. Confirm rent validity before submission."
                  sxProps={{
                    textAlign: "left",
                  }}
                />
              )}
            </DialogTitle>
            <DialogContent>
              {dialog.type === AddPropertyTextString && (
                <AddProperty
                  isEditing
                  register={register}
                  control={control}
                  errors={errors}
                  isManagerManaged={isManagerManaged}
                  isBrokerManaged={isBrokerManaged}
                  isOwnerCoveredUtilities={isOwnerCoveredUtilities}
                  isPropertyWithinHOA={isPropertyWithinHOA}
                  onSubmit={handleSubmit(onSubmit)}
                  isDisabled={!isValid || isUpdatePropertyLoading}
                />
              )}
              {dialog.type === AddRentRecordsTextString && (
                <AddRentRecords
                  property={property}
                  closeDialog={closeDialog}
                  setShowSnackbar={setShowSnackbar}
                />
              )}
            </DialogContent>
            <DialogActions>
              <AButton
                size="small"
                variant="outlined"
                onClick={closeDialog}
                label="Close"
                loading={isUpdatePropertyLoading}
              />
            </DialogActions>
          </Dialog>

          <CustomSnackbar
            showSnackbar={showSnackbar}
            setShowSnackbar={setShowSnackbar}
            title="Changes saved."
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

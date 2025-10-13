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
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import {
  AddPropertyTextString,
  AddRentRecordsTextString,
} from "features/Rent/common/constants";
import { fetchLoggedInUser } from "features/Rent/utils/utils";
import AddProperty from "features/Rent/components/AddProperty/AddProperty";
import { AddRentRecords } from "features/Rent/components/AddRentRecords/AddRentRecords";

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
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({ mode: "onChange" });

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

    updateProperty(result);
  };

  useEffect(() => {
    if (isUpdatePropertySuccess) {
      closeDialog();
      setShowSnackbar(true);
    }
  }, [isUpdatePropertySuccess]);

  useEffect(() => {
    if (property?.id) {
      reset({
        name: property.name || "",
        address: property.address || "",
        city: property.city || "",
        state: property.state || "",
        zipcode: property.zipcode || "",
        owner_email: property.owner_email || "",
        units: property.units || "",
        bathrooms: property.bathrooms || "",
        rent: property.rent || "",
        additional_rent: property?.additional_rent || "",
        note: property?.note || "",
        sqFt: property?.sqFt || "",
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
            maxWidth="md"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
              <RowHeader
                title="Add rent records"
                caption="Once you add a rental record manually, it can’t be edited later. Please double-check before submitting."
                sxProps={{
                  textAlign: "left",
                }}
              />
            </DialogTitle>
            <DialogContent>
              {dialog.type === AddPropertyTextString && (
                <AddProperty
                  isEditing
                  register={register}
                  errors={errors}
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

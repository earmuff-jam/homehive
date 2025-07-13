import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import dayjs from "dayjs";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Stack,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import { AddPropertyTextString } from "features/RentWorks/common/constants";
import { fetchLoggedInUser } from "features/RentWorks/common/utils";
import AddProperty from "features/RentWorks/components/AddProperty/AddProperty";

const defaultDialog = {
  title: "",
  type: "",
  display: false,
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QuickActions({ property }) {
  const user = fetchLoggedInUser();
  const [updateProperty] = useUpdatePropertyByIdMutation();

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

  const onSubmit = async (data) => {
    const result = {
      ...data,
      id: property?.id,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    };

    await updateProperty(result);
    setShowSnackbar(true);
    closeDialog();
  };

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
    <Stack spacing={1}>
      <Button
        variant="outlined"
        fullWidth
        onClick={() =>
          setDialog({
            title: "Edit property",
            type: AddPropertyTextString,
            display: true,
          })
        }
      >
        Edit Property
      </Button>

      <Button variant="outlined" fullWidth>
        View Payment History
      </Button>
      <Button variant="outlined" fullWidth disabled>
        Add Maintenance Request
      </Button>
      <Button variant="outlined" fullWidth disabled>
        Generate Report
      </Button>

      {/* Edit property dialog  */}
      <Dialog
        open={dialog.display}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          {dialog.type === AddPropertyTextString && (
            <AddProperty
              isEditing
              register={register}
              errors={errors}
              onSubmit={handleSubmit(onSubmit)}
              isDisabled={!isValid}
            />
          )}
        </DialogContent>
        <DialogActions>
          <AButton
            size="small"
            variant="outlined"
            onClick={closeDialog}
            label="Close"
          />
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
}

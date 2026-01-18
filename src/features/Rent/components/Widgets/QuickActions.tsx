import { useEffect, useState } from "react";

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
import { fetchLoggedInUser } from "common/utils";
import { useUpdatePropertyByIdMutation } from "features/Api/propertiesApi";
import {
  TProperty,
  TPropertyForm,
  TPropertyUpdateApiRequest,
  TRentDialog,
} from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import {
  AddPropertyTextString,
  AddRentRecordsTextString,
} from "features/Rent/common/constants";
import AddProperty from "features/Rent/components/AddProperty/AddProperty";
import AddRentRecords from "features/Rent/components/AddRentRecords/AddRentRecords";
import { UpdatePropertyApiRequestEnumValue } from "features/Rent/utils";
import { TUser } from "src/types";

const defaultDialog: TRentDialog = {
  title: "",
  type: "",
  display: false,
};

// TQuickActionsProps ...
type TQuickActionsProps = {
  property: TProperty;
};

export default function QuickActions({ property }: TQuickActionsProps) {
  const navigate = useNavigate();
  const user: TUser = fetchLoggedInUser();
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
  } = useForm<TPropertyForm>({
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
      additionalRent: 0,
      rentIncrement: 100,
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

  const [dialog, setDialog] = useState<TRentDialog>(defaultDialog);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const closeDialog = () => {
    setDialog(defaultDialog);
    reset();
  };

  const onSubmit = (data: TPropertyForm) => {
    // TODO: figure out if we need this
    // const sanitizedPayload: TProperty = sanitizeApiFields(result);
    const request: TPropertyUpdateApiRequest = {
      property: {
        ...data,
        id: property.id,
        updatedBy: user.uid,
        updatedOn: dayjs().toISOString(),
      },
      action: UpdatePropertyApiRequestEnumValue,
    };
    updateProperty(request);
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
        name: property?.name,
        address: property?.address,
        city: property?.city,
        state: property?.state,
        county: property?.county,
        zipcode: property?.zipcode,
        units: property?.units || 0,
        bathrooms: property?.bathrooms || 0,
        rent: property?.rent || 0,
        additionalRent: property?.additionalRent || 0,
        note: property?.note,
        sqFt: property?.sqFt || 0,
        rentIncrement: property?.rentIncrement,
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
            severity="success"
            showSnackbar={showSnackbar}
            setShowSnackbar={setShowSnackbar}
            title="Changes saved."
          />
        </Stack>
      </CardContent>
    </Card>
  );
}

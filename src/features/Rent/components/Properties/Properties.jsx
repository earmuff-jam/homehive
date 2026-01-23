import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";

import dayjs from "dayjs";

import {
  AddRounded,
  DeleteRounded,
  ExpandMoreRounded,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  useCreatePropertyMutation,
  useGetPropertiesByUserIdQuery,
  useUpdatePropertyByIdMutation,
} from "features/Api/propertiesApi";
import { useLazyGetRentsByPropertyIdWithFiltersQuery } from "features/Api/rentApi";
import { AddPropertyTextString } from "features/Rent/common/constants";
import AddProperty from "features/Rent/components/AddProperty/AddProperty";
import ViewPropertyAccordionDetails from "features/Rent/components/Properties/ViewPropertyAccordionDetails";
import { sanitizeApiFields } from "features/Rent/utils";
import { useAppTitle } from "hooks/useAppTitle";

const defaultDialog = {
  title: "",
  type: "",
  display: false,
};

export default function Properties() {
  useAppTitle("View Properties");

  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const { data: properties = [], isLoading } = useGetPropertiesByUserIdQuery(
    user.uid,
    {
      skip: !user?.uid,
    },
  );

  const { data: userData } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const [
    triggerGetRents,
    { data: rentDetails = [], isLoading: isRentDetailsLoading },
  ] = useLazyGetRentsByPropertyIdWithFiltersQuery();

  const [
    createProperty,
    { isSuccess: isCreatePropertySuccess, isLoading: isCreatePropertyLoading },
  ] = useCreatePropertyMutation();

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
    setValue,
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

  const [expanded, setExpanded] = useState(null);
  const [dialog, setDialog] = useState(defaultDialog);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const handleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  const closeDialog = () => {
    setDialog(defaultDialog);
    reset();
  };

  const handleUpdate = (propertyId) => {
    if (!propertyId) return;
    updateProperty({
      id: propertyId,
      isDeleted: true,
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  const toggleAddPropertyPopup = () => {
    setDialog({
      title: "Add Property",
      type: AddPropertyTextString,
      display: true,
    });
  };

  const onSubmit = (data) => {
    const result = {
      ...data,
      id: uuidv4(),
      isDeleted: false,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    };

    const sanitizedPayload = sanitizeApiFields(result);

    createProperty(sanitizedPayload);
    closeDialog();
  };

  const isPropertyWithinHOA = watch("isHoa");
  const isBrokerManaged = watch("isBrokerManaged");
  const isManagerManaged = watch("isManagerManaged");
  const isOwnerCoveredUtilities = watch("isOwnerCoveredUtilities");

  useEffect(() => {
    if (isCreatePropertySuccess || isUpdatePropertySuccess) {
      setShowSnackbar(true);
    }
  }, [isCreatePropertyLoading, isUpdatePropertyLoading]);

  useEffect(() => {
    // update form fields if present
    if (userData?.email) {
      setValue("owner_email", userData.email);
    }
  }, [userData, setValue]);

  if (isLoading) return <Skeleton height="10rem" />;

  return (
    <Stack data-tour="properties-0">
      <Stack direction="row" justifyContent="space-between">
        <RowHeader
          title="Properties"
          sxProps={{ fontWeight: "bold", color: "text.secondary" }}
        />
        <AButton
          data-tour="properties-1"
          label="Add Property"
          size="small"
          variant="outlined"
          loading={isCreatePropertyLoading || isUpdatePropertyLoading}
          endIcon={<AddRounded fontSize="small" />}
          onClick={toggleAddPropertyPopup}
        />
      </Stack>

      <Stack padding={1} spacing={1}>
        {properties.length === 0 ? (
          <EmptyComponent caption="Add new property to begin." />
        ) : (
          properties.map((property) => (
            <Accordion
              key={property.id}
              expanded={expanded === property.id}
              elevation={0}
              sx={{
                cursor: "default",
              }}
            >
              <AccordionSummary
                data-tour="properties-4"
                expandIcon={
                  <IconButton
                    data-tour="properties-3"
                    onClick={() => {
                      if (property?.id) {
                        handleExpand(property.id);
                        triggerGetRents({
                          propertyId: property?.id,
                          tenantEmails: property?.rentees,
                          rentMonth: dayjs().format("MMMM"),
                        });
                      }
                    }}
                  >
                    <ExpandMoreRounded />
                  </IconButton>
                }
              >
                <Stack flexGrow={1} spacing={0.5}>
                  <Stack direction="row" spacing={1} alignItems="flex-start">
                    <Stack spacing={0.25}>
                      <Stack direction="row" alignItems="center">
                        <Stack
                          data-tour="properties-5"
                          onClick={(ev) => {
                            ev.stopPropagation();
                            navigate(`/rent/property/${property?.id}`);
                          }}
                          sx={{
                            justifyContent: "left",
                            textAlign: "left",
                            borderRadius: 1,
                            width: "100%",
                          }}
                        >
                          <Typography variant="h6" color="text.secondary">
                            {property.name || "Unknown Property Name"}
                          </Typography>
                        </Stack>
                      </Stack>
                      <ButtonBase
                        onClick={(ev) => {
                          ev.stopPropagation();
                          navigate(`/rent/property/${property?.id}`);
                        }}
                      >
                        <Stack
                          sx={{
                            justifyContent: "left",
                            textAlign: "left",
                            borderRadius: 1,
                            width: "100%",
                          }}
                        >
                          <Typography variant="caption">
                            {property.address}
                          </Typography>
                          <Typography variant="caption">
                            {property.city} {property.state}, {property.zipcode}
                          </Typography>
                        </Stack>
                      </ButtonBase>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack justifyContent="center">
                  <IconButton
                    data-tour="properties-2"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpdate(property.id);
                    }}
                  >
                    <DeleteRounded fontSize="small" color="error" />
                  </IconButton>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <ViewPropertyAccordionDetails
                  property={property}
                  userData={userData}
                  rentDetails={rentDetails}
                  isRentDetailsLoading={isRentDetailsLoading}
                />
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Stack>

      <Dialog
        open={dialog.display}
        keepMounted
        fullWidth
        maxWidth="lg"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{dialog.title}</DialogTitle>
        <DialogContent>
          {dialog.type === AddPropertyTextString && (
            <AddProperty
              register={register}
              control={control}
              errors={errors}
              isManagerManaged={isManagerManaged}
              isBrokerManaged={isBrokerManaged}
              isOwnerCoveredUtilities={isOwnerCoveredUtilities}
              isPropertyWithinHOA={isPropertyWithinHOA}
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

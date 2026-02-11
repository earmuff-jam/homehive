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
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import ConfirmationBox, {
  DefaultConfirmationBoxProps,
} from "common/ConfirmationBox";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  useCreatePropertyMutation,
  useDeletePropertyByIdMutation,
  useGetPropertiesByUserIdQuery,
} from "features/Api/propertiesApi";
import { useLazyGetRentsByPropertyIdWithFiltersQuery } from "features/Api/rentApi";
import { Role } from "features/Auth/AuthHelper";
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

  const [createProperty, createPropertyResult] = useCreatePropertyMutation();

  const [triggerGetRents, getRentsResult] =
    useLazyGetRentsByPropertyIdWithFiltersQuery();

  const [deleteProperty, deletePropertyResult] =
    useDeletePropertyByIdMutation();

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

  const [expanded, setExpanded] = useState(null);
  const [dialog, setDialog] = useState(defaultDialog);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showConfirmationBox, setShowConfirmationBox] = useState(
    DefaultConfirmationBoxProps,
  );

  const handleExpand = (id) => setExpanded((prev) => (prev === id ? null : id));

  const closeDialog = () => {
    setDialog(defaultDialog);
    reset();
  };

  const handleDelete = (propertyId) => {
    if (!propertyId) return;
    deleteProperty({
      id: propertyId,
      isDeleted: true,
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
    setShowConfirmationBox(DefaultConfirmationBoxProps);
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
    if (createPropertyResult.isSuccess || deletePropertyResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [createPropertyResult.isLoading, deletePropertyResult.isLoading]);

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
          loading={
            createPropertyResult.isLoading || deletePropertyResult.isLoading
          }
          disabled={![Role.Admin, Role.Owner].includes(user?.role)}
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
                expandIcon={
                  <ExpandMoreRounded
                    fontSize="small"
                    data-tour="properties-3"
                  />
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
                      <Stack
                        sx={{
                          justifyContent: "left",
                          textAlign: "left",
                          borderRadius: 1,
                          width: "100%",
                        }}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          navigate(`/rent/property/${property?.id}`);
                        }}
                      >
                        <Typography variant="caption">
                          {property.address}
                        </Typography>
                        <Typography variant="caption">
                          {property.city} {property.state}, {property.zipcode}
                        </Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Box
                  alignContent="center"
                  data-tour="properties-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowConfirmationBox({
                      value: true,
                      updateKey: property?.id,
                    });
                  }}
                >
                  <DeleteRounded
                    fontSize="small"
                    color="error"
                    sx={{
                      cursor: "pointer",
                      "&:hover": { backgroundColor: "action.hover" },
                    }}
                  />
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <ViewPropertyAccordionDetails
                  property={property}
                  userData={userData}
                  rentDetails={getRentsResult.data}
                  isRentDetailsLoading={getRentsResult.isLoading}
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

      <ConfirmationBox
        isOpen={showConfirmationBox.value}
        handleConfirm={() => handleDelete(showConfirmationBox.updateKey)}
        handleCancel={() => setShowConfirmationBox(DefaultConfirmationBoxProps)}
      />

      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
}

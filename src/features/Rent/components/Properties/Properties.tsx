import { useEffect, useState } from "react";

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
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import { TDialog } from "common/types";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  useCreatePropertyMutation,
  useGetPropertiesByUserIdQuery,
  useUpdatePropertyByIdMutation,
} from "features/Api/propertiesApi";
import { useLazyGetRentsByPropertyIdWithFiltersQuery } from "features/Api/rentApi";
import {
  useUpdateTenantByEmailMutation,
  useUpdateTenantByIdMutation,
} from "features/Api/tenantsApi";
import {
  TProperty,
  TPropertyForm,
  TPropertyUpdateApiRequest,
} from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import { AddPropertyTextString } from "features/Rent/common/constants";
import AddProperty from "features/Rent/components/AddProperty/AddProperty";
import ViewPropertyAccordionDetails from "features/Rent/components/Properties/ViewPropertyAccordionDetails";
import {
  DeletePropertyApiRequestEnumValue,
  sanitizeApiFields,
} from "features/Rent/utils";
import { useAppTitle } from "hooks/useAppTitle";
import { TUser } from "src/types";

const defaultDialog: TDialog = {
  title: "",
  type: "",
  display: false,
};

export default function Properties() {
  useAppTitle("View Properties");

  const navigate = useNavigate();
  const user: TUser = fetchLoggedInUser();

  const { data: properties = [], isLoading } = useGetPropertiesByUserIdQuery(
    user.uid,
    {
      skip: !user?.uid,
    },
  ) as { data: TProperty[]; isLoading: boolean };

  const { data: userData } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const [triggerGetRents, getRentsResult] =
    useLazyGetRentsByPropertyIdWithFiltersQuery();

  const [createProperty, createPropertyResult] = useCreatePropertyMutation();

  const [updateProperty, updatePropertyResult] =
    useUpdatePropertyByIdMutation();

  const [updateTenantByEmail, updateTenantByEmailResult] =
    useUpdateTenantByEmailMutation();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
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

  const [expanded, setExpanded] = useState<string | null>(null);
  const [dialog, setDialog] = useState<TDialog>(defaultDialog);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const handleExpand = (id: string) =>
    setExpanded((prev) => (prev === id ? null : id));

  const closeDialog = () => {
    setDialog(defaultDialog);
    reset();
  };

  const handleDelete = (propertyId: string) => {
    if (!propertyId) return;
    const request: TPropertyUpdateApiRequest = {
      property: {
        id: propertyId,
        isDeleted: true,
        updatedBy: user.uid,
        updatedOn: dayjs().toISOString(),
      },
      action: DeletePropertyApiRequestEnumValue,
    };
    updateProperty(request);
  };

  const onSubmit = (data: TPropertyForm) => {
    const result: TProperty = {
      ...data,
      id: uuidv4(),
      isDeleted: false,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    };

    const sanitizedPayload = sanitizeApiFields(result) as TProperty;
    createProperty(sanitizedPayload);
    closeDialog();
  };

  const isPropertyWithinHOA = watch("isHoa");
  const isBrokerManaged = watch("isBrokerManaged");
  const isManagerManaged = watch("isManagerManaged");
  const isOwnerCoveredUtilities = watch("isOwnerCoveredUtilities");

  useEffect(() => {
    if (updatePropertyResult.isSuccess) {
      const tenantEmail = updatePropertyResult.data.rentees[0];
      updateTenantByEmail({
        email: tenantEmail,
        newData: {
          email: tenantEmail,
          isActive: false,
          updatedBy: user?.uid,
          updatedOn: dayjs().toISOString(),
        },
      });
    }
  }, [updatePropertyResult.isLoading]);

  useEffect(() => {
    if (createPropertyResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [createPropertyResult.isLoading]);

  useEffect(() => {
    if (updateTenantByEmailResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [updateTenantByEmailResult.isLoading]);

  useEffect(() => {
    // update form fields if present
    if (userData?.email) {
      setValue("ownerEmail", userData.email);
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
          loading={
            createPropertyResult.isLoading || updatePropertyResult.isLoading
          }
          endIcon={<AddRounded fontSize="small" />}
          onClick={() =>
            setDialog({
              title: "Add Property",
              type: AddPropertyTextString,
              display: true,
            })
          }
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
                      handleDelete(property.id);
                    }}
                  >
                    <DeleteRounded fontSize="small" color="error" />
                  </IconButton>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <ViewPropertyAccordionDetails
                  property={property}
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
              isEditing={false}
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
        severity="success"
        title="Changes saved."
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
      />
    </Stack>
  );
}

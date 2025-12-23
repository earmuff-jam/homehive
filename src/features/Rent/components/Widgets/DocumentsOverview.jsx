import React, { useEffect, useState } from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import {
  useCreateEsignFromTemplateMutation,
  useGetEsignTemplatesQuery,
} from "features/Api/externalIntegrationsApi";
import {
  useLazyGetUserByEmailAddressQuery,
  useLazyGetUserDataByIdQuery,
} from "features/Api/firebaseUserApi";
import EsignTemplateDetails from "features/Rent/components/EsignConnect/EsignTemplateDetails";
import { fetchLoggedInUser } from "features/Rent/utils";
import { produce } from "immer";

export default function DocumentsOverview({
  property,
  dataTour,
  primaryTenant = {},
  isEsignConnected,
  isPropertyLoading,
  isViewingRental = false,
}) {
  const user = fetchLoggedInUser();
  const { data: esignTemplates, isLoading: isGetEsignTemplatesLoading } =
    useGetEsignTemplatesQuery(user?.uid, {
      skip: !isEsignConnected,
    });

  const [triggerGetOwnerData, { data: propertyOwnerData }] =
    useLazyGetUserDataByIdQuery();

  const [
    createEsignFromTemplate,
    {
      isLoading: isPrepareTemplateLoading,
      isSuccess: isPrepareTemplateSuccess,
    },
  ] = useCreateEsignFromTemplateMutation();

  const [triggerGetTenantData, { data: tenantData }] =
    useLazyGetUserByEmailAddressQuery();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const templates = esignTemplates?.templates ?? [];

  const validateFullName = (firstName, lastName, otherName) => {
    if (!firstName || !lastName) {
      return otherName || "";
    } else if (firstName && lastName) {
      return `${firstName}, ${lastName}`;
    } else {
      return "N/A";
    }
  };

  const prepareDocumentForEsign = (rowData) => {
    if (!rowData) return null;

    const draftData = produce(rowData, (draft) => {
      draft.id = rowData.uuid;
      draft.owner = validateFullName(
        propertyOwnerData.first_name,
        propertyOwnerData.last_name,
        propertyOwnerData.googleDisplayName,
      );
      draft.ownerEmail = property?.owner_email;
      draft.tenant = validateFullName(
        tenantData.first_name,
        tenantData.last_name,
        tenantData.fullName,
      );
      draft.tenantEmail = tenantData.googleEmailAddress;
      draft.address = property?.address;
      draft.city = property?.city;
      draft.state = property?.state;
      draft.zipCode = property?.zipCode;
      draft.county = property?.county;
      draft.startDate = primaryTenant?.startDate;
      draft.endDate = primaryTenant?.endDate;
      draft.isAutoRenew = primaryTenant?.isAutoRenewPolicySet;
      draft.autoRenewDays = primaryTenant?.autoRenewDays;
      draft.isMonthLastDate = primaryTenant?.isMonthLastDate;
      draft.rent = property?.rent;
      draft.isFirstDayRent = true;
      draft.isPayToLandlord = true;
      draft.isPayToListingBroker = true;
      draft.isPayToPropertyManager = true;
      draft.rentDueDate = primaryTenant?.rentDueDate;
      draft.isCashiersCheck = true;
      draft.isElectronicPayment = true;
      draft.isMoneyOrder = true;
      draft.isPersonalCheck = true;
      draft.isOtherMeans = true;
      draft.proratedRent =
        Number(property?.rent || 0) + Number(property?.additionalRent || 0);
      draft.proratedRentDueDate = tenantData?.rentDueDate;
      draft.paymentID = property?.paymentID;
      draft.isExtraChargeNotAdded = false;
      draft.isMonthlyPaymentsRequired = true;
      draft.isInitialLateFee = true;
      draft.initialLateFee = primaryTenant?.initialLateFee;
      draft.dailyLateFee = primaryTenant?.dailyLateFee;
      draft.returnedPaymentFee = primaryTenant?.returnedPaymentFee;
      draft.initialAnimalViolationFee =
        primaryTenant?.initialAnimalVoilationFee;
      draft.dailyAnimalViolationFee = primaryTenant?.dailyAnimalVoilationFee;
      draft.securityDeposit = property?.securityDeposit;
      draft.ownerCoveredUtilities = property?.ownerCoveredUtilities; // comma seperated string
      draft.isHOA = property?.isHOA;
      draft.isNotHOA = !property?.isHOA;
      draft.hoaDetails = property?.hoaDetails; // details string seperated
      draft.guestsPermittedStayDays = primaryTenant?.guestsPermittedStayDays;
      draft.allowedVehicleCounts = property?.allowedVehicleCounts;
      draft.tripCharge = primaryTenant?.tripCharge; // cost to pay to owner if the owner has to do smth for tenant
      draft.allowKeyboxSince = primaryTenant?.allowKeyboxSince;
      draft.removeKeyboxFee = primaryTenant?.removeKeyboxFee;
      draft.inventoryCompleteWithin = primaryTenant?.inventoryCompleteWithin;
      draft.isTenantCleaningYard = property?.isTenantCleaningYard;
      draft.isSmokingNotAllowed = !property?.isSmoking;
      draft.emergencyContactNumber = property?.emergencyContactNumber;
      draft.specialProvisions = property?.specialProvisions; // extra rules for tenant, like addendum
      draft.rentalFloodDisclosure = property?.rentalFloodDisclosure;
      draft.brokerName = property?.brokerName;
      draft.isBrokerManaged = property?.isBrokerManaged;
      draft.isNotBrokerManaged = !property?.isBrokerManaged;
      draft.isOwnerManaged = property?.isOwnerManaged;
      draft.isManagerManaged = !property?.isManagerManaged;
      draft.managerName = property?.managerName;
      draft.managerAddress = property?.managerAddress;
      draft.managerPhone = property?.managerPhone;
    });

    createEsignFromTemplate(draftData);
  };

  useEffect(() => {
    if (property?.id && Array.isArray(property?.rentees)) {
      const propertyOwnerID = property?.createdBy;
      const tenantEmail = property?.rentees.find((rentee) => rentee);
      triggerGetOwnerData(propertyOwnerID);
      triggerGetTenantData(tenantEmail);
    }
  }, [property?.id]);

  useEffect(() => {
    if (isPrepareTemplateSuccess) {
      setShowSnackbar(true);
    }
  }, [isPrepareTemplateLoading]);

  if (isGetEsignTemplatesLoading) return <Skeleton height="10rem" />;

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Documents Overview"
          caption={`View documents assoicated with ${property?.name}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        <Stack spacing={2}>
          {isPropertyLoading ? (
            <Skeleton height="5rem" />
          ) : (
            <EsignTemplateDetails
              templates={templates}
              isViewingRental={isViewingRental}
              isPrepareTemplateLoading={isPrepareTemplateLoading}
              prepareDocumentForEsign={prepareDocumentForEsign}
            />
          )}
        </Stack>
      </CardContent>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Card>
  );
}

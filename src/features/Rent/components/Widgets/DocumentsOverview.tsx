import { useEffect, useState } from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { fetchLoggedInUser } from "common/utils";
import {
  useCreateEsignFromTemplateMutation,
  useGetEsignTemplatesMutation,
} from "features/Api/externalIntegrationsApi";
import {
  useLazyGetUserByEmailAddressQuery,
  useLazyGetUserDataByIdQuery,
} from "features/Api/firebaseUserApi";
import { TProperty } from "features/Rent/Rent.schema";
import { TTenant } from "features/Rent/Rent.types";
import RowHeader from "features/Rent/common/RowHeader";
import EsignTemplateDetails from "features/Rent/components/EsignConnect/EsignTemplateDetails";
import {
  sanitizeEsignFieldsForLeaseExtension,
  sanitizeEsignFieldsForNewLease,
} from "features/Rent/utils";
import { TUser } from "src/types";

// TDocumentOverviewProps ...
type TDocumentOverviewProps = {
  property: TProperty;
  dataTour: string;
  primaryTenant?: TTenant;
  isEsignConnected?: boolean;
  isPropertyLoading: boolean;
  isViewingRental?: boolean;
};

export default function DocumentsOverview({
  property,
  dataTour,
  primaryTenant,
  isEsignConnected = false,
  isPropertyLoading,
  isViewingRental = false,
}: TDocumentOverviewProps) {
  const user: TUser = fetchLoggedInUser();

  const [triggerGetEsignTemplatesQuery, esignTemplatesResult] =
    useGetEsignTemplatesMutation();

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

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

  const templates = esignTemplatesResult?.data?.templates ?? [];

  const prepareDocumentForEsign = (rowData) => {
    if (!rowData) return null;

    const sanitizedFieldsForNewLease = sanitizeEsignFieldsForNewLease(
      rowData,
      property,
      propertyOwnerData,
      tenantData,
      primaryTenant,
    );

    const sanitizedFieldsForLeaseExtension =
      sanitizeEsignFieldsForLeaseExtension(
        rowData,
        property,
        propertyOwnerData,
        primaryTenant,
      );

    const frameWork = {
      userId: user?.uid,
      doc_name: rowData?.name,
      uuid: rowData?.uuid,
      additional_senders: "earmuffjam@homehivesolutions.com",
      fields: {
        ...sanitizedFieldsForNewLease,
        ...sanitizedFieldsForLeaseExtension,
      },
    };
    createEsignFromTemplate(frameWork);
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
    if (!isEsignConnected && user.uid) {
      triggerGetEsignTemplatesQuery(user.uid);
    }
  }, [isEsignConnected, user?.uid]);

  useEffect(() => {
    if (isPrepareTemplateSuccess) {
      setShowSnackbar(true);
    }
  }, [isPrepareTemplateLoading]);

  if (esignTemplatesResult?.isLoading) return <Skeleton height="10rem" />;

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
              prepareDocumentForEsign={prepareDocumentForEsign}
            />
          )}
        </Stack>
      </CardContent>
      <CustomSnackbar
        severity="success"
        title="Changes saved."
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
      />
    </Card>
  );
}

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { Card, CardContent, Skeleton, Stack, Typography } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import RowHeader from "common/RowHeader";
import { SettingsRouteUri, fetchLoggedInUser } from "common/utils";
import {
  useCreateEsignFromTemplateMutation,
  useGetEsignTemplatesQuery,
} from "features/Api/externalIntegrationsApi";
import {
  useGetUserByEmailAddressQuery,
  useGetUserDataByIdQuery,
} from "features/Api/firebaseUserApi";
import { Role } from "features/Auth/AuthHelper";
import EsignTemplateDetails from "features/Rent/components/EsignConnect/EsignTemplateDetails";
import {
  sanitizeEsignFieldsForLeaseExtension,
  sanitizeEsignFieldsForNewLease,
} from "features/Rent/utils";

export default function DocumentsOverview({
  property,
  dataTour,
  primaryTenant = {},
  isEsignConnected,
  isPropertyLoading,
  isViewingRental = false,
}) {
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const tenantEmail = property?.rentees?.find((email) => email);

  const { data: esignTemplates, isLoading: isGetEsignTemplatesLoading } =
    useGetEsignTemplatesQuery(user?.uid, {
      skip: !isEsignConnected,
    });

  const { data: tenantData } = useGetUserByEmailAddressQuery(tenantEmail, {
    skip: !tenantEmail,
  });

  const { data: propertyOwnerData } = useGetUserDataByIdQuery(
    property?.createdBy,
    {
      skip: !property?.createdBy,
    },
  );

  const [createEsignFromTemplate, { isSuccess: isPrepareTemplateSuccess }] =
    useCreateEsignFromTemplateMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const templates = esignTemplates?.templates ?? [];

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
    if (isPrepareTemplateSuccess) {
      setShowSnackbar(true);
    }
  }, [isPrepareTemplateSuccess]);

  if (isGetEsignTemplatesLoading) return <Skeleton height="10rem" />;

  return (
    <Card sx={{ mb: 3 }} data-tour={dataTour}>
      <CardContent>
        <RowHeader
          title="Documents Overview"
          caption={`View documents assoicated with ${property?.name}`}
          sxProps={{ textAlign: "left", color: "text.secondary" }}
        />
        {isEsignConnected ? (
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
        ) : ![Role.Tenant].includes(user?.role) ? (
          <EmptyComponent caption="Setup your esign account for">
            <Typography
              component={"span"}
              variant="caption"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`${SettingsRouteUri}?tabIdx=2`)}
            >
              Esign here.
            </Typography>
          </EmptyComponent>
        ) : (
          <EmptyComponent caption="Contact property owner to setup E-Sign"></EmptyComponent>
        )}
      </CardContent>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Card>
  );
}

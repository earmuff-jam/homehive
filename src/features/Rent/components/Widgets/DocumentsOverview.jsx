import React, { useEffect, useState } from "react";

import { Card, CardContent, Skeleton, Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import {
  useCreateEsignFromTemplateMutation,
  useGetEsignTemplatesQuery,
} from "features/Api/externalIntegrationsApi";
import EsignTemplateDetails from "features/Rent/components/EsignConnect/EsignTemplateDetails";
import { fetchLoggedInUser } from "features/Rent/utils";

export default function DocumentsOverview({
  property,
  dataTour,
  isEsignConnected,
  isPropertyLoading,
  isViewingRental = false,
}) {
  const user = fetchLoggedInUser();
  const { data: esignTemplates, isLoading: isGetEsignTemplatesLoading } =
    useGetEsignTemplatesQuery(user?.uid, {
      skip: !isEsignConnected,
    });

  const [
    createEsignFromTemplate,
    {
      isLoading: isCreateEsignFromTemplateLoading,
      isSuccess: isCreateEsignFromTemplateSuccess,
    },
  ] = useCreateEsignFromTemplateMutation();

  const [showSnackbar, setShowSnackbar] = useState(false);

  const templates = esignTemplates?.templates ?? [];

  useEffect(() => {
    if (isCreateEsignFromTemplateSuccess) {
      setShowSnackbar(true);
    }
  }, [isCreateEsignFromTemplateLoading]);

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
              isCreateEsignFromTemplateLoading={
                isCreateEsignFromTemplateLoading
              }
              createEsignFromExistingTemplate={createEsignFromTemplate}
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

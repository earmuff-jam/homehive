import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import dayjs from "dayjs";

import { Button, Paper, Skeleton, Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useGetPropertiesByUserIdQuery } from "features/Api/propertiesApi";
import {
  useDecodeIntentMutation,
  useGetAnswerMutation,
} from "features/Api/raspyApi";
import { useLazyGetRentsByPropertiesQuery } from "features/Api/rentApi";
import { useLazyGetTenantsByPropertiesArrQuery } from "features/Api/tenantsApi";
import ResponseDetails from "features/Raspy/ResponseDetails";

export default function ChatForm() {
  const user = fetchLoggedInUser();

  const {
    data: properties = [],
    isLoading: isPropertiesListLoading,
    isSuccess: isPropertiesListSuccess,
  } = useGetPropertiesByUserIdQuery(user.uid, {
    skip: !user?.uid,
  });

  const [getExistingTenants, getExistingTenantsResult] =
    useLazyGetTenantsByPropertiesArrQuery();

  const [getExistingRents, getExistingRentsResult] =
    useLazyGetRentsByPropertiesQuery();

  const [handleRaspyMessage, handleRaspyMessageResult] = useGetAnswerMutation();
  const [decodeUserIntent, decodeUserIntentResult] = useDecodeIntentMutation();

  useEffect(() => {
    if (!isPropertiesListLoading && isPropertiesListSuccess) {
      const propertiesIds = properties?.map((property) => property.id);
      getExistingTenants({ propertyIds: propertiesIds, isActive: true });
      getExistingRents({ propertyIds: propertiesIds, isActive: true });
    }
  }, [isPropertiesListLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      message: "",
    },
  });

  const submit = (formData) => {
    formData["email"] = user?.email;
    formData["properties"] = properties || [];
    formData["rents"] = getExistingRents?.data || [];
    formData["tenants"] = getExistingTenants?.data || [];
    formData["message"] = formData?.message.trim();
    formData["updatedOn"] = dayjs().toISOString();

    decodeUserIntent(formData);
  };

  const [showSnackbar, setShowSnackbar] = useState(false);
  const loading =
    handleRaspyMessageResult.isLoading || decodeUserIntentResult.isLoading;

  useEffect(() => {
    if (handleRaspyMessageResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [handleRaspyMessageResult.isLoading]);

  useEffect(() => {
    if (decodeUserIntentResult.isSuccess) {
      const responseData = decodeUserIntentResult.data;
      const originalArgs = decodeUserIntentResult.originalArgs;

      handleRaspyMessage({
        ...originalArgs,
        intent: responseData?.intent || "Other",
      });
    }
  }, [decodeUserIntentResult.isLoading]);

  if (
    isPropertiesListLoading ||
    getExistingTenantsResult.isLoading ||
    getExistingRentsResult.isLoading
  ) {
    return <Skeleton height="10rem" />;
  }

  return (
    <Stack spacing={1}>
      <TextFieldWithLabel
        id="raspy-question"
        label="Ask something about your properties ..."
        placeholder="e.g. What's the rent situation?"
        errorMsg={errors.message?.message}
        multiline
        inputProps={{
          ...register("message", {
            required: "Message is required",
            minLength: {
              value: 5,
              message: "Message is too short. Please rephrase the question.",
            },
            maxLength: {
              value: 1500,
              message: "Message is too long. Please rephrase the question.",
            },
          }),
        }}
      />

      <Button
        variant="contained"
        onClick={handleSubmit(submit)}
        loading={loading}
      >
        {loading ? "Sending..." : "Send"}
      </Button>

      {handleRaspyMessageResult?.isSuccess ? (
        <Paper variant="outlined" sx={{ padding: 2 }}>
          <ResponseDetails data={handleRaspyMessageResult.data} />
        </Paper>
      ) : (
        <EmptyComponent caption="Dive in with Raspy ..." />
      )}
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
}

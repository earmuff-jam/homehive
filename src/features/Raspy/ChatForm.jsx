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

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formattedRaspyResponseDetails, setFormattedRaspyResponseDetails] =
    useState(null);

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

  const loading =
    handleRaspyMessageResult.isLoading || decodeUserIntentResult.isLoading;

  useEffect(() => {
    if (!isPropertiesListLoading && isPropertiesListSuccess) {
      const propertiesIds = properties?.map((property) => property.id);
      getExistingTenants({ propertyIds: propertiesIds, isActive: true });
      getExistingRents({ propertyIds: propertiesIds, isActive: true });
    }
  }, [isPropertiesListLoading]);

  useEffect(() => {
    if (handleRaspyMessageResult.isSuccess) {
      const raspyRecomendedActions =
        handleRaspyMessageResult?.data?.recommendedActions || [];

      setFormattedRaspyResponseDetails({
        portfolioHealth: calculatePropertyHealth(properties),
        financialHealth: calculateFinancialHealth(
          properties,
          getExistingTenantsResult?.data,
          getExistingRentsResult.data,
        ),
        recommendedActions: raspyRecomendedActions,
      });
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
          <ResponseDetails data={formattedRaspyResponseDetails} />
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

// calculatePropertyHealth ...
// defines a function that is used to calculate the health of your property
const calculatePropertyHealth = (properties = []) => {
  const totalProperties = properties?.length;
  const vacantProperties = properties?.filter(
    (property) => property.rentee?.length === 0,
  )?.length;

  return {
    totalProperties: totalProperties,
    vacantProperties: vacantProperties,
  };
};

// calculateFinancialHealth ...
// defines a function that is used to calculate the financial health of your property.
const calculateFinancialHealth = (properties, tenants, rents) => {
  const totalActiveTenants = tenants?.length;

  const totalMonthlyRentalIncome = properties?.reduce((acc, el) => {
    acc += Number(el?.rent);
    acc += Number(el?.additionalRent);
    return acc;
  }, 0);

  console.log(properties, totalMonthlyRentalIncome, tenants);

  const securityDepositsCollected = tenants.reduce((acc, el) => {
    const securityDeposit = el?.securityDeposit || 0;
    acc += securityDeposit;

    return acc;
  }, 0);

  return {
    totalMonthlyRentalIncome: "totalMonthlyRentalIncome",
    securityDepositsCollected: securityDepositsCollected,
  };
};

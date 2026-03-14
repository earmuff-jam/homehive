import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import dayjs from "dayjs";

import { Button, Paper, Stack, Typography } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useGetAnswerMutation } from "features/Api/raspyApi";

export default function ChatForm({ properties = [], tenants = [] }) {
  const user = fetchLoggedInUser();
  const [handleRaspyMessage, handleRaspyMessageResult] = useGetAnswerMutation();

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
    formData["rents"] = [];
    formData["tenants"] = [];
    formData["updatedOn"] = dayjs().toISOString();
    handleRaspyMessage(formData);
  };

  const [showSnackbar, setShowSnackbar] = useState(false);
  const loading = false;

  useEffect(() => {
    if (handleRaspyMessageResult.isSuccess) {
      setShowSnackbar(true);
    }
  }, [handleRaspyMessageResult.isLoading]);

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
        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: "grey.50" }}>
          <Typography variant="body2">
            {JSON.stringify(handleRaspyMessageResult.data)}
          </Typography>
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

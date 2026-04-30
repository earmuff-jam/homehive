import React, { useEffect } from "react";

import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";

// ContactEmailEnumValue ...
const ContactEmailEnumValue = import.meta.env.VITE_PRIMARY_EMAIL;
// DoNotSellMyInformationEnumValue ...
const DoNotSellMyInformationEnumValue = "no_sp";

const derieveEmailMessageFromQueryParams = (subject = "") => {
  if (subject === "") {
    return { subject: "", message: "" };
  }
  if (subject == DoNotSellMyInformationEnumValue) {
    return {
      subject: "Opt out of analytics",
      message: "Please out me out of analytics",
    };
  }
};

export default function Contact() {
  const [searchParams] = useSearchParams();

  const draftSubject = searchParams.get("subject");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      subject: "",
      email: "",
      message: "",
    },
  });

  const [sendEmail, sendEmailResponse] = useSendEmailMutation();

  const onSubmit = (data) => {
    sendEmail({
      to: ContactEmailEnumValue,
      subject: data?.subject,
      text: `${data?.email} ${data?.message}`,
    });
  };

  useEffect(() => {
    if (sendEmailResponse.isSuccess) {
      const t = setTimeout(() => {
        reset();
        sendEmailResponse.reset();
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [sendEmailResponse.isLoading]);

  useEffect(() => {
    if (draftSubject) {
      const { subject, message } =
        derieveEmailMessageFromQueryParams(draftSubject);
      setValue("subject", subject);
      setValue("message", message);
    }
  }, [draftSubject]);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" gutterBottom>
        Contact Us
      </Typography>

      <Typography color="text.secondary">
        Have a question or need help? Fill out the form below and we will get
        back to you as soon as possible.
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ mt: 3 }}
        noValidate
      >
        {sendEmailResponse.isSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Message sent successfully! We will get back to you soon.
          </Alert>
        )}

        {sendEmailResponse.isError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            Something went wrong. Please try again later.
          </Alert>
        )}

        <TextField
          fullWidth
          label="Subject"
          margin="normal"
          {...register("subject", {
            required: "Subject is required",
          })}
          error={!!errors.subject}
          helperText={errors.subject?.message}
        />

        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address",
            },
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

        <TextField
          fullWidth
          label="Message"
          multiline
          rows={5}
          margin="normal"
          {...register("message", {
            required: "Message is required",
          })}
          error={!!errors.message}
          helperText={errors.message?.message}
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={isSubmitting || sendEmailResponse.isLoading}
          sx={{ mt: 2 }}
        >
          {sendEmailResponse.isLoading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </Button>
      </Box>
    </Container>
  );
}

import React from "react";
import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Container, Stack, Typography } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import { ViewInvoiceRouteUri } from "common/utils";
import {
  useGetInvoiceListQuery,
  useGetReceiverInfoQuery,
  useUpsertReceiverInfoMutation,
} from "features/Api/invoiceApi";
import InvoiceSelector from "features/Invoice/components/InvoiceSelector/InvoiceSelector";
import UserInfoViewer from "features/Invoice/components/UserInfo/UserInfoViewer";
import { useAppTitle } from "hooks/useAppTitle";

// DefaultReceiverInfo ...
// defines the default values for the receiever info
const DefaultReceiverInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipcode: "",
};

export default function ReceiverInfo() {
  useAppTitle("Receiver Information");
  const navigate = useNavigate();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const { data: invoiceListOptions } = useGetInvoiceListQuery();

  const { data: receiverInfo, isFetching: isReceiverInfoLoading } =
    useGetReceiverInfoQuery(
      { invoiceID: selectedInvoice },
      { skip: !selectedInvoice },
    );

  const [
    upsertReceiverInfo,
    {
      isLoading: isupsertReceiverInfoLoading,
      isSuccess: isupsertReceiverInfoSuccess,
    },
  ] = useUpsertReceiverInfoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: DefaultReceiverInfo,
  });

  const submit = (formData) => {
    formData["invoiceID"] = selectedInvoice;
    formData["updatedOn"] = dayjs().toISOString();
    upsertReceiverInfo(formData);
  };

  const isExistingInvoice =
    selectedInvoice && selectedInvoice !== "new_invoice";
  const selectedInvoiceDetails = invoiceListOptions?.invoiceDetails?.find(
    (el) => el.id === selectedInvoice,
  );

  useEffect(() => {
    if (isupsertReceiverInfoSuccess) {
      setShowSnackbar(true);
    }
  }, [isupsertReceiverInfoLoading]);

  useEffect(() => {
    if (receiverInfo) {
      reset({
        firstName: receiverInfo.firstName,
        lastName: receiverInfo.lastName,
        email: receiverInfo.email,
        phone: receiverInfo.phone,
        streetAddress: receiverInfo.streetAddress,
        city: receiverInfo.city,
        state: receiverInfo.state,
        zipcode: receiverInfo.zipcode,
        updatedOn: receiverInfo.updatedOn,
      });
    } else {
      reset({ ...DefaultReceiverInfo });
    }
  }, [selectedInvoice, isReceiverInfoLoading]);

  return (
    <Container
      maxWidth="md"
      data-tour="reciever-0"
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2,
        padding: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Stack direction="row" spacing={1} justifyContent="space-between">
        <Stack>
          <Typography variant="h5" color="text.secondary" fontWeight="bold">
            Receiver Information
          </Typography>
          <Typography variant="subtitle2">
            {isExistingInvoice
              ? `Edit receiver details for ${selectedInvoiceDetails?.invoiceHeader}`
              : "Required fields are marked with an *"}
          </Typography>
        </Stack>
        <Stack justifyContent="flex-end" direction="row" spacing={1}>
          <InvoiceSelector
            hideCreateNewSelector
            inputLabel="Select Invoice"
            selectedInvoice={selectedInvoice}
            setSelectedInvoice={setSelectedInvoice}
            options={invoiceListOptions?.invoiceDetails}
          />
        </Stack>
      </Stack>
      {selectedInvoice ? (
        <UserInfoViewer
          register={register}
          errors={errors}
          isDisabled={!isValid}
          onSubmit={handleSubmit(submit)}
          loading={isupsertReceiverInfoLoading}
          handleReset={() => reset(DefaultReceiverInfo)}
        />
      ) : (
        <EmptyComponent caption="Select or create invoice to begin" />
      )}
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
        caption="View Invoice"
        onClick={() => navigate(ViewInvoiceRouteUri)}
      />
    </Container>
  );
}

import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Container, Stack, Typography } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import { ViewInvoiceRouteUri } from "common/utils";
import {
  useGetInvoiceListQuery,
  useGetSenderInfoQuery,
  useUpsertSenderInfoMutation,
} from "features/Api/invoiceApi";
import InvoiceSelector from "features/Invoice/components/InvoiceSelector/InvoiceSelector";
import UserInfoViewer from "features/Invoice/components/UserInfo/UserInfoViewer";
import { useAppTitle } from "hooks/useAppTitle";

const DefaultSenderInfo = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  streetAddress: "",
  city: "",
  state: "",
  zipcode: "",
};

export default function SenderInfo() {
  useAppTitle("Sender Information");
  const navigate = useNavigate();

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState("");

  const { data: invoiceListOptions } = useGetInvoiceListQuery();

  const { data: senderInfo, isFetching: isSenderInfoFetching } =
    useGetSenderInfoQuery(
      { invoiceID: selectedInvoice },
      { skip: !selectedInvoice },
    );

  const [
    upsertSenderInfo,
    {
      isLoading: isUpsertSendingInfoLoading,
      isSuccess: isUpsertSendingInfoSuccess,
    },
  ] = useUpsertSenderInfoMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: DefaultSenderInfo,
  });

  const submit = (formData) => {
    formData["invoiceID"] = selectedInvoice;
    formData["updatedOn"] = dayjs().toISOString();
    upsertSenderInfo(formData);
  };

  const isExistingInvoice =
    selectedInvoice && selectedInvoice !== "new_invoice";

  const selectedInvoiceDetails = invoiceListOptions?.invoiceDetails?.find(
    (el) => el.id === selectedInvoice,
  );

  useEffect(() => {
    if (isUpsertSendingInfoSuccess) {
      setShowSnackbar(true);
    }
  }, [isUpsertSendingInfoLoading]);

  useEffect(() => {
    if (senderInfo) {
      reset({
        firstName: senderInfo.firstName,
        lastName: senderInfo.lastName,
        email: senderInfo.email,
        phone: senderInfo.phone,
        streetAddress: senderInfo.streetAddress,
        city: senderInfo.city,
        state: senderInfo.state,
        zipcode: senderInfo.zipcode,
        updatedOn: senderInfo.updatedOn,
      });
    } else {
      reset({ ...DefaultSenderInfo });
    }
  }, [selectedInvoice, isSenderInfoFetching]);

  return (
    <Container
      maxWidth="md"
      data-tour="sender-0"
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
            Sender Information
          </Typography>
          <Typography variant="subtitle2">
            {isExistingInvoice
              ? `Edit sender details for ${selectedInvoiceDetails?.invoiceHeader}`
              : "Required fields are marked with an *"}
          </Typography>
        </Stack>
        <Stack
          justifyContent="flex-end"
          direction="row"
          spacing={1}
          data-tour="sender-1"
        >
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
          dataTour="sender-2"
          register={register}
          errors={errors}
          isDisabled={!isValid}
          onSubmit={handleSubmit(submit)}
          loading={isUpsertSendingInfoLoading}
          handleReset={() => reset(DefaultSenderInfo)}
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

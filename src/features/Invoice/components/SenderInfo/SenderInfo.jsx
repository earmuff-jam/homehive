import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import {
  useGetSenderInfoQuery,
  useUpsertSenderInfoMutation,
} from "features/Api/invoiceApi";
import UserInfoViewer from "features/Invoice/components/UserInfo/UserInfoViewer";
import { useAppTitle } from "hooks/useAppTitle";

export default function SenderInfo() {
  useAppTitle("Sender Information");
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const { data: senderInfo, isLoading: isSenderInfoLoading } =
    useGetSenderInfoQuery();

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
    defaultValues: {
      first_name: "",
      last_name: "",
      email_address: "",
      phone_number: "",
      street_address: "",
      city: "",
      state: "",
      zipcode: "",
    },
  });

  const submit = (formData) => {
    formData["updatedOn"] = dayjs();
    upsertSenderInfo(formData);
  };

  useEffect(() => {
    if (isUpsertSendingInfoSuccess) {
      setShowSnackbar(true);
    }
  }, [isUpsertSendingInfoLoading]);

  useEffect(() => {
    if (senderInfo) {
      reset({
        first_name: senderInfo.first_name,
        last_name: senderInfo.last_name,
        email_address: senderInfo.email_address,
        phone_number: senderInfo.phone_number,
        street_address: senderInfo.street_address,
        city: senderInfo.city,
        state: senderInfo.state,
        zipcode: senderInfo.zipcode,
        updatedOn: senderInfo.updatedOn,
      });
    }
  }, [isSenderInfoLoading]);

  return (
    <Stack spacing={1} alignItems="center" data-tour={"sender-0"}>
      <RowHeader
        title="Add details about the sender"
        caption="Required fields are marked with an * "
      />
      <UserInfoViewer
        title="Sender Information"
        caption="Add details about the sender"
        register={register}
        errors={errors}
        isDisabled={!isValid}
        onSubmit={handleSubmit(submit)}
        loading={isUpsertSendingInfoLoading}
      />
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
        caption="View Invoice"
        onClick={() => navigate("/view")}
      />
    </Stack>
  );
}

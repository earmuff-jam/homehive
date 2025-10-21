import { useEffect, useState } from "react";
import React from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import {
  useGetReceiverInfoQuery,
  useUpsertReceiverInfoMutation,
} from "features/Api/invoiceApi";
import UserInfoViewer from "features/Invoice/components/UserInfo/UserInfoViewer";
import { useAppTitle } from "hooks/useAppTitle";

export default function RecieverInfo() {
  useAppTitle("Reciever Information");
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    data: recieverInfo,
    isLoading: isRecieverInfoLoading,
    isSuccess: isRecieverInfoSuccess,
  } = useGetReceiverInfoQuery();

  const [
    upsertRecieverInfo,
    {
      isLoading: isUpsertRecieverInfoLoading,
      isSuccess: isUpsertRecieverInfoSuccess,
    },
  ] = useUpsertReceiverInfoMutation();

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
    upsertRecieverInfo(formData);
  };

  useEffect(() => {
    if (isUpsertRecieverInfoSuccess) {
      setShowSnackbar(true);
    }
  }, [isUpsertRecieverInfoLoading]);

  useEffect(() => {
    if (isRecieverInfoSuccess) {
      reset({
        first_name: recieverInfo.first_name,
        last_name: recieverInfo.last_name,
        email_address: recieverInfo.email_address,
        phone_number: recieverInfo.phone_number,
        street_address: recieverInfo.street_address,
        city: recieverInfo.city,
        state: recieverInfo.state,
        zipcode: recieverInfo.zipcode,
        updatedOn: recieverInfo.updatedOn,
      });
    }
  }, [isRecieverInfoLoading]);

  return (
    <Stack spacing={1} alignItems="center" data-tour={"reciever-0"}>
      <RowHeader
        title="Add details about the reciever"
        caption="Required fields are marked with an * "
      />
      <UserInfoViewer
        title="Reciever Information"
        caption="Add details about the reciever"
        register={register}
        errors={errors}
        isDisabled={!isValid}
        onSubmit={handleSubmit(submit)}
        loading={isUpsertRecieverInfoLoading}
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

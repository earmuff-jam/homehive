import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import {
  useGetReceiverInfoQuery,
  useUpsertReceiverInfoMutation,
} from "features/Api/invoiceApi";
import RowHeader from "features/Invoice/components/RowHeader/InvoiceRowHeader";
import UserInfoViewer from "features/Invoice/components/UserInfo/UserInfoViewer";
import { UserInfo } from "features/Invoice/types/Invoice.types";
import { useAppTitle } from "hooks/useAppTitle";

export default function RecieverInfo() {
  useAppTitle("Reciever Information");
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

  const {
    data: recieverInfo,
    isLoading: isRecieverInfoLoading,
    isSuccess: isRecieverInfoSuccess,
  } = useGetReceiverInfoQuery(undefined);

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
  } = useForm<UserInfo>({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      zipcode: "",
    },
  });

  const submit = (formData: UserInfo) => {
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
        firstName: recieverInfo.firstName,
        lastName: recieverInfo.lastName,
        email: recieverInfo.email,
        phone: recieverInfo.phone,
        streetAddress: recieverInfo.streetAddress,
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
        severity="success"
        title="Changes saved."
        caption="View Invoice"
        onClick={() => navigate("/view")}
      />
    </Stack>
  );
}

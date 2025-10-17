import { useEffect, useState } from "react";
import React from "react";

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import UserInfoViewer from "features/Invoice/components/UserInfo/UserInfoViewer";
import { useAppTitle } from "hooks/useAppTitle";

export default function RecieverInfo() {
  useAppTitle("Reciever Information");
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);

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
    localStorage.setItem("receiverInfo", JSON.stringify(formData));
    setShowSnackbar(true);
  };

  useEffect(() => {
    const localValues = localStorage.getItem("receiverInfo");
    const parsedValues = JSON.parse(localValues);
    if (parsedValues) {
      reset({
        first_name: parsedValues.first_name,
        last_name: parsedValues.last_name,
        email_address: parsedValues.email_address,
        phone_number: parsedValues.phone_number,
        street_address: parsedValues.street_address,
        city: parsedValues.city,
        state: parsedValues.state,
        zipcode: parsedValues.zipcode,
        updatedOn: parsedValues.updatedOn,
      });
    }
  }, []);

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

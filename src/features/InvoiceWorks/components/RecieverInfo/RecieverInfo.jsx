import { useEffect, useState } from "react";
import React from "react";

import { useNavigate } from "react-router-dom";

import dayjs from "dayjs";

import { Stack } from "@mui/material";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import RowHeader from "common/RowHeader/RowHeader";
import UserInfoViewer from "common/UserInfo/UserInfoViewer";
import { BLANK_INDIVIDUAL_INFORMATION_DETAILS } from "common/UserInfo/constants";
import { useAppTitle } from "hooks/useAppTitle";

export default function RecieverInfo() {
  useAppTitle("Reciever Information");
  const navigate = useNavigate();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [formData, setFormData] = useState(
    BLANK_INDIVIDUAL_INFORMATION_DETAILS,
  );

  const handleChange = (ev) => {
    const { id, value } = ev.target;
    const updatedFormData = { ...formData };
    let errorMsg = "";
    for (const validator of updatedFormData[id].validators) {
      if (validator.validate(value)) {
        errorMsg = validator.message;
        break;
      }
    }
    updatedFormData[id] = {
      ...updatedFormData[id],
      value,
      errorMsg,
    };
    setFormData(updatedFormData);
  };

  const submit = (ev) => {
    ev.preventDefault();
    const draftData = Object.entries(formData).reduce(
      (acc, [key, valueObj]) => {
        acc[key] = valueObj.value;
        return acc;
      },
      {},
    );
    draftData["updatedOn"] = dayjs();
    localStorage.setItem("recieverInfo", JSON.stringify(draftData));
    setShowSnackbar(true);
  };

  const isDisabled = () => {
    const containsErr = Object.values(formData).reduce((acc, el) => {
      if (el.errorMsg) {
        return true;
      }
      return acc;
    }, false);

    const requiredFormFields = Object.values(formData).filter(
      (v) => v.isRequired,
    );
    const isRequiredFieldsEmpty = requiredFormFields.some(
      (el) => el.value.trim() === "",
    );

    return containsErr || isRequiredFieldsEmpty;
  };

  useEffect(() => {
    const localValues = localStorage.getItem("recieverInfo");
    const parsedValues = JSON.parse(localValues);
    if (parsedValues) {
      const draftProfileDetails = { ...BLANK_INDIVIDUAL_INFORMATION_DETAILS };
      draftProfileDetails.first_name.value = parsedValues.first_name;
      draftProfileDetails.last_name.value = parsedValues.last_name;
      draftProfileDetails.email_address.value = parsedValues.email_address;
      draftProfileDetails.phone_number.value = parsedValues.phone_number;
      draftProfileDetails.street_address.value = parsedValues.street_address;
      draftProfileDetails.city.value = parsedValues.city;
      draftProfileDetails.state.value = parsedValues.state;
      draftProfileDetails.zipcode.value = parsedValues.zipcode;
      draftProfileDetails.updatedOn = parsedValues.updatedOn;
      setFormData(draftProfileDetails);
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
        formData={formData}
        handleChange={handleChange}
        onSubmit={submit}
        isDisabled={isDisabled()}
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

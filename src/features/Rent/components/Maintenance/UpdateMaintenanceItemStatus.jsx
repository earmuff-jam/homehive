import React, { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import dayjs from "dayjs";

import { HandymanOutlined } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar";
import TextFieldWithLabel from "common/TextFieldWithLabel";
import { fetchLoggedInUser } from "common/utils";
import { useSendEmailMutation } from "features/Api/externalIntegrationsApi";
import { useUpdateMaintenanceDataMutation } from "features/Api/maintenanceApi";
import {
  UpdateMaintenanceRecordEnumValue,
  appendDisclaimer,
  emailMessageBuilder,
  formatAndSendNotification,
} from "features/Rent/utils";

const UpdateMaintenanceItemStatus = ({
  id,
  status,
  closeDialog,
  propertyName,
  primaryTenantEmail,
}) => {
  const user = fetchLoggedInUser();

  const [sendEmail] = useSendEmailMutation();

  const [
    updateMaintenanceRecord,
    {
      isFetching: isMaintenanceRecordLoading,
      isSuccess: isMaintenanceRecordSuccess,
    },
  ] = useUpdateMaintenanceDataMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const [showSnackbar, setShowSnackbar] = useState(false);

  const onSubmit = (data) => {
    updateMaintenanceRecord({
      ...data,
      id: id,
      status: status,
      createdBy: user?.uid,
      createdOn: dayjs().toISOString(),
      updatedBy: user?.uid,
      updatedOn: dayjs().toISOString(),
    });
  };

  useEffect(() => {
    if (isMaintenanceRecordSuccess) {
      closeDialog();
      setShowSnackbar(true);

      const emailMsgWithDisclaimer = appendDisclaimer(
        emailMessageBuilder(UpdateMaintenanceRecordEnumValue, propertyName),
        user?.email,
      );

      formatAndSendNotification({
        to: primaryTenantEmail,
        subject: `${UpdateMaintenanceRecordEnumValue} - ${propertyName}`,
        body: emailMsgWithDisclaimer,
        ccEmailIds: [user?.email],
        sendEmail,
      });
    }
  }, [isMaintenanceRecordSuccess]);

  return (
    <Stack spacing={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box flex={3}>
          <TextFieldWithLabel
            label="Note *"
            id="note"
            multiline
            maxRows={5}
            placeholder="Enter resolution or notes under 500 characters"
            errorMsg={errors.note?.message}
            inputProps={{
              ...register("note", {
                required: "Note is required",
                maxLength: {
                  value: 500,
                  message: "Note should be less than 500 characters",
                },
              }),
            }}
          />
        </Box>
      </form>
      <Box alignSelf="flex-end">
        <AButton
          variant="outlined"
          disabled={!isValid}
          endIcon={<HandymanOutlined fontSize="small" />}
          label="Update maintenance request"
          loading={isMaintenanceRecordLoading}
          onClick={handleSubmit(onSubmit)}
        />
      </Box>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default UpdateMaintenanceItemStatus;

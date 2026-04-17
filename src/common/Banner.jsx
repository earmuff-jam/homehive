import React from "react";

import { useLocation } from "react-router-dom";

import { ErrorOutlineRounded } from "@mui/icons-material";
import { Alert, Button, Stack, Typography } from "@mui/material";
import { fetchLoggedInUser, isBasePlanUser } from "common/utils";
import { useUpdateUserByUidMutation } from "features/Api/firebaseUserApi";
import { Role } from "features/Auth/AuthHelper";

export default function Banner() {
  const location = useLocation();
  const user = fetchLoggedInUser();
  const currentPath = location?.pathname;

  const [updateUser] = useUpdateUserByUidMutation();

  // updates user with the role of property owner;
  // sets up seven day stripe trial as well.
  const handleOwnerEmailConfirmation = () => {
    updateUser({
      uid: user?.uid,
      newData: {
        role: Role.Owner,
      },
    });
  };

  if (isBasePlanUser(currentPath))
    return (
      <Alert
        icon={<ErrorOutlineRounded fontSize="small" />}
        severity="error"
        action={
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleOwnerEmailConfirmation}
          >
            Accept
          </Button>
        }
      >
        <Stack direction="row" alignItems="center">
          <Typography variant="body2">
            We’ll log you out so you can sign back in and confirm your account.
          </Typography>
        </Stack>
      </Alert>
    );
  return null;
}

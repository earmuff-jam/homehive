import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { MenuOutlined } from "@mui/icons-material";
import {
  Alert,
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { DefaultTourStepsMapperObj } from "common/Tour/TourSteps";
import { isUserLoggedIn } from "common/utils";
import { useAuthenticateMutation } from "features/Api/firebaseUserApi";
import { useLocalStorageData } from "features/InvoiceWorks/hooks/useGenerateUserData";
import {
  OwnerRole,
  TenantRole,
} from "features/Layout/components/Landing/constants";
import MenuOptions from "features/Layout/components/NavBar/MenuOptions";
import { retrieveTourKey } from "features/Layout/utils";
import { isFeatureEnabled, logoutUser } from "features/RentWorks/common/utils";
import useSendEmail, { generateInvoiceHTML } from "hooks/useSendEmail";

export default function AppToolbar({
  currentUri,
  currentRoute,
  currentThemeIdx,
  setCurrentThemeIdx,
  handleDrawerOpen,
  handleDrawerClose,
  setDialog,
}) {
  const navigate = useNavigate();
  const { sendEmail, reset, loading, error, success } = useSendEmail();

  const [
    authenticate,
    {
      isSuccess: isAuthSuccess,
      isLoading: isAuthLoading,
      isError: isAuthError,
      error: authError,
    },
  ] = useAuthenticateMutation();

  const {
    data,
    recieverInfo,
    draftInvoiceHeader,
    draftInvoiceStatusLabel,
    draftRecieverUserEmailAddress,
    isDisabled,
  } = useLocalStorageData();

  // hide for landing page
  const showHelp = currentRoute.config.displayHelpSelector;
  const showPrint = currentRoute.config.displayPrintSelector;

  const isSendEmailFeatureEnabled = isFeatureEnabled("sendEmail");

  const handleSendEmail = () => {
    sendEmail({
      to: draftRecieverUserEmailAddress,
      subject: draftInvoiceHeader
        ? `Invoice Details - ${draftInvoiceHeader}`
        : "Invoice Details",
      text: "Please view your attached invoice.",
      html: generateInvoiceHTML(recieverInfo, data, draftInvoiceStatusLabel),
    });
  };

  const handleHelp = () => {
    const key = retrieveTourKey(currentUri, "property");
    const draftDialogTitle = DefaultTourStepsMapperObj[key]?.element;

    setDialog({
      title: draftDialogTitle,
      label: "Help and Support",
      type: "HELP",
      display: true,
      showWatermark: false,
    });

    handleDrawerOpen();
  };

  const handlePrint = () => {
    const draftDialogTitle =
      "Verify all information is correct before proceeding to print. Press print when ready.";

    setDialog({
      title: draftDialogTitle,
      label: "Verify Information",
      type: "PRINT",
      display: true,
      showWatermark: false,
    });

    handleDrawerClose();
  };

  const changeTheme = (_, currentThemeIdx) => {
    if (Number(currentThemeIdx) === 0) {
      localStorage.setItem("theme", 1);

      setCurrentThemeIdx(1);
      return;
    }

    localStorage.setItem("theme", 0);
    setCurrentThemeIdx(0);
  };

  const handleCreateUser = (role = TenantRole) => {
    authenticate(role);
  };

  const logout = async () => {
    await logoutUser();
    navigate(`/?refresh=${Date.now()}`); // force refresh
  };

  useEffect(() => {
    if (!isAuthLoading && isAuthSuccess) {
      window.location.reload();
    }
  }, [isAuthLoading]);

  if (isAuthError) {
    return (
      <Alert severity="error">
        <Stack>
          <Typography>Error during log in. Please try again later.</Typography>
          <Typography variant="caption">{authError?.message}</Typography>
        </Stack>
      </Alert>
    );
  }

  return (
    <AppBar elevation={0} sx={{ padding: "0.25rem 0rem" }} className="no-print">
      <Toolbar>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flexGrow: 1 }}
        >
          <IconButton onClick={handleDrawerOpen}>
            <MenuOutlined />
          </IconButton>
          <img src="/logo-no-text.png" height="100%" width="50rem" />
          <Typography variant="h5">Homehive</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {isUserLoggedIn() ? (
            <Tooltip title="logout">
              <AButton
                label="Logout"
                variant="outlined"
                size="small"
                onClick={logout}
              />
            </Tooltip>
          ) : (
            <>
              <AButton
                size="small"
                variant="outlined"
                label="Manage Properties"
                onClick={() => handleCreateUser(OwnerRole)}
              />
              <AButton
                size="small"
                variant="contained"
                label="Access Rental Account"
                onClick={() => handleCreateUser(TenantRole)}
              />
            </>
          )}
          <MenuOptions
            showPrint={showPrint}
            handleHelp={handleHelp}
            handlePrint={handlePrint}
            handleSendEmail={handleSendEmail}
            handleTheme={() => changeTheme("", currentThemeIdx)}
            isEmailEnabled={isSendEmailFeatureEnabled} // email feature check
            isDisabled={isDisabled} // valid data check
            isLightTheme={Number(currentThemeIdx) === 1}
            showHelpAndSupport={showHelp}
            isSendEmailLoading={loading}
          />
        </Stack>
      </Toolbar>
      <CustomSnackbar
        showSnackbar={success || error !== null}
        setShowSnackbar={reset}
        severity={success ? "success" : "error"}
        title={
          success
            ? "Email sent successfully. Check spam if necessary."
            : "Error sending email."
        }
      />
    </AppBar>
  );
}

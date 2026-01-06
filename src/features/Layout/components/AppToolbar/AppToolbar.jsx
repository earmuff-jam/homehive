import React, { useEffect } from "react";

import { matchPath, useLocation, useNavigate } from "react-router-dom";

import { MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AButton from "common/AButton";
import CustomSnackbar from "common/CustomSnackbar/CustomSnackbar";
import { DefaultTourStepsMap } from "common/Tour/TourSteps";
import { retrieveTourKey } from "common/utils";
import { useLogoutMutation } from "features/Api/firebaseUserApi";
import { useLocalStorageData } from "features/Invoice/hooks/useGenerateUserData";
import MenuOptions from "features/Layout/components/NavBar/MenuOptions";
import { fetchLoggedInUser, isFeatureEnabled } from "features/Rent/utils";
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
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const smallFormFactor = useMediaQuery(theme.breakpoints.down("sm"));
  const { sendEmail, reset, loading, error, success } = useSendEmail();

  const [logout, { isSuccess: isLogoutSuccess, isLoading: isLogoutLoading }] =
    useLogoutMutation();

  const {
    data,
    recieverInfo,
    draftInvoiceHeader,
    draftInvoiceStatusLabel,
    draftRecieverUserEmailAddress,
    isDisabled,
  } = useLocalStorageData();

  const currentSubRoute = currentRoute?.element.props?.routes?.find((route) =>
    matchPath(route.routeUri, location.pathname),
  );
  const showHelp =
    currentRoute.config.displayHelpSelector &&
    currentSubRoute?.config?.displayHelpSelector;
  const showPrint =
    currentRoute.config.displayPrintSelector &&
    currentSubRoute?.config?.displayPrintSelector;

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
    const draftDialogTitle = DefaultTourStepsMap[key]?.element;

    setDialog({
      title: draftDialogTitle,
      label: "Help and Support",
      type: "HELP",
      display: true,
      showWatermark: false,
    });

    !smallFormFactor && handleDrawerOpen();
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

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate(`/?refresh=${Date.now()}`);
    }
  }, [isLogoutLoading]);

  return (
    <AppBar elevation={0} sx={{ padding: "0.30rem 0rem" }} className="no-print">
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
          <Typography variant="h5">Homehive</Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {user?.uid && (
            <Tooltip title="logout">
              <AButton
                label="Logout"
                variant="outlined"
                size="small"
                disabled={false} // support demo users
                onClick={() => logout()}
              />
            </Tooltip>
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

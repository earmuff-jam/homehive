import React, {
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";

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
import { TAppRoute, TThemeIdx } from "common/types";
import { retrieveTourKey } from "common/utils";
import { useCreateEmailMutation } from "features/Api/externalIntegrationsApi";
import { useLogoutMutation } from "features/Api/firebaseUserApi";
import { useFormatEmailWithInvoiceDetails } from "features/Invoice/hooks/useFormatEmailWithInvoiceDetails";
import { TInvoiceDialog } from "features/Invoice/types/Invoice.types";
import MenuOptions from "features/Layout/components/NavBar/MenuOptions";
import { fetchLoggedInUser, isFeatureEnabled } from "features/Rent/utils";
import { generateInvoiceHTML } from "hooks/useSendEmail";

// TAppToolbarProps ...
type TAppToolbarProps = {
  currentUri: string;
  currentRoute: TAppRoute;
  currentThemeIdx: TThemeIdx;
  setCurrentThemeIdx: Dispatch<SetStateAction<string>>;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
  setDialog: (data: TInvoiceDialog) => void;
};

export default function AppToolbar({
  currentUri,
  currentRoute,
  currentThemeIdx,
  setCurrentThemeIdx,
  handleDrawerOpen,
  handleDrawerClose,
  setDialog,
}: TAppToolbarProps) {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const smallFormFactor = useMediaQuery(theme.breakpoints.down("sm"));

  const [
    createEmail,
    { isSuccess: isCreateEmailSuccess, isLoading: isCreateEmailLoading },
  ] = useCreateEmailMutation();

  const [logout, { isSuccess: isLogoutSuccess, isLoading: isLogoutLoading }] =
    useLogoutMutation();

  const { data, recieverInfo, draftInvoiceHeader, isDisabled } =
    useFormatEmailWithInvoiceDetails();

  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);

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
    createEmail({
      to: recieverInfo.email,
      subject: draftInvoiceHeader
        ? `Invoice Details - ${draftInvoiceHeader}`
        : "Invoice Details",
      text: "Please view your attached invoice.",
      html: generateInvoiceHTML(recieverInfo, data),
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

  const changeTheme = (_: React.MouseEvent, currentThemeIdx: string) => {
    if (currentThemeIdx === "0") {
      localStorage.setItem("theme", "1");
      setCurrentThemeIdx("1");
      return;
    }

    localStorage.setItem("theme", "0");
    setCurrentThemeIdx("0");
  };

  useEffect(() => {
    if (isLogoutSuccess) {
      navigate(`/?refresh=${Date.now()}`);
    }
  }, [isLogoutLoading]);

  useEffect(() => {
    if (isCreateEmailSuccess) {
      setShowSnackbar(true);
    }
  });

  return (
    <AppBar elevation={0} sx={{ padding: "0.30rem 0rem" }} className="no-print">
      <Toolbar>
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{ flexGrow: 1 }}
        >
          <IconButton onClick={handleDrawerOpen} size="small">
            <MenuOutlined fontSize="small" />
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
            handleTheme={(ev) => changeTheme(ev, currentThemeIdx)}
            isEmailEnabled={isSendEmailFeatureEnabled} // email feature check
            isDisabled={isDisabled} // valid data check
            isLightTheme={currentThemeIdx === "1"}
            showHelpAndSupport={showHelp}
            isSendEmailLoading={isCreateEmailLoading}
          />
        </Stack>
      </Toolbar>
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        severity="success"
        title="Email sent successfully. Check spam if necessary."
      />
    </AppBar>
  );
}

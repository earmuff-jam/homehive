import React, { useEffect } from "react";

import { matchPath, useLocation, useNavigate } from "react-router-dom";

import { MenuOutlined } from "@mui/icons-material";
import {
  AppBar,
  Button,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { DefaultTourStepsMapperObj } from "common/TourSteps";
import { HomeRouteUri, fetchLoggedInUser } from "common/utils";
import { useLogoutMutation } from "features/Api/firebaseUserApi";
import MenuOptions from "features/Layout/components/NavBar/MenuOptions";
import { retrieveTourKey } from "features/Layout/utils";

export default function AppToolbar({
  currentUri,
  currentRoute,
  currentThemeIdx,
  setCurrentThemeIdx,
  handleDrawerOpen,
  setDialog,
}) {
  const theme = useTheme();
  const location = useLocation();

  const navigate = useNavigate();
  const user = fetchLoggedInUser();

  const smallFormFactor = useMediaQuery(theme.breakpoints.down("sm"));

  const [logout, { isSuccess: isLogoutSuccess, isLoading: isLogoutLoading }] =
    useLogoutMutation();

  const currentSubRoute = currentRoute?.element.props?.routes?.find((route) =>
    matchPath(route.routeUri, location.pathname),
  );
  const showHelp =
    currentRoute.config.displayHelpSelector &&
    currentSubRoute?.config?.displayHelpSelector;

  const isSplashPage = currentUri === HomeRouteUri;

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

    !smallFormFactor && handleDrawerOpen();
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
          {!isSplashPage ? (
            <IconButton onClick={handleDrawerOpen}>
              <MenuOutlined />
            </IconButton>
          ) : null}
          <Typography
            sx={{
              fontFamily: "'Instrument Serif', serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Homehive
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          {user?.uid && (
            <Tooltip title="logout">
              <Button variant="outlined" size="small" onClick={() => logout()}>
                Logout
              </Button>
            </Tooltip>
          )}
          <MenuOptions
            handleHelp={handleHelp}
            handleTheme={() => changeTheme("", currentThemeIdx)}
            isLightTheme={Number(currentThemeIdx) === 1}
            showHelpAndSupport={showHelp}
          />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

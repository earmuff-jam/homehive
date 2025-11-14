import React, { useState } from "react";

import { Outlet, matchPath, useLocation } from "react-router-dom";

import { InfoRounded } from "@mui/icons-material";
import {
  Box,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTour } from "@reactour/tour";
import AButton from "common/AButton";
import { NavigationProvider } from "common/ANavigation";
import {
  DefaultTourStepsMapperObj,
  GeneratedTourSteps,
} from "common/Tour/TourSteps";
import {
  HomeRouteUri,
  SettingsRouteUri,
  TenantRole,
} from "common/utils";
import AppToolbar from "features/Layout/components/AppToolbar/AppToolbar";
import BreadCrumbs from "features/Layout/components/AppToolbar/BreadCrumbs";
import Footer from "features/Layout/components/Footer/Footer";
import NavBar from "features/Layout/components/NavBar/NavBar";
import { retrieveTourKey } from "features/Layout/utils";
import { fetchLoggedInUser } from "features/Rent/utils";

const defaultDialog = {
  title: "",
  label: "",
  type: "",
  showWatermark: true,
  display: false,
};

export default function Layout({
  routes,
  currentThemeIdx,
  setCurrentThemeIdx,
}) {
  const theme = useTheme();
  const location = useLocation();

  const currentUri = location?.pathname || "";
  const currentRoute = routes.find((route) =>
    matchPath(route.path, currentUri),
  );

  const { setIsOpen, setCurrentStep, setSteps } = useTour();

  const smScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up("sm"));
  const lgScreenSizeAndHigher = useMediaQuery(theme.breakpoints.up("lg"));

  const [dialog, setDialog] = useState(defaultDialog);

  const [openDrawer, setOpenDrawer] = useState(
    smScreenSizeAndHigher ? true : false,
  );

  const closeDialog = () => setDialog(defaultDialog);

  const handleChange = () =>
    setDialog((prev) => ({ ...prev, showWatermark: !prev.showWatermark }));

  const setTour = () => {
    const key = retrieveTourKey(currentUri, "property");
    const currentTourEl = DefaultTourStepsMapperObj[key];

    let formattedDraftTourSteps;

    formattedDraftTourSteps = GeneratedTourSteps.slice(
      currentTourEl.start,
      currentTourEl.end,
    );

    if (currentUri === SettingsRouteUri) {
      const currentUser = fetchLoggedInUser();
      if (currentUser.role === TenantRole) {
        formattedDraftTourSteps = GeneratedTourSteps.slice(
          currentTourEl.start,
          currentTourEl.start + 1, // tenants do not have other tabs under settings
        );
      }
    }

    setIsOpen(true);
    setCurrentStep(0);
    setCurrentThemeIdx(0);
    setSteps(formattedDraftTourSteps);
  };

  return (
    <NavigationProvider>
      <AppToolbar
        currentUri={currentUri}
        currentRoute={currentRoute}
        handleDrawerClose={() => setOpenDrawer(false)}
        handleDrawerOpen={() => setOpenDrawer(true)}
        currentThemeIdx={currentThemeIdx}
        setCurrentThemeIdx={setCurrentThemeIdx}
        setDialog={setDialog}
      />
      <Stack
        sx={{
          marginTop: "5rem",
          marginBottom: "1rem",
          py: 2,
          flexGrow: 1,
        }}
      >
        <NavBar
          openDrawer={openDrawer}
          handleDrawerClose={() => setOpenDrawer(false)}
          smScreenSizeAndHigher={smScreenSizeAndHigher}
          lgScreenSizeAndHigher={lgScreenSizeAndHigher}
        />
        <Box
          sx={{
            transition: "margin-left 0.3s ease",
            marginLeft: openDrawer && lgScreenSizeAndHigher ? "300px" : "0px",
            width:
              openDrawer && lgScreenSizeAndHigher
                ? "calc(100% - 300px)"
                : "100%",
            padding: "0rem 1rem",
          }}
        >
          <Box sx={{ minHeight: "90vh" }}>
            {/* no breadcrumbs on splash page */}
            {currentUri !== HomeRouteUri && (
              <BreadCrumbs currentRoute={currentRoute} />
            )}
            <Outlet context={[dialog.showWatermark]} />
          </Box>
          <Footer />
        </Box>
      </Stack>
      {/* Dialog for help and print */}
      <Dialog
        className="no-print"
        open={dialog.type === "HELP" || dialog.type === "PRINT"}
        keepMounted
        onClose={() => setDialog(defaultDialog)}
        aria-describedby="alert-dialog-slide-help-box"
      >
        <DialogTitle>{dialog.label}</DialogTitle>
        <DialogContent>
          <Typography>{dialog.title}</Typography>
          {dialog.type === "PRINT" && (
            <Stack direction="row" spacing={1} alignItems="center">
              <FormControlLabel
                label="Display watermark"
                labelPlacement="end"
                control={
                  <Checkbox
                    checked={dialog?.showWatermark || false}
                    onChange={handleChange}
                  />
                }
              />
              <Tooltip title="Display invoice status if checked during print.">
                <InfoRounded
                  sx={{ color: "text.secondary" }}
                  fontSize="small"
                />
              </Tooltip>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <AButton
            onClick={() => {
              closeDialog();
              dialog.type === "HELP" && setTour();
              dialog.type === "PRINT" && print();
            }}
            className="no-print"
            label={dialog.type === "HELP" ? "Start help" : "Print"}
          />
          <AButton
            size="small"
            variant="outlined"
            onClick={closeDialog}
            className="no-print"
            label="Cancel"
          />
        </DialogActions>
      </Dialog>
    </NavigationProvider>
  );
}

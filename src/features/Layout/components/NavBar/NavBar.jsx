import React from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { useTheme } from "@emotion/react";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import validateClientPermissions, {
  filterValidRoutesForNavigationBar,
  isValidPermissions,
} from "common/ValidateClientPerms";
import {
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  isUserLoggedIn,
} from "common/utils";
import { InvoiceAppRoutes } from "features/Invoice/Routes";
import NavigationGroup from "features/Layout/components/NavBar/NavigationGroup";
import { RentalAppRoutes } from "features/Rent/Routes";
import { fetchLoggedInUser } from "features/Rent/utils/utils";
import { MainAppRoutes } from "src/Routes";

export default function NavBar({
  openDrawer,
  handleDrawerClose,
  smScreenSizeAndHigher,
  lgScreenSizeAndHigher,
}) {
  const theme = useTheme();
  const navigate = useNavigate();

  const user = fetchLoggedInUser();
  const { pathname } = useLocation();

  // the timeout allows to close the drawer first before navigation occurs.
  // Without this, the drawer behaves weird.
  const handleMenuItemClick = (to) => {
    !lgScreenSizeAndHigher && handleDrawerClose();
    setTimeout(() => {
      navigate(to);
    }, 200);
  };

  const getValidRoutes = (routes = [], roleType = "") => {
    const validRouteFlags = validateClientPermissions();
    const filteredNavigationRoutes = filterValidRoutesForNavigationBar(routes);

    return filteredNavigationRoutes.filter(({ requiredFlags, config }) => {
      const isRouteValid = isValidPermissions(validRouteFlags, requiredFlags);
      if (!isRouteValid) return false;

      const validRoles = config?.enabledForRoles || [];
      if (validRoles.length > 0 && !validRoles.includes(roleType)) return false;

      const requiresLogin = Boolean(config?.isLoggedInFeature);
      if (requiresLogin && !isUserLoggedIn()) return false;

      return true;
    });
  };

  return (
    <Stack>
      <Drawer
        variant="persistent"
        open={openDrawer}
        onClose={handleDrawerClose}
        aria-modal="true"
        slotProps={{
          paper: smScreenSizeAndHigher
            ? {
                sx: {
                  width: 300,
                  flexShrink: 0,
                  [`& .MuiDrawer-paper`]: {
                    width: 300,
                    boxSizing: "border-box",
                  },
                },
              }
            : {
                sx: {
                  width: "100%",
                },
              },
        }}
      >
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.4rem",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <img src="/logo-no-text.png" height="100%" width="50rem" />
            <Typography variant="h5">Homehive</Typography>
          </Stack>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightRounded />
            ) : (
              <ChevronLeftRounded />
            )}
          </IconButton>
        </Stack>
        <Divider />
        <List
          sx={{ width: "100%" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          {MainAppRoutes.map(
            ({ id, label, icon, path, requiredFlags, config }) => {
              const isRouteValid = isValidPermissions(
                validateClientPermissions(),
                requiredFlags,
              );
              if (!isRouteValid) return null;

              const validRoles = config?.enabledForRoles || [];
              if (validRoles.length > 0 && !validRoles.includes(user?.role))
                return null;

              const requiresLogin = Boolean(config?.isLoggedInFeature);
              if (requiresLogin && !isUserLoggedIn()) return null;

              let childRoutes = [];

              if (path.startsWith(MainInvoiceAppRouteUri)) {
                childRoutes = getValidRoutes(InvoiceAppRoutes, user?.role);
              } else if (path.startsWith(MainRentAppRouteUri)) {
                childRoutes = getValidRoutes(RentalAppRoutes, user?.role);
              }

              if (childRoutes.length > 0) {
                return (
                  <NavigationGroup
                    key={id}
                    label={label}
                    icon={icon}
                    pathname={pathname}
                    theme={theme}
                    navigate={handleMenuItemClick}
                    childrenRoutes={filterValidRoutesForNavigationBar(
                      childRoutes,
                    )}
                  />
                );
              }

              return (
                <ListItemButton
                  key={id}
                  selected={pathname === path}
                  onClick={() => handleMenuItemClick(path)}
                >
                  <ListItemIcon
                    sx={{
                      color: pathname === path && theme.palette.primary.main,
                    }}
                  >
                    {icon}
                  </ListItemIcon>
                  <ListItemText primary={label} />
                </ListItemButton>
              );
            },
          )}
        </List>
      </Drawer>
    </Stack>
  );
}

import { useLocation, useNavigate } from "react-router-dom";

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
import { useTheme } from "@mui/material/styles";
import rootLevelEnabledFeatures, {
  MainInvoiceAppRouteUri,
  MainRentAppRouteUri,
  fetchLoggedInUser,
  filterValidRoutesForNavigationBar,
  isValidPermissions,
} from "common/utils";
import { InvoiceAppRoutes } from "features/Invoice/Routes";
import NavigationGroup from "features/Layout/components/NavBar/NavigationGroup";
import { getValidRoutes } from "features/Layout/utils";
import { RentalAppRoutes } from "features/Rent/Routes";
import { MainAppRoutes } from "src/Routes";
import { TAppRoute, TUser } from "src/types";

// TNavBarProps ...
type TNavBarProps = {
  openDrawer: boolean;
  handleDrawerClose: () => void;
  smScreenSizeAndHigher: boolean;
  lgScreenSizeAndHigher: boolean;
};

export default function NavBar({
  openDrawer,
  handleDrawerClose,
  smScreenSizeAndHigher,
  lgScreenSizeAndHigher,
}: TNavBarProps) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const user: TUser = fetchLoggedInUser();
  const enabledFeatures = rootLevelEnabledFeatures();

  // close drawer before nav to preserve state
  const handleMenuItemClick = (to: string) => {
    if (!lgScreenSizeAndHigher) handleDrawerClose();
    setTimeout(() => {
      navigate(to);
    }, 200);
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
                  boxSizing: "border-box",
                },
              }
            : {
                sx: {
                  width: "100%",
                },
              },
        }}
      >
        {/* Header */}
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0.4rem",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <img src="/logo-no-text.png" width="50" alt="Homehive logo" />
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

        {/* Navigation */}
        <List component="nav" sx={{ width: "100%" }}>
          {MainAppRoutes.map(
            ({ id, label, icon, path, requiredFlags, config }) => {
              const isRouteValid = isValidPermissions(
                enabledFeatures,
                requiredFlags,
              );
              if (!isRouteValid) return null;

              const requiresLogin = Boolean(config?.isLoggedInFeature);
              if (requiresLogin && !user?.uid) return null;

              let childRoutes: TAppRoute[] = [];

              if (path.startsWith(MainInvoiceAppRouteUri)) {
                childRoutes = getValidRoutes(
                  InvoiceAppRoutes,
                  enabledFeatures,
                  user,
                );
              } else if (path.startsWith(MainRentAppRouteUri)) {
                childRoutes = getValidRoutes(
                  RentalAppRoutes,
                  enabledFeatures,
                  user,
                );
              }

              if (childRoutes.length > 0) {
                return (
                  <NavigationGroup
                    key={id}
                    label={label}
                    icon={icon}
                    pathname={pathname}
                    navigate={handleMenuItemClick}
                    childrenRoutes={filterValidRoutesForNavigationBar(
                      childRoutes,
                    )}
                  />
                );
              }

              return (
                config?.displayInNavBar && (
                  <ListItemButton
                    key={id}
                    selected={pathname === path}
                    onClick={() => handleMenuItemClick(path)}
                  >
                    <ListItemIcon
                      sx={{
                        color:
                          pathname === path
                            ? theme.palette.primary.main
                            : undefined,
                      }}
                    >
                      {icon}
                    </ListItemIcon>
                    <ListItemText primary={label} />
                  </ListItemButton>
                )
              );
            },
          )}
        </List>
      </Drawer>
    </Stack>
  );
}

import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Drawer,
  IconButton,
  Divider,
  Typography,
} from "@mui/material";

import { useTheme } from "@emotion/react";
import { InvoicerRoutes } from "src/Routes";
import { useLocation, useNavigate } from "react-router-dom";
import validateClientPermissions, {
  filterValidRoutesForNavigationBar,
  isValidPermissions,
} from "common/ValidateClientPerms";
import { isUserLoggedIn } from "src/common/utils";
import { fetchLoggedInUser } from "src/features/Properties/utils";

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

  const formattedInvoicerRoutes = (InvoicerRoutes = [], roleType = "") => {
    const validRouteFlags = validateClientPermissions();
    const filteredNavigationRoutes =
      filterValidRoutesForNavigationBar(InvoicerRoutes);

    return filteredNavigationRoutes
      .map(({ id, path, label, icon, requiredFlags, config }) => {
        const isRequired = isValidPermissions(validRouteFlags, requiredFlags);
        if (!isRequired) return null;

        // Check role access here
        const validRoles = config.enabledForRoles || [];
        if (validRoles.length > 0 && !validRoles.includes(roleType))
          return null;

        const requiresLogin = Boolean(config.isLoggedInFeature);

        // only if login is required
        // AND user is logged in
        // OR if login not required
        if (requiresLogin) {
          if (!isUserLoggedIn()) return null;
        }

        return (
          <ListItemButton
            key={id}
            selected={pathname === path}
            onClick={() => handleMenuItemClick(path)}
          >
            <ListItemIcon
              sx={{ color: pathname === path && theme.palette.primary.main }}
            >
              {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
          </ListItemButton>
        );
      })
      .filter(Boolean);
  };

  return (
    <Stack>
      <Drawer
        variant="persistent"
        open={openDrawer}
        onClose={handleDrawerClose}
        aria-modal="true"
        PaperProps={
          smScreenSizeAndHigher
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
              }
        }
      >
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <Typography variant="h5">Invoicer</Typography>
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
          {formattedInvoicerRoutes(InvoicerRoutes, user?.role)}
        </List>
      </Drawer>
    </Stack>
  );
}

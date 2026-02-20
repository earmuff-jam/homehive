import React, { useEffect, useState } from "react";

import { matchPath } from "react-router-dom";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { PropertiesRouteUri, PropertyRouteUri } from "common/utils";

const NavigationGroup = ({
  label,
  icon,
  pathname,
  childrenRoutes = [],
  navigate,
  theme,
}) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => setOpen((prev) => !prev);

  const isPropertyRoute = !!matchPath(
    { path: PropertyRouteUri, end: false },
    pathname,
  );

  useEffect(() => {
    const shouldOpen = childrenRoutes?.some(
      (routes) =>
        routes.routeUri === pathname ||
        (isPropertyRoute && routes.routeUri === PropertiesRouteUri),
    );
    setOpen(shouldOpen);
  }, [childrenRoutes]);

  return (
    <>
      <ListItemButton onClick={handleToggle}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ paddingLeft: 4 }}>
          {childrenRoutes.map(({ id, routeUri, label, icon }) => {
            return (
              <ListItemButton
                key={id}
                selected={
                  pathname === routeUri ||
                  (isPropertyRoute && routeUri === PropertiesRouteUri)
                }
                onClick={() => navigate(routeUri)}
              >
                <ListItemIcon
                  sx={{
                    color:
                      pathname === routeUri
                        ? theme.palette.primary.main
                        : undefined,
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>
    </>
  );
};

export default NavigationGroup;

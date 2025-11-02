import React, { useEffect, useState } from "react";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

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

  useEffect(() => {
    // adding this to allow fade transition
    // the nav bar can open slightly
    const shouldOpen = childrenRoutes?.some(
      (routes) => routes.routeUri === pathname,
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
        <List component="div" disablePadding sx={{ pl: 4 }}>
          {childrenRoutes.map(({ id, routeUri, label, icon }) => (
            <ListItemButton
              key={id}
              selected={pathname === routeUri}
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
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default NavigationGroup;

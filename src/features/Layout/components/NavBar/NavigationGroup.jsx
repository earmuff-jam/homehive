import React, { useEffect, useState } from "react";

import { ExpandLessRounded, ExpandMoreRounded } from "@mui/icons-material";
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
  const [expandDrawer, setExpandDrawer] = useState(false);
  const handleToggle = () => setExpandDrawer((prev) => !prev);

  useEffect(() => {
    if (pathname) {
      setExpandDrawer(
        childrenRoutes?.some((route) => route.routeUri === pathname),
      );
    }
  }, [pathname]);

  return (
    <>
      <ListItemButton onClick={handleToggle}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={label} />
        {expandDrawer ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </ListItemButton>
      <Collapse in={expandDrawer} timeout="auto" unmountOnExit>
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

import { ReactNode, useEffect, useState } from "react";

import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { TAppRoute } from "src/types";

// TNavigationGroupProps ...
type TNavigationGroupProps = {
  label: string;
  icon?: ReactNode;
  pathname: string;
  childrenRoutes?: TAppRoute[];
  navigate: (path: string) => void;
};

const NavigationGroup = ({
  label,
  icon,
  pathname,
  childrenRoutes = [],
  navigate,
}: TNavigationGroupProps) => {
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    // Allows fade transition when sidebar opens
    const shouldOpen = childrenRoutes.some(
      (route) => route.routeUri === pathname,
    );
    setOpen(shouldOpen);
  }, [childrenRoutes, pathname]);

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

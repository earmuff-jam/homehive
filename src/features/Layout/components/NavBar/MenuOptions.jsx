import React, { useState } from "react";

import {
  DarkModeRounded,
  HelpOutlineRounded,
  LightModeRounded,
} from "@mui/icons-material";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import AIconButton from "common/AIconButton";

export default function MenuOptions({
  handleHelp = () => {},
  handleTheme = () => {},
  isLightTheme = false,
  showHelpAndSupport = false,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <>
      <AIconButton
        id="customized-btn"
        className="no-print"
        aria-controls={open ? "customized-btn" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        onClick={handleClick}
        ariaLabel="Help with this page"
        label={<HelpOutlineRounded />}
      />
      <Menu
        id="customized-btn"
        elevation={0}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            sx: {
              padding: 0,
            },
          },
        }}
        sx={{
          "& .MuiPaper-root": {
            minWidth: 180,
            boxShadow:
              "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
            "& .MuiMenuItem-root": {
              "& .MuiSvgIcon-root": {
                fontSize: 18,
              },
            },
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleTheme();
            handleClose();
          }}
          disableRipple
          sx={{ gap: "0.5rem" }}
        >
          <ListItemIcon>
            {isLightTheme ? (
              <LightModeRounded fontSize="small" />
            ) : (
              <DarkModeRounded fontSize="small" />
            )}
          </ListItemIcon>
          <ListItemText
            primary="Change Theme"
            slotProps={{
              primary: {
                fontSize: 14,
                fontWeight: 500,
                variant: "subtitle2",
              },
            }}
          />
        </MenuItem>
        {showHelpAndSupport ? (
          <MenuItem
            onClick={() => {
              handleHelp();
              handleClose();
            }}
            disableRipple
            sx={{ gap: "0.5rem" }}
          >
            <ListItemIcon>
              <HelpOutlineRounded fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Help and Support"
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: 500,
                  variant: "subtitle2",
                },
              }}
            />
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}

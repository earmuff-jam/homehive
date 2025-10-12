import React, { useState } from "react";

import {
  BlindsRounded,
  DarkModeRounded,
  EmailOutlined,
  HelpOutlineRounded,
  KeyboardArrowDownRounded,
  LightModeRounded,
  PrintRounded,
  SettingsRounded,
} from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import AIconButton from "common/AIconButton";

export default function MenuOptions({
  handleHelp = () => {},
  handlePrint = () => {},
  handleTheme = () => {},
  handleSendEmail = () => {},
  showPrint = false,
  isLightTheme = false,
  isSendEmailLoading = false,
  showHelpAndSupport = false,
  isEmailEnabled = false,
  isDisabled = true,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  return (
    <>
      <AIconButton
        data-tour="view-pdf-1"
        id="customized-btn"
        className="no-print"
        aria-controls={open ? "customized-btn" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="outlined"
        onClick={handleClick}
        label={<HelpOutlineRounded />}
      />
      <Menu
        id="customized-btn"
        elevation={0}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
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
        {showPrint ? (
          <>
            <MenuItem
              disabled={isDisabled}
              onClick={() => {
                handlePrint();
                handleClose();
              }}
              disableRipple
              sx={{ gap: "0.5rem", py: 1 }}
            >
              <ListItemIcon>
                <PrintRounded />
              </ListItemIcon>
              <ListItemText
                primary="Print Invoice"
                slotProps={{
                  primary: {
                    fontSize: 14,
                    fontWeight: 500,
                  },
                }}
              />
            </MenuItem>
            {isEmailEnabled ? (
              <MenuItem
                disabled={isSendEmailLoading || isDisabled}
                onClick={() => {
                  handleSendEmail();
                  handleClose();
                }}
                disableRipple
                sx={{ gap: "0.5rem" }}
              >
                <ListItemIcon>
                  {isSendEmailLoading ? (
                    <CircularProgress color="inherit" size="1rem" />
                  ) : (
                    <EmailOutlined />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary="Send Email"
                  slotProps={{
                    primary: {
                      fontSize: 14,
                      fontWeight: 500,
                    },
                  }}
                />
              </MenuItem>
            ) : null}
          </>
        ) : null}

        {showPrint && <Divider sx={{ my: 0.5 }} />}

        <MenuItem
          onClick={() => {
            handleTheme();
            handleClose();
          }}
          disableRipple
          sx={{ gap: "0.5rem" }}
        >
          <ListItemIcon>
            {isLightTheme ? <LightModeRounded /> : <DarkModeRounded />}
          </ListItemIcon>
          <ListItemText
            primary="Change Theme"
            slotProps={{
              primary: {
                fontSize: 14,
                fontWeight: 500,
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
              <HelpOutlineRounded />
            </ListItemIcon>
            <ListItemText
              primary="Help and Support"
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
          </MenuItem>
        ) : null}
      </Menu>
    </>
  );
}

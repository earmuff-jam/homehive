import React, { useState } from "react";

import { MoreHorizRounded } from "@mui/icons-material";
import { IconButton, Menu, MenuItem, Stack } from "@mui/material";

export default function MobileIconDropdown({
  handleTenantLogin,
  handleOwnerLogin,
}) {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClose = () => setAnchorEl(null);
  const handleClick = (ev) => setAnchorEl(ev.currentTarget);

  return (
    <Stack>
      <IconButton size="small">
        <MoreHorizRounded fontSize="small" onClick={handleClick} />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            "aria-labelledby": "basic-button",
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleOwnerLogin();
            handleClose();
          }}
          sx={{
            fontSize: "0.875rem",
          }}
        >
          Manage Properties
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleTenantLogin();
            handleClose();
          }}
          sx={{
            fontSize: "0.875rem",
          }}
        >
          Access Rental Account
        </MenuItem>
      </Menu>
    </Stack>
  );
}

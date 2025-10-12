import React from "react";

import {
  CampaignRounded,
  NotificationsRounded,
  ReceiptLongRounded,
} from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  CreateInvoiceEnumValue,
  PaymentReminderEnumValue,
  RenewLeaseNoticeEnumValue,
  SendDefaultInvoiceEnumValue,
} from "features/Rent/utils/utils";

export default function QuickConnectMenu({
  anchorEl,
  open,
  onClose,
  onMenuItemClick,
}) {
  const handleMenuItemClick = (action) => {
    onMenuItemClick?.(action);
    onClose();
  };

  const menuItems = [
    {
      id: "invoice",
      label: "Create your own Invoice",
      icon: <ReceiptLongRounded fontSize="small" />,
      action: CreateInvoiceEnumValue,
    },
    {
      id: "default-invoice",
      label: "Send Default Invoice",
      icon: <ReceiptLongRounded fontSize="small" />,
      action: SendDefaultInvoiceEnumValue,
    },
    {
      id: "payment-reminder",
      label: "Send Payment Reminder",
      icon: <NotificationsRounded fontSize="small" />,
      action: PaymentReminderEnumValue,
    },
    {
      id: "renew-lease-notice",
      label: "Send renew Lease Reminder",
      icon: <CampaignRounded fontSize="small" />,
      action: RenewLeaseNoticeEnumValue,
    },
  ];

  return (
    <Menu
      id="quick-connect-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          elevation: 3,
          sx: {
            minWidth: 220,
            mt: 1,
          },
        },
        list: {
          "aria-labelledby": "quick-connect-button",
        },
      }}
    >
      {menuItems?.map((item, index) => (
        <React.Fragment key={item.id}>
          <MenuItem
            onClick={() => handleMenuItemClick(item.action)}
            sx={{ py: 1 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              slotProps={{
                primary: {
                  fontSize: 14,
                  fontWeight: 500,
                },
              }}
            />
          </MenuItem>
          {index < menuItems.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );
}

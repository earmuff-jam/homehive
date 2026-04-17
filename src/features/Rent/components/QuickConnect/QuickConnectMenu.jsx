import React, { useEffect, useState } from "react";

import {
  CampaignRounded,
  NotificationsRounded,
  PaymentsRounded,
  ReceiptLongRounded,
} from "@mui/icons-material";
import {
  Divider,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useCheckStripeAccountStatusQuery } from "features/Api/externalIntegrationsApi";
import { getStripeFailureReasons } from "features/Rent/components/Settings/common";
import {
  CreateInvoiceEnumValue,
  OneTimePaymentRequest,
  PaymentReminderEnumValue,
  RenewLeaseNoticeEnumValue,
  SendDefaultInvoiceEnumValue,
} from "features/Rent/utils";

export default function QuickConnectMenu({
  anchorEl,
  open,
  owner,
  onClose,
  onMenuItemClick,
}) {
  const {
    data: stripeStatus,
    isLoading: isStripeStatusLoading,
    isError: isStripeStatusError,
    isSuccess: isStripeStatusSuccess,
  } = useCheckStripeAccountStatusQuery(owner?.stripeAccountId, {
    skip: !owner?.stripeAccountId,
  });

  const [stripeValid, setStripeValid] = useState(false);

  const handleMenuItemClick = (action) => {
    onMenuItemClick?.(action);
    onClose();
  };

  const menuItems = [
    {
      id: "invoice",
      label: "Create custom Invoice",
      icon: <ReceiptLongRounded fontSize="small" />,
      action: CreateInvoiceEnumValue,
    },
    {
      id: "default-invoice",
      label: "Send Default Rent Invoice",
      icon: <ReceiptLongRounded fontSize="small" />,
      action: SendDefaultInvoiceEnumValue,
    },
    {
      id: "payment-reminder",
      label: "Send Rent Payment Reminder",
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

  if (stripeValid) {
    menuItems.push({
      id: "additional-charge",
      label: "Send one time payment request",
      icon: <PaymentsRounded fontSize="small" />,
      action: OneTimePaymentRequest,
    });
  }

  useEffect(() => {
    if (isStripeStatusSuccess) {
      const reasons = getStripeFailureReasons(stripeStatus?.status);

      if (!reasons || reasons.length === 0) {
        setStripeValid(true);
      } else {
        setStripeValid(false);
      }
    }

    if (isStripeStatusError) {
      setStripeValid(false);
    }
  }, [isStripeStatusLoading, isStripeStatusError]);

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

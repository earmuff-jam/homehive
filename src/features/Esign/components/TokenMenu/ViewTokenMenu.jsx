import React, { useEffect } from "react";

import { Box, Menu, MenuItem, MenuList, Typography } from "@mui/material";
import { fetchLoggedInUser } from "common/utils";
import { usePurchaseTokenCheckoutSessionMutation } from "features/Api/externalIntegrationsApi";

// EsignTokenPriceMap ...
// defines the valid token association for server
// calculated in the server; prevents user manipulation
const EsignTokenPriceMap = {
  BASIC: "BASIC",
  PREMIUM: "PREMIUM",
  ULTRA: "ULTRA",
};

// TokenOptionsEnumValues ...
// defines the token options and its value in dollar amount
const TokenOptionsEnumValues = [
  { id: 1, label: "1 credit", cost: 10, value: EsignTokenPriceMap.BASIC },
  { id: 2, label: "2 credits", cost: 20, value: EsignTokenPriceMap.PREMIUM },
  { id: 3, label: "5 credits", cost: 50, value: EsignTokenPriceMap.ULTRA },
];

const ViewTokenMenu = ({ open, anchorEl, handleClose }) => {
  const user = fetchLoggedInUser();

  const [purchaseTokenCheckoutSession, purchaseTokenCheckoutSessionResult] =
    usePurchaseTokenCheckoutSessionMutation();

  const purchaseToken = (id) => {
    const selected = TokenOptionsEnumValues.find((t) => t.id === id);

    purchaseTokenCheckoutSession({
      userId: user?.uid,
      email: user?.email,
      label: selected?.label,
      value: selected?.value,
    });

    handleClose();
  };

  useEffect(() => {
    if (purchaseTokenCheckoutSessionResult.isSuccess) {
      const secureURL = purchaseTokenCheckoutSessionResult.data;
      window.open(secureURL?.url, "_blank", "noopener,noreferrer");
      return;
    }
  }, [purchaseTokenCheckoutSessionResult.isSuccess]);

  return (
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: {
            mt: 1,
            minWidth: 220,
            boxShadow: 3,
            p: 1,
          },
        },
      }}
    >
      <MenuList dense disablePadding>
        {TokenOptionsEnumValues.map((token) => (
          <MenuItem
            key={token.id}
            onClick={() => purchaseToken(token.id)}
            sx={{
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "primary.main",
                color: "white",
                "& .price": {
                  opacity: 1,
                },
              },
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              alignItems="center"
            >
              <Typography fontWeight={500} variant="subtitle2">
                {token.label}
              </Typography>

              <Typography
                className="price"
                variant="subtitle2"
                sx={{
                  opacity: 0.7,
                  fontWeight: 600,
                }}
              >
                ${token.cost}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </MenuList>
    </Menu>
  );
};

export default ViewTokenMenu;

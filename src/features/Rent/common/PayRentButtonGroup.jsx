import React, { useRef, useState } from "react";

import { ArrowDropDownCircleRounded } from "@mui/icons-material";
import {
  Button,
  ButtonGroup,
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from "@mui/material";
import AButton from "common/AButton";
import { fetchLoggedInUser } from "common/utils";
import { useGetUserDataByIdQuery } from "features/Api/firebaseUserApi";
import {
  DefaultRentPaymentOptions,
  STRIPE_PAYMENT_VALUE,
} from "features/Rent/constants";

const PayRentButtonGroup = ({
  isStripeStatusLoading,
  isStripeValid,
  isCashAppValid,
  handleStripeClick,
  handleCashAppClick,
  isRentPaymentSuccessForCurrentMonth,
}) => {
  const user = fetchLoggedInUser();

  const { data: userDetails } = useGetUserDataByIdQuery(user?.uid, {
    skip: !user?.uid,
  });

  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const preferredMethodOfRentPaymentOption = DefaultRentPaymentOptions?.find(
    (opt) => opt.value === userDetails?.preferredMethodOfRentPayment,
  );

  const [selectedOption, setSelectedOption] = useState(
    preferredMethodOfRentPaymentOption || DefaultRentPaymentOptions[0],
  );

  const handleMenuItemClick = (option) => {
    const selectedOption = DefaultRentPaymentOptions?.find(
      (opt) => opt.value === option,
    );
    setSelectedOption(selectedOption);
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  const isStripePaymentSelected =
    selectedOption?.value === STRIPE_PAYMENT_VALUE;

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
        disabled={isRentPaymentSuccessForCurrentMonth}
      >
        <AButton
          fullWidth
          label={selectedOption?.label}
          disabled={isStripePaymentSelected ? !isStripeValid : !isCashAppValid}
          loading={isStripePaymentSelected ? isStripeStatusLoading : false}
          onClick={
            isStripePaymentSelected ? handleStripeClick : handleCashAppClick
          }
        />
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownCircleRounded fontSize="small" />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{
          zIndex: 1,
          minWidth: 320,
          opacity: 1,
        }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {DefaultRentPaymentOptions.map((option) => (
                    <MenuItem
                      key={option?.id}
                      selected={selectedOption?.value === option?.value}
                      onClick={() => handleMenuItemClick(option?.value)}
                    >
                      {option?.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default PayRentButtonGroup;

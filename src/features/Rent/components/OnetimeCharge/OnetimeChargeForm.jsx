import React from "react";

import { Controller } from "react-hook-form";

import {
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import TextFieldWithLabel from "common/TextFieldWithLabel";

const OnetimeChargeForm = ({ control, register, errors }) => {
  return (
    <form>
      <Stack spacing={2}>
        <Stack padding={1} alignItems="center">
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <ToggleButtonGroup
                size="small"
                exclusive
                value={field.value}
                onChange={(_, value) => {
                  if (value) field.onChange(value);
                }}
              >
                <ToggleButton value="card">
                  <Stack>
                    <Typography variant="subtitle2">
                      Credit Card (Instant)
                    </Typography>
                    <Typography variant="caption">
                      2.9% + 30¢ per successful transaction for domestic cards
                    </Typography>
                  </Stack>
                </ToggleButton>
                <ToggleButton value="us_bank_account">
                  <Stack>
                    <Typography variant="subtitle2">
                      Bank Transfer (Upto 3 business days)
                    </Typography>
                    <Typography variant="caption">
                      0.8% per successful transaction, capped at $5.
                    </Typography>
                  </Stack>
                </ToggleButton>
              </ToggleButtonGroup>
            )}
          />
        </Stack>
        <TextFieldWithLabel
          label="Charge Amount *"
          id="amount"
          size="small"
          placeholder="Amount in dollars to charge tenant. Eg, 10"
          errorMsg={errors.amount?.message}
          inputProps={{
            ...register("amount", {
              required: "Amount is required and must be in number format.",
              pattern: {
                value: /^\d+(\.\d{1,2})?$/,
                message: "Amount must be a valid amount (e.g. 650.00)",
              },
            }),
          }}
        />

        <TextFieldWithLabel
          label="Note *"
          id="note"
          fullWidth
          size="small"
          multiline
          maxRows={3}
          placeholder="Description of charge. Eg, Cost of water pipe replacement"
          errorMsg={errors.note?.message}
          inputProps={{
            ...register("note", {
              required: "Note is required",
              minLength: {
                value: 5,
                message: "Note must be at least five characters",
              },
              maxLength: {
                value: 500,
                message: "Note must be less than 500 characters",
              },
            }),
          }}
        />
      </Stack>
    </form>
  );
};

export default OnetimeChargeForm;

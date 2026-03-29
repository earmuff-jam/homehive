import React from "react";

import { Stack } from "@mui/material";
import TextFieldWithLabel from "common/TextFieldWithLabel";

const OnetimeChargeForm = ({ register, errors }) => {
  return (
    <form>
      <Stack spacing={2}>
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

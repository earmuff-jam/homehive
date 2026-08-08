import React from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const InvoiceSelector = ({
  options,
  inputLabel,
  hideCreateNewSelector = false,
  selectedInvoice,
  setSelectedInvoice,
}) => {
  const onChange = (ev) => {
    setSelectedInvoice(ev?.target.value);
  };

  if (!options) return null;

  return (
    <Box className="no-print">
      <FormControl sx={{ m: 1, minWidth: 320 }} size="small" variant="standard">
        <InputLabel id="selected-property-label-id">
          <Typography variant="subtitle2">{inputLabel}</Typography>
        </InputLabel>
        <Select
          labelId="selected-property-label-id"
          id="selected-property-id"
          value={selectedInvoice || "new_invoice"}
          onChange={onChange}
        >
          {!hideCreateNewSelector && (
            <MenuItem value="new_invoice">
              <Typography variant="subtitle2">Create new ...</Typography>
            </MenuItem>
          )}
          {options?.map((el) => (
            <MenuItem key={el?.id} value={el.id}>
              <Typography variant="subtitle2">{el?.invoiceHeader}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default InvoiceSelector;

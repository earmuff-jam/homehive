import React from "react";

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

const PropertyMenuItemSelector = ({
  inputLabel,
  selectedItem,
  onChange,
  data,
}) => {
  return (
    <Box>
      <FormControl sx={{ m: 1, minWidth: 320 }} size="small" variant="standard">
        <InputLabel id="selected-property-label-id">
          <Typography variant="subtitle2">{inputLabel}</Typography>
        </InputLabel>
        <Select
          labelId="selected-property-label-id"
          id="selected-property-id"
          value={selectedItem}
          onChange={onChange}
        >
          {data?.map((el) => (
            <MenuItem key={el?.id} value={el.id}>
              <Typography variant="subtitle2">{el?.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default PropertyMenuItemSelector;

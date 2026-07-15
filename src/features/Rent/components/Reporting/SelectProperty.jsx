import React from "react";

import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectProperty = ({ inputLabel, selectedItem, onChange, data }) => {
  return (
    <Box>
      <FormControl sx={{ m: 1, minWidth: 320 }} size="small" variant="standard">
        <InputLabel id="selected-property-label-id">{inputLabel}</InputLabel>
        <Select
          labelId="selected-property-label-id"
          id="selected-property-id"
          value={selectedItem}
          onChange={onChange}
        >
          {data?.map((el) => (
            <MenuItem key={el?.id} value={el.id}>
              {el?.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SelectProperty;

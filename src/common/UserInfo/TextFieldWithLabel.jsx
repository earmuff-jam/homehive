import React from "react";

import { Stack, TextField, Tooltip, Typography } from "@mui/material";

const TextFieldWithLabel = React.forwardRef(
  (
    {
      label,
      id,
      name,
      placeholder,
      errorMsg,
      multiline = false,
      maxRows = 0,
      dataTour,
      isDisabled = false,
      labelIcon = null,
      labelIconHelper = "",
      inputProps = {},
      value,
      onChange,
      onBlur,
    },
    ref,
  ) => {
    return (
      <Stack spacing={0.5} width="100%" data-tour={dataTour}>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" fontWeight="medium">
            {label}
          </Typography>
          {labelIcon && <Tooltip title={labelIconHelper}>{labelIcon}</Tooltip>}
        </Stack>
        <TextField
          fullWidth
          id={id}
          name={name}
          placeholder={placeholder}
          variant="outlined"
          size="small"
          multiline={multiline}
          rows={maxRows}
          error={Boolean(errorMsg?.length)}
          helperText={errorMsg}
          disabled={isDisabled}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          {...inputProps}
        />
      </Stack>
    );
  },
);

// for eslint and react devtools // ref needs display name
TextFieldWithLabel.displayName = "TextFieldWithLabel";

export default TextFieldWithLabel;

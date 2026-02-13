import React from "react";

import { Box, Stack, TextField, Tooltip } from "@mui/material";

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
      variant = "body2",
      onChange,
      onBlur,
    },
    ref,
  ) => {
    return (
      <Stack spacing={0.5} width="100%" data-tour={dataTour}>
        <Stack direction="row" spacing={1}>
          <Box
            component="span"
            variant={variant}
            color={isDisabled ? "textSecondary" : "textPrimary"}
            fontWeight="medium"
          >
            {label}
          </Box>
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

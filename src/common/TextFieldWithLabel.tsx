import { forwardRef } from "react";
import type { ReactElement } from "react";

import { Stack, TextField, Tooltip, Typography } from "@mui/material";
import type { TextFieldProps } from "@mui/material";

// TextFieldWithLabelProps ...
export type TextFieldWithLabelProps = {
  label: string;
  name: string;
  placeholder: string;
  errorMsg?: string;
  multiline?: boolean;
  maxRows?: number;
  dataTour?: string;
  isDisabled?: boolean;
  labelIcon?: ReactElement;
  labelIconHelper?: string;
  inputProps?: Partial<TextFieldProps>;
  value?: string | number;
  fullWidth?: boolean;
  error?: boolean;
  onChange?: TextFieldProps["onChange"];
  onBlur?: TextFieldProps["onBlur"];
};

const TextFieldWithLabel = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextFieldWithLabelProps
>(function TextFieldWithLabel(
  {
    name,
    value,
    label,
    onBlur,
    onChange,
    placeholder,
    errorMsg,
    dataTour,
    maxRows = 0,
    inputProps = {},
    labelIcon = null,
    multiline = false,
    isDisabled = false,
    labelIconHelper = "",
  },
  ref,
) {
  return (
    <Stack spacing={0.5} width="100%" data-tour={dataTour}>
      <Stack direction="row" spacing={1}>
        <Typography
          variant="body2"
          color={isDisabled ? "text.secondary" : "text.primary"}
          fontWeight="medium"
        >
          {label}
        </Typography>

        {labelIcon && <Tooltip title={labelIconHelper}>{labelIcon}</Tooltip>}
      </Stack>

      <TextField
        fullWidth
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
});

// for eslint and react devtools
TextFieldWithLabel.displayName = "TextFieldWithLabel";

export default TextFieldWithLabel;

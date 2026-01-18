import { ReactNode } from "react";

import { Stack, StackProps, SxProps, Theme, Typography } from "@mui/material";

// EmptyComponentProps ...
type EmptyComponentProps = {
  title?: string;
  direction?: StackProps["direction"];
  caption?: string;
  sxProps?: SxProps<Theme>;
  children?: ReactNode;
};

export default function EmptyComponent({
  title = "Sorry, no matching records found.",
  direction = "column",
  caption,
  sxProps,
  children,
}: EmptyComponentProps) {
  return (
    <Stack
      direction={direction}
      textAlign="center"
      padding="2rem 0rem"
      sx={sxProps}
    >
      <Typography sx={sxProps}>{title}</Typography>
      <Stack>
        <Typography variant="caption">
          {caption} {children}
        </Typography>
      </Stack>
    </Stack>
  );
}

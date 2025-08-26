import { Stack, Typography } from "@mui/material";

/**
 * EmptyComponent
 *
 * used to house an empty component with custom title & caption
 * @param {title} string - the string representation of the title component
 * @param {caption} string - the string representation of the caption component
 * @param {direction} string - the direction of the entire stack component
 * @param {sxProps} object - the object data of the styles for the component
 * @param {children} React.Fragment - the jsx fragment that can be passed as a span component
 */
export default function EmptyComponent({
  title = "Sorry, no matching records found.",
  direction = "column",
  caption,
  sxProps,
  children,
}) {
  return (
    <Stack
      direction={direction}
      textAlign="center"
      padding="2rem 0rem"
      {...sxProps}
    >
      <Typography {...sxProps} sx={{ textTransform: "initial" }}>
        {title}
      </Typography>
      <Stack>
        <Typography variant="caption" sx={{ textTransform: "initial" }}>
          {caption} {children}
        </Typography>
      </Stack>
    </Stack>
  );
}

import { Alert, AlertColor, Snackbar, Typography } from "@mui/material";

/**
 * The CustomSnackbarProps type defines props for a custom Snackbar component in TypeScript React.
 * @property {boolean} showSnackbar - The `showSnackbar` property is a boolean value that determines
 * whether the Snackbar component should be displayed or not. If `showSnackbar` is `true`, the Snackbar
 * will be visible to the user; if `showSnackbar` is `false`, the Snackbar will be hidden.
 * @property setShowSnackbar - The `setShowSnackbar` property is a function that takes a boolean value
 * as an argument and does not return anything (`void`). It is used to control the visibility of the
 * Snackbar component in your application. When `setShowSnackbar(true)` is called, the Snackbar will be
 * displayed, and when `
 * @property {AlertColor} severity - The `severity` property in the `CustomSnackbarProps` type is of
 * type `AlertColor`. This indicates that the severity property is expected to be a value that
 * corresponds to different severity levels such as "error", "warning", "info", or "success".
 * @property {string} title - The `title` property in the `CustomSnackbarProps` type represents the
 * title or main message that will be displayed in the custom snackbar component. It is a string type,
 * which means it should contain text that provides a brief summary or description of the message being
 * shown to the user.
 * @property {string} caption - The `caption` property in the `CustomSnackbarProps` type represents a
 * string that provides additional information or context for the Snackbar component. It is typically
 * used to display a brief message or description related to the Snackbar's content or action.
 * @property onClick - The `onClick` property in the `CustomSnackbarProps` type is a function that is
 * optional. It is a callback function that will be called when the Snackbar is clicked or interacted
 * with in some way. If provided, it should be a function that takes no arguments and returns void.
 */
export type CustomSnackbarProps = {
  showSnackbar: boolean;
  setShowSnackbar: (value: boolean) => void;
  severity: AlertColor;
  title: string;
  caption?: string;
  onClick?: () => void;
};

function CustomSnackbar({
  showSnackbar,
  setShowSnackbar,
  severity = "success",
  title,
  caption,
  onClick,
}: CustomSnackbarProps) {
  return (
    <Snackbar
      open={showSnackbar}
      autoHideDuration={3000}
      onClose={() => setShowSnackbar(false)}
    >
      <Alert
        onClose={() => setShowSnackbar(false)}
        severity={severity}
        variant="filled"
      >
        <Typography variant="caption" textTransform="initial">
          {title}
        </Typography>
        <Typography
          variant="caption"
          textTransform="initial"
          paddingLeft="0.2rem"
          sx={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={(e) => {
            // prevent bubbling to parent, so that snackbar does not navigate
            // if close button is pressed
            e.stopPropagation();
            onClick?.();
          }}
        >
          {caption}
        </Typography>
      </Alert>
    </Snackbar>
  );
}

export default CustomSnackbar;

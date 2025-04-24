import { IconButton } from "@mui/material";
import { useButtonAnalytics } from "src/hooks/useButtonAnalytics";

const analyticsEnabled = import.meta.env.VITE_ENABLE_ANALYTICS || "false";

/**
 * AIconButton
 *
 * Muiv5 icon button component setup with analytics tracking. Used to perform
 * analytics of the user location based on the route
 *
 * @param {string} label - the icon that is used as a html element to display
 * @param {function} onClick - the onClick handler to perform action on the icon button
 * @param {object} rest - the props passed in as a ...rest component
 *
 */
export default function AIconButton({ label, onClick, ...rest }) {
  const buttonAnalytics = useButtonAnalytics();

  const handleClick = (ev) => {
    // log data only if analytics is enabled
    analyticsEnabled?.toLowerCase() === "true" && buttonAnalytics?.(label);
    onClick(ev);
  };

  return (
    <IconButton {...rest} onClick={handleClick}>
      {label}
    </IconButton>
  );
}

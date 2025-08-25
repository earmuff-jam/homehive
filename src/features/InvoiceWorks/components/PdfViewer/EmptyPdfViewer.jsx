import { Typography } from "@mui/material";
import EmptyComponent from "common/EmptyComponent";

export default function EmptyPdfViewer({ handleNavigate }) {
  return (
    <EmptyComponent
      title="Sorry, no invoice found to display"
      caption="Create new invoice from"
      sxProps={{ textTransform: "initial" }}
    >
      <Typography
        component={"span"}
        variant="caption"
        color="primary"
        sx={{ cursor: "pointer" }}
        onClick={handleNavigate}
      >
        &nbsp;here.
      </Typography>
    </EmptyComponent>
  );
}

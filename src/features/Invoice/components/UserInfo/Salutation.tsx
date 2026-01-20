import { Stack, Typography } from "@mui/material";
import { TInvoiceUserInfo } from "features/Invoice/Invoice.schema";

// SalutationProps ...
export type SalutationProps = {
  userInfo: TInvoiceUserInfo;
  isEnd?: boolean;
};

export default function Salutation({
  userInfo,
  isEnd = false,
}: SalutationProps) {
  return (
    <Stack sx={{ my: 4 }}>
      <Typography variant="subtitle2" color="text.secondary">
        {isEnd ? "Thank you," : "To,"}
      </Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="subtitle2" color="text.secondary">
          {userInfo.firstName}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {userInfo.lastName}
        </Typography>
      </Stack>
      <Typography variant="subtitle2" color="text.secondary">
        {userInfo.streetAddress}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        {userInfo.city} {userInfo.state}, {userInfo.zipcode}
      </Typography>
    </Stack>
  );
}

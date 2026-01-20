import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  TInvoiceStatusOption,
  TLineItem,
} from "features/Invoice/Invoice.schema";
import { numberFormatter } from "features/Invoice/utils";

// TReportTableProps ...
export type TReportTableProps = {
  rows: TLineItem[];
  taxRate: number;
  showWatermark: boolean;
  invoiceStatus: TInvoiceStatusOption;
  invoiceTitle: string;
};

export default function ReportTable({
  rows = [],
  taxRate = 0,
  showWatermark,
  invoiceStatus,
  invoiceTitle,
}: TReportTableProps) {
  const subtotal = rows
    .map(({ price }) => price || 0)
    .reduce((sum, i) => sum + i, 0);

  const paymentRecieved = rows
    .map(({ payment }) => payment || 0)
    .reduce((sum, i) => sum + i, 0);

  const invoiceSubtotal = subtotal - paymentRecieved;
  const formattedTax = taxRate || 0;
  const invoiceTaxes = (formattedTax / 100) * invoiceSubtotal;
  const invoiceTotal = invoiceSubtotal + invoiceTaxes;

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell align="center" colSpan={5} sx={{ fontWeight: "bold" }}>
              {invoiceTitle}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Price (USD)
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Description</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Qty.
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Cost
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Payment Received
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Balance Due
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography variant="subtitle2">
                  {row?.category?.label}
                </Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1} alignItems="flex-end">
                  <Typography variant="subtitle2">{row.description}</Typography>
                  <Typography variant="caption">
                    <sub>{row.caption}</sub>
                  </Typography>
                </Stack>
              </TableCell>
              <TableCell align="right">{row.quantity}</TableCell>
              <TableCell align="right">{numberFormatter(row.price)}</TableCell>
              <TableCell align="right">
                {numberFormatter(row.payment)}
              </TableCell>
              <TableCell align="right">
                {numberFormatter(row.price - row.payment)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell rowSpan={3} />
            <TableCell colSpan={4} sx={{ fontWeight: "bold" }}>
              Subtotal
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {numberFormatter(invoiceSubtotal)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Tax</TableCell>
            <TableCell colSpan={3} align="right" sx={{ fontWeight: "bold" }}>
              {formattedTax}%
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {numberFormatter(invoiceTaxes)}
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell colSpan={4} sx={{ fontWeight: "bold" }}>
              <Stack direction="row" spacing={10}>
                <Typography>Total</Typography>
                <Box component="span">
                  {invoiceStatus?.display && (
                    <Typography
                      color="error.light"
                      variant="caption"
                      className={!showWatermark && "no-print"} // print only when allowed
                      sx={{
                        textTransform: "uppercase",
                        fontSize: "2rem",
                        padding: "0.3rem 0.5rem",
                        textAlign: "center",
                        border: "0.3rem solid",
                      }}
                    >
                      {invoiceStatus?.label}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              {numberFormatter(invoiceTotal)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

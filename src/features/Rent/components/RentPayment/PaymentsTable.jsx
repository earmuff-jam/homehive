import React, { useMemo, useState } from "react";

import dayjs from "dayjs";

import {
  CommentRounded,
  HighlightOffOutlined,
  OpenInNewRounded,
  Remove,
} from "@mui/icons-material";
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import AIconButton from "common/AIconButton";
import CustomSnackbar from "common/CustomSnackbar";
import EmptyComponent from "common/EmptyComponent";
import relativeTime from "dayjs/plugin/relativeTime";
import UpdateRentRecord from "features/Rent/components/RentPayment/UpdatePaymentRecord";
import {
  CASH_APP_PAYMENT_VALUE,
  RentalPaymentEnumValues,
} from "features/Rent/constants";
import { RentIntentStatusEnumValue, formatCurrency } from "features/Rent/utils";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

dayjs.extend(relativeTime);

// DefaultDialogProps ...
// defines the default props for dialog component
const DefaultDialogProps = {
  title: "",
  id: "",
  status: "",
  display: false,
};

const PaymentsTable = ({
  isPropertyOwner = false,
  rentData = [],
  propertyName,
}) => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [dialog, setDialog] = useState(DefaultDialogProps);

  const closeDialog = () => {
    setDialog(DefaultDialogProps);
  };

  const updateRentRow = (row) => {
    const rowId = row?.original?.id;
    const status = row?.original?.status;
    setDialog({
      title: `Current status: ${status}`,
      id: rowId,
      status: status,
      display: true,
    });
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "tenantEmail",
        header: "Tenant Email",
        size: 50,
        Cell: ({ cell }) =>
          <Typography variant="subtitle2">{cell.getValue()}</Typography> || "-",
      },
      {
        header: "Amount Paid ($)",
        accessorFn: (row) => {
          const total = [
            row?.rentAmount,
            row?.additionalCharges,
            row?.initialLateFee,
            row?.dailyLateFee,
          ].reduce((sum, val) => {
            const num = Number(val);
            return sum + (Number.isFinite(num) ? num : 0);
          }, 0);
          return total;
        },
        id: "amountPaid",
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">
            {formatCurrency(cell.getValue())}
          </Typography>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 50,
        Cell: ({ cell, row }) => {
          const rentRecord = row?.original;

          const cashAppPaymentAttempt =
            rentRecord?.paymentMethod === CASH_APP_PAYMENT_VALUE &&
            rentRecord?.status === RentIntentStatusEnumValue &&
            !rentRecord?.customEventType;

          return cell?.getValue() ? (
            <Stack direction="row" alignItems="center" spacing={1}>
              <Chip
                size="small"
                label={cell.getValue()}
                color="primary"
                sx={{
                  fontSize: "0.785rem",
                  paddingBottom: "0.2rem",
                  borderRadius: 0.5,
                }}
              />
              {cashAppPaymentAttempt && isPropertyOwner && (
                <OpenInNewRounded
                  color="secondary"
                  sx={{ width: "1.175rem", cursor: "pointer" }}
                  onClick={() => updateRentRow(row)}
                />
              )}
            </Stack>
          ) : (
            "-"
          );
        },
      },
      {
        accessorKey: "paymentMethod",
        header: "Payment Method",
        size: 50,
        Cell: ({ cell }) =>
          (
            <Typography textTransform="capitalize" variant="subtitle2">
              {RentalPaymentEnumValues[cell.getValue()] || cell.getValue()}
            </Typography>
          ) || "-",
      },
      {
        accessorKey: "rentMonth",
        header: "Rent Month",
        size: 50,
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">{cell.getValue() || "-"}</Typography>
        ),
      },
      {
        accessorKey: "updatedOn",
        header: "Updated on",
        size: 50,
        Cell: ({ cell }) => (
          <Typography variant="subtitle2">
            {cell.getValue()
              ? dayjs(cell.getValue()).format("YYYY-MM-DD HH:mm:ss")
              : "-"}
          </Typography>
        ),
      },
    ],
    [],
  );

  const table = useMaterialReactTable({
    columns,
    data: rentData,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableExpandAll: false,
    // hides header for expand column
    displayColumnDefOptions: {
      "mrt-row-expand": {
        header: "",
      },
    },
    initialState: {
      density: "compact",
      sorting: [{ id: "updatedOn", desc: true }],
    },
    renderEmptyRowsFallback: () => <EmptyComponent />,
    renderDetailPanel: ({ row }) => {
      const note = row?.original?.note;
      return note ? (
        <Typography variant="caption" fontStyle="italic">
          {row?.original?.note}
        </Typography>
      ) : null;
    },
    mrtTheme: (theme) => ({
      baseBackgroundColor: theme.palette.transparent.main,
    }),
    muiExpandButtonProps: ({ row }) => ({
      children: row.getIsExpanded() ? (
        <Remove sx={{ height: "0.875rem", width: "0.875rem" }} />
      ) : (
        <CommentRounded sx={{ height: "0.875rem", width: "0.875rem" }} />
      ),
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: "16rem",
        boxShadow: "none",
      },
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        boxShadow: "none",
      },
    },
  });

  return (
    <Stack spacing={2}>
      <MaterialReactTable table={table} />
      {dialog?.id ? (
        <Dialog
          open={dialog.display}
          keepMounted
          fullWidth
          maxWidth="md"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Stack>
                <Typography variant="subtitle2">Update rent</Typography>
                <Typography variant="caption">{dialog.title}</Typography>
              </Stack>
              <AIconButton
                size="small"
                color="error"
                variant="outlined"
                onClick={closeDialog}
                ariaLabel="Close"
                label={<HighlightOffOutlined />}
              />
            </Stack>
          </DialogTitle>
          <DialogContent>
            <UpdateRentRecord
              rentId={dialog.id}
              closeDialog={closeDialog}
              propertyName={propertyName}
            />
          </DialogContent>
        </Dialog>
      ) : null}
      <CustomSnackbar
        showSnackbar={showSnackbar}
        setShowSnackbar={setShowSnackbar}
        title="Changes saved."
      />
    </Stack>
  );
};

export default PaymentsTable;

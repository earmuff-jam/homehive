import React from "react";

import {
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Typography,
} from "@mui/material";
import EmptyComponent from "common/EmptyComponent";

export default function RecentTransactions({ transactions = [], loading }) {
  return (
    <Card elevation={0} sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Recent Transactions
      </Typography>

      {loading ? (
        <Skeleton variant="rectangular" height={100} />
      ) : transactions.length === 0 ? (
        <EmptyComponent
          caption="Perform transactions to begin."
          sxProps={{ variant: "subtitle2" }}
        />
      ) : (
        <List>
          {transactions.map((tx) => (
            <div key={tx.id}>
              <ListItem disableGutters>
                <ListItemText
                  primary={`$${(tx.amount / 100).toFixed(2)} • ${
                    tx.billing_details.name || "Unknown"
                  }`}
                  secondary={new Date(tx.created * 1000).toLocaleString()}
                />
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
      )}
    </Card>
  );
}

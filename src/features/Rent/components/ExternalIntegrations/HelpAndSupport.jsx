import React from "react";

import { Box, Card, Stack, Typography } from "@mui/material";
import AButton from "common/AButton";
import RowHeader from "common/RowHeader/RowHeader";

export default function HelpAndSupport({ options = [] }) {
  return (
    <Card elevation={0} sx={{ p: 1, bgcolor: "background.paper" }}>
      <RowHeader
        title="Need Help?"
        caption="Select how can we help you best."
        sxProps={{ textAlign: "left" }}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-around"
        spacing={2}
      >
        {options?.map((option) => (
          <Box key={option.id} sx={{ textAlign: "center" }}>
            {option?.icon}
            <Typography variant="subtitle2" fontWeight={600}>
              {option?.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {option?.caption}
            </Typography>
            <AButton
              size="small"
              variant="outlined"
              onClick={() =>
                window.open(`${option?.to}`, "_blank", "noopener,noreferrer")
              }
              label={option?.buttonText}
            />
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
